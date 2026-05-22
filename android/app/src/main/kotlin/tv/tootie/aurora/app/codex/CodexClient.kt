package tv.tootie.aurora.app.codex

import android.util.Log
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.trySendBlocking
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
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
    private val ids = AtomicInteger(0)
    private var ws: WebSocket? = null

    private val _msgs = Channel<RpcMessage>(Channel.UNLIMITED)
    val messages: Flow<RpcMessage> = _msgs.receiveAsFlow()

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
                    })
                }))
                ws.send(json.encodeToString(buildJsonObject {
                    put("method", "initialized")
                    put("params", JsonObject(emptyMap()))
                }))
            }
            override fun onMessage(ws: WebSocket, text: String) {
                try { _msgs.trySendBlocking(json.decodeFromString(text)) }
                catch (e: Exception) { Log.w(TAG, "parse error: $text") }
            }
            override fun onFailure(ws: WebSocket, t: Throwable, r: Response?) {
                Log.e(TAG, "failure", t)
                _msgs.trySendBlocking(RpcMessage(error = RpcError(-1, t.message ?: "error")))
            }
            override fun onClosed(ws: WebSocket, code: Int, reason: String) { _msgs.close() }
        })
    }

    fun disconnect() { ws?.close(1000, "bye"); ws = null }

    fun startThread(model: String? = null): Int {
        val id = ids.incrementAndGet()
        send("thread/start", buildJsonObject { model?.let { put("model", it) } }, id)
        return id
    }

    fun startTurn(threadId: String, text: String, model: String? = null): Int {
        val id = ids.incrementAndGet()
        send("turn/start", buildJsonObject {
            put("threadId", threadId)
            put("input", buildJsonArray { add(buildJsonObject { put("type", "text"); put("text", text) }) })
            model?.let { put("model", it) }
        }, id)
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
