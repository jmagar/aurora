package tv.tootie.aurora.app.codex

import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.util.concurrent.ConcurrentHashMap

private const val TAG = "CodexRepository"

/**
 * Classifies outgoing requests so responses can be routed to the right flow.
 *
 * Separate [Thread] (listThreads) from [ThreadStart] (startThread) because
 * their response shapes differ:
 *   - listThreads  → result.data[] → routes to [threadsFlow]
 *   - startThread  → result.thread.id → routes to [turnEventsFlow] so
 *                    ChatViewModel's existing null-method dispatch picks it up
 */
public enum class RequestKind {
    Thread,        // thread/list
    ThreadStart,   // thread/start — response goes to turnEventsFlow, not threadsFlow
    ThreadResume,  // thread/resume
    ThreadRead,    // thread/read — fetch full item history for history restore
    Steer,         // turn/steer
    GoalSet,       // thread/goal/set
    GoalGet,       // thread/goal/get
    GoalClear,     // thread/goal/clear
    McpServers,          // mcpServerStatus/list
    Models,              // model/list
    Skills,              // skills/list
    ConfigRequirements,  // configRequirements/read
    ConfigRead,          // config/read
    AccountRead,         // account/read
    RateLimitsRead,      // account/rateLimits/read
    FuzzySearch,         // fuzzyFileSearch
    ReviewStart,         // review/start
    ShellCommand,        // thread/shellCommand
    ExecCommand,         // command/exec (buffered)
    ExecCommandPty,      // command/exec (PTY streaming)
    CompactStart,        // thread/compact/start
    LoadedThreads,       // thread/loaded/list
    MetadataUpdate,      // thread/metadata/update
    Other,
}

/**
 * Typed events emitted per-flow from [CodexRepository].
 */
sealed class CodexEvent {
    /** Parsed result from a thread/list response. */
    data class ThreadList(val threads: List<JsonObject>) : CodexEvent()

    /** Parsed result from a model/list response — raw data array items. */
    data class ModelList(val models: List<JsonObject>) : CodexEvent()

    /** Parsed result from a skills/list response — raw skills array items. */
    data class SkillList(val skills: List<JsonObject>) : CodexEvent()

    /**
     * Any server notification or response that ChatViewModel needs:
     * - turn/started, turn/completed, item events, hook events, reasoning events, session/update, error
     * - thread/start response (result.thread.id)
     * - model/list and skills/list are handled separately above and do NOT
     *   appear on this flow
     */
    data class TurnEvent(val msg: RpcMessage, val originKind: RequestKind? = null) : CodexEvent()

    /** Parsed result from a mcpServerStatus/list response. */
    data class McpServerList(val servers: List<JsonObject>) : CodexEvent()

    /**
     * Parsed result from a config/read response.
     *
     * [config] is the merged effective configuration (always present on success).
     * [layers] is the optional per-key breakdown — present when includeLayers=true was requested.
     * Each entry in [layers] maps a config key to the name of the layer that supplied it
     * (e.g. "user", "project", "defaults").
     * [error] is non-null when the RPC returned an error.
     */
    data class ConfigResult(
        val config: JsonObject?,
        val layers: JsonObject?,
        val error: String? = null,
    ) : CodexEvent()

    /** A connection-level error (WebSocket failure). */
    data class ConnectionError(val message: String) : CodexEvent()

    /** Parsed result from an account/read response — raw result object. */
    data class AccountInfo(val data: JsonObject) : CodexEvent()

    /** Parsed result from an account/rateLimits/read response — raw result object. */
    data class RateLimitsInfo(val data: JsonObject) : CodexEvent()
}

/**
 * Application-scoped singleton that holds ONE [CodexClient] WebSocket connection
 * and fans incoming messages into typed [SharedFlow]s.
 *
 * ViewModels resolve this via `(app as CodexApp).repository` and subscribe to
 * whichever flows they care about. None of them instantiate [CodexClient] directly.
 */
class CodexRepository {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val pendingKinds = ConcurrentHashMap<String, RequestKind>()
    /** Guards connect/reconnect/disconnect so concurrent calls are serialized. */
    private val connectionMutex = Mutex()
    private var client: CodexClient? = null

