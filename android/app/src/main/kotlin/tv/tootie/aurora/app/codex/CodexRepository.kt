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
import tv.tootie.aurora.app.ui.chat.SelectedItem

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
    Steer,         // turn/steer
    GoalSet,       // thread/goal/set
    GoalGet,       // thread/goal/get
    GoalClear,     // thread/goal/clear
    McpServers,    // mcpServerStatus/list
    Models,        // model/list
    Skills,        // skills/list
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

    /** A connection-level error (WebSocket failure). */
    data class ConnectionError(val message: String) : CodexEvent()
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

    private val _modelsFlow = MutableSharedFlow<CodexEvent.ModelList>(replay = 1)
    val modelsFlow: SharedFlow<CodexEvent.ModelList> = _modelsFlow.asSharedFlow()

    private val _skillsFlow = MutableSharedFlow<CodexEvent.SkillList>(replay = 1)
    val skillsFlow: SharedFlow<CodexEvent.SkillList> = _skillsFlow.asSharedFlow()

    private val _mcpServersFlow = MutableSharedFlow<CodexEvent.McpServerList>(replay = 1)
    val mcpServersFlow: SharedFlow<CodexEvent.McpServerList> = _mcpServersFlow.asSharedFlow()

    private val _sidebarNotificationsFlow = MutableSharedFlow<RpcMessage>(replay = 1)
    val sidebarNotificationsFlow: SharedFlow<RpcMessage> = _sidebarNotificationsFlow.asSharedFlow()

    private val _sessionInvalidated = MutableSharedFlow<Unit>(replay = 0)
    val sessionInvalidated: SharedFlow<Unit> = _sessionInvalidated.asSharedFlow()

    private val _turnEventsFlow = MutableSharedFlow<CodexEvent.TurnEvent>(extraBufferCapacity = 256)
    /** All turn-related messages + thread/start responses. ChatViewModel subscribes here. */
    val turnEventsFlow: SharedFlow<CodexEvent.TurnEvent> = _turnEventsFlow.asSharedFlow()

    private val _errorsFlow = MutableSharedFlow<CodexEvent.ConnectionError>(replay = 1)
    val errorsFlow: SharedFlow<CodexEvent.ConnectionError> = _errorsFlow.asSharedFlow()

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

    fun startThread(model: String?): Int {
        val id = client?.startThread(model) ?: return -1
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

    fun resumeThread(threadId: String, history: List<JsonObject>? = null): String {
        val rawId = client?.resumeThread(threadId, history) ?: return "-1"
        val key = rawId.toString()
        pendingKinds[key] = RequestKind.ThreadResume
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

    fun sendApproval(rawServerId: JsonElement, decision: String): Boolean =
        client?.sendApproval(rawServerId, decision) ?: false

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
                RequestKind.Models -> routeModelsResponse(msg)
                RequestKind.Skills -> routeSkillsResponse(msg)
                RequestKind.McpServers -> routeMcpServersResponse(msg)
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
        // suspend emit() ensures critical events like turn/completed are never dropped.
        _turnEventsFlow.emit(CodexEvent.TurnEvent(msg))
    }

    private fun routeThreadListResponse(msg: RpcMessage) {
        val result = msg.result?.jsonObject ?: return
        val threads = result["data"]?.jsonArray?.mapNotNull { it as? JsonObject } ?: return
        _threadsFlow.tryEmit(CodexEvent.ThreadList(threads))
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
}
