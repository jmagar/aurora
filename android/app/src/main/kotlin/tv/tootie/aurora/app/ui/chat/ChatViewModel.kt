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
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.CodexConnectionManager
import tv.tootie.aurora.app.codex.ConnectionState
import tv.tootie.aurora.app.codex.RpcMessage
import tv.tootie.aurora.app.data.AppSettings

enum class MsgRole { User, Assistant }

data class ChatMsg(val id: String, val role: MsgRole, val content: String)
data class ToolCall(val id: String, val cmd: String, val out: StringBuilder = StringBuilder(), val done: Boolean = false, val failed: Boolean = false)
data class SkillItem(val name: String, val description: String)

data class SkillInvocation(
    val id: String,
    val skillName: String,
    val done: Boolean = false,
)

data class ChatState(
    val threadId: String? = null,
    val msgs: List<ChatMsg> = emptyList(),
    val toolCalls: List<ToolCall> = emptyList(),
    val reasoning: List<String> = emptyList(),
    val thinking: Boolean = false,
    val connected: Boolean = false,
    val error: String? = null,
    val assistantId: String? = null,
    // Feature 1: Model + Reasoning selectors
    val models: List<ModelOption> = emptyList(),
    val selectedModel: String = "gpt-5.5",
    val selectedEffort: String = "medium",
    // Feature 2: Reactions + Edit
    val reactions: Map<String, Set<String>> = emptyMap(),
    val editingMessage: ChatMsg? = null,
    val actionsTarget: ChatMsg? = null,
    // Feature 3: @Mention / slash commands
    val availableCommands: List<String> = emptyList(),
    val availableSkills: List<SkillItem> = emptyList(),
    // Skill hook invocations
    val skillInvocations: List<SkillInvocation> = emptyList(),
)

class ChatViewModel(app: Application) : AndroidViewModel(app) {
    private val settings = AppSettings(app)
    private val manager: CodexConnectionManager get() = (getApplication<CodexApp>()).connectionManager

    // Stores pending user message when thread has not been created yet
    private var _pendingMsg: String? = null

    private val _state = MutableStateFlow(ChatState())
    val state: StateFlow<ChatState> = _state.asStateFlow()

    init {
        // Subscribe exactly once per ViewModel lifetime — never inside connect()
        // SharedFlow(replay=0): subscribe before connecting so no events are missed
        manager.messages.onEach { handle(it) }.launchIn(viewModelScope)
        manager.connectionState.onEach { state ->
            _state.update { it.copy(connected = state is ConnectionState.Connected) }
        }.launchIn(viewModelScope)
    }