    /**
     * Tracks the current client so [isReady] can delegate to its [CodexClient.isInitialized].
     * Replaced atomically under [connectionMutex] whenever a new client is created.
     */
    private val _currentClient = MutableStateFlow<CodexClient?>(null)

    /**
     * `true` once the WebSocket handshake (`initialized`) has completed on the
     * current connection.  Resets to `false` on reconnect or failure.
     *
     * Callers (e.g. [SidebarViewModel]) should `first { it }` before issuing
     * requests that require an established connection.
     */
    @OptIn(ExperimentalCoroutinesApi::class)
    val isReady: StateFlow<Boolean> = _currentClient
        .flatMapLatest { c -> c?.isInitialized ?: flowOf(false) }
        .stateIn(scope, kotlinx.coroutines.flow.SharingStarted.Eagerly, false)

    // --- Typed output flows ------------------------------------------------

    private val _threadsFlow = MutableSharedFlow<CodexEvent.ThreadList>(replay = 1)
    /** Thread-list updates from thread/list responses. SidebarViewModel subscribes here. */
    val threadsFlow: SharedFlow<CodexEvent.ThreadList> = _threadsFlow.asSharedFlow()

    private val _loadedThreadsFlow = MutableSharedFlow<CodexEvent.ThreadList>(replay = 1)
    /** Loaded-thread-list updates from thread/loaded/list responses. */
    val loadedThreadsFlow: SharedFlow<CodexEvent.ThreadList> = _loadedThreadsFlow.asSharedFlow()

    private val _modelsFlow = MutableSharedFlow<CodexEvent.ModelList>(replay = 1)
    val modelsFlow: SharedFlow<CodexEvent.ModelList> = _modelsFlow.asSharedFlow()

    private val _skillsFlow = MutableSharedFlow<CodexEvent.SkillList>(replay = 1)
    val skillsFlow: SharedFlow<CodexEvent.SkillList> = _skillsFlow.asSharedFlow()

    private val _mcpServersFlow = MutableSharedFlow<CodexEvent.McpServerList>(replay = 1)
    val mcpServersFlow: SharedFlow<CodexEvent.McpServerList> = _mcpServersFlow.asSharedFlow()

    private val _accountFlow = MutableSharedFlow<CodexEvent.AccountInfo>(replay = 1)
    /** Account details from account/read responses and account/updated notifications. */
    val accountFlow: SharedFlow<CodexEvent.AccountInfo> = _accountFlow.asSharedFlow()

    private val _rateLimitsFlow = MutableSharedFlow<CodexEvent.RateLimitsInfo>(replay = 1)
    /** Rate-limit state from account/rateLimits/read responses and account/rateLimits/updated notifications. */
    val rateLimitsFlow: SharedFlow<CodexEvent.RateLimitsInfo> = _rateLimitsFlow.asSharedFlow()

    private val _sidebarNotificationsFlow = MutableSharedFlow<RpcMessage>(replay = 1)
    val sidebarNotificationsFlow: SharedFlow<RpcMessage> = _sidebarNotificationsFlow.asSharedFlow()

    private val _sessionInvalidated = MutableSharedFlow<Unit>(replay = 0)
    val sessionInvalidated: SharedFlow<Unit> = _sessionInvalidated.asSharedFlow()

    private val _turnEventsFlow = MutableSharedFlow<CodexEvent.TurnEvent>(extraBufferCapacity = 256)
    /** All turn-related messages + thread/start responses. ChatViewModel subscribes here. */
    val turnEventsFlow: SharedFlow<CodexEvent.TurnEvent> = _turnEventsFlow.asSharedFlow()

    private val _errorsFlow = MutableSharedFlow<CodexEvent.ConnectionError>(replay = 1)
    val errorsFlow: SharedFlow<CodexEvent.ConnectionError> = _errorsFlow.asSharedFlow()

    private val _configFlow = MutableSharedFlow<CodexEvent.ConfigResult>(replay = 1)
    /** config/read responses. SettingsViewModel subscribes here. */
    val configFlow: SharedFlow<CodexEvent.ConfigResult> = _configFlow.asSharedFlow()

    // --- Connection lifecycle ----------------------------------------------

    /**
     * Connect to [url] with optional [token]. Safe to call multiple times;
     * subsequent calls are no-ops if already connected.
     *
     * Serialized by [connectionMutex] so concurrent calls from multiple ViewModels
     * result in exactly one WebSocket connection.
     */
    fun connect(url: String, token: String?) {
        scope.launch {
            connectionMutex.withLock {
                if (client != null) return@withLock
                startClientLocked(url, token)
            }
        }
    }

