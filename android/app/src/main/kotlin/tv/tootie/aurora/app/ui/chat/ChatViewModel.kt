package tv.tootie.aurora.app.ui.chat

import android.app.Application
import androidx.compose.runtime.Immutable
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.ImmutableMap
import kotlinx.collections.immutable.persistentListOf
import kotlinx.collections.immutable.persistentMapOf
import kotlinx.collections.immutable.toImmutableList
import kotlinx.collections.immutable.toImmutableMap
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonPrimitive
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

@Immutable
data class ChatMsg(val id: String, val role: MsgRole, val content: String)

/** out is a String snapshot — never mutable in place. Updated via state transitions only. */
@Immutable
data class ToolCall(
    val id: String,
    val cmd: String,
    val out: String = "",
    val done: Boolean = false,
    val failed: Boolean = false,
)

enum class SkillSource { HOOK, EXPLICIT }

@Immutable
data class SkillItem(val name: String, val description: String, val path: String? = null)

@Immutable
data class SkillInvocation(
    val id: String,
    val skillName: String,
    val done: Boolean = false,
    val source: SkillSource = SkillSource.HOOK,
)

@Immutable
data class McpToolCallItem(
    val id: String,
    val server: String,
    val tool: String,
    val status: String = "inProgress",
    val arguments: String = "",
    val output: String = "",
    val error: String? = null,
)

@Immutable
data class FileChangeItem(
    val id: String,
    val paths: ImmutableList<String>,
    val status: String = "pending",
)

@Immutable
data class ToolApproval(
    val itemId: String,
    // Correlation key. Removal/resolution assumes server-id uniqueness; if two pending
    // entries share a rawServerId (a tie), the reducer removes ALL matches (see reduceApprovals).
    val rawServerId: JsonElement,
    val type: String,              // "command" or "fileChange"
    val command: String? = null,   // already sanitized
    val reason: String? = null,    // already sanitized
    val availableDecisions: ImmutableList<String> = persistentListOf("accept", "decline"),
)

@Immutable
data class ChatState(
    val threadId: String? = null,
    val msgs: ImmutableList<ChatMsg> = persistentListOf(),
    val toolCalls: ImmutableList<ToolCall> = persistentListOf(),
    val reasoning: ImmutableList<String> = persistentListOf(),
    val rawReasoning: String = "",          // verbose reasoning text, accumulated but not shown in summary UI
    val thinking: Boolean = false,
    val connected: Boolean = false,
    val error: String? = null,
    val assistantId: String? = null,
    val models: ImmutableList<ModelOption> = persistentListOf(),
    val selectedModel: String = "gpt-5.5",
    val selectedEffort: String = "medium",
    val reactions: ImmutableMap<String, Set<String>> = persistentMapOf(),
    val editingMessage: ChatMsg? = null,
    val actionsTarget: ChatMsg? = null,
    val availableCommands: ImmutableList<String> = persistentListOf(),
    val availableSkills: ImmutableList<SkillItem> = persistentListOf(),
    val skillInvocations: ImmutableList<SkillInvocation> = persistentListOf(),
    val mcpToolCalls: ImmutableList<McpToolCallItem> = persistentListOf(),
    val planItems: ImmutableList<String> = persistentListOf(),
    val webSearches: ImmutableList<String> = persistentListOf(),
    val fileChanges: ImmutableList<FileChangeItem> = persistentListOf(),
    // Image attachments pending send
    val pendingAttachments: ImmutableList<PendingAttachment> = persistentListOf(),
    // Approval policy controls
    val selectedApprovalPolicy: ApprovalPolicy = ApprovalPolicy.OnRequest,
    val granularPolicy: GranularPolicy = GranularPolicy(),
    val selectedReviewer: ApprovalsReviewer = ApprovalsReviewer.User,
    val pendingApprovals: ImmutableList<ToolApproval> = persistentListOf(),
    val activeTurnId: String? = null,
    val showSteerSheet: Boolean = false,
    // Bead nev6: thread name + cwd shown in top bar
    val threadName: String? = null,
    val cwd: String? = null,
) {
    /**
     * Return a copy with all per-turn transient fields zeroed and [newMsgs] installed.
     * Called from send(), sendEdit(), and sendWithSkill() so the reset is always consistent.
     *
     * [retainSkillInvocations]: sendWithSkill() appends the new invocation before calling
     * this, so it passes `true` to keep the updated list intact.
     */
    fun resetForNewTurn(
        newMsgs: ImmutableList<ChatMsg> = msgs,
        retainSkillInvocations: Boolean = false,
    ): ChatState = copy(
        msgs = newMsgs,
        thinking = true,
        toolCalls = persistentListOf(),
        reasoning = persistentListOf(),
        rawReasoning = "",
        skillInvocations = if (retainSkillInvocations) skillInvocations else persistentListOf(),
        mcpToolCalls = persistentListOf(),
        planItems = persistentListOf(),
        webSearches = persistentListOf(),
        fileChanges = persistentListOf(),
        pendingAttachments = persistentListOf(),
        pendingApprovals = persistentListOf(),
    )
}

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

