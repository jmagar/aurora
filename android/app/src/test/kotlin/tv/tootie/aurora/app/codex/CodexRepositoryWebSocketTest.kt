package tv.tootie.aurora.app.codex

import kotlinx.coroutines.delay
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
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
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

    @Test fun repositoryRoutesCorrelatedConfigResponsesAndReconnectsAfterNormalClose() = runBlocking {
        server.enqueue(MockResponse().withWebSocketUpgrade(rpcListener(closeAfterModels = true)))
        server.enqueue(MockResponse().withWebSocketUpgrade(rpcListener(closeAfterModels = false)))
        val repo = CodexRepository()
        val url = server.url("/rpc").toString().replaceFirst("http", "ws")

        repo.connect(url, null)
        withTimeout(5_000) { repo.isReady.first { it } }
        repo.listModels()
        withTimeout(5_000) { repo.modelsFlow.first() }
        withTimeout(5_000) { repo.isReady.first { !it } }
        // onClosing flips readiness synchronously; allow the repository's guarded
        // terminal callback to clear its active-client identity before reconnect.
        delay(500)

        repo.connect(url, null)
        withTimeout(5_000) { repo.isReady.first { it } }
        val firstId = repo.readConfig(includeLayers = false)
        val first = withTimeout(5_000) { repo.configFlow.first { it.requestId == firstId } }
        val secondId = repo.readConfig(includeLayers = false)
        val second = withTimeout(5_000) { repo.configFlow.first { it.requestId == secondId } }

        assertTrue(firstId != secondId)
        assertEquals("value-$firstId", first.config?.get("request")?.jsonPrimitive?.content)
        assertEquals("value-$secondId", second.config?.get("request")?.jsonPrimitive?.content)
        repo.disconnect()
        delay(100)
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