    /**
     * Disconnect and immediately reconnect. Call when server URL or token changes.
     * Do NOT call this from ViewModel.onCleared().
     *
     * Serialized by [connectionMutex] so concurrent calls (e.g. rapid Save taps) are safe.
     */
    fun reconnect(url: String, token: String?) {
        scope.launch {
            connectionMutex.withLock {
                client?.disconnect()
                client = null
                _currentClient.value = null
                pendingKinds.clear()
                scope.launch { _sessionInvalidated.emit(Unit) }
                startClientLocked(url, token)
            }
        }
    }

    /**
     * Creates, connects, and wires a new [CodexClient]. Must only be called while
     * holding [connectionMutex] and with [client] already null.
     */
    private fun startClientLocked(url: String, token: String?) {
        Log.d(TAG, "connecting to $url")
        val c = CodexClient(url, token)
        client = c
        _currentClient.value = c
        c.connect()
        c.messages.onEach { demux(it) }.launchIn(scope)
    }

    /**
     * Disconnect cleanly. Should be called when the application is done with the
     * repository. Note: [Application.onTerminate] is only called in emulated environments;
     * for production use consider a [ProcessLifecycleOwner] observer instead.
     */
    fun disconnect() {
        scope.launch {
            connectionMutex.withLock {
                client?.disconnect()
                client = null
                _currentClient.value = null
                pendingKinds.clear()
            }
        }
    }

    // --- Request helpers ---------------------------------------------------

    fun startThread(model: String?, effort: String? = null): Int {
        val id = client?.startThread(model, effort) ?: return -1
        pendingKinds[id.toString()] = RequestKind.ThreadStart  // response goes to turnEventsFlow
        return id
    }

    fun startTurn(
        threadId: String,
        text: String,
        attachments: List<SelectedItem> = emptyList(),
        model: String?,
        effort: String?,
        images: List<PendingAttachment> = emptyList(),
        approvalPolicy: ApprovalPolicy = ApprovalPolicy.OnRequest,
        granularPolicy: GranularPolicy? = null,
        approvalsReviewer: ApprovalsReviewer = ApprovalsReviewer.User,
    ): Int {
        val id = client?.startTurn(
            threadId, text, attachments, model, effort, images,
            approvalPolicy, granularPolicy, approvalsReviewer,
        ) ?: return -1
        pendingKinds[id.toString()] = RequestKind.Other
        return id
    }

    fun listModels(): Int {
        val id = client?.listModels() ?: return -1
        pendingKinds[id.toString()] = RequestKind.Models
        return id
    }

    fun listSkills(): Int {
        val id = client?.listSkills() ?: return -1
        pendingKinds[id.toString()] = RequestKind.Skills
        return id
    }

    fun listThreads(limit: Int = 50): Int {
        val id = client?.listThreads(limit) ?: return -1
        pendingKinds[id.toString()] = RequestKind.Thread  // response goes to threadsFlow
        return id
    }

    /**
     * List threads currently loaded in server memory (active or recently active).
     * Response is routed to [loadedThreadsFlow] — the data shape is identical to thread/list.
     * SidebarViewModel can use this to show a "running sessions" indicator.
     */
    fun listLoadedThreads(): String {
        val rawId = client?.listLoadedThreads() ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.LoadedThreads
        return key
    }

    /**
     * Update opaque key/value metadata on a thread. Fire-and-forget — the response
     * carries no meaningful payload; errors are logged via the demux null path.
     */
    fun updateThreadMetadata(threadId: String, metadata: Map<String, String>): String {
        val rawId = client?.updateThreadMetadata(threadId, metadata) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.MetadataUpdate
        return key
    }

    fun resumeThread(threadId: String, history: List<JsonObject>? = null): String {
        val rawId = client?.resumeThread(threadId, history) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ThreadResume
        return key
    }

    /**
     * Fetch the full item history for [threadId].
     *
     * The response is routed through [turnEventsFlow] with [RequestKind.ThreadRead] so
     * [ChatViewModel] can reconstruct prior messages from `result.items[]`.
     * Returns the request key, or "-1" if the client is not connected.
     */
    fun readThread(threadId: String): String {
        val rawId = client?.readThread(threadId) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ThreadRead
        return key
    }