/**
 * Pure state transitions for the pending-approval list (P1-6).
 *
 * Extracted from ChatViewModel so the human-in-the-loop approval correlation logic
 * can be unit-tested without an Android runtime. All transitions correlate by
 * [ToolApproval.rawServerId] identity (the JsonElement server id), never by list
 * position — so approving/removing always targets the intended request.
 *
 * The reducer is side-effect free: it never auto-accepts. The ViewModel performs the
 * actual repo.sendApproval(...) network call and then applies [ApprovalEvent.Approved]
 * to drop the resolved entry.
 */
internal sealed interface ApprovalEvent {
    /** A new approval request arrived from the server. */
    data class Requested(val approval: ToolApproval) : ApprovalEvent
    /** The user (or VM) resolved a specific approval, identified by server id. */
    data class Approved(val rawServerId: JsonElement) : ApprovalEvent
    /** serverRequest/resolved with a specific id: drop the matching approval. */
    data class Resolved(val rawServerId: JsonElement) : ApprovalEvent
    /** serverRequest/resolved without an id: clear ALL pending approvals. */
    data object ResolvedAll : ApprovalEvent
}

/**
 * Apply an [ApprovalEvent] to the pending-approval list, returning the new list.
 * Pure: no side effects, correlates strictly by rawServerId identity.
 */
/**
 * Normalize a server request id to a primitive correlation key. Codex request ids are scalars
 * (string/number) on the wire, so a JsonPrimitive passes through UNCHANGED — the reducer's
 * structural equality and the sendApproval echo are byte-identical for the real protocol. A
 * (non-protocol) JsonObject/JsonArray id is collapsed to a deterministic primitive so it can't
 * cause structural-equality collisions in correlation. Apply at id ingestion so every
 * downstream use (ToolApproval.rawServerId, Approved/Resolved, the echo) shares one key.
 */
internal fun normalizeServerId(id: JsonElement): JsonElement =
    if (id is JsonPrimitive) id else JsonPrimitive(id.toString())

