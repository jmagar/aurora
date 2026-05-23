package tv.tootie.aurora.app.ui.chat

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.ApprovalPolicy
import tv.tootie.aurora.app.codex.ApprovalsReviewer
import tv.tootie.aurora.app.codex.CodexEvent
import tv.tootie.aurora.app.codex.CodexRepository
import tv.tootie.aurora.app.codex.GranularPolicy
import tv.tootie.aurora.app.codex.PendingAttachment
import tv.tootie.aurora.app.codex.RequestKind
import tv.tootie.aurora.app.data.AppSettings

enum class MsgRole { User, Assistant }

data class ChatMsg(val id: String, val role: MsgRole, val content: String)
data class ToolCall(val id: String, val cmd: String, val out: StringBuilder = StringBuilder(), val done: Boolean = false, val failed: Boolean = false)
enum class SkillSource { HOOK, EXPLICIT }

data class SkillItem(val name: String, val description: String, val path: String? = null)

data class SkillInvocation(
    val id: String,
    val skillName: String,
    val done: Boolean = false,
    val source: SkillSource = SkillSource.HOOK,
)

data class McpToolCallItem(
    val id: String,
    val server: String,
    val tool: String,
    val status: String = "inProgress",
    val arguments: String = "",
    val output: String = "",
    val error: String? = null,
)

data class FileChangeItem(
    val id: String,
    val paths: List<String>,
    val status: String = "pending",
)

data class ToolApproval(
    val itemId: String,
    val rawServerId: JsonElement,
    val type: String,              // "command" or "fileChange"
    val command: String? = null,   // already sanitized
    val reason: String? = null,    // already sanitized
    val availableDecisions: List<String> = listOf("accept", "decline"),
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
    val mcpToolCalls: List<McpToolCallItem> = emptyList(),
    val planItems: List<String> = emptyList(),
    val webSearches: List<String> = emptyList(),
    val fileChanges: List<FileChangeItem> = emptyList(),
    // Image attachments pending send
    val pendingAttachments: List<PendingAttachment> = emptyList(),
    // Approval policy controls
    val selectedApprovalPolicy: ApprovalPolicy = ApprovalPolicy.OnRequest,
    val granularPolicy: GranularPolicy = GranularPolicy(),
    val selectedReviewer: ApprovalsReviewer = ApprovalsReviewer.User,
    val pendingApprovals: List<ToolApproval> = emptyList(),
    val activeTurnId: String? = null,
    val showSteerSheet: Boolean = false,
)

/**
 * Strips terminal escape sequences, Bidi overrides, and zero-width chars from
 * server-supplied strings before storing in UI state.
 * Internal visibility so ToolCallTimeline.kt (same module) can use it.
 * Uses ESC variable to avoid storing literal 0x1B bytes in source.
 */
internal fun String.sanitizeForDisplay(): String {
    val ESC = "\u001B"
    return this
        .replace(Regex("""$ESC\[[0-?]*[ -/]*[@-~]"""), "")          // CSI sequences
        .replace(Regex("""$ESC[\]PX^_][^$ESC]*(?:$ESC\\|)?"""), "") // OSC/DCS/APC/SOS/PM
        .replace(Regex("""$ESC[@-_]"""), "")                          // 2-byte Fe sequences
        .replace(ESC, "")                                             // stray ESC byte
        .replace(Regex("[\u0000-\u0008\u000B\u000C\u000E-\u001F]"), "") // C0 (keep \t\n\r)
        .replace(Regex("[\u0080-\u009F]"), "")                        // C1 controls
        .replace(Regex("[‎‏‪-‮⁦-⁩]"), "") // Bidi overrides
        .replace(Regex("[​-‍﻿]"), "")                  // zero-width + BOM
}

class ChatViewModel(app: Application) : AndroidViewModel(app) {
    private val settings = AppSettings(app)
    private val repo: CodexRepository = (app as CodexApp).repository
    private var pendingMsg: String? = null
    private var pendingAttachments: List<SelectedItem> = emptyList()
    // Pending image attachments for new-thread sends (stored until thread/start response arrives)
    private var pendingImages: List<PendingAttachment> = emptyList()

