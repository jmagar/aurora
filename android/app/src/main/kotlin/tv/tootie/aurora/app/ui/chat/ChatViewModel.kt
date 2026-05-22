package tv.tootie.aurora.app.ui.chat

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.codex.CodexClient
import tv.tootie.aurora.app.codex.RpcMessage
import tv.tootie.aurora.app.data.AppSettings

enum class MsgRole { User, Assistant }

data class ChatMsg(val id: String, val role: MsgRole, val content: String)
data class ToolCall(val id: String, val cmd: String, val out: StringBuilder = StringBuilder(), val done: Boolean = false, val failed: Boolean = false)

data class ChatState(
    val threadId: String? = null,
    val msgs: List<ChatMsg> = emptyList(),
    val toolCalls: List<ToolCall> = emptyList(),
    val reasoning: List<String> = emptyList(),
    val thinking: Boolean = false,
    val connected: Boolean = false,
    val error: String? = null,
    val assistantId: String? = null,
)

class ChatViewModel(app: Application) : AndroidViewModel(app) {
    private val settings = AppSettings(app)
    private var client: CodexClient? = null
    private var pendingMsg: String? = null

    private val _state = MutableStateFlow(ChatState())
    val state: StateFlow<ChatState> = _state.asStateFlow()

    fun connect(threadId: String) {
        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            client = CodexClient(url, tok).also { c ->
                c.connect()
                c.messages.onEach { handle(it) }.launchIn(this)
            }
            _state.update { it.copy(connected = true, threadId = if (threadId != "new") threadId else null) }
        }
    }

    fun send(text: String) {
        val c = client ?: return
        val tid = _state.value.threadId
        _state.update { s ->
            s.copy(
                msgs = s.msgs + ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, text),
                thinking = true, toolCalls = emptyList(), reasoning = emptyList(),
            )
        }
        viewModelScope.launch {
            if (tid == null) {
                pendingMsg = text
                val model = settings.model.first()
                c.startThread(model)
            } else {
                c.startTurn(tid, text)
            }
        }
    }

    fun interrupt() {
        val tid = _state.value.threadId ?: return
        client?.interrupt(tid)
        _state.update { it.copy(thinking = false) }
    }

    private fun handle(msg: RpcMessage) {
        val params = msg.params?.jsonObject
        val result = msg.result?.jsonObject
        when (msg.method) {
            null -> {
                // Response to a request
                val tid = result?.get("threadId")?.jsonPrimitive?.content
                    ?: result?.get("id")?.jsonPrimitive?.content
                if (tid != null && _state.value.threadId == null) {
                    _state.update { it.copy(threadId = tid) }
                    pendingMsg?.let { text ->
                        pendingMsg = null
                        viewModelScope.launch { client?.startTurn(tid, text) }
                    }
                }
            }
            "agentMessageDelta" -> {
                val delta = params?.get("delta")?.jsonPrimitive?.content ?: return
                val aid = _state.value.assistantId
                if (aid != null) {
                    _state.update { s -> s.copy(msgs = s.msgs.map { if (it.id == aid) it.copy(content = it.content + delta) else it }) }
                } else {
                    val newId = "a${System.currentTimeMillis()}"
                    _state.update { s -> s.copy(msgs = s.msgs + ChatMsg(newId, MsgRole.Assistant, delta), assistantId = newId) }
                }
            }
            "turnStarted" -> _state.update { it.copy(thinking = true, assistantId = null) }
            "turnCompleted" -> _state.update { it.copy(thinking = false, assistantId = null) }
            "itemStarted" -> {
                val item = params?.get("item")?.jsonObject ?: return
                if (item["type"]?.jsonPrimitive?.content == "commandExecution") {
                    val cmd = item["command"]?.jsonPrimitive?.content ?: return
                    val id = item["id"]?.jsonPrimitive?.content ?: cmd
                    _state.update { s -> s.copy(toolCalls = s.toolCalls + ToolCall(id, cmd)) }
                }
            }
            "itemCompleted" -> {
                val item = params?.get("item")?.jsonObject ?: return
                val id = item["id"]?.jsonPrimitive?.content ?: return
                val failed = item["status"]?.jsonPrimitive?.content == "failed"
                _state.update { s -> s.copy(toolCalls = s.toolCalls.map { if (it.id == id) it.copy(done = true, failed = failed) else it }) }
            }
            "commandExecOutputDelta" -> {
                val itemId = params?.get("itemId")?.jsonPrimitive?.content ?: return
                val out = params["delta"]?.jsonPrimitive?.content ?: return
                _state.update { s -> s.copy(toolCalls = s.toolCalls.map { if (it.id == itemId) { it.out.append(out); it } else it }) }
            }
            "reasoningSummaryTextDelta" -> {
                val delta = params?.get("delta")?.jsonPrimitive?.content ?: return
                _state.update { s ->
                    val lines = s.reasoning.toMutableList()
                    if (lines.isEmpty()) lines.add(delta) else lines[lines.lastIndex] += delta
                    s.copy(reasoning = lines)
                }
            }
            "error" -> _state.update { it.copy(error = msg.error?.message, thinking = false) }
        }
    }

    override fun onCleared() { client?.disconnect(); super.onCleared() }
}