internal fun reduceApprovals(
    pending: ImmutableList<ToolApproval>,
    event: ApprovalEvent,
): ImmutableList<ToolApproval> = when (event) {
    is ApprovalEvent.Requested -> (pending + event.approval).toImmutableList()
    is ApprovalEvent.Approved -> pending.filter { it.rawServerId != event.rawServerId }.toImmutableList()
    is ApprovalEvent.Resolved -> pending.filter { it.rawServerId != event.rawServerId }.toImmutableList()
    ApprovalEvent.ResolvedAll -> persistentListOf()
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

    // --- Streaming coalescing buffers (P0-2) ---
    // Per-token deltas used to rebuild the immutable message list + re-emit ChatState,
    // which is O(n²) over the streamed length. Instead we accumulate the active
    // streaming text in non-state StringBuilders (mirroring rawReasoningBuffer) and
    // snapshot into ChatState on a short debounce, plus a forced flush at item/turn
    // completion. Text still streams visibly; only the emit cadence changes.
    //
    // Chosen cadence: STREAM_FLUSH_MS (50ms) fixed-window coalesce — the first delta
    // schedules one flush 50ms out; further deltas in that window only mark the buffer
    // dirty (no extra job). So a burst of N tokens collapses to ~one emission per 50ms
    // (≈20 fps) instead of N emissions, while latency stays imperceptible. Completion
    // events (item/agentMessage completed, commandExecution completed, turn/completed,
    // interrupt, error) flush synchronously so final text is never stranded in the buffer.
    //
    // The pure buffer state machine (buffers + dirty flags) lives in StreamCoalescer.
    // The timing (coalesce window + cancel/flush ordering) lives in StreamFlushScheduler,
    // which is driven by viewModelScope but is itself unit-testable with a TestScope.
    private val coalescer = StreamCoalescer()
    private val flushScheduler = StreamFlushScheduler(viewModelScope, STREAM_FLUSH_MS) { flushStreaming() }

    private companion object {
        const val STREAM_FLUSH_MS = 50L
    }

    /** Reset all streaming buffers + cancel any pending flush. Call when a new turn
     *  begins and the prior msgs/toolCalls/reasoning state is being cleared. */
    private fun resetStreamBuffers() {
        flushScheduler.cancel()
        coalescer.reset()
    }

    /** Schedule a coalesced flush of buffered streaming text into ChatState. */
    private fun scheduleFlush() = flushScheduler.schedule()

    /**
     * Snapshot all buffered streaming text into ChatState in a single update.
     * Idempotent and safe to call when nothing is dirty. Called on the debounce
     * tick and synchronously at item/turn completion.
     */
    private fun flushStreaming() {
        if (!coalescer.isDirty) return
        _state.update { s -> coalescer.flush(s) }
    }

    private val _state = MutableStateFlow(ChatState())
    val state: StateFlow<ChatState> = _state.asStateFlow()

    init {
        // Subscribe to typed flows from the shared repository
        repo.modelsFlow.onEach { handleModels(it) }.launchIn(viewModelScope)
        repo.skillsFlow.onEach { handleSkills(it) }.launchIn(viewModelScope)
        repo.turnEventsFlow.onEach { handle(it) }.launchIn(viewModelScope)
        repo.errorsFlow.onEach { e ->
            // Commit any buffered streaming text before teardown so a connection drop
            // racing a pending flush doesn't strand the last <50ms of streamed text.
            // Idempotent; mirrors the "error" event handler and interrupt().
            flushScheduler.flushNow()
            coalescer.clearAgentBuffer()
            // Clear steerText on connection drop so it doesn't reference a lost turn
            val lostSteer = steerText.getAndSet(null)
            _state.update { s ->
                s.copy(
                    error = e.message,
                    thinking = false,
                    showSteerSheet = false,
                    msgs = if (lostSteer != null)
                        s.msgs + ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, "[steer not sent — connection lost]")
                    else s.msgs,
                )
            }
        }.launchIn(viewModelScope)
        repo.sessionInvalidated.onEach {
            // Clear all transient state on reconnect — pendingApprovals prevents stuck modal
            resetStreamBuffers()
            _state.update { it.copy(threadId = null, msgs = persistentListOf(), pendingApprovals = persistentListOf()) }
            viewModelScope.launch { settings.clearThreadId() }
        }.launchIn(viewModelScope)
    }

    /**
     * Connect to the server and optionally resume the last saved thread.
     *
     * [allowResume] controls whether cold-start auto-resume is attempted:
     *   - `true`  (default) — if `threadId == "new"` and DataStore has a saved thread id,
     *             resume it. This is the cold-start path (app launched fresh with no explicit
     *             thread choice).
     *   - `false` — skip auto-resume entirely. Pass this when the user explicitly tapped
     *             "New session" in the sidebar or thread list — they want a fresh thread, not
     *             the previous one.
     *
     * For explicit thread navigations (`threadId != "new"`) the distinction is irrelevant;
     * the saved threadId is never consulted when a concrete id is provided.
     */
    fun connect(threadId: String, allowResume: Boolean = true) {
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
            // Wait for the handshake to complete before issuing requests. Wrapped in
            // withTimeout so a never-ready connection surfaces an error instead of
            // hanging forever (e.g. if disconnect() runs concurrently from logout).
            try {
                withTimeout(10_000) { repo.isReady.filter { it }.first() }
                repo.listModels()
                repo.listSkills()
                // Auto-resume only when: route is "new", caller has not suppressed it,
                // and a saved threadId exists. Suppressing via allowResume=false lets the
                // "New session" sidebar action always produce a genuinely empty thread
                // regardless of what was saved from a prior session.
                if (threadId == "new" && allowResume) {
                    val saved = settings.savedThreadId.first()
                    if (saved != null) {
                        tryResumeThread(saved)
                    }
                    // saved == null -> new thread created lazily on first send()
                }
            } catch (_: TimeoutCancellationException) {
                _state.update { it.copy(error = "Server handshake did not complete") }
            }
        }
    }

    private fun tryResumeThread(threadId: String) {
        val key = repo.resumeThread(threadId)
        if (key == "-1") {
            // Client not connected yet — connect() will retry once isReady fires
            android.util.Log.w("ChatViewModel", "tryResumeThread: called before client connected for thread $threadId")
        }
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
        resetStreamBuffers()
        _state.update { s ->
            s.resetForNewTurn(
                newMsgs = (s.msgs + ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, displayContent)).toImmutableList(),
            )
        }
        viewModelScope.launch {
            if (tid == null) {
                pendingMsg = text
                pendingAttachments = attachments
                pendingImages = images
                val model = settings.model.first()
                repo.startThread(model, effort = _state.value.selectedEffort)
            } else {
                startTurnWithCurrentPolicy(tid, text, attachments = attachments, images = images)
            }
        }
    }

    fun addImageAttachment(attachment: PendingAttachment) {
        _state.update { it.copy(pendingAttachments = it.pendingAttachments + attachment) }
    }

    fun removeAttachment(id: String) {
        _state.update { it.copy(pendingAttachments = it.pendingAttachments.filter { a -> a.id != id }.toImmutableList()) }
    }

    fun interrupt() {
        val tid = _state.value.threadId ?: return
        // Commit any buffered streaming text so partial output survives the interrupt.
        flushScheduler.flushNow()
        coalescer.clearAgentBuffer()
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
            s.copy(reactions = (s.reactions + (msgId to updated)).toImmutableMap())
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
        resetStreamBuffers()
        _state.update { s ->
            // Discard pending image attachments — edits are text/skill only.
            s.resetForNewTurn(newMsgs = trimmed.toImmutableList()).copy(editingMessage = null)
        }
        viewModelScope.launch {
            startTurnWithCurrentPolicy(tid, newText, attachments = attachments)
        }
    }

    fun sendWithSkill(text: String, skillName: String, skillPath: String) {
        val tid = _state.value.threadId
        val images = _state.value.pendingAttachments
        val inv = SkillInvocation(id = "explicit-$skillName", skillName = skillName, source = SkillSource.EXPLICIT)
        rawReasoningBuffer.clear()
        resetStreamBuffers()
        _state.update { s ->
            val existing = s.skillInvocations.any { it.skillName.equals(skillName, ignoreCase = true) }
            val withInv = if (existing) s else s.copy(skillInvocations = (s.skillInvocations + inv).toImmutableList())
            withInv.resetForNewTurn(
                newMsgs = (s.msgs + ChatMsg(System.currentTimeMillis().toString(), MsgRole.User, text)).toImmutableList(),
                retainSkillInvocations = true,
            )
        }
        viewModelScope.launch {
            if (tid == null) {
                pendingMsg = text
                pendingAttachments = listOf(SelectedItem.Skill(skillName, skillPath))
                pendingImages = images
                val model = settings.model.first()
                repo.startThread(model, effort = _state.value.selectedEffort)
            } else {
                startTurnWithCurrentPolicy(
                    tid, text,
                    attachments = listOf(SelectedItem.Skill(skillName, skillPath)),
                    images = images,
                )
            }
        }
    }

    /**
     * Resolve the currently displayed approval. The UI renders
     * pendingApprovals.firstOrNull(), so this targets the same entry the user sees.
     */
    fun approveToolCall(decision: String) {
        val approval = _state.value.pendingApprovals.firstOrNull() ?: return
        approveToolCall(approval, decision)
    }

    /**
     * Resolve a specific approval by identity. Human-in-the-loop: the decision is
     * always sent explicitly; nothing is auto-accepted. Removal is correlated by
     * rawServerId via [reduceApprovals], so concurrent serverRequest/resolved races
     * never drop the wrong entry.
     *
     * Elicitation requests use [repo.respondElicitation] so the response frame carries
     * the correct MCP elicitation shape (`{ action, content? }`) rather than a bare
     * decision string. All other approval types use [repo.sendApproval] as before.
     */
    fun approveToolCall(approval: ToolApproval, decision: String) {
        val sent = if (approval.type == "elicitation") {
            // MCP elicitation response: { id, result: { action: "accept"|"cancel", content?: {} } }
            // On accept we send an empty content object — full field collection is a future feature.
            repo.respondElicitation(approval.rawServerId, decision)
        } else {
            repo.sendApproval(approval.rawServerId, decision)
        }
        if (sent) {
            _state.update {
                it.copy(pendingApprovals = reduceApprovals(it.pendingApprovals, ApprovalEvent.Approved(approval.rawServerId)))
            }
        } else {
            _state.update { it.copy(error = "Could not send approval — connection lost. Reconnecting...") }
        }
    }

    fun steer(text: String) {
        val turnId = _state.value.activeTurnId ?: return
        val threadId = _state.value.threadId ?: return
        steerText.set(text)
        _state.update { it.copy(showSteerSheet = false) }
        val key = repo.steerTurn(threadId, text, turnId)
        if (key == "-1") {
            android.util.Log.w("ChatViewModel", "steer: not connected — steer input will be lost if connection doesn't recover")
        }
    }

    fun showSteer() = _state.update { it.copy(showSteerSheet = true) }
    fun hideSteer() = _state.update { it.copy(showSteerSheet = false) }

    // --- Flow handlers for typed repository events ---

    /**
     * Call repo.startTurn with the policy, reviewer, model, and effort from current state.
     * All three send paths (send, sendEdit, sendWithSkill) use the same turn parameters
     * so they all call this helper rather than duplicating the Granular-policy branch.
     */
    private suspend fun startTurnWithCurrentPolicy(
        tid: String,
        text: String,
        attachments: List<SelectedItem> = emptyList(),
        images: List<tv.tootie.aurora.app.codex.PendingAttachment> = emptyList(),
    ) {
        val s = _state.value
        repo.startTurn(
            threadId = tid,
            text = text,
            attachments = attachments,
            model = s.selectedModel,
            effort = s.selectedEffort,
            images = images,
            approvalPolicy = s.selectedApprovalPolicy,
            granularPolicy = if (s.selectedApprovalPolicy == ApprovalPolicy.Granular) s.granularPolicy else null,
            approvalsReviewer = s.selectedReviewer,
        )
    }

    private fun handleModels(event: CodexEvent.ModelList) {
        val options = event.models.mapNotNull { obj ->
            val id = obj["id"]?.jsonPrimitive?.content ?: return@mapNotNull null
            val displayName = obj["displayName"]?.jsonPrimitive?.content ?: id
            val defaultEffort = obj["defaultReasoningEffort"]?.jsonPrimitive?.content ?: "medium"
            val efforts = (obj["supportedReasoningEfforts"]?.jsonArray?.mapNotNull { e ->
                val ev = e.jsonObject
                val v = ev["reasoningEffort"]?.jsonPrimitive?.content ?: return@mapNotNull null
                val d = ev["description"]?.jsonPrimitive?.content ?: ""
                ReasoningEffortOption(v, d)
            } ?: emptyList()).toImmutableList()
            ModelOption(id, displayName, efforts, defaultEffort)
        }
        if (options.isNotEmpty()) {
            _state.update { s ->
                val defaultEffort = options.find { it.id == s.selectedModel }?.defaultEffort ?: "medium"
                s.copy(models = options.toImmutableList(), selectedEffort = defaultEffort)
            }
        }
    }

    private fun handleSkills(event: CodexEvent.SkillList) {
        val skills = event.skills.mapNotNull { obj ->
            val name = obj["name"]?.jsonPrimitive?.content?.sanitizeForDisplay() ?: return@mapNotNull null
            val desc = obj["description"]?.jsonPrimitive?.content?.sanitizeForDisplay() ?: ""
            val path = obj["path"]?.jsonPrimitive?.contentOrNull
            SkillItem(name, desc, path)
        }
        if (skills.isNotEmpty()) {
            _state.update { it.copy(availableSkills = skills.sortedBy { s -> s.name }.toImmutableList()) }
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
                    // Success — extract threadId (and metadata) from result
                    val threadObj = result?.get("thread")?.jsonObject
                    val tid = threadObj?.get("id")?.jsonPrimitive?.content
                    if (tid != null) {
                        val cwd = threadObj["cwd"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                        val name = threadObj["name"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                        _state.update { it.copy(threadId = tid, msgs = emptyList(), cwd = cwd, threadName = name) }
                        // Fetch full item history now that we have a valid threadId.
                        repo.readThread(tid)
                    }
                    return
                }

                if (event.originKind == RequestKind.ThreadRead) {
                    if (msg.error != null) {
                        // History fetch failed — not fatal; the thread is still resumed, just
                        // no prior messages will be shown. Log silently; do not surface to user.
                        android.util.Log.w("ChatViewModel", "thread/read failed: ${msg.error.message}")
                        return
                    }
                    // result.items[] — each item is a JsonObject with `type` and `role`/`content`
                    val items = result?.get("items")?.jsonArray ?: return
                    val history = items.mapNotNull { el ->
                        val obj = el as? JsonObject ?: return@mapNotNull null
                        val role = obj["role"]?.jsonPrimitive?.contentOrNull ?: return@mapNotNull null
                        // Reconstruct content: may be a plain string or an array of parts
                        val contentEl = obj["content"] ?: return@mapNotNull null
                        val text = when {
                            contentEl is kotlinx.serialization.json.JsonPrimitive -> contentEl.contentOrNull ?: ""
                            contentEl is kotlinx.serialization.json.JsonArray -> {
                                contentEl.mapNotNull { part ->
                                    (part as? JsonObject)?.get("text")?.jsonPrimitive?.contentOrNull
                                }.joinToString("")
                            }
                            else -> return@mapNotNull null
                        }
                        val msgRole = when (role) {
                            "user" -> MsgRole.User
                            "assistant" -> MsgRole.Assistant
                            else -> return@mapNotNull null
                        }
                        val id = obj["id"]?.jsonPrimitive?.contentOrNull ?: System.currentTimeMillis().toString()
                        ChatMsg(id, msgRole, text.sanitizeForDisplay())
                    }
                    if (history.isNotEmpty()) {
                        _state.update { s ->
                            // Only restore if msgs is still empty — avoids stomping a turn that
                            // arrived in the narrow window between resume and the read response.
                            if (s.msgs.isEmpty()) s.copy(msgs = history.toImmutableList()) else s
                        }
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
                        _state.update { s -> s.copy(msgs = (s.msgs + steerMsg).toImmutableList()) }
                    }
                    return
                }

                // thread/start response: result.thread.id (+ optional cwd / name)
                val threadObj = result?.get("thread")?.jsonObject
                val tid = threadObj?.get("id")?.jsonPrimitive?.content
                if (tid != null && _state.value.threadId == null) {
                    val cwd = threadObj["cwd"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                    val name = threadObj["name"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                    _state.update { it.copy(threadId = tid, cwd = cwd ?: it.cwd, threadName = name ?: it.threadName) }
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
                    // Continuation of the active message: append to the non-state buffer
                    // and snapshot on a debounce instead of rebuilding the list per token.
                    // The coalescer re-seeds from current content if the buffer id changed.
                    val priorContent = _state.value.msgs.find { it.id == aid }?.content ?: ""
                    coalescer.appendAgentDelta(aid, delta, priorContent)
                    scheduleFlush()
                } else {
                    // New assistant message: emit immediately so the bubble appears, and
                    // seed the buffer so subsequent deltas coalesce.
                    flushStreaming() // commit any prior message's buffered tail first
                    coalescer.startAgentMessage(resolvedId, delta)
                    _state.update { s -> s.copy(msgs = (s.msgs + ChatMsg(resolvedId, MsgRole.Assistant, delta)).toImmutableList(), assistantId = resolvedId) }
                }
            }

            // Turn lifecycle
            "turn/started" -> {
                val turnId = params?.get("turn")?.jsonObject?.get("id")?.jsonPrimitive?.contentOrNull ?: return
                _state.update { it.copy(thinking = true, activeTurnId = turnId, assistantId = null) }
            }
            "turn/completed" -> {
                // Force a final flush of any buffered streaming text before the turn closes.
                flushScheduler.flushNow()
                coalescer.clearAgentBuffer()
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
                        _state.update { s -> s.copy(toolCalls = (s.toolCalls + ToolCall(resolvedId, cmd)).toImmutableList()) }
                    }
                    "mcpToolCall" -> {
                        if (id == null) return
                        val server = item["server"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: ""
                        val tool = item["tool"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: ""
                        val args = try { item["arguments"]?.jsonPrimitive?.content }
                                   catch (_: Exception) { item["arguments"]?.toString() }
                                   ?.take(8000)?.sanitizeForDisplay() ?: ""
                        _state.update { s ->
                            s.copy(mcpToolCalls = (s.mcpToolCalls + McpToolCallItem(id, server, tool, "inProgress", args)).toImmutableList())
                        }
                    }
                    "plan" -> {
                        val text = item["text"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return
                        _state.update { s -> s.copy(planItems = (s.planItems + text).toImmutableList()) }
                    }
                    "webSearch" -> {
                        val query = item["query"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return
                        _state.update { s -> s.copy(webSearches = (s.webSearches + query).toImmutableList()) }
                    }
                    "fileChange" -> {
                        if (id == null) return
                        val changes = item["changes"]?.jsonArray
                        val paths = (changes?.mapNotNull { it.jsonObject["path"]?.jsonPrimitive?.contentOrNull } ?: emptyList()).toImmutableList()
                        _state.update { s -> s.copy(fileChanges = (s.fileChanges + FileChangeItem(id, paths)).toImmutableList()) }
                    }
                    "imageView" -> { /* informational only — no state needed */ }
                }
            }
            "item/completed" -> {
                val item = params?.get("item")?.jsonObject ?: return
                val id = item["id"]?.jsonPrimitive?.content ?: return
                val type = item["type"]?.jsonPrimitive?.content
                if (type == "agentMessage") {
                    // Commit buffered text for this message before clearing the active id.
                    flushStreaming()
                    if (coalescer.agentBufferId == id) coalescer.clearAgentBuffer()
                    _state.update { it.copy(assistantId = null) }
                    return
                }
                val failed = item["status"]?.jsonPrimitive?.content == "failed"
                when (type) {
                    "commandExecution" -> {
                        // Flush any buffered output so the final text + done flag land together.
                        flushStreaming()
                        _state.update { s -> s.copy(toolCalls = s.toolCalls.map { if (it.id == id) it.copy(done = true, failed = failed) else it }.toImmutableList()) }
                    }
                    "mcpToolCall" -> {
                        val output = item["result"]?.toString()?.take(8000)?.sanitizeForDisplay() ?: ""
                        val err = item["error"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                        _state.update { s ->
                            s.copy(mcpToolCalls = s.mcpToolCalls.map { call ->
                                if (call.id == id) call.copy(
                                    status = if (failed) "failed" else "done",
                                    output = output, error = err
                                ) else call
                            }.toImmutableList())
                        }
                    }
                    "fileChange" -> {
                        _state.update { s ->
                            s.copy(fileChanges = s.fileChanges.map { fc ->
                                if (fc.id == id) fc.copy(status = if (failed) "failed" else "done") else fc
                            }.toImmutableList())
                        }
                    }
                }
            }

            // Command output streaming
            "item/commandExecution/outputDelta" -> {
                val itemId = params?.get("itemId")?.jsonPrimitive?.content ?: return
                val delta = params["delta"]?.jsonPrimitive?.content ?: return
                // Accumulate delta into the coalescer buffer; snapshot into state on the
                // debounced flush rather than rebuilding the immutable list per token.
                coalescer.appendCommandDelta(itemId, delta, _state.value.toolCalls)
                scheduleFlush()
            }

            // Reasoning summary — extends the current (last) step with streamed characters
            "item/reasoning/summaryTextDelta" -> {
                val delta = params?.get("delta")?.jsonPrimitive?.content ?: return
                if (_state.value.reasoning.isEmpty()) {
                    // No part started yet — create the first line immediately so the
                    // reasoning section appears, and seed the buffer for coalescing.
                    coalescer.startReasoning(delta)
                    _state.update { s -> s.copy(reasoning = listOf(delta)) }
                } else {
                    coalescer.appendReasoning(delta)
                }
                scheduleFlush()
            }

            // Reasoning summary — a new summary part begins; append a fresh step.
            // Commit the prior line's buffered tail first, then reset the buffer.
            "item/reasoning/summaryPartAdded" -> {
                flushStreaming()
                coalescer.resetReasoningLine()
                _state.update { s ->
                    s.copy(reasoning = s.reasoning + "")
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
                _state.update { s -> s.copy(skillInvocations = (s.skillInvocations + inv).toImmutableList()) }
            }
            "hook/completed" -> {
                val run = params?.get("run")?.jsonObject ?: return
                val hookId = run["id"]?.jsonPrimitive?.content ?: return
                _state.update { s ->
                    s.copy(skillInvocations = s.skillInvocations.map {
                        if (it.id == hookId) it.copy(done = true) else it
                    }.toImmutableList())
                }
            }

            // Bead nev6: thread name updated from server
            "thread/name/updated" -> {
                val name = params?.get("name")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                _state.update { it.copy(threadName = name) }
            }

            // Errors
            "error" -> {
                // Commit any buffered streaming text before teardown. A sub-50ms error
                // followed by sessionInvalidated (which resetStreamBuffers + cancels the
                // pending scheduled flush) would otherwise drop the last <50ms of streamed text.
                // Mirrors interrupt()/turn-completed; flushStreaming() is idempotent so it
                // never double-emits when the buffer is clean.
                flushScheduler.flushNow()
                coalescer.clearAgentBuffer()
                val errMsg = params?.get("error")?.jsonObject?.get("message")?.jsonPrimitive?.content
                    ?: msg.error?.message
                _state.update { it.copy(error = errMsg, thinking = false, pendingApprovals = persistentListOf()) }
            }

            "item/commandExecution/requestApproval" -> {
                val rawId = normalizeServerId(event.msg.id ?: return)
                val rawCommand = params?.get("command")?.jsonPrimitive?.contentOrNull ?: ""
                val safeCommand = rawCommand.sanitizeForDisplay()
                val reason = params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                val decisions = params?.get("availableDecisions")?.jsonArray
                    ?.mapNotNull { it.jsonPrimitive?.contentOrNull } ?: listOf("accept", "decline")
                _state.update { s ->
                    s.copy(pendingApprovals = reduceApprovals(s.pendingApprovals, ApprovalEvent.Requested(ToolApproval(
                        itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull ?: "",
                        rawServerId = rawId,
                        type = "command",
                        command = safeCommand,
                        reason = reason,
                        availableDecisions = decisions,
                    ))))
                }
            }
            "item/fileChange/requestApproval" -> {
                val rawId = normalizeServerId(event.msg.id ?: return)
                _state.update { s ->
                    s.copy(pendingApprovals = reduceApprovals(s.pendingApprovals, ApprovalEvent.Requested(ToolApproval(
                        itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull ?: "",
                        rawServerId = rawId,
                        type = "fileChange",
                        reason = params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay(),
                    ))))
                }
            }

            // Agent is requesting additional sandbox permissions (filesystem paths or network).
            // Params: itemId, reason, permissionProfile { readPaths, writePaths, networkEnabled }.
            // The response uses the same sendApproval path as command/fileChange approvals.
            "item/permissions/requestApproval" -> {
                val rawId = normalizeServerId(event.msg.id ?: return)
                val profile = params?.get("permissionProfile")?.jsonObject
                val readPaths = profile?.get("readPaths")?.jsonArray
                    ?.mapNotNull { it.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() }
                    ?: emptyList()
                val writePaths = profile?.get("writePaths")?.jsonArray
                    ?.mapNotNull { it.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() }
                    ?: emptyList()
                val networkEnabled = profile?.get("networkEnabled")?.jsonPrimitive
                    ?.content?.toBooleanStrictOrNull()
                val reasonBase = params?.get("reason")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay()
                // Build a human-readable summary of what is being requested.
                val permLines = buildList {
                    if (readPaths.isNotEmpty()) add("Read: ${readPaths.joinToString(", ")}")
                    if (writePaths.isNotEmpty()) add("Write: ${writePaths.joinToString(", ")}")
                    if (networkEnabled == true) add("Network access")
                }
                val reason = listOfNotNull(reasonBase, permLines.joinToString("\n").ifBlank { null })
                    .joinToString("\n\n").ifBlank { null }
                val decisions = params?.get("availableDecisions")?.jsonArray
                    ?.mapNotNull { it.jsonPrimitive?.contentOrNull } ?: listOf("accept", "decline")
                _state.update { s ->
                    s.copy(pendingApprovals = reduceApprovals(s.pendingApprovals, ApprovalEvent.Requested(ToolApproval(
                        itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull ?: "",
                        rawServerId = rawId,
                        type = "permissions",
                        reason = reason,
                        availableDecisions = decisions,
                    ))))
                }
            }
            // Legacy command-execution approval (older codex-app-server versions).
            // Params: command, workingDirectory?, sandboxPolicy?, reason?, availableDecisions?.
            // Response path is identical to item/commandExecution/requestApproval.
            "execCommandApproval" -> {
                val rawId = normalizeServerId(event.msg.id ?: return)
                val command = params?.get("command")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay() ?: ""
                val workDir = params?.get("workingDirectory")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay()
                val sandboxPolicy = params?.get("sandboxPolicy")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay()
                val reason = listOfNotNull(
                    params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay(),
                    workDir?.let { "Working directory: $it" },
                    sandboxPolicy?.let { "Sandbox policy: $it" },
                ).joinToString("\n").ifBlank { null }
                val decisions = params?.get("availableDecisions")?.jsonArray
                    ?.mapNotNull { it.jsonPrimitive?.contentOrNull } ?: listOf("accept", "decline")
                _state.update { s ->
                    s.copy(pendingApprovals = reduceApprovals(s.pendingApprovals, ApprovalEvent.Requested(ToolApproval(
                        itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull ?: "",
                        rawServerId = rawId,
                        type = "command",
                        command = command,
                        reason = reason,
                        availableDecisions = decisions,
                    ))))
                }
            }

            // Legacy file-patch approval (older codex-app-server versions).
            // Params: callId, conversationId, fileChanges (path → {before,after}), grantRoot?, reason?.
            // Correlates with patchApplyBeginEvent/patchApplyEndEvent notifications.
            // Response path is identical to item/fileChange/requestApproval.
            "applyPatchApproval" -> {
                val rawId = normalizeServerId(event.msg.id ?: return)
                val explicitReason = params?.get("reason")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay()
                val fileChanges = params?.get("fileChanges")?.jsonObject
                val changedPaths = fileChanges?.keys
                    ?.map { it.sanitizeForDisplay() }
                    ?.sorted()
                    ?: emptyList()
                val grantRoot = params?.get("grantRoot")?.jsonPrimitive?.content
                    ?.toBooleanStrictOrNull()
                val reason = listOfNotNull(
                    explicitReason,
                    if (changedPaths.isNotEmpty()) "Files: ${changedPaths.joinToString(", ")}" else null,
                    if (grantRoot == true) "Requires root access" else null,
                ).joinToString("\n").ifBlank { null }
                _state.update { s ->
                    s.copy(pendingApprovals = reduceApprovals(s.pendingApprovals, ApprovalEvent.Requested(ToolApproval(
                        itemId = params?.get("callId")?.jsonPrimitive?.contentOrNull ?: "",
                        rawServerId = rawId,
                        type = "fileChange",
                        reason = reason,
                    ))))
                }
            }

            // MCP server-layer elicitation: the server needs structured user input
            // that the model cannot supply. Params: message, requestedSchema (JSON Schema).
            // The client responds with action="accept" (content={}) or action="cancel".
            // Full form rendering based on requestedSchema is a future enhancement;
            // the current UI surfaces the message prompt and gives Accept / Cancel.
            "mcpServer/elicitation/request" -> {
                val rawId = normalizeServerId(msg.id ?: return)
                val message = params?.get("message")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay()
                    ?: "An MCP server needs additional information to continue."
                _state.update { s ->
                    s.copy(pendingApprovals = reduceApprovals(s.pendingApprovals, ApprovalEvent.Requested(ToolApproval(
                        itemId = "",
                        rawServerId = rawId,
                        type = "elicitation",
                        reason = message,
                        availableDecisions = listOf("accept", "cancel"),
                    ))))
                }
            }

            // Item-scoped elicitation: a MCP tool in progress needs user input.
            // Params: itemId, toolName, message, requestedSchema.
            // Response shape is the same as mcpServer/elicitation/request.
            "item/tool/requestUserInput" -> {
                val rawId = normalizeServerId(msg.id ?: return)
                val toolName = params?.get("toolName")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay()
                val message = params?.get("message")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay()
                    ?: "A tool needs additional information to continue."
                val displayReason = if (toolName != null) "Tool: $toolName\n\n$message" else message
                _state.update { s ->
                    s.copy(pendingApprovals = reduceApprovals(s.pendingApprovals, ApprovalEvent.Requested(ToolApproval(
                        itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull ?: "",
                        rawServerId = rawId,
                        type = "elicitation",
                        reason = displayReason,
                        availableDecisions = listOf("accept", "cancel"),
                    ))))
                }
            }

            "serverRequest/resolved" -> {
                // Extract the resolved request ID if the server provides it; otherwise clear all
                val resolvedId = params?.get("id")
                val event = if (resolvedId == null) ApprovalEvent.ResolvedAll
                            else ApprovalEvent.Resolved(normalizeServerId(resolvedId))
                _state.update { s ->
                    s.copy(pendingApprovals = reduceApprovals(s.pendingApprovals, event))
                }
            }

            // Server requests the client to supply fresh ChatGPT auth tokens.
            // Triggered when the server receives a 401 upstream mid-session.
            // We respond synchronously with whatever tokens are stored; if none
            // are available the session cannot continue and we surface an error.
            "account/chatgptAuthTokens/refresh" -> {
                val requestId = msg.id ?: run {
                    android.util.Log.w("ChatViewModel", "account/chatgptAuthTokens/refresh: missing request id — cannot respond")
                    return
                }
                viewModelScope.launch {
                    val accessToken = settings.accessToken.first()
                    val accountId = settings.chatgptAccountId.first()
                    if (accessToken == null || accountId == null) {
                        android.util.Log.w("ChatViewModel", "account/chatgptAuthTokens/refresh: no stored tokens — cannot refresh")
                        _state.update { it.copy(error = "Session expired: ChatGPT token refresh required but no tokens are stored. Please sign in again.") }
                        return@launch
                    }
                    val sent = repo.respondAuthTokensRefresh(requestId, accessToken, accountId)
                    if (!sent) {
                        android.util.Log.w("ChatViewModel", "account/chatgptAuthTokens/refresh: WebSocket send failed")
                        _state.update { it.copy(error = "Token refresh failed — connection lost. Please reconnect.") }
                    }
                    // On success the server will resume the upstream request transparently.
                    // No UI state change needed — the session continues without interruption.
                }
            }
        }
    }

    private fun extractSkillName(hookId: String): String? {
        val parts = hookId.split("/")
        val cacheIdx = parts.indexOf("cache")
        return if (cacheIdx >= 0 && cacheIdx + 2 < parts.size) parts[cacheIdx + 2] else null
    }

    // Do NOT disconnect here — the repository owns the connection lifetime.
}
