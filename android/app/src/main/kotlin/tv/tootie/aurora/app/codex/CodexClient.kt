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
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.add
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.encodeToJsonElement
import kotlinx.serialization.json.put
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.atomic.AtomicInteger

private const val TAG = "CodexClient"

class CodexClient(private val url: String, private val token: String? = null) {

    private val json = Json { ignoreUnknownKeys = true }
    private val http = OkHttpClient()
    internal val ids = AtomicInteger(0)
    private var ws: WebSocket? = null

    /**
     * Frames queued while the WebSocket is connecting or the server `initialized`
     * handshake has not yet completed. Drained in order once `onOpen` fires and the
     * handshake exchange is sent. This prevents messages from being silently dropped
     * if a caller sends before the socket is open (e.g., a race between `connect()`
     * returning and `onOpen` being dispatched on OkHttp's async thread).
     */
    private val outboundQueue = ConcurrentLinkedQueue<String>()

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
                    // has processed the handshake — flip the ready flag and drain any
                    // frames that were queued before the socket was ready.
                    if (msg.method == "initialized") {
                        _isInitialized.value = true
                        var queued = outboundQueue.poll()
                        while (queued != null) {
                            ws.send(queued)
                            queued = outboundQueue.poll()
                        }
                        Log.d(TAG, "initialized — drained outboundQueue")
                    }
                    _msgs.trySendBlocking(msg)
                } catch (e: Exception) { Log.w(TAG, "parse error len=${text.length}: ${e.javaClass.simpleName}: ${e.message}") }
            }
            override fun onFailure(ws: WebSocket, t: Throwable, r: Response?) {
                Log.e(TAG, "failure", t)
                _isInitialized.value = false
                outboundQueue.clear()
                _msgs.trySendBlocking(RpcMessage(error = RpcError(-1, t.message ?: "error")))
            }
            override fun onClosed(ws: WebSocket, code: Int, reason: String) {
                val wasReady = _isInitialized.value
                _isInitialized.value = false
                outboundQueue.clear()
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

    fun startThread(model: String? = null, effort: String? = null): Int {
        val id = ids.incrementAndGet()
        send("thread/start", buildJsonObject {
            model?.let { put("model", it) }
            effort?.let { put("effort", it) }
        }, id)
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

    /**
     * List threads currently loaded in server memory (actively processing or recently active).
     * Distinct from [listThreads] which returns the full persisted history.
     * Returns the request id for correlation.
     */
    fun listLoadedThreads(): Int {
        val id = ids.incrementAndGet()
        send("thread/loaded/list", JsonObject(emptyMap()), id)
        return id
    }

    /**
     * Update opaque key/value metadata on a thread. The server merges [metadata] into
     * any existing metadata for the thread — keys not present in [metadata] are preserved.
     * Returns the request id for correlation.
     */
    fun updateThreadMetadata(threadId: String, metadata: Map<String, String>): Int {
        val id = ids.incrementAndGet()
        send("thread/metadata/update", buildJsonObject {
            put("threadId", threadId)
            put("metadata", JsonObject(metadata.mapValues { JsonPrimitive(it.value) }))
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

    /**
     * Fetch the full item history for an existing thread.
     *
     * Protocol: `thread/read` → `{ threadId }` → `result.items[]`
     * Each item is a raw JsonObject with at minimum `type`, `role`, and `content` fields.
     * Use this after a successful `thread/resume` to restore prior messages in the UI.
     */
    fun readThread(threadId: String): Int {
        val id = ids.incrementAndGet()
        send("thread/read", buildJsonObject {
            put("threadId", threadId)
        }, id)
        return id
    }

    fun gitDiffToRemote(threadId: String): Int {
        val id = ids.incrementAndGet()
        send("gitDiffToRemote", buildJsonObject {
            put("threadId", threadId)
        }, id)
        return id
    }

    fun setThreadName(threadId: String, name: String): Int {
        val id = ids.incrementAndGet()
        send("thread/name/set", buildJsonObject {
            put("threadId", threadId)
            put("name", name)
        }, id)
        return id
    }

    fun archiveThread(threadId: String): Int {
        val id = ids.incrementAndGet()
        send("thread/archive", buildJsonObject {
            put("threadId", threadId)
        }, id)
        return id
    }

    fun unarchiveThread(threadId: String): Int {
        val id = ids.incrementAndGet()
        send("thread/unarchive", buildJsonObject {
            put("threadId", threadId)
        }, id)
        return id
    }

    fun forkThread(
        threadId: String,
        model: String? = null,
        sandboxMode: String? = null,
        cwd: String? = null,
        approvalPolicy: String? = null,
        approvalsReviewer: String? = null,
        developerInstructions: String? = null,
        serviceTier: String? = null,
        ephemeral: Boolean? = null,
        config: JsonObject? = null,
    ): Int {
        val id = ids.incrementAndGet()
        send("thread/fork", buildJsonObject {
            put("threadId", threadId)
            model?.let { put("model", it) }
            sandboxMode?.let { put("sandboxMode", it) }
            cwd?.let { put("cwd", it) }
            approvalPolicy?.let { put("approvalPolicy", it) }
            approvalsReviewer?.let { put("approvalsReviewer", it) }
            developerInstructions?.let { put("developerInstructions", it) }
            serviceTier?.let { put("serviceTier", it) }
            ephemeral?.let { put("ephemeral", it) }
            config?.let { put("config", it) }
        }, id)
        return id
    }

    /**
     * Builds the raw JSON string for a `turn/steer` request.
     * Extracted as `internal` so unit tests can assert on the serialised frame
     * without a real WebSocket connection.
     */
    internal fun buildSteerFrame(threadId: String, text: String, expectedTurnId: String): Pair<String, Int> {
        val id = ids.incrementAndGet()
        val frame = json.encodeToString(buildJsonObject {
            put("method", "turn/steer")
            put("id", id)
            put("params", buildJsonObject {
                put("threadId", threadId)
                put("input", buildJsonArray {
                    add(buildJsonObject { put("type", "text"); put("text", text) })
                })
                put("expectedTurnId", expectedTurnId)
            })
        })
        return frame to id
    }

    fun steerTurn(threadId: String, text: String, expectedTurnId: String): Int {
        val (frame, id) = buildSteerFrame(threadId, text, expectedTurnId)
        ws?.send(frame)
        return id
    }

    /**
     * Builds the raw JSON string for a `thread/goal/set` request.
     * Extracted as `internal` so unit tests can assert on the serialised frame
     * without a real WebSocket connection.
     */
    internal fun buildSetGoalFrame(threadId: String, objective: String, tokenBudget: Int? = null): Pair<String, Int> {
        val id = ids.incrementAndGet()
        val frame = json.encodeToString(buildJsonObject {
            put("method", "thread/goal/set")
            put("id", id)
            put("params", buildJsonObject {
                put("threadId", threadId)
                put("objective", objective)
                tokenBudget?.let { put("tokenBudget", it) }
            })
        })
        return frame to id
    }

    fun setGoal(threadId: String, objective: String, tokenBudget: Int? = null): Int {
        val (frame, id) = buildSetGoalFrame(threadId, objective, tokenBudget)
        ws?.send(frame)
        return id
    }

    /**
     * Builds the raw JSON string for a `thread/goal/get` request.
     * Extracted as `internal` so unit tests can assert on the serialised frame
     * without a real WebSocket connection.
     */
    internal fun buildGetGoalFrame(threadId: String): Pair<String, Int> {
        val id = ids.incrementAndGet()
        val frame = json.encodeToString(buildJsonObject {
            put("method", "thread/goal/get")
            put("id", id)
            put("params", buildJsonObject { put("threadId", threadId) })
        })
        return frame to id
    }

    fun getGoal(threadId: String): Int {
        val (frame, id) = buildGetGoalFrame(threadId)
        ws?.send(frame)
        return id
    }

    /**
     * Builds the raw JSON string for a `thread/goal/clear` request.
     * Extracted as `internal` so unit tests can assert on the serialised frame
     * without a real WebSocket connection.
     */
    internal fun buildClearGoalFrame(threadId: String): Pair<String, Int> {
        val id = ids.incrementAndGet()
        val frame = json.encodeToString(buildJsonObject {
            put("method", "thread/goal/clear")
            put("id", id)
            put("params", buildJsonObject { put("threadId", threadId) })
        })
        return frame to id
    }

    fun clearGoal(threadId: String): Int {
        val (frame, id) = buildClearGoalFrame(threadId)
        ws?.send(frame)
        return id
    }

    /**
     * Builds the raw JSON string for a `mcpServerStatus/list` request.
     * Extracted as `internal` so unit tests can assert on the serialised frame
     * without a real WebSocket connection.
     */
    internal fun buildListMcpServersFrame(): Pair<String, Int> {
        val id = ids.incrementAndGet()
        val frame = json.encodeToString(buildJsonObject {
            put("method", "mcpServerStatus/list")
            put("id", id)
            put("params", buildJsonObject { put("detail", "toolsAndAuthOnly") })
        })
        return frame to id
    }

    fun listMcpServers(): Int {
        val (frame, id) = buildListMcpServersFrame()
        ws?.send(frame)
        return id
    }

    /**
     * Send a configRequirements/read request (no params).
     * Returns the request id for correlation in the messages flow.
     */
    fun readConfigRequirements(): Int {
        val id = ids.incrementAndGet()
        send("configRequirements/read", JsonObject(emptyMap()), id)
        return id
    }

    /**
     * Start a fuzzy file search session.
     *
     * [query] is the user's search string. [roots] is the list of root directories to search.
     * The server responds with a synchronous result (same id) and then emits incremental
     * [fuzzyFileSearch/sessionUpdated] and [fuzzyFileSearch/sessionCompleted] notifications
     * keyed by the sessionId returned in the response.
     *
     * Returns the request id for correlation.
     */
    fun fuzzyFileSearch(query: String, roots: List<String>): Int {
        val id = ids.incrementAndGet()
        send("fuzzyFileSearch", buildJsonObject {
            put("query", query)
            put("roots", buildJsonArray { roots.forEach { add(it) } })
        }, id)
        return id
    }

    /**
     * Send an account/read request.
     * Returns the request id for correlation in the messages flow.
     */
    fun readAccount(): Int {
        val id = ids.incrementAndGet()
        send("account/read", JsonObject(emptyMap()), id)
        return id
    }

    /**
     * Send an account/rateLimits/read request.
     * Returns the request id for correlation in the messages flow.
     */
    fun readRateLimits(): Int {
        val id = ids.incrementAndGet()
        send("account/rateLimits/read", JsonObject(emptyMap()), id)
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

    fun writeConfigValue(
        key: String,
        value: JsonElement?,
        strategy: String = ConfigMergeStrategy.Upsert.wire,
        filePath: String? = null,
    ): Int {
        val id = ids.incrementAndGet()
        send("config/value/write", buildJsonObject {
            put("key", key)
            put("value", value ?: JsonNull)
            put("strategy", strategy)
            filePath?.let { put("filePath", it) }
        }, id)
        return id
    }

    fun batchWriteConfig(
        edits: List<ConfigEditEntry>,
        expectedVersion: String? = null,
        filePath: String? = null,
        reloadUserConfig: Boolean = false,
    ): Int {
        val id = ids.incrementAndGet()
        send("config/batchWrite", buildJsonObject {
            put("edits", buildJsonArray {
                edits.forEach { edit ->
                    add(buildJsonObject {
                        put("key", edit.key)
                        put("value", edit.value ?: JsonNull)
                        put("strategy", edit.strategy)
                    })
                }
            })
            expectedVersion?.let { put("expectedVersion", it) }
            filePath?.let { put("filePath", it) }
            put("reloadUserConfig", reloadUserConfig)
        }, id)
        return id
    }

    fun listPlugins(cwds: List<String>? = null, marketplaceKinds: List<String>? = null): Int {
        val id = ids.incrementAndGet()
        send("plugin/list", buildJsonObject {
            cwds?.let { put("cwds", buildJsonArray { it.forEach { c -> add(c) } }) }
            marketplaceKinds?.let { put("marketplaceKinds", buildJsonArray { it.forEach { k -> add(k) } }) }
        }, id)
        return id
    }

    fun readPlugin(pluginId: String): Int {
        val id = ids.incrementAndGet()
        send("plugin/read", buildJsonObject { put("pluginId", pluginId) }, id)
        return id
    }

    fun listInstalledPlugins(): Int {
        val id = ids.incrementAndGet()
        send("plugin/installed", JsonObject(emptyMap()), id)
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
     * Respond to an `mcpServer/elicitation/request` or `item/tool/requestUserInput`
     * server request with the user's decision.
     *
     * [requestId] is the raw [JsonElement] id from the server's inbound request — echoed
     * back verbatim so the server can correlate the response. Per MCP elicitation spec,
     * [action] is `"accept"` or `"cancel"`. [content] holds field values when accepting
     * (may be an empty object); should be null or empty for cancel.
     *
     * Returns `true` if the frame was queued on the WebSocket, `false` if not connected.
     */
    fun respondElicitation(
        requestId: JsonElement,
        action: String,
        content: JsonObject = JsonObject(emptyMap()),
    ): Boolean {
        val frame = json.encodeToString(buildJsonObject {
            put("id", requestId)
            put("result", buildJsonObject {
                put("action", action)
                if (action == "accept") put("content", content)
            })
        })
        return ws?.send(frame) ?: false
    }

    /**
     * Start an AI code review for a thread.
     *
     * [targetType]: "uncommittedChanges", "baseBranch", "commit", or "custom".
     * [targetValue]: branch name, commit SHA, or custom instructions (null for uncommittedChanges).
     * [delivery]: "inline" (default — uses current thread) or "detached" (creates new thread).
     */
    fun startReview(threadId: String, targetType: String, targetValue: String?, delivery: String): Int {
        val id = ids.incrementAndGet()
        send("review/start", buildJsonObject {
            put("threadId", threadId)
            put("target", buildJsonObject {
                put("type", targetType)
                if (targetValue != null) put("value", targetValue)
            })
            put("delivery", delivery)
        }, id)
        return id
    }

    /** Send a one-off shell command within the thread's execution sandbox. */
    fun shellCommand(threadId: String, command: String): Int {
        val id = ids.incrementAndGet()
        send("thread/shellCommand", buildJsonObject {
            put("threadId", threadId)
            put("command", command)
        }, id)
        return id
    }

    /**
     * Run a command outside any thread (buffered mode — no PTY, no streaming).
     *
     * The server captures stdout+stderr and returns them in the response `result`.
     * [command] is the argv list; [cwd] overrides the working directory; [env] supplies
     * additional environment variables; [timeoutMs] caps execution time.
     *
     * Returns the request id for correlation.
     */
    fun execCommand(
        command: List<String>,
        cwd: String? = null,
        env: Map<String, String> = emptyMap(),
        timeoutMs: Long? = null,
    ): Int {
        val id = ids.incrementAndGet()
        send("command/exec", buildJsonObject {
            put("command", buildJsonArray { command.forEach { add(it) } })
            if (cwd != null) put("cwd", cwd)
            if (env.isNotEmpty()) put("env", JsonObject(env.mapValues { JsonPrimitive(it.value) }))
            if (timeoutMs != null) put("timeoutMs", timeoutMs)
        }, id)
        return id
    }

    /**
     * Run a command in PTY streaming mode — allocates a pseudo-terminal and streams
     * stdout/stderr back as [command/exec/outputDelta] notifications keyed by [processId].
     * The caller supplies [processId] so it can correlate follow-up write/resize/terminate
     * requests. [cols] and [rows] set the initial terminal dimensions.
     *
     * Returns the request id for correlation.
     */
    fun execCommandPty(
        command: List<String>,
        processId: String,
        cwd: String? = null,
        env: Map<String, String> = emptyMap(),
        cols: Int = 80,
        rows: Int = 24,
        timeoutMs: Long? = null,
    ): Int {
        val id = ids.incrementAndGet()
        send("command/exec", buildJsonObject {
            put("command", buildJsonArray { command.forEach { add(it) } })
            put("processId", processId)
            put("tty", true)
            put("streamStdin", true)
            put("streamStdoutStderr", true)
            put("cols", cols)
            put("rows", rows)
            if (cwd != null) put("cwd", cwd)
            if (env.isNotEmpty()) put("env", JsonObject(env.mapValues { JsonPrimitive(it.value) }))
            if (timeoutMs != null) put("timeoutMs", timeoutMs)
        }, id)
        return id
    }

    /**
     * Write data to a running PTY process's stdin.
     * [processId] must match the one used in [execCommandPty].
     */
    fun execCommandWrite(processId: String, data: String) {
        send("command/exec/write", buildJsonObject {
            put("processId", processId)
            put("data", data)
        })
    }

    /**
     * Resize the PTY window for a running process.
     * [processId] must match the one used in [execCommandPty].
     */
    fun execCommandResize(processId: String, cols: Int, rows: Int) {
        send("command/exec/resize", buildJsonObject {
            put("processId", processId)
            put("cols", cols)
            put("rows", rows)
        })
    }

    /**
     * Send SIGTERM (or equivalent) to a running PTY process.
     * [processId] must match the one used in [execCommandPty].
     */
    fun execCommandTerminate(processId: String) {
        send("command/exec/terminate", buildJsonObject {
            put("processId", processId)
        })
    }

    /** Manually trigger context window compaction for a thread. */
    fun compactStart(threadId: String): Int {
        val id = ids.incrementAndGet()
        send("thread/compact/start", buildJsonObject {
            put("threadId", threadId)
        }, id)
        return id
    }

    /**
     * Respond to an `account/chatgptAuthTokens/refresh` server request.
     *
     * The server sends this request (with its own id) when it needs fresh ChatGPT
     * tokens. The client must echo back a result frame keyed to the same [requestId].
     * Mirrors the RPC response shape: `{ id, result: { accessToken, chatgptAccountId } }`.
     *
     * Returns `true` if the frame was queued on the WebSocket, `false` if not connected.
     */
    fun respondAuthTokensRefresh(
        requestId: JsonElement,
        accessToken: String,
        chatgptAccountId: String,
    ): Boolean {
        val frame = json.encodeToString(buildJsonObject {
            put("id", requestId)
            put("result", buildJsonObject {
                put("accessToken", accessToken)
                put("chatgptAccountId", chatgptAccountId)
            })
        })
        return ws?.send(frame) ?: false
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
        val frame = json.encodeToString(msg)
        val socket = ws
        when {
            socket == null -> {
                // Not yet connected — should not happen in normal flow since CodexRepository
                // guards calls with isReady, but enqueue defensively rather than silently drop.
                Log.w(TAG, "send: ws null, queuing method=$method")
                outboundQueue.add(frame)
            }
            !_isInitialized.value -> {
                // Socket open but handshake not yet acknowledged — queue until drain in onMessage.
                outboundQueue.add(frame)
            }
            else -> socket.send(frame)
        }
    }
}
