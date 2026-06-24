package tv.tootie.aurora.app.ui.terminal

import android.app.Application
import androidx.compose.runtime.Immutable
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.persistentListOf
import kotlinx.collections.immutable.toImmutableList
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.CodexEvent
import tv.tootie.aurora.app.codex.RequestKind
import java.util.UUID

/** Status of the current exec session. */
enum class ExecStatus { Idle, Running, Done, Error }

/**
 * State for a standalone command/exec PTY terminal session.
 *
 * [processId] is the client-generated UUID used to correlate [command/exec/outputDelta]
 * push notifications and follow-up write/resize/terminate frames.
 * [output] accumulates all stdout+stderr deltas in order; it is a flat String so
 * the composable can render it in a single Text/BasicText without allocation churn.
 */
@Immutable
data class TerminalState(
    val command: String = "",
    val processId: String? = null,
    val status: ExecStatus = ExecStatus.Idle,
    val output: String = "",
    val exitCode: Int? = null,
    val error: String? = null,
    /** History of commands run this session, oldest first. */
    val history: ImmutableList<String> = persistentListOf(),
)

class TerminalViewModel(app: Application) : AndroidViewModel(app) {

    private val repo = (app as CodexApp).repository

    private val _state = MutableStateFlow(TerminalState())
    val state: StateFlow<TerminalState> = _state.asStateFlow()

    init {
        // Route ExecCommandPty responses and command/exec/outputDelta push notifications
        // from the shared turnEventsFlow so we don't need a dedicated flow.
        repo.turnEventsFlow
            .filter { it.originKind == RequestKind.ExecCommandPty || it.originKind == RequestKind.ExecCommand }
            .onEach { event -> handleExecResponse(event) }
            .launchIn(viewModelScope)

        // Also subscribe for push notifications (method = "command/exec/outputDelta" etc.)
        repo.turnEventsFlow
            .filter { it.msg.method != null }
            .onEach { event -> handlePushNotification(event) }
            .launchIn(viewModelScope)
    }

    /**
     * Run [commandLine] in PTY mode. Splits on whitespace to produce argv.
     * Clears previous output and assigns a fresh processId for this run.
     */
    fun runCommand(commandLine: String, cwd: String? = null) {
        val trimmed = commandLine.trim()
        if (trimmed.isBlank()) return
        val argv = trimmed.split(Regex("\\s+"))
        val processId = UUID.randomUUID().toString()
        _state.update { s ->
            s.copy(
                command = trimmed,
                processId = processId,
                status = ExecStatus.Running,
                output = "",
                exitCode = null,
                error = null,
                history = (s.history + trimmed).toImmutableList(),
            )
        }
        repo.execCommandPty(command = argv, processId = processId, cwd = cwd)
    }

    /** Write [data] to the running PTY's stdin (e.g., keyboard input). */
    fun writeStdin(data: String) {
        val pid = _state.value.processId ?: return
        if (_state.value.status != ExecStatus.Running) return
        repo.execCommandWrite(pid, data)
    }

    /** Resize the PTY window to [cols] x [rows]. */
    fun resize(cols: Int, rows: Int) {
        val pid = _state.value.processId ?: return
        if (_state.value.status != ExecStatus.Running) return
        repo.execCommandResize(pid, cols, rows)
    }

    /** Send SIGTERM to the running process. */
    fun terminate() {
        val pid = _state.value.processId ?: return
        if (_state.value.status != ExecStatus.Running) return
        repo.execCommandTerminate(pid)
        _state.update { it.copy(status = ExecStatus.Done) }
    }

    /** Clear the terminal output and reset to idle. */
    fun clear() {
        _state.update { it.copy(output = "", status = ExecStatus.Idle, exitCode = null, error = null) }
    }

    // -------------------------------------------------------------------------

    private fun handleExecResponse(event: CodexEvent.TurnEvent) {
        val msg = event.msg
        // Initial exec response: result contains { processId?, exitCode? }
        val result = msg.result?.jsonObject ?: return
        val exitCode = result["exitCode"]?.jsonPrimitive?.contentOrNull?.toIntOrNull()
        val errMsg = msg.error?.message
        if (errMsg != null) {
            _state.update { it.copy(status = ExecStatus.Error, error = errMsg) }
        } else if (exitCode != null) {
            // Buffered mode: result also has stdout/stderr
            val stdout = result["stdout"]?.jsonPrimitive?.contentOrNull ?: ""
            val stderr = result["stderr"]?.jsonPrimitive?.contentOrNull ?: ""
            val combined = buildString {
                if (stdout.isNotEmpty()) append(stdout)
                if (stderr.isNotEmpty()) { if (isNotEmpty()) append("\n"); append(stderr) }
            }
            _state.update { it.copy(output = it.output + combined, exitCode = exitCode, status = ExecStatus.Done) }
        }
        // PTY mode: the initial response just confirms start — output arrives via outputDelta
    }

    private fun handlePushNotification(event: CodexEvent.TurnEvent) {
        val msg = event.msg
        val currentPid = _state.value.processId ?: return
        when (msg.method) {
            "command/exec/outputDelta" -> {
                val params = msg.params?.jsonObject ?: return
                val pid = params["processId"]?.jsonPrimitive?.contentOrNull ?: return
                if (pid != currentPid) return
                val data = params["data"]?.jsonPrimitive?.contentOrNull ?: return
                _state.update { it.copy(output = it.output + data) }
            }
            "command/exec/completed" -> {
                val params = msg.params?.jsonObject ?: return
                val pid = params["processId"]?.jsonPrimitive?.contentOrNull ?: return
                if (pid != currentPid) return
                val exitCode = params["exitCode"]?.jsonPrimitive?.contentOrNull?.toIntOrNull()
                _state.update { it.copy(status = ExecStatus.Done, exitCode = exitCode) }
            }
            "command/exec/error" -> {
                val params = msg.params?.jsonObject ?: return
                val pid = params["processId"]?.jsonPrimitive?.contentOrNull ?: return
                if (pid != currentPid) return
                val errMsg = params["message"]?.jsonPrimitive?.contentOrNull ?: "Unknown error"
                _state.update { it.copy(status = ExecStatus.Error, error = errMsg) }
            }
        }
    }
}
