package tv.tootie.aurora.app.codex

import android.util.Log
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.trySendBlocking
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.encodeToJsonElement
import kotlinx.serialization.json.put
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.util.concurrent.atomic.AtomicInteger

private const val TAG = "CodexClient"

class CodexClient(private val url: String, private val token: String? = null) {

    private val json = Json { ignoreUnknownKeys = true; isLenient = true }
    private val http = OkHttpClient()
    internal val ids = AtomicInteger(0)
    private var ws: WebSocket? = null

    private val _msgs = Channel<RpcMessage>(Channel.UNLIMITED)
    val messages: Flow<RpcMessage> = _msgs.receiveAsFlow()

    /**
     * Becomes `true` once the server responds to the `initialize` handshake with
     * its own `initialized` notification.  Callers that need to send requests only
     * after the handshake is complete (e.g. `listThreads()` in SidebarViewModel)
     * should wait until this is `true` before issuing requests.
     */
    private val _isInitialized = MutableStateFlow(false)
    val isInitialized: StateFlow<Boolean> = _isInitialized.asStateFlow()

    fun connect() {
        val req = Request.Builder().url(url)
            .apply { token?.let { header("Authorization", "Bearer $it") } }
            .build()
        ws = http.newWebSocket(req, object : WebSocketListener() {
            override fun onOpen(ws: WebSocket, r: Response) {
                Log.d(TAG, "open")
                ws.send(json.encodeToString(buildJsonObject {
                    put("method", "initialize")
                    put("id", 0)
                    put("params", buildJsonObject {
                        put("clientInfo", buildJsonObject {
                            put("name", "aurora-app")
                            put("version", "1.0")
                        })
                        put("capabilities", buildJsonObject {
                            put("experimentalApi", true)
                            put("requestAttestation", false)
                        })
                    })
                }))
                ws.send(json.encodeToString(buildJsonObject {
                    put("method", "initialized")
                    put("params", JsonObject(emptyMap()))
                }))
            }
            override fun onMessage(ws: WebSocket, text: String) {
                // All server notifications (including "account/login/completed",
                // "account/login/deviceCode", "turn/started", etc.) flow through
                // the `messages` Flow as-is. Callers filter by RpcMessage.method.
                try {
                    val msg: RpcMessage = json.decodeFromString(text)
                    // The server echoes back an "initialized" notification once it
                    // has processed the handshake — flip the ready flag at that point.
                    if (msg.method == "initialized") {
                        _isInitialized.value = true
                    }
                    _msgs.trySendBlocking(msg)
                } catch (e: Exception) { Log.w(TAG, "parse error: $text") }
            }
            override fun onFailure(ws: WebSocket, t: Throwable, r: Response?) {
                Log.e(TAG, "failure", t)
                _isInitialized.value = false
                _msgs.trySendBlocking(RpcMessage(error = RpcError(-1, t.message ?: "error")))
            }
            override fun onClosed(ws: WebSocket, code: Int, reason: String) {
                _isInitialized.value = false
                _msgs.close()
            }
        })
    }

    fun disconnect() { ws?.close(1000, "bye"); ws = null }

    fun startThread(model: String? = null): Int {
        val id = ids.incrementAndGet()
        send("thread/start", buildJsonObject { model?.let { put("model", it) } }, id)
        return id
    }

    fun startTurn(threadId: String, text: String, model: String? = null, effort: String? = null): Int {
        val id = ids.incrementAndGet()
        send("turn/start", buildJsonObject {
            put("threadId", threadId)
            put("input", buildJsonArray { add(buildJsonObject { put("type", "text"); put("text", text) }) })
            model?.let { put("model", it) }
            effort?.let { put("effort", it) }
        }, id)
        return id
    }

    fun listModels(): Int {
        val id = ids.incrementAndGet()
        send("model/list", JsonObject(emptyMap()), id)
        return id
    }

    fun listSkills(): Int {
        val id = ids.incrementAndGet()
        send("skills/list", JsonObject(emptyMap()), id)
        return id
    }

    /** Send account/login/start with apiKey method. */
    fun loginWithApiKey(apiKey: String): Int {
        val id = ids.incrementAndGet()
        val params = json.encodeToJsonElement(ApiKeyLoginParams(apiKey = apiKey))
        send("account/login/start", params, id)
        return id
    }

    /** Send account/login/start with chatgpt browser-OAuth method. */
    fun loginWithChatGpt(streamlined: Boolean = false): Int {
        val id = ids.incrementAndGet()
        val params = json.encodeToJsonElement(ChatGptLoginParams(codexStreamlinedLogin = streamlined))
        send("account/login/start", params, id)
        return id
    }

    /** Send account/login/start with chatgptDeviceCode method (headless). */
    fun loginWithDeviceCode(): Int {
        val id = ids.incrementAndGet()
        val params = json.encodeToJsonElement(ChatGptDeviceCodeLoginParams())
        send("account/login/start", params, id)
        return id
    }

    /** Send account/login/start with chatgptAuthTokens method (token injection). */
    fun loginWithAuthTokens(accessToken: String, chatgptAccountId: String): Int {
        val id = ids.incrementAndGet()
        val params = json.encodeToJsonElement(
            ChatGptAuthTokensLoginParams(
                accessToken = accessToken,
                chatgptAccountId = chatgptAccountId,
            )
        )
        send("account/login/start", params, id)
        return id
    }

    /**
     * Builds the raw JSON string for an `account/login/start` request.
     * Extracted as `internal` so unit tests can assert on the serialised frame
     * without a real WebSocket connection.
     */
    internal fun buildLoginFrame(method: LoginMethodType, vararg extras: Pair<String, String>): String {
        val id = ids.incrementAndGet()
        return json.encodeToString(
            buildJsonObject {
                put("method", "account/login/start")
                put("id", id)
                put("params", buildJsonObject {
                    put("type", method.name)
                    extras.forEach { (k, v) -> put(k, v) }
                })
            }
        )
    }

    fun listThreads(limit: Int = 50): Int {
        val id = ids.incrementAndGet()
        send("thread/list", buildJsonObject {
            put("limit", limit)
        }, id)
        return id
    }

    fun getAuthStatus(): Int {
        val id = ids.incrementAndGet()
        send("getAuthStatus", JsonObject(emptyMap()), id)
        return id
    }

    fun interrupt(threadId: String) {
        send("turn/interrupt", buildJsonObject { put("threadId", threadId) })
    }

    private fun send(method: String, params: kotlinx.serialization.json.JsonElement, id: Int? = null) {
        val msg = buildJsonObject {
            put("method", method)
            if (id != null) put("id", id)
            put("params", params)
        }
        ws?.send(json.encodeToString(msg))
    }
}
