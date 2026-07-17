package tv.tootie.aurora.app.codex

import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import okhttp3.Response
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
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

@RunWith(RobolectricTestRunner::class)
class CodexClientWebSocketTest {
    private lateinit var server: MockWebServer
    private val json = Json { ignoreUnknownKeys = true }

    @Before fun setUp() { server = MockWebServer(); server.start() }
    @After fun tearDown() { server.shutdown() }

    @Test fun queuedRequestIsOrderedAfterHandshakeAndClassifiedBeforeImmediateResponse() = runBlocking {
        val received = CopyOnWriteArrayList<String>()
        val responseSent = CountDownLatch(1)
        server.enqueue(MockResponse().withWebSocketUpgrade(object : WebSocketListener() {
            override fun onMessage(webSocket: WebSocket, text: String) {
                val root = json.parseToJsonElement(text).jsonObject
                val method = root["method"]?.jsonPrimitive?.content
                received += method ?: "response"
                if (method == "initialized") webSocket.send("{\"method\":\"initialized\",\"params\":{}}")
                if (method == "model/list") {
                    val id = root["id"]!!.jsonPrimitive.content
                    webSocket.send("{\"id\":$id,\"result\":{\"data\":[]}}")
                    responseSent.countDown()
                    webSocket.close(1000, "test complete")
                }
            }
        }))
        val classified = CopyOnWriteArrayList<Pair<Int, RequestKind>>()
        val client = CodexClient(
            server.url("/rpc").toString().replaceFirst("http", "ws"),
            onRequestCreated = { id, kind -> classified += id to kind },
        )
        client.connect()
        val requestId = client.listModels()
        assertTrue(responseSent.await(5, TimeUnit.SECONDS))
        val response = withTimeout(5_000) { client.messages.first { it.id?.jsonPrimitive?.content == requestId.toString() } }

        assertEquals(requestId.toString(), response.id?.jsonPrimitive?.content)
        assertTrue(classified.contains(requestId to RequestKind.Models))
        assertTrue(received.indexOf("initialized") < received.indexOf("model/list"))
        client.disconnect()
    }

    @Test fun peerNormalCloseAlwaysTerminatesClient() {
        val terminated = CountDownLatch(1)
        server.enqueue(MockResponse().withWebSocketUpgrade(object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                webSocket.close(1000, "normal peer shutdown")
            }
        }))
        val client = CodexClient(
            server.url("/rpc").toString().replaceFirst("http", "ws"),
            onTerminated = { _, code, _ -> if (code == 1000) terminated.countDown() },
        )
        client.connect()
        assertTrue("normal close did not terminate client", terminated.await(5, TimeUnit.SECONDS))
    }

    @Test fun boundedOutboundQueueRejectsOverloadExplicitly() {
        val client = CodexClient("ws://127.0.0.1:1/rpc")
        repeat(600) { client.listModels() }
        assertTrue(client.bufferStats.value.outboundRejected > 0)
    }
}
