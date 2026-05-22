package tv.tootie.aurora.app.codex

import android.content.Context
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.put
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicInteger
import kotlin.random.Random

private const val TAG = "CodexConnectionManager"

enum class QueuedMessageType {
    TURN_START,
    GOAL_SET,
    OTHER,
    DISCARD_ON_RECONNECT
}

data class QueuedMessage(
    val type: QueuedMessageType,
    val payload: String,
    val threadId: String
)

class CodexConnectionManager(context: Context) {

    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    private val okClient: OkHttpClient = OkHttpClient.Builder()
        .pingInterval(20, TimeUnit.SECONDS)
        .connectTimeout(10, TimeUnit.SECONDS)
        .build()

    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    private val _connectionState = MutableStateFlow<ConnectionState>(ConnectionState.Disconnected)
    val connectionState: StateFlow<ConnectionState> = _connectionState.asStateFlow()

    // Control/lifecycle messages only — agentMessage/delta is NOT emitted here
    private val _messages = MutableSharedFlow<RpcMessage>(replay = 0, extraBufferCapacity = 256)
    val messages: SharedFlow<RpcMessage> = _messages.asSharedFlow()

    // Per-turn delta channels (one Channel<String> per active turn)
    val activeTurnDeltaChannels = ConcurrentHashMap<String, Channel<String>>()

    // Client-initiated request callbacks: key = "c-N"
    private val pendingRequests = ConcurrentHashMap<String, (RpcMessage) -> Unit>()

    // Server-initiated requests waiting for approval: server request id -> params
    private val serverInitiatedRequests = ConcurrentHashMap<String, JsonElement>()

    // Offline outbound queue
    private val outboundQueue = Channel<QueuedMessage>(Channel.UNLIMITED)

    private val _handshakeComplete = MutableStateFlow(false)

    private var retryCount = 0
    private val isReconnecting = AtomicBoolean(false)
    private var userInitiatedDisconnect = false

    private var savedUrl: String? = null
    private var savedToken: String? = null

    @Volatile
    private var currentWebSocket: WebSocket? = null

    private val clientIdCounter = AtomicInteger(0)

    fun connect(url: String, token: String?) {
        if (currentWebSocket != null) return  // already connected or connecting
        userInitiatedDisconnect = false
        savedUrl = url
        savedToken = token
        _connectionState.value = ConnectionState.Connecting
        _handshakeComplete.value = false
        val req = Request.Builder()
            .url(url)
            .apply { token?.let { header("Authorization", "Bearer $it") } }
            .build()
        currentWebSocket = okClient.newWebSocket(req, createListener())
    }

    private fun createListener(): WebSocketListener = object : WebSocketListener() {

        override fun onOpen(ws: WebSocket, response: Response) {
            Log.d(TAG, "onOpen")
            val initId = clientIdCounter.incrementAndGet()
            pendingRequests["c-$initId"] = { _ ->
                // After initialize response, send initialized notification
                ws.send(buildJsonObject {
                    put("method", "initialized")
                    put("params", JsonObject(emptyMap()))
                }.toString())
                _handshakeComplete.value = true
                _connectionState.value = ConnectionState.Connected
                retryCount = 0
                scope.launch { drainOutboundQueue(ws) }
            }
            ws.send(buildJsonObject {
                put("method", "initialize")
                put("id", initId)
                put("params", buildJsonObject {
                    put("clientInfo", buildJsonObject {
                        put("name", "aurora-codex-android")
                        put("version", "1.0")
                    })
                })
            }.toString())
        }

        override fun onMessage(ws: WebSocket, text: String) {
            val msg = try {
                json.decodeFromString<RpcMessage>(text)
            } catch (e: Exception) {
                Log.w(TAG, "parse error: $text", e)
                return
            }

            val msgId = msg.id?.jsonPrimitive?.contentOrNull

            // Server-initiated request (has both id and method)
            if (msgId != null && msg.method != null) {
                serverInitiatedRequests[msgId] = msg.params ?: JsonObject(emptyMap())
                scope.launch { _messages.emit(msg) }
                return
            }

            // Response to our client request
            if (msgId != null && msg.method == null) {
                val key = "c-$msgId"
                val cb = pendingRequests.remove(key)
                if (cb != null) {
                    scope.launch { cb(msg) }
                    return
                }
            }

            // agentMessage/delta: route to per-turn Channel, NOT to _messages
            if (msg.method == "item/agentMessage/delta") {
                val params = msg.params?.jsonObject ?: return
                val turnId = params["turnId"]?.jsonPrimitive?.contentOrNull ?: return
                val delta = params["delta"]?.jsonPrimitive?.contentOrNull ?: return
                activeTurnDeltaChannels[turnId]?.trySend(delta)
                return
            }

            // Pre-create delta channel synchronously when turn/started arrives.
            // _messages.emit is async (scope.launch) so deltas could arrive before
            // ChatViewModel processes turn/started and calls getDeltaChannel(). Creating
            // the channel here on the OkHttp thread prevents early-delta drops.
            if (msg.method == "turn/started") {
                val turnId = msg.params?.jsonObject
                    ?.get("turn")?.jsonObject?.get("id")?.jsonPrimitive?.contentOrNull
                if (turnId != null) getDeltaChannel(turnId)
            }

            // All other messages go to shared _messages flow
            scope.launch { _messages.emit(msg) }
        }

        override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
            Log.e(TAG, "onFailure: ${t.message}", t)
            currentWebSocket = null

            // 401 = auth failure, stop retrying
            if (response?.code == 401) {
                scope.launch {
                    _messages.emit(RpcMessage(error = RpcError(-32001, "auth_failure")))
                }
                _connectionState.value = ConnectionState.Error(t)
                return
            }

            _connectionState.value = ConnectionState.Error(t)
            if (!userInitiatedDisconnect) {
                scheduleReconnect()
            }
        }