    fun connect(threadId: String) {
        _state.update { it.copy(threadId = if (threadId != "new") threadId else null) }

        val currentState = manager.connectionState.value
        if (currentState is ConnectionState.Connected || currentState is ConnectionState.Connecting) {
            if (_state.value.models.isEmpty()) {
                fetchModels()
                fetchSkills()
            }
            return
        }

        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            manager.connect(url, tok)
            manager.connectionState.first { it is ConnectionState.Connected }
            fetchModels()
            fetchSkills()
        }
    }

    fun send(text: String) {
        val tid = _state.value.threadId
        _state.update { s ->
            s.copy(
                msgs = s.msgs + ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, text),
                thinking = true, toolCalls = emptyList(), reasoning = emptyList(),
                skillInvocations = emptyList(),
            )
        }
        viewModelScope.launch {
            if (tid == null) {
                val model = settings.model.first()
                _pendingMsg = text
                manager.startThread(model) { response ->
                    val newTid = response.result?.jsonObject
                        ?.get("thread")?.jsonObject?.get("id")?.jsonPrimitive?.content
                    if (newTid != null) {
                        _state.update { it.copy(threadId = newTid) }
                        val pending = _pendingMsg
                        _pendingMsg = null
                        if (pending != null) {
                            manager.startTurn(
                                newTid, pending,
                                _state.value.selectedModel,
                                _state.value.selectedEffort
                            )
                        }
                    }
                }
            } else {
                manager.startTurn(
                    tid, text,
                    model = _state.value.selectedModel,
                    effort = _state.value.selectedEffort
                )
            }
        }
    }

    fun interrupt() {
        val tid = _state.value.threadId ?: return
        manager.interrupt(tid)
        _state.update { it.copy(thinking = false) }
    }

    // Feature 1: Model + Reasoning selectors
    fun selectModel(id: String) {
        val effort = _state.value.models.find { it.id == id }?.defaultEffort ?: "medium"
        _state.update { it.copy(selectedModel = id, selectedEffort = effort) }
    }

    fun selectEffort(effort: String) {
        _state.update { it.copy(selectedEffort = effort) }
    }

    private fun fetchModels() {
        manager.listModels { response ->
            val modelData = response.result?.jsonObject?.get("data")?.jsonArray ?: return@listModels
            val options = modelData.mapNotNull { elem ->
                val obj = elem.jsonObject
                val id = obj["id"]?.jsonPrimitive?.content ?: return@mapNotNull null
                val displayName = obj["displayName"]?.jsonPrimitive?.content ?: id
                val defaultEffort = obj["defaultReasoningEffort"]?.jsonPrimitive?.content ?: "medium"
                val efforts = obj["supportedReasoningEfforts"]?.jsonArray?.mapNotNull { e ->
                    val ev = e.jsonObject
                    val v = ev["reasoningEffort"]?.jsonPrimitive?.content ?: return@mapNotNull null
                    val d = ev["description"]?.jsonPrimitive?.content ?: ""
                    ReasoningEffortOption(v, d)
                } ?: emptyList()
                ModelOption(id, displayName, efforts, defaultEffort)
            }
            if (options.isNotEmpty()) {
                _state.update { s ->
                    val defaultEffort = options.find { it.id == s.selectedModel }?.defaultEffort ?: "medium"
                    s.copy(models = options, selectedEffort = defaultEffort)
                }
            }
        }
    }

    private fun fetchSkills() {
        manager.listSkills { response ->
            val firstItem = response.result?.jsonObject?.get("data")?.jsonArray
                ?.firstOrNull()?.jsonObject
            if (firstItem?.containsKey("skills") == true) {
                val skills = firstItem["skills"]?.jsonArray?.mapNotNull { elem ->
                    val obj = elem.jsonObject
                    val name = obj["name"]?.jsonPrimitive?.content ?: return@mapNotNull null
                    val desc = obj["description"]?.jsonPrimitive?.content ?: ""
                    SkillItem(name, desc)
                } ?: emptyList()
                if (skills.isNotEmpty()) {
                    _state.update { it.copy(availableSkills = skills.sortedBy { s -> s.name }) }
                }
            }
        }
    }

    // Feature 2: Message reactions + edit
    fun showActions(msg: ChatMsg) = _state.update { it.copy(actionsTarget = msg) }
    fun dismissActions() = _state.update { it.copy(actionsTarget = null) }

    fun toggleReaction(msgId: String, emoji: String) {
        _state.update { s ->
            val current = s.reactions[msgId] ?: emptySet()
            val updated = if (emoji in current) current - emoji else current + emoji
            s.copy(reactions = s.reactions + (msgId to updated))
        }
    }

    fun startEdit(msg: ChatMsg) {
        _state.update { it.copy(editingMessage = msg, actionsTarget = null) }
    }

    fun cancelEdit() = _state.update { it.copy(editingMessage = null) }

    fun sendEdit(newText: String) {
        val editing = _state.value.editingMessage ?: return
        val tid = _state.value.threadId ?: return
        val idx = _state.value.msgs.indexOfFirst { it.id == editing.id }
        val trimmed = if (idx >= 0) _state.value.msgs.take(idx) else _state.value.msgs
        _state.update { s ->
            s.copy(
                msgs = trimmed,
                editingMessage = null,
                thinking = true,
                toolCalls = emptyList(),
                reasoning = emptyList(),
            )
        }
        viewModelScope.launch {
            manager.startTurn(tid, newText,
                model = _state.value.selectedModel,
                effort = _state.value.selectedEffort)
        }
    }

    private fun handle(msg: RpcMessage) {
        val params = msg.params?.jsonObject

        when (msg.method) {
            // Null method = unmatched response (auth failure, general errors)
            // Note: thread/start, model/list, skills/list responses are handled by callbacks
            // registered in manager.send() — they never reach this handler.
            null -> {
                // Auth failure — -32001 is detected in message parser for app-layer errors
                if (msg.error?.code == -32001 || msg.error?.message?.contains("auth_failure") == true) {
                    _state.update { it.copy(error = "Authentication failed. Check Settings.", thinking = false) }
                    return
                }
                // General connection errors
                if (msg.error != null) {
                    _state.update { it.copy(error = msg.error.message, thinking = false) }
                }
            }

            // agentMessage/delta is NOT routed here — it goes to per-turn Channel<String>
            // in CodexConnectionManager.onMessage and is consumed by the coroutine launched
            // in the "turn/started" handler below. This case is intentionally absent.

            // Turn lifecycle
            "turn/started" -> {
                val turnId = params?.get("turn")?.jsonObject?.get("id")?.jsonPrimitive?.content ?: return
                val msgId = "a${System.currentTimeMillis()}"
                _state.update { it.copy(thinking = true, assistantId = msgId,
                    msgs = it.msgs + ChatMsg(msgId, MsgRole.Assistant, "")) }

                // Drain the per-turn delta channel and update message in-place
                // DEVIATION: Using option (a) — direct state update from delta channel coroutine.
                // This keeps O(n) list scan per delta but avoids exposing _inProgressContent StateFlow,
                // minimizing ChatScreen changes in this bead.
                val deltaChannel = manager.getDeltaChannel(turnId)
                viewModelScope.launch {
                    for (delta in deltaChannel) {
                        _state.update { s ->
                            s.copy(msgs = s.msgs.map { m ->
                                if (m.id == msgId) m.copy(content = m.content + delta) else m
                            })
                        }
                    }
                    // Channel closed = turn complete; final cleanup handled by turn/completed
                }
            }

            "turn/completed" -> {
                val turnId = params?.get("turn")?.jsonObject?.get("id")?.jsonPrimitive?.content
                if (turnId != null) {
                    manager.closeDeltaChannel(turnId)
                }
                _state.update { it.copy(thinking = false, assistantId = null) }
            }

            // Item lifecycle — track command executions as tool calls
            "item/started" -> {
                val item = params?.get("item")?.jsonObject ?: return
                val type = item["type"]?.jsonPrimitive?.content
                if (type == "commandExecution") {
                    val cmd = item["command"]?.jsonPrimitive?.content ?: return
                    val id = item["id"]?.jsonPrimitive?.content ?: cmd
                    _state.update { s -> s.copy(toolCalls = s.toolCalls + ToolCall(id, cmd)) }
                }
            }
            "item/completed" -> {
                val item = params?.get("item")?.jsonObject ?: return
                val id = item["id"]?.jsonPrimitive?.content ?: return
                val type = item["type"]?.jsonPrimitive?.content
                if (type == "agentMessage") {
                    _state.update { it.copy(assistantId = null) }
                    return
                }
                val failed = item["status"]?.jsonPrimitive?.content == "failed"
                _state.update { s -> s.copy(toolCalls = s.toolCalls.map { if (it.id == id) it.copy(done = true, failed = failed) else it }) }
            }

            // Command output streaming
            "item/commandExecution/outputDelta" -> {
                val itemId = params?.get("itemId")?.jsonPrimitive?.content ?: return
                val out = params["delta"]?.jsonPrimitive?.content ?: return
                _state.update { s -> s.copy(toolCalls = s.toolCalls.map { if (it.id == itemId) { it.out.append(out); it } else it }) }
            }

            // Reasoning summary streaming
            "reasoningSummaryTextDelta", "item/reasoning/summaryDelta" -> {
                val delta = params?.get("delta")?.jsonPrimitive?.content ?: return
                _state.update { s ->
                    val lines = s.reasoning.toMutableList()
                    if (lines.isEmpty()) lines.add(delta) else lines[lines.lastIndex] += delta
                    s.copy(reasoning = lines)
                }
            }

            // Feature 3: Available commands from server
            "session/update" -> {
                val commands = params?.get("availableCommands")?.jsonArray
                if (commands != null) {
                    _state.update { it.copy(availableCommands = commands.mapNotNull { c ->
                        c.jsonObject["name"]?.jsonPrimitive?.content
                    }) }
                }
            }

            // Skill hook invocations
            "hook/started" -> {
                val run = params?.get("run")?.jsonObject ?: return
                val eventName = run["eventName"]?.jsonPrimitive?.content ?: return
                if (eventName != "userPromptSubmit") return
                val hookId = run["id"]?.jsonPrimitive?.content ?: return
                val skillName = extractSkillName(hookId) ?: return
                val inv = SkillInvocation(id = hookId, skillName = skillName, done = false)
                _state.update { s -> s.copy(skillInvocations = s.skillInvocations + inv) }
            }
            "hook/completed" -> {
                val run = params?.get("run")?.jsonObject ?: return
                val hookId = run["id"]?.jsonPrimitive?.content ?: return
                _state.update { s ->
                    s.copy(skillInvocations = s.skillInvocations.map {
                        if (it.id == hookId) it.copy(done = true) else it
                    })
                }
            }

            // Errors
            "error" -> {
                val errMsg = params?.get("error")?.jsonObject?.get("message")?.jsonPrimitive?.content
                    ?: msg.error?.message
                _state.update { it.copy(error = errMsg, thinking = false) }
            }
        }
    }

    private fun extractSkillName(hookId: String): String? {
        // Paths like: .../plugins/cache/labby-marketplace/aurora-design-system/1.0.4/hooks/...
        // or: .../plugins/cache/jmagar-lab/superpowers/5.1.0/hooks/...
        val parts = hookId.split("/")
        val cacheIdx = parts.indexOf("cache")
        if (cacheIdx >= 0 && cacheIdx + 2 < parts.size) {
            return parts[cacheIdx + 2]  // e.g. "aurora-design-system", "superpowers", "beads"
        }
        return null
    }

    override fun onCleared() {
        // Do not disconnect — manager is a shared singleton owned by CodexApp
        super.onCleared()
    }
}
