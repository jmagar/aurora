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
import kotlinx.serialization.json.JsonElement
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
import tv.tootie.aurora.app.ui.chat.SelectedItem
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
                } catch (e: Exception) { Log.w(TAG, "parse error len=${text.length}: ${e.javaClass.simpleName}: ${e.message}") }
            }
            override fun onFailure(ws: WebSocket, t: Throwable, r: Response?) {
                Log.e(TAG, "failure", t)
                _isInitialized.value = false
                _msgs.trySendBlocking(RpcMessage(error = RpcError(-1, t.message ?: "error")))
            }
            override fun onClosed(ws: WebSocket, code: Int, reason: String) {
                val wasReady = _isInitialized.value
                _isInitialized.value = false
                // Emit a synthetic error for unexpected server-side closes (code != 1000)
                // so demux() receives a termination signal and ChatViewModel can clear thinking=true.
                // Code 1000 = normal user-initiated close via disconnect(); no error needed.
                if (wasReady && code != 1000) {
                    _msgs.trySendBlocking(
                        RpcMessage(error = RpcError(code, reason.ifBlank { "server closed connection (code $code)" }))
                    )
                }
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

    /**
     * Builds the raw JSON string for a `turn/start` request and returns it paired
     * with the request ID that was embedded in the frame.
     *
     * Extracted as `internal` so unit tests can assert on the serialised frame
     * without a real WebSocket connection. Returns a [Pair] so the caller can
     * echo back the exact ID that was used, avoiding a race on [ids].
     *
     * [images] are serialised before [attachments] so image context appears first
     * in the input array.
     */
    internal fun buildTurnFrame(
        threadId: String,
        text: String,
        attachments: List<SelectedItem>,
        model: String?,
        effort: String?,
        images: List<PendingAttachment> = emptyList(),
        approvalPolicy: ApprovalPolicy = ApprovalPolicy.OnRequest,
        granularPolicy: GranularPolicy? = null,
        approvalsReviewer: ApprovalsReviewer = ApprovalsReviewer.User,
        sandboxPolicy: SandboxPolicy = SandboxPolicy.DangerFullAccess,
    ): Pair<String, Int> {
        val id = ids.incrementAndGet()
        val frame = json.encodeToString(
            buildJsonObject {
                put("method", "turn/start")
                put("id", id)
                put("params", buildJsonObject {
                    put("threadId", threadId)
                    put("input", buildJsonArray {
                        // Image parts first (protocol: images before text context)
                        images.forEach { img ->
                            add(buildJsonObject {
                                put("type", "image")
                                put("url", "data:${img.mimeType};base64,${img.base64Data}")
                                put("detail", "auto")
                            })
                        }
                        // Text part — omit when blank and images are present (image-only send)
                        if (text.isNotBlank() || images.isEmpty()) {
                            add(buildJsonObject { put("type", "text"); put("text", text) })
                        }
                        // Skill/mention/command attachments
                        attachments.forEach { item ->
                            when (item) {
                                is SelectedItem.Skill -> add(buildJsonObject {
                                    put("type", "skill")
                                    put("name", item.name)
                                    put("path", item.path)
                                })
                                is SelectedItem.Mention -> add(buildJsonObject {
                                    put("type", "mention")
                                    put("name", item.name)
                                    put("path", item.path)
                                })
                                is SelectedItem.Command -> add(buildJsonObject {
                                    put("type", "command")
                                    put("name", item.name)
                                    put("path", item.path)
                                })
                            }
                        }
                    })
                    model?.let { put("model", it) }
                    effort?.let { put("effort", it) }
                    put("approvalPolicy", approvalPolicy.wire)
                    put("approvalsReviewer", approvalsReviewer.wire)
                    if (approvalPolicy == ApprovalPolicy.Granular && granularPolicy != null) {
                        put("approvalPolicyGranular", buildJsonObject {
                            put("mcp_elicitations", granularPolicy.mcpElicitations)
                            put("sandbox_approval", granularPolicy.sandboxApproval)
                            put("rules", granularPolicy.rules)
                            put("skill_approval", granularPolicy.skillApproval)
                        })
                    }
                    // sandboxPolicy: omit entirely for DangerFullAccess (server default).
                    when (sandboxPolicy) {
                        SandboxPolicy.DangerFullAccess -> Unit
                        is SandboxPolicy.ReadOnly -> put("sandboxPolicy", buildJsonObject {
                            put("type", "readOnly")
                            put("networkAccess", sandboxPolicy.networkAccess)
                        })
                        is SandboxPolicy.WorkspaceWrite -> put("sandboxPolicy", buildJsonObject {
                            put("type", "workspaceWrite")
                            put("networkAccess", sandboxPolicy.networkAccess)
                            put("writableRoots", buildJsonArray {
                                sandboxPolicy.writableRoots.forEach { add(it) }
                            })
                        })
                        SandboxPolicy.ExternalSandbox -> put("sandboxPolicy", buildJsonObject {
                            put("type", "externalSandbox")
                        })
                    }
                })
            }
        )
        return frame to id
    }

    fun startTurn(
        threadId: String,
        text: String,
        attachments: List<SelectedItem> = emptyList(),
        model: String? = null,
        effort: String? = null,
        images: List<PendingAttachment> = emptyList(),
        approvalPolicy: ApprovalPolicy = ApprovalPolicy.OnRequest,
        granularPolicy: GranularPolicy? = null,
        approvalsReviewer: ApprovalsReviewer = ApprovalsReviewer.User,
        sandboxPolicy: SandboxPolicy = SandboxPolicy.DangerFullAccess,
    ): Int {
        val (frame, id) = buildTurnFrame(
            threadId, text, attachments, model, effort, images,
            approvalPolicy, granularPolicy, approvalsReviewer, sandboxPolicy,
        )
        ws?.send(frame)
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

    fun resumeThread(threadId: String, history: List<JsonObject>? = null): Int {
        val id = ids.incrementAndGet()
        send("thread/resume", buildJsonObject {
            put("threadId", threadId)
            history?.let { h ->
                put("history", buildJsonArray { h.forEach { add(it) } })
            }
        }, id)
        return id
    }

    fun steerTurn(threadId: String, text: String, expectedTurnId: String): Int {
        val id = ids.incrementAndGet()
        send("turn/steer", buildJsonObject {
            put("threadId", threadId)
            put("input", buildJsonArray {
                add(buildJsonObject { put("type", "text"); put("text", text) })
            })
            put("expectedTurnId", expectedTurnId)
        }, id)
        return id
    }

    fun setGoal(threadId: String, objective: String, tokenBudget: Int? = null): Int {
        val id = ids.incrementAndGet()
        send("thread/goal/set", buildJsonObject {
            put("threadId", threadId)
            put("objective", objective)
            tokenBudget?.let { put("tokenBudget", it) }
        }, id)
        return id
    }

    fun getGoal(threadId: String): Int {
        val id = ids.incrementAndGet()
        send("thread/goal/get", buildJsonObject { put("threadId", threadId) }, id)
        return id
    }

    fun clearGoal(threadId: String): Int {
        val id = ids.incrementAndGet()
        send("thread/goal/clear", buildJsonObject { put("threadId", threadId) }, id)
        return id
    }

    fun listMcpServers(): Int {
        val id = ids.incrementAndGet()
        send("mcpServerStatus/list", buildJsonObject {
            put("detail", "toolsAndAuthOnly")
        }, id)
        return id
    }

    /**
     * Read the effective codex configuration, optionally with a layer breakdown.
     *
     * [cwd] scopes the read to a project directory (server resolves project config from here).
     * [includeLayers] requests the full per-key layer breakdown (user/project/defaults)
     * in addition to the merged effective config.
     */
    fun readConfig(cwd: String? = null, includeLayers: Boolean = true): Int {
        val id = ids.incrementAndGet()
        send("config/read", buildJsonObject {
            cwd?.let { put("cwd", it) }
            if (includeLayers) put("includeLayers", true)
        }, id)
        return id
    }

    fun sendApproval(rawServerId: JsonElement, decision: String): Boolean {
        val json = buildJsonObject {
            put("id", rawServerId)
            put("result", decision)
        }.toString()
        return ws?.send(json) ?: false
    }

    /**
     * Logs out the current account. After the response is received the caller should
     * disconnect the WebSocket and clear cached credentials.
     * Returns the request id for correlation in the messages flow.
     */
    fun logout(): Int {
        val id = ids.incrementAndGet()
        send("account/logout", JsonObject(emptyMap()), id)
        return id
    }

    /**
     * Cancels an in-progress login flow.
     * [loginId] is the value returned in the account/login/start response (field "loginId").
     * Safe to call after login/completed — the server will ignore or return a benign error.
     * Returns the request id for correlation in the messages flow.
     */
    fun cancelLogin(loginId: String): Int {
        val id = ids.incrementAndGet()
        send("account/login/cancel", buildJsonObject { put("loginId", loginId) }, id)
        return id
    }

    fun interrupt(threadId: String) {
        send("turn/interrupt", buildJsonObject { put("threadId", threadId) })
    }

    /**
     * Lists all available experimental features and their current enablement state.
     * Requires `experimentalApi: true` in the initialize capabilities (already set).
     * [threadId] optionally scopes evaluation to a project directory.
     */
    fun listExperimentalFeatures(threadId: String? = null): Int {
        val id = ids.incrementAndGet()
        send("experimentalFeature/list", buildJsonObject {
            threadId?.let { put("threadId", it) }
        }, id)
        return id
    }

    /**
     * Enables or disables a named experimental feature process-wide.
     * [name] is the feature identifier as returned by [listExperimentalFeatures].
     * [enabled] is the desired enablement state.
     */
    fun setFeatureEnablement(name: String, enabled: Boolean): Int {
        val id = ids.incrementAndGet()
        send("experimentalFeature/enablement/set", buildJsonObject {
            put("name", name)
            put("enabled", enabled)
        }, id)
        return id
    }

    private fun send(method: String, params: JsonElement, id: Int? = null) {
        val msg = buildJsonObject {
            put("method", method)
            if (id != null) put("id", id)
            put("params", params)
        }
        ws?.send(json.encodeToString(msg))
    }
}