    fun steerTurn(threadId: String, text: String, expectedTurnId: String): String {
        val rawId = client?.steerTurn(threadId, text, expectedTurnId) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.Steer
        return key
    }

    fun setGoal(threadId: String, objective: String, tokenBudget: Int? = null): String {
        val rawId = client?.setGoal(threadId, objective, tokenBudget) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.GoalSet
        return key
    }

    fun getGoal(threadId: String): String {
        val rawId = client?.getGoal(threadId) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.GoalGet
        return key
    }

    fun clearGoal(threadId: String): String {
        val rawId = client?.clearGoal(threadId) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.GoalClear
        return key
    }

    fun listMcpServers(): String {
        val rawId = client?.listMcpServers() ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.McpServers
        return key
    }

    /**
     * Send a configRequirements/read request to validate config completeness.
     * The response is routed through [turnEventsFlow] with [RequestKind.ConfigRequirements].
     * Returns the request key for correlation, or "-1" if not connected.
     */
    fun readConfigRequirements(): String {
        val rawId = client?.readConfigRequirements() ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ConfigRequirements
        return key
    }

    /** Fetch current account details. Response routed to [accountFlow]. */
    fun readAccount(): String {
        val rawId = client?.readAccount() ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.AccountRead
        return key
    }

    /** Fetch current rate-limit state. Response routed to [rateLimitsFlow]. */
    fun readRateLimits(): String {
        val rawId = client?.readRateLimits() ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.RateLimitsRead
        return key
    }

    /**
     * Start a fuzzy file search session. The initial response is routed to [turnEventsFlow]
     * with [RequestKind.FuzzySearch] so [ChatViewModel] can extract the sessionId. Subsequent
     * incremental results arrive as [fuzzyFileSearch/sessionUpdated] notifications and are
     * dispatched through [turnEventsFlow] as ordinary server notifications.
     */
    fun fuzzyFileSearch(query: String, roots: List<String>): String {
        val rawId = client?.fuzzyFileSearch(query, roots) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.FuzzySearch
        return key
    }

    fun readConfig(cwd: String? = null, includeLayers: Boolean = true): String {
        val rawId = client?.readConfig(cwd, includeLayers) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ConfigRead
        return key
    }

    fun sendApproval(rawServerId: JsonElement, decision: String): Boolean =
        client?.sendApproval(rawServerId, decision) ?: false

    /**
     * Respond to an `mcpServer/elicitation/request` or `item/tool/requestUserInput`
     * server request.
     *
     * [requestId] is echoed verbatim. [action] is `"accept"` or `"cancel"`. [content]
     * carries field values on accept; ignored (and omitted from the frame) on cancel.
     * Returns `true` if the frame was queued, `false` if the client is not connected.
     */
    fun respondElicitation(
        requestId: JsonElement,
        action: String,
        content: JsonObject = JsonObject(emptyMap()),
    ): Boolean = client?.respondElicitation(requestId, action, content) ?: false

    /**
     * Respond to an `account/chatgptAuthTokens/refresh` server request.
     *
     * [requestId] is the raw [JsonElement] id from the server's inbound request — it is
     * echoed back verbatim so the server can correlate the response. Returns `true` if
     * the frame was queued, `false` if the client is not connected.
     */
    fun respondAuthTokensRefresh(
        requestId: JsonElement,
        accessToken: String,
        chatgptAccountId: String,
    ): Boolean = client?.respondAuthTokensRefresh(requestId, accessToken, chatgptAccountId) ?: false

    /**
     * Start an AI code review. Target types: uncommittedChanges, baseBranch, commit, custom.
     * Delivery: inline (default, uses current thread) or detached (creates new thread).
     * Response is routed through [turnEventsFlow] with [RequestKind.ReviewStart].
     */
    fun startReview(threadId: String, targetType: String, targetValue: String? = null, delivery: String = "inline"): String {
        val rawId = client?.startReview(threadId, targetType, targetValue, delivery) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ReviewStart
        return key
    }

    /**
     * Send a one-off shell command within the thread's execution context.
     * Response is routed through [turnEventsFlow] with [RequestKind.ShellCommand].
     */
    fun shellCommand(threadId: String, command: String): String {
        val rawId = client?.shellCommand(threadId, command) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ShellCommand
        return key
    }