        override fun onClosing(ws: WebSocket, code: Int, reason: String) {
            Log.d(TAG, "onClosing code=$code reason=$reason")
        }

        override fun onClosed(ws: WebSocket, code: Int, reason: String) {
            Log.d(TAG, "onClosed code=$code reason=$reason")
            currentWebSocket = null
            if (!userInitiatedDisconnect) {
                scheduleReconnect()
            }
        }
    }

    private fun scheduleReconnect() {
        if (isReconnecting.getAndSet(true)) return
        val delay = minOf(1000L shl retryCount, 60_000L) + Random.nextLong(0, 500)
        retryCount++
        _connectionState.value = ConnectionState.Reconnecting(retryCount, delay)
        scope.launch {
            delay(delay)
            connect(savedUrl ?: run { isReconnecting.set(false); return@launch }, savedToken)
            isReconnecting.set(false)
        }
    }

    private suspend fun drainOutboundQueue(ws: WebSocket) {
        while (true) {
            val msg = outboundQueue.tryReceive().getOrNull() ?: break
            if (msg.type != QueuedMessageType.DISCARD_ON_RECONNECT) {
                ws.send(msg.payload)
            }
        }
    }

    /**
     * Send a request, optionally registering a callback for the response.
     * Returns the request ID used.
     */
    fun send(method: String, params: JsonElement, callback: ((RpcMessage) -> Unit)? = null): Int {
        val id = clientIdCounter.incrementAndGet()
        if (callback != null) {
            pendingRequests["c-$id"] = callback
        }
        val jsonStr = buildJsonObject {
            put("method", method)
            put("id", id)
            put("params", params)
        }.toString()

        val ws = currentWebSocket
        if (ws != null && _connectionState.value is ConnectionState.Connected) {
            ws.send(jsonStr)
        } else {
            outboundQueue.trySend(QueuedMessage(QueuedMessageType.OTHER, jsonStr, ""))
        }
        return id
    }

    /**
     * Reply to a server-initiated request (e.g. tool approval).
     * Assumes server uses numeric request ids.
     */
    fun sendApproval(serverRequestId: String, decision: String) {
        val entry = serverInitiatedRequests.remove(serverRequestId)
        if (entry == null) {
            scope.launch {
                _messages.emit(RpcMessage(error = RpcError(-1, "approval_not_found: $serverRequestId")))
            }
            return
        }
        // NOTE: assumes server uses numeric request ids
        val idInt = serverRequestId.toIntOrNull()
        val responseJson = buildJsonObject {
            if (idInt != null) put("id", idInt) else put("id", serverRequestId)
            put("result", decision)
        }
        currentWebSocket?.send(responseJson.toString())
    }

    fun getDeltaChannel(turnId: String): Channel<String> =
        activeTurnDeltaChannels.getOrPut(turnId) { Channel(Channel.UNLIMITED) }

    fun closeDeltaChannel(turnId: String) {
        activeTurnDeltaChannels.remove(turnId)?.close()
    }

    fun disconnect() {
        userInitiatedDisconnect = true
        currentWebSocket?.close(1000, "bye")
        currentWebSocket = null
        _connectionState.value = ConnectionState.Disconnected
    }

    // --- Convenience wrappers ---

    fun startThread(model: String? = null, callback: ((RpcMessage) -> Unit)? = null): Int =
        send("thread/start", buildJsonObject { model?.let { put("model", it) } }, callback)

    fun startTurn(
        threadId: String,
        text: String,
        model: String? = null,
        effort: String? = null,
        callback: ((RpcMessage) -> Unit)? = null
    ): Int = send(
        "turn/start",
        buildJsonObject {
            put("threadId", threadId)
            put("input", buildJsonArray {
                add(buildJsonObject { put("type", "text"); put("text", text) })
            })
            model?.let { put("model", it) }
            effort?.let { put("effort", it) }
        },
        callback
    )

    fun listModels(callback: ((RpcMessage) -> Unit)? = null): Int =
        send("model/list", JsonObject(emptyMap()), callback)

    fun listSkills(callback: ((RpcMessage) -> Unit)? = null): Int =
        send("skills/list", JsonObject(emptyMap()), callback)

    fun listThreads(limit: Int = 50, callback: ((RpcMessage) -> Unit)? = null): Int =
        send("thread/list", buildJsonObject { put("limit", limit) }, callback)

    fun interrupt(threadId: String) {
        send("turn/interrupt", buildJsonObject { put("threadId", threadId) })
    }

}