    // Buffer for verbose reasoning text — avoids O(n²) String allocations and prevents
    // unnecessary state emissions on every textDelta. Snapshot to ChatState.rawReasoning
    // only on turn/completed or when the UI opts in to display it.
    private val rawReasoningBuffer = StringBuilder()
    private val steerText = java.util.concurrent.atomic.AtomicReference<String?>(null)

    private val _state = MutableStateFlow(ChatState())
    val state: StateFlow<ChatState> = _state.asStateFlow()

    init {
        // Subscribe to typed flows from the shared repository
        repo.modelsFlow.onEach { handleModels(it) }.launchIn(viewModelScope)
        repo.skillsFlow.onEach { handleSkills(it) }.launchIn(viewModelScope)
        repo.turnEventsFlow.onEach { handle(it) }.launchIn(viewModelScope)
        repo.errorsFlow.onEach { e ->
            _state.update { it.copy(error = e.message, thinking = false) }
        }.launchIn(viewModelScope)
        repo.sessionInvalidated.onEach {
            _state.update { it.copy(threadId = null, msgs = emptyList()) }
            viewModelScope.launch { settings.clearThreadId() }
        }.launchIn(viewModelScope)
    }

    fun connect(threadId: String) {
        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            repo.connect(url, tok)
            _state.update { it.copy(connected = true, threadId = if (threadId != "new") threadId else null) }
            // Load global approval defaults from settings
            val policyWire = settings.approvalPolicy.first()
            val reviewerWire = settings.approvalsReviewer.first()
            _state.update { it.copy(
                selectedApprovalPolicy = ApprovalPolicy.fromWire(policyWire),
                selectedReviewer = ApprovalsReviewer.fromWire(reviewerWire),
            ) }
            // Wait for handshake to complete before issuing requests
            repo.isReady.filter { it }.first()
            repo.listModels()
            repo.listSkills()
            // Try to resume the last saved thread on fresh connect
            if (threadId == "new") {
                val saved = settings.savedThreadId.first()
                if (saved != null) {
                    tryResumeThread(saved)
                }
                // saved == null -> new thread created lazily on first send()
            }
        }
    }

    private fun tryResumeThread(threadId: String) {
        repo.resumeThread(threadId)
        // Response arrives as TurnEvent with originKind=RequestKind.ThreadResume
        // Handled in handle() — see ThreadResume branch in the null-method dispatch
    }

    // Approval policy selectors
    fun selectApprovalPolicy(policy: ApprovalPolicy) {
        _state.update { it.copy(selectedApprovalPolicy = policy) }
    }

    fun updateGranularPolicy(update: GranularPolicy.() -> GranularPolicy) {
        _state.update { it.copy(granularPolicy = it.granularPolicy.update()) }
    }

    fun selectReviewer(reviewer: ApprovalsReviewer) {
        _state.update { it.copy(selectedReviewer = reviewer) }
    }

    fun send(text: String, attachments: List<SelectedItem> = emptyList()) {
        val tid = _state.value.threadId
        val images = _state.value.pendingAttachments

        // Display text when available; use a placeholder for image-only sends.
        val displayContent = text.ifBlank {
            if (images.isNotEmpty()) "[Image]" else ""
        }

        rawReasoningBuffer.clear()
        _state.update { s ->
            s.copy(
                msgs = s.msgs + ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, displayContent),
                thinking = true, toolCalls = emptyList(), reasoning = emptyList(),
                rawReasoning = "",
                skillInvocations = emptyList(),
                mcpToolCalls = emptyList(),
                planItems = emptyList(),
                webSearches = emptyList(),
                fileChanges = emptyList(),
                pendingAttachments = emptyList(),
                pendingApprovals = emptyList(),
            )
        }
        viewModelScope.launch {
            if (tid == null) {
                pendingMsg = text
                pendingAttachments = attachments
                pendingImages = images
                val model = settings.model.first()
                repo.startThread(model)
            } else {
                repo.startTurn(tid, text,
                    attachments = attachments,
                    model = _state.value.selectedModel,
                    effort = _state.value.selectedEffort,
                    images = images,
                    approvalPolicy = _state.value.selectedApprovalPolicy,
                    granularPolicy = if (_state.value.selectedApprovalPolicy == ApprovalPolicy.Granular)
                        _state.value.granularPolicy else null,
                    approvalsReviewer = _state.value.selectedReviewer)
            }
        }
    }

    fun addImageAttachment(attachment: PendingAttachment) {
        _state.update { it.copy(pendingAttachments = it.pendingAttachments + attachment) }
    }

    fun removeAttachment(id: String) {
        _state.update { it.copy(pendingAttachments = it.pendingAttachments.filter { a -> a.id != id }) }
    }

    fun interrupt() {
        val tid = _state.value.threadId ?: return
        repo.interrupt(tid)
        _state.update { it.copy(thinking = false, activeTurnId = null) }
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
                mcpToolCalls = emptyList(),
                planItems = emptyList(),
                webSearches = emptyList(),
                fileChanges = emptyList(),
                // Discard pending image attachments — edits are text/skill only.
                pendingAttachments = emptyList(),
                pendingApprovals = emptyList(),
            )
        }
        viewModelScope.launch {
            repo.startTurn(tid, newText,
                attachments = attachments,
                model = _state.value.selectedModel,
                effort = _state.value.selectedEffort,
                approvalPolicy = _state.value.selectedApprovalPolicy,
                granularPolicy = if (_state.value.selectedApprovalPolicy == ApprovalPolicy.Granular)
                    _state.value.granularPolicy else null,
                approvalsReviewer = _state.value.selectedReviewer)
        }
    }

    fun sendWithSkill(text: String, skillName: String, skillPath: String) {
        val tid = _state.value.threadId
        val images = _state.value.pendingAttachments
        val inv = SkillInvocation(id = "explicit-$skillName", skillName = skillName, source = SkillSource.EXPLICIT)
        rawReasoningBuffer.clear()
        _state.update { s ->
            val existing = s.skillInvocations.any { it.skillName.equals(skillName, ignoreCase = true) }
            s.copy(
                msgs = s.msgs + ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, text),
                thinking = true,
                toolCalls = emptyList(),
                reasoning = emptyList(),
                rawReasoning = "",
                mcpToolCalls = emptyList(),
                skillInvocations = if (existing) s.skillInvocations else s.skillInvocations + inv,
                pendingApprovals = emptyList(),
                planItems = emptyList(),
                webSearches = emptyList(),
                fileChanges = emptyList(),
                pendingAttachments = emptyList(),
            )
        }
        viewModelScope.launch {
            if (tid == null) {
                pendingMsg = text
                pendingAttachments = listOf(SelectedItem.Skill(skillName, skillPath))
                pendingImages = images
                val model = settings.model.first()
                repo.startThread(model)
            } else {
                repo.startTurn(
                    threadId = tid,
                    text = text,
                    attachments = listOf(SelectedItem.Skill(skillName, skillPath)),
                    model = _state.value.selectedModel,
                    effort = _state.value.selectedEffort,
                    images = images,
                    approvalPolicy = _state.value.selectedApprovalPolicy,
                    granularPolicy = if (_state.value.selectedApprovalPolicy == ApprovalPolicy.Granular)
                        _state.value.granularPolicy else null,
                    approvalsReviewer = _state.value.selectedReviewer,
                )
            }
        }
    }

    fun approveToolCall(decision: String) {
        val approval = _state.value.pendingApprovals.firstOrNull() ?: return
        val sent = repo.sendApproval(approval.rawServerId, decision)
        if (sent) {
            // Use identity-based removal to handle concurrent serverRequest/resolved races
            _state.update { it.copy(pendingApprovals = it.pendingApprovals.filter { a -> a.rawServerId != approval.rawServerId }) }
        } else {
            _state.update { it.copy(error = "Could not send approval — connection lost. Reconnecting...") }
        }
    }

    fun steer(text: String) {
        val turnId = _state.value.activeTurnId ?: return
        val threadId = _state.value.threadId ?: return
        steerText.set(text)
        _state.update { it.copy(showSteerSheet = false) }
        repo.steerTurn(threadId, text, turnId)
    }

    fun showSteer() = _state.update { it.copy(showSteerSheet = true) }
    fun hideSteer() = _state.update { it.copy(showSteerSheet = false) }

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
            val path = obj["path"]?.jsonPrimitive?.contentOrNull
            SkillItem(name, desc, path)
        }
        if (skills.isNotEmpty()) {
            _state.update { it.copy(availableSkills = skills.sortedBy { s -> s.name }) }
        }
    }

    // --- Turn event dispatch (unchanged from original, minus model/skill branches) ---

    private fun handle(event: CodexEvent.TurnEvent) {
        val msg = event.msg
        val params = msg.params?.jsonObject
        val result = msg.result?.jsonObject
        when (msg.method) {
            // Null method = response to one of our requests that the repository
            // forwarded to turnEventsFlow.
            null -> {
                // Handle ThreadResume responses first
                if (event.originKind == RequestKind.ThreadResume) {
                    if (msg.error != null) {
                        if (msg.error.code == -32600) {
                            // Thread expired — clear saved ID
                            viewModelScope.launch { settings.clearThreadId() }
                        }
                        // Any other error: leave savedThreadId intact (transient failure)
                        return
                    }
                    // Success — extract threadId from result
                    val tid = result
                        ?.get("thread")?.jsonObject?.get("id")?.jsonPrimitive?.content
                    if (tid != null) {
                        _state.update { it.copy(threadId = tid, msgs = emptyList()) }
                    }
                    return
                }

                if (event.originKind == RequestKind.Steer) {
                    val text = steerText.getAndSet(null)
                    if (msg.error != null) {
                        // -32600 = turn already completed (race condition) — dismiss silently
                        _state.update { it.copy(showSteerSheet = false) }
                        return
                    }
                    // Steer accepted — append [steer] user message
                    if (text != null) {
                        val steerMsg = ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, "[steer] $text")
                        _state.update { s -> s.copy(msgs = s.msgs + steerMsg) }
                    }
                    return
                }

                // thread/start response: result.thread.id
                val tid = result
                    ?.get("thread")?.jsonObject?.get("id")?.jsonPrimitive?.content
                if (tid != null && _state.value.threadId == null) {
                    _state.update { it.copy(threadId = tid) }
                    viewModelScope.launch { settings.saveThread(tid) }
                    pendingMsg?.let { text ->
                        val attachments = pendingAttachments
                        val images = pendingImages
                        pendingMsg = null
                        pendingAttachments = emptyList()
                        pendingImages = emptyList()
                        viewModelScope.launch {
                            repo.startTurn(tid, text,
                                attachments = attachments,
                                model = _state.value.selectedModel,
                                effort = _state.value.selectedEffort,
                                images = images,
                                approvalPolicy = _state.value.selectedApprovalPolicy,
                                granularPolicy = if (_state.value.selectedApprovalPolicy == ApprovalPolicy.Granular)
                                    _state.value.granularPolicy else null,
                                approvalsReviewer = _state.value.selectedReviewer)
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
            "turn/started" -> {
                val turnId = params?.get("turn")?.jsonObject?.get("id")?.jsonPrimitive?.contentOrNull ?: return
                _state.update { it.copy(thinking = true, activeTurnId = turnId, assistantId = null) }
            }
            "turn/completed" -> {
                // Snapshot buffered raw reasoning to state once at turn end (avoids per-delta emissions)
                val raw = rawReasoningBuffer.toString()
                _state.update { it.copy(thinking = false, assistantId = null, rawReasoning = raw, activeTurnId = null) }
            }

            // Item lifecycle — track command executions and other items as tool calls
            "item/started" -> {
                val item = params?.get("item")?.jsonObject ?: return
                val type = item["type"]?.jsonPrimitive?.content
                val id = item["id"]?.jsonPrimitive?.content
                when (type) {
                    "commandExecution" -> {
                        val cmd = item["command"]?.jsonPrimitive?.content ?: return
                        val resolvedId = id ?: cmd
                        _state.update { s -> s.copy(toolCalls = s.toolCalls + ToolCall(resolvedId, cmd)) }
                    }
                    "mcpToolCall" -> {
                        if (id == null) return
                        val server = item["server"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: ""
                        val tool = item["tool"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: ""
                        val args = try { item["arguments"]?.jsonPrimitive?.content }
                                   catch (_: Exception) { item["arguments"]?.toString() }
                                   ?.take(8000)?.sanitizeForDisplay() ?: ""
                        _state.update { s ->
                            s.copy(mcpToolCalls = s.mcpToolCalls + McpToolCallItem(id, server, tool, "inProgress", args))
                        }
                    }
                    "plan" -> {
                        val text = item["text"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return
                        _state.update { s -> s.copy(planItems = s.planItems + text) }
                    }
                    "webSearch" -> {
                        val query = item["query"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return
                        _state.update { s -> s.copy(webSearches = s.webSearches + query) }
                    }
                    "fileChange" -> {
                        if (id == null) return
                        val changes = item["changes"]?.jsonArray
                        val paths = changes?.mapNotNull { it.jsonObject["path"]?.jsonPrimitive?.contentOrNull } ?: emptyList()
                        _state.update { s -> s.copy(fileChanges = s.fileChanges + FileChangeItem(id, paths)) }
                    }
                    "imageView" -> { /* informational only — no state needed */ }
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
                when (type) {
                    "commandExecution" -> {
                        _state.update { s -> s.copy(toolCalls = s.toolCalls.map { if (it.id == id) it.copy(done = true, failed = failed) else it }) }
                    }
                    "mcpToolCall" -> {
                        val output = try { item["result"]?.toString() } catch (_: Exception) { null }
                            ?.take(8000)?.sanitizeForDisplay() ?: ""
                        val err = item["error"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                        _state.update { s ->
                            s.copy(mcpToolCalls = s.mcpToolCalls.map { call ->
                                if (call.id == id) call.copy(
                                    status = if (failed) "failed" else "done",
                                    output = output, error = err
                                ) else call
                            })
                        }
                    }
                    "fileChange" -> {
                        _state.update { s ->
                            s.copy(fileChanges = s.fileChanges.map { fc ->
                                if (fc.id == id) fc.copy(status = if (failed) "failed" else "done") else fc
                            })
                        }
                    }
                }
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
                val inv = SkillInvocation(id = hookId, skillName = skillName, done = false, source = SkillSource.HOOK)
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

            "item/commandExecution/requestApproval" -> {
                val rawId = event.msg.id ?: return
                val rawCommand = params?.get("command")?.jsonPrimitive?.contentOrNull ?: ""
                val safeCommand = rawCommand.sanitizeForDisplay()
                val reason = params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                val decisions = params?.get("availableDecisions")?.jsonArray
                    ?.mapNotNull { it.jsonPrimitive?.contentOrNull } ?: listOf("accept", "decline")
                _state.update { s ->
                    s.copy(pendingApprovals = s.pendingApprovals + ToolApproval(
                        itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull ?: "",
                        rawServerId = rawId,
                        type = "command",
                        command = safeCommand,
                        reason = reason,
                        availableDecisions = decisions,
                    ))
                }
            }
            "item/fileChange/requestApproval" -> {
                val rawId = event.msg.id ?: return
                _state.update { s ->
                    s.copy(pendingApprovals = s.pendingApprovals + ToolApproval(
                        itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull ?: "",
                        rawServerId = rawId,
                        type = "fileChange",
                        reason = params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay(),
                    ))
                }
            }
            "serverRequest/resolved" -> {
                _state.update { it.copy(pendingApprovals = emptyList()) }
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
