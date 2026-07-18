package tv.tootie.aurora.app.codex

import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner

@RunWith(RobolectricTestRunner::class)
class CodexRepositoryWebSocketTest {
    private lateinit var server: MockWebServer
    private val json = Json { ignoreUnknownKeys = true }

    @Before fun setUp() { server = MockWebServer(); server.start() }
    @After fun tearDown() { server.shutdown() }

    @Test fun repositoryClearsActiveClientAfterNormalClose() = runBlocking {
        server.enqueue(MockResponse().withWebSocketUpgrade(rpcListener(closeAfterModels = true)))
        val repo = CodexRepository()
        val url = server.url("/rpc").toString().replaceFirst("http", "ws")

        repo.connect(url, null)
        withTimeout(5_000) { repo.hasActiveClient.first { it } }
        withTimeout(15_000) { repo.isReady.first { it } }
        repo.listModels()
        withTimeout(5_000) { repo.modelsFlow.first() }
        withTimeout(5_000) { repo.isReady.first { !it } }
        // Await the guarded terminal callback, not an arbitrary wall-clock sleep.
        withTimeout(5_000) { repo.hasActiveClient.first { !it } }

        Unit
    }

    private fun rpcListener(closeAfterModels: Boolean) = object : WebSocketListener() {
        override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
            webSocket.close(code, reason)
        }

        override fun onMessage(webSocket: WebSocket, text: String) {
            val root = json.parseToJsonElement(text).jsonObject
            val method = root["method"]?.jsonPrimitive?.content ?: return
            when (method) {
                "initialized" -> webSocket.send("{\"method\":\"initialized\",\"params\":{}}")
                "model/list" -> {
                    val id = root["id"]!!.jsonPrimitive.content
                    webSocket.send("{\"id\":$id,\"result\":{\"data\":[]}}")
                    if (closeAfterModels) webSocket.close(1000, "rotate connection")
                }
                "config/read" -> {
                    val id = root["id"]!!.jsonPrimitive.content
                    webSocket.send("{\"id\":$id,\"result\":{\"config\":{\"request\":\"value-$id\"}}}")
                }
            }
        }
    }
}
