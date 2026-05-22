package tv.tootie.aurora.app.ui.chat

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
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
import tv.tootie.aurora.app.codex.CodexEvent
import tv.tootie.aurora.app.codex.CodexRepository
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
    val rawReasoning: String = "",          // verbose reasoning text, accumulated but not shown in summary UI
    val thinking: Boolean = false,
    val connected: Boolean = false,
    val error: String? = null,
    val assistantId: String? = null,
    val models: List<ModelOption> = emptyList(),
    val selectedModel: String = "gpt-5.5",
    val selectedEffort: String = "medium",
    val reactions: Map<String, Set<String>> = emptyMap(),
    val editingMessage: ChatMsg? = null,
    val actionsTarget: ChatMsg? = null,
    val availableCommands: List<String> = emptyList(),
    val availableSkills: List<SkillItem> = emptyList(),
    val skillInvocations: List<SkillInvocation> = emptyList(),
)

class ChatViewModel(app: Application) : AndroidViewModel(app) {
    private val settings = AppSettings(app)
    private val repo: CodexRepository = (app as CodexApp).repository
    private var pendingMsg: String? = null
    private var pendingAttachments: List<SelectedItem> = emptyList()

    // Buffer for verbose reasoning text — avoids O(n²) String allocations and prevents
    // unnecessary state emissions on every textDelta. Snapshot to ChatState.rawReasoning
    // only on turn/completed or when the UI opts in to display it.
    private val rawReasoningBuffer = StringBuilder()

    private val _state = MutableStateFlow(ChatState())
    val state: StateFlow<ChatState> = _state.asStateFlow()

    init {
        // Subscribe to typed flows from the shared repository
        repo.modelsFlow.onEach { handleModels(it) }.launchIn(viewModelScope)
        repo.skillsFlow.onEach { handleSkills(it) }.launchIn(viewModelScope)
        repo.turnEventsFlow.onEach { handle(it.msg) }.launchIn(viewModelScope)
        repo.errorsFlow.onEach { e ->
            _state.update { it.copy(error = e.message, thinking = false) }
        }.launchIn(viewModelScope)
    }