    /**
     * Run a command outside any thread (buffered mode — stdout/stderr returned in response).
     * Response is routed through [turnEventsFlow] with [RequestKind.ExecCommand].
     */
    fun execCommand(
        command: List<String>,
        cwd: String? = null,
        env: Map<String, String> = emptyMap(),
        timeoutMs: Long? = null,
    ): String {
        val rawId = client?.execCommand(command, cwd, env, timeoutMs) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ExecCommand
        return key
    }

    /**
     * Run a command in PTY streaming mode. Stdout/stderr arrive as
     * [command/exec/outputDelta] push notifications keyed by [processId].
     * The initial response (routed to [turnEventsFlow] as [RequestKind.ExecCommandPty])
     * confirms the process was started. Use [execCommandWrite]/[execCommandResize]/
     * [execCommandTerminate] for follow-up control frames.
     */
    fun execCommandPty(
        command: List<String>,
        processId: String,
        cwd: String? = null,
        env: Map<String, String> = emptyMap(),
        cols: Int = 80,
        rows: Int = 24,
        timeoutMs: Long? = null,
    ): String {
        val rawId = client?.execCommandPty(command, processId, cwd, env, cols, rows, timeoutMs) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ExecCommandPty
        return key
    }

    /** Write stdin data to a running PTY process. Fire-and-forget — no response expected. */
    fun execCommandWrite(processId: String, data: String) {
        client?.execCommandWrite(processId, data)
    }

    /** Resize the PTY window for a running process. Fire-and-forget. */
    fun execCommandResize(processId: String, cols: Int, rows: Int) {
        client?.execCommandResize(processId, cols, rows)
    }

    /** Send SIGTERM to a running PTY process. Fire-and-forget. */
    fun execCommandTerminate(processId: String) {
        client?.execCommandTerminate(processId)
    }

    /**
     * Manually trigger context window compaction for a thread.
     * Response is routed through [turnEventsFlow] with [RequestKind.CompactStart].
     */
    fun compactStart(threadId: String): String {
        val rawId = client?.compactStart(threadId) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.CompactStart
        return key
    }

    fun interrupt(threadId: String) {
        client?.interrupt(threadId)
    }

    // --- Demux logic -------------------------------------------------------

    private suspend fun demux(msg: RpcMessage) {
        // Extract the request id as a String (RpcMessage.id is a JsonElement?).
        // Safe-cast skips non-primitive ids (e.g. malformed JsonObject), which silently
        // routes them to turnEventsFlow below — diagnose with the warning if the id was
        // present but unparseable.
        val idStr: String? = (msg.id as? JsonPrimitive)?.contentOrNull
        if (msg.id != null && idStr == null) {
            Log.w(TAG, "demux: non-primitive id ignored (method=${msg.method}): ${msg.id}")
        }

        // Responses to our own requests (method == null, id present)
        if (msg.method == null && idStr != null) {
            val kind = pendingKinds.remove(idStr)
            when (kind) {
                RequestKind.Thread -> routeThreadListResponse(msg)
                RequestKind.LoadedThreads -> routeLoadedThreadsResponse(msg)
                RequestKind.MetadataUpdate -> { /* fire-and-forget — no state update needed */ }
                RequestKind.Models -> routeModelsResponse(msg)
                RequestKind.Skills -> routeSkillsResponse(msg)
                RequestKind.McpServers -> routeMcpServersResponse(msg)
                RequestKind.AccountRead -> routeAccountResponse(msg)
                RequestKind.RateLimitsRead -> routeRateLimitsResponse(msg)
                RequestKind.ConfigRead -> routeConfigResponse(msg)
                // ThreadStart, ThreadResume, Steer, Goal*, Other, null — go to turnEventsFlow
                // so ChatViewModel handles them with its existing null-method dispatch.
                // Direct emit (demux is already suspend) — no scope.launch to preserve ordering
                else -> _turnEventsFlow.emit(CodexEvent.TurnEvent(msg, originKind = kind))
            }
            return
        }

        // Connection-level errors (no method, no id — from WebSocket failure callback).
        // Reset client so that the next connect() call can establish a new connection
        // rather than no-oping on the stale (dead) client reference.
        if (msg.method == null && msg.error != null) {
            _errorsFlow.tryEmit(CodexEvent.ConnectionError(msg.error.message))
            scope.launch {
                connectionMutex.withLock {
                    client = null
                    _currentClient.value = null
                    pendingKinds.clear()
                }
            }
            return
        }

        // All server-initiated notifications (turn/*, item/*, hook/*, etc.)
        // Route sidebar-relevant methods to sidebarNotificationsFlow as well.
        val sidebarMethods = setOf(
            "thread/goal/updated", "thread/goal/cleared",
            "mcpServer/startupStatus/updated"
        )
        if (msg.method in sidebarMethods) {
            _sidebarNotificationsFlow.tryEmit(msg)
        }
        // Route account push notifications directly to their dedicated flows so
        // SettingsViewModel stays current without polling.
        when (msg.method) {
            "account/updated" -> {
                val data = msg.params?.jsonObject ?: msg.result?.jsonObject
                if (data != null) _accountFlow.tryEmit(CodexEvent.AccountInfo(data))
            }
            "account/rateLimits/updated" -> {
                val data = msg.params?.jsonObject ?: msg.result?.jsonObject
                if (data != null) _rateLimitsFlow.tryEmit(CodexEvent.RateLimitsInfo(data))
            }
        }
        // suspend emit() ensures critical events like turn/completed are never dropped.
        _turnEventsFlow.emit(CodexEvent.TurnEvent(msg))
    }