    fun connect(threadId: String) {
        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            repo.connect(url, tok)
            _state.update { it.copy(connected = true, threadId = if (threadId != "new") threadId else null) }
            // Fetch models and skills after handshake completes
            delay(500)
            repo.listModels()
            delay(100)
            repo.listSkills()
        }
    }

    fun send(text: String, attachments: List<SelectedItem> = emptyList()) {
        val tid = _state.value.threadId
        rawReasoningBuffer.clear()
        _state.update { s ->
            s.copy(
                msgs = s.msgs + ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, text),
                thinking = true, toolCalls = emptyList(), reasoning = emptyList(),
                rawReasoning = "",
                skillInvocations = emptyList(),
            )
        }
        viewModelScope.launch {
            if (tid == null) {
                pendingMsg = text
                pendingAttachments = attachments
                val model = settings.model.first()
                repo.startThread(model)
            } else {
                repo.startTurn(tid, text,
                    attachments = attachments,
                    model = _state.value.selectedModel,
                    effort = _state.value.selectedEffort)
            }
        }
    }

    fun interrupt() {
        val tid = _state.value.threadId ?: return
        repo.interrupt(tid)
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

    fun sendEdit(newText: String, attachments: List<SelectedItem> = emptyList()) {
        val editing = _state.value.editingMessage ?: return
        val tid = _state.value.threadId ?: return
        val idx = _state.value.msgs.indexOfFirst { it.id == editing.id }
        val trimmed = if (idx >= 0) _state.value.msgs.take(idx) else _state.value.msgs
        rawReasoningBuffer.clear()
        _state.update { s ->
            s.copy(
                msgs = trimmed,
                editingMessage = null,
                thinking = true,
                toolCalls = emptyList(),
                reasoning = emptyList(),
                rawReasoning = "",
            )
        }
        viewModelScope.launch {
            repo.startTurn(tid, newText,
                attachments = attachments,
                model = _state.value.selectedModel,
                effort = _state.value.selectedEffort)
        }
    }

    // --- Flow handlers for typed repository events ---

    private fun handleModels(event: CodexEvent.ModelList) {
        val options = event.models.mapNotNull { obj ->
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

    private fun handleSkills(event: CodexEvent.SkillList) {
        val skills = event.skills.mapNotNull { obj ->
            val name = obj["name"]?.jsonPrimitive?.content ?: return@mapNotNull null
            val desc = obj["description"]?.jsonPrimitive?.content ?: ""
            SkillItem(name, desc)
        }
        if (skills.isNotEmpty()) {
            _state.update { it.copy(availableSkills = skills.sortedBy { s -> s.name }) }
        }
    }

    // --- Turn event dispatch (unchanged from original, minus model/skill branches) ---

    private fun handle(msg: RpcMessage) {
        val params = msg.params?.jsonObject
        val result = msg.result?.jsonObject
        when (msg.method) {
            // Null method = response to one of our requests that the repository
            // forwarded to turnEventsFlow. After this refactor the only response
            // that arrives here (not intercepted by the repository) is thread/start.
            null -> {
                // thread/start response: result.thread.id
                val tid = result
                    ?.get("thread")?.jsonObject?.get("id")?.jsonPrimitive?.content
                if (tid != null && _state.value.threadId == null) {
                    _state.update { it.copy(threadId = tid) }
                    pendingMsg?.let { text ->
                        val attachments = pendingAttachments
                        pendingMsg = null
                        pendingAttachments = emptyList()
                        viewModelScope.launch {
<<<<<<< HEAD
                            repo.startTurn(tid, text,
=======
                            client?.startTurn(tid, text,
>>>>>>> a8dcc11 (fix(chat): clear selectedItems on edit entry; preserve attachments for new threads)
                                attachments = attachments,
                                model = _state.value.selectedModel,
                                effort = _state.value.selectedEffort)
                        }
                    }
                }
            }

            // Agent text streaming
            "item/agentMessage/delta" -> {
                val delta = params?.get("delta")?.jsonPrimitive?.content ?: return
                val itemId = params["itemId"]?.jsonPrimitive?.content
                val aid = _state.value.assistantId
                val resolvedId = itemId ?: aid ?: "a${System.currentTimeMillis()}"
                if (aid != null && (itemId == null || itemId == aid)) {
                    _state.update { s -> s.copy(msgs = s.msgs.map { if (it.id == aid) it.copy(content = it.content + delta) else it }) }
                } else {
                    _state.update { s -> s.copy(msgs = s.msgs + ChatMsg(resolvedId, MsgRole.Assistant, delta), assistantId = resolvedId) }
                }
            }

            // Turn lifecycle
            "turn/started" -> _state.update { it.copy(thinking = true, assistantId = null) }
            "turn/completed" -> {
                // Snapshot buffered raw reasoning to state once at turn end (avoids per-delta emissions)
                val raw = rawReasoningBuffer.toString()
                _state.update { it.copy(thinking = false, assistantId = null, rawReasoning = raw) }
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

            // Reasoning summary — extends the current (last) step with streamed characters
            "item/reasoning/summaryTextDelta" -> {
                val delta = params?.get("delta")?.jsonPrimitive?.content ?: return
                _state.update { s ->
                    val lines = s.reasoning.toMutableList()
                    if (lines.isEmpty()) lines.add(delta) else lines[lines.lastIndex] += delta
                    s.copy(reasoning = lines)
                }
            }

            // Reasoning summary — a new summary part begins; append a fresh step
            "item/reasoning/summaryPartAdded" -> {
                _state.update { s ->
                    s.copy(reasoning = s.reasoning + "")
                }
            }

            // Available commands from server
            "session/update" -> {
                val commands = params?.get("availableCommands")?.jsonArray
                if (commands != null) {
                    _state.update { it.copy(availableCommands = commands.mapNotNull { c ->
                        c.jsonObject["name"]?.jsonPrimitive?.content
                    }) }
                }
            }

            // Raw verbose reasoning text — buffer without emitting state (not rendered in UI).
            // Snapshot to ChatState.rawReasoning when the turn completes.
            "item/reasoning/textDelta" -> {
                val delta = params?.get("delta")?.jsonPrimitive?.content ?: return
                rawReasoningBuffer.append(delta)
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
        val parts = hookId.split("/")
        val cacheIdx = parts.indexOf("cache")
        if (cacheIdx >= 0 && cacheIdx + 2 < parts.size) {
            return parts[cacheIdx + 2]
        }
        return null
    }

    // Do NOT disconnect here — the repository owns the connection lifetime.
    override fun onCleared() { super.onCleared() }
}