    private fun routeThreadListResponse(msg: RpcMessage) {
        val result = msg.result?.jsonObject ?: return
        val threads = result["data"]?.jsonArray?.mapNotNull { it as? JsonObject } ?: return
        _threadsFlow.tryEmit(CodexEvent.ThreadList(threads))
    }

    private fun routeLoadedThreadsResponse(msg: RpcMessage) {
        val result = msg.result?.jsonObject ?: return
        // thread/loaded/list response shape mirrors thread/list: result.data[]
        val threads = result["data"]?.jsonArray?.mapNotNull { it as? JsonObject } ?: emptyList()
        _loadedThreadsFlow.tryEmit(CodexEvent.ThreadList(threads))
    }

    private fun routeModelsResponse(msg: RpcMessage) {
        val result = msg.result?.jsonObject ?: return
        val data = result["data"]?.jsonArray?.mapNotNull { it as? JsonObject } ?: return
        _modelsFlow.tryEmit(CodexEvent.ModelList(data))
    }

    private fun routeSkillsResponse(msg: RpcMessage) {
        val result = msg.result?.jsonObject ?: return
        // skills/list response shape: result.data[0].skills[]
        val firstItem = result["data"]?.jsonArray?.firstOrNull() as? JsonObject ?: return
        val skills = firstItem["skills"]?.jsonArray?.mapNotNull { it as? JsonObject } ?: return
        _skillsFlow.tryEmit(CodexEvent.SkillList(skills))
    }

    private fun routeMcpServersResponse(msg: RpcMessage) {
        val result = msg.result ?: return
        val servers = (result as? JsonObject)?.get("servers") as? JsonArray
            ?: (result as? JsonArray)
            ?: run { Log.w(TAG, "unexpected mcpServerStatus shape"); return }
        val list = servers.mapNotNull { it as? JsonObject }
        _mcpServersFlow.tryEmit(CodexEvent.McpServerList(list))
    }
    private fun routeAccountResponse(msg: RpcMessage) {
        val data = msg.result?.jsonObject ?: return
        _accountFlow.tryEmit(CodexEvent.AccountInfo(data))
    }

    private fun routeRateLimitsResponse(msg: RpcMessage) {
        val data = msg.result?.jsonObject ?: return
        _rateLimitsFlow.tryEmit(CodexEvent.RateLimitsInfo(data))
    }

    private fun routeConfigResponse(msg: RpcMessage) {
        if (msg.error != null) {
            _configFlow.tryEmit(CodexEvent.ConfigResult(
                config = null,
                layers = null,
                error = msg.error.message,
            ))
            return
        }
        val result = msg.result?.jsonObject ?: return
        val config = result["config"]?.jsonObject
        val layers = result["layers"]?.jsonObject
        _configFlow.tryEmit(CodexEvent.ConfigResult(config = config, layers = layers))
    }
}
