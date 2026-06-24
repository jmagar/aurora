package tv.tootie.aurora.app.ui.sidebar

import android.app.Application
import android.widget.Toast
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.serialization.json.booleanOrNull
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.intOrNull
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.longOrNull
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.CodexEvent
import tv.tootie.aurora.app.codex.CodexRepository
import tv.tootie.aurora.app.codex.RequestKind
import tv.tootie.aurora.app.codex.RpcMessage
import tv.tootie.aurora.app.data.AppSettings
import tv.tootie.aurora.app.ui.chat.sanitizeForDisplay

data class McpTool(val name: String, val description: String = "")
data class McpServerInfo(
    val name: String,
    val status: String = "running",
    val tools: List<McpTool> = emptyList(),
) {
    val toolCount: Int get() = tools.size
}

data class ThreadGoal(
    val objective: String,
    val status: String = "active",
    val tokenBudget: Int? = null,
    val tokensUsed: Int = 0,
)

enum class ThreadFilter { Active, Archived }

data class SidebarState(
    val projects: List<ProjectGroup> = emptyList(),
    val isLoading: Boolean = true,
    val activeSessionId: String? = null,
    val currentGoal: ThreadGoal? = null,
    val showGoalEditor: Boolean = false,
    val currentThreadId: String? = null,
    val mcpServers: List<McpServerInfo> = emptyList(),
    /** Non-null when the last setGoal or clearGoal RPC failed. UI dismisses by calling clearGoalError(). */
    val goalError: String? = null,
    /** IDs of threads currently loaded in server memory (actively processing or recently active). */
    val loadedThreadIds: Set<String> = emptySet(),
    val renamingThreadId: String? = null,
    val renameText: String = "",
    val threadFilter: ThreadFilter = ThreadFilter.Active,
    val isForkingThread: Boolean = false,
)

class SidebarViewModel(app: Application) : AndroidViewModel(app) {
    private val settings = AppSettings(app)
    private val repo: CodexRepository = (app as CodexApp).repository

    private val _state = MutableStateFlow(SidebarState())
    val state: StateFlow<SidebarState> = _state.asStateFlow()

    init {
        repo.threadsFlow
            .onEach { event -> handleThreadList(event) }
            .launchIn(viewModelScope)

        repo.mcpServersFlow.onEach { event ->
            parseMcpServers(event.servers)
        }.launchIn(viewModelScope)

        // Track which threads are currently loaded in server memory.
        repo.loadedThreadsFlow.onEach { event ->
            val ids = event.threads.mapNotNull { it["id"]?.jsonPrimitive?.contentOrNull }.toSet()
            _state.update { it.copy(loadedThreadIds = ids) }
        }.launchIn(viewModelScope)

        // Clear sidebar state when server URL/token changes (mirrors ChatViewModel pattern)
        repo.sessionInvalidated.onEach {
            _state.update {
                it.copy(
                    currentThreadId = null,
                    currentGoal = null,
                    mcpServers = emptyList(),
                    renamingThreadId = null,
                    renameText = "",
                    isForkingThread = false,
                )
            }
        }.launchIn(viewModelScope)

        // Subscribe to goal and MCP notifications from sidebar flow
        repo.sidebarNotificationsFlow.onEach { msg ->
            handleSidebarNotification(msg)
        }.launchIn(viewModelScope)

        // Subscribe to goal GET + SET responses from turnEventsFlow
        repo.turnEventsFlow.onEach { event ->
            when (event.originKind) {
                RequestKind.GoalGet -> {
                    if (event.msg.error == null) {
                        val goalObj = event.msg.result?.jsonObject ?: return@onEach
                        val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return@onEach
                        // Read expected BEFORE _state.update so we capture the thread the user
                        // was on when this response arrived. The update lambda then verifies the
                        // thread hasn't changed in the meantime.
                        val expected = _state.value.currentThreadId ?: return@onEach
                        val status = goalObj["status"]?.jsonPrimitive?.contentOrNull ?: "active"
                        val tokenBudget = goalObj["tokenBudget"]?.jsonPrimitive?.intOrNull
                        val tokensUsed = goalObj["tokensUsed"]?.jsonPrimitive?.intOrNull ?: 0
                        _state.update { s ->
                            if (s.currentThreadId == expected) {
                                s.copy(currentGoal = ThreadGoal(objective, status, tokenBudget, tokensUsed))
                            } else s
                        }
                    }
                }
                RequestKind.GoalSet -> {
                    if (event.msg.error != null) {
                        // Server rejected the goal — re-open the editor and surface the error
                        val msg = event.msg.error.message.sanitizeForDisplay()
                        _state.update { it.copy(showGoalEditor = true, goalError = msg) }
                        android.util.Log.w("SidebarViewModel", "setGoal failed: $msg")
                    }
                    // On success: thread/goal/updated notification updates state via handleSidebarNotification
                }
                RequestKind.GoalClear -> {
                    if (event.msg.error != null) {
                        // Server rejected the clear — surface the error so the user knows the goal is still active
                        val msg = event.msg.error.message.sanitizeForDisplay()
                        _state.update { it.copy(goalError = msg) }
                        android.util.Log.w("SidebarViewModel", "clearGoal failed: $msg")
                    }
                    // On success: thread/goal/cleared notification clears currentGoal via handleSidebarNotification
                }
                RequestKind.ThreadResume -> {
                    // When ChatViewModel successfully resumes a thread on cold start, sync the
                    // sidebar's current thread so the goal panel populates automatically.
                    // This avoids sharing ChatViewModel at NavHost level (which breaks per-destination VMs).
                    if (event.msg.error == null) {
                        val tid = event.msg.result?.jsonObject
                            ?.get("thread")?.jsonObject?.get("id")?.jsonPrimitive?.contentOrNull
                        if (tid != null) setCurrentThread(tid)
                    }
                }
                else -> { /* other response kinds not handled here */ }
            }
        }.launchIn(viewModelScope)

        repo.threadMgmtFlow
            .onEach { event -> handleThreadMgmtEvent(event) }
            .launchIn(viewModelScope)
    }

    fun connect() {
        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            repo.connect(url, tok)
            // Wait for the initialize/initialized handshake to complete before
            // sending thread/list — otherwise the request can arrive before the
            // server has finished its handshake and will be silently ignored.
            // Wrapped in withTimeout because isReady can stay false forever if
            // disconnect() runs while we are waiting (e.g. user logs out concurrently).
            try {
                withTimeout(10_000) { repo.isReady.filter { it }.first() }
                repo.listThreads()
                loadMcpServers()
            } catch (_: TimeoutCancellationException) {
                _state.update { it.copy(isLoading = false) }
            }
        }
    }

    fun setActiveSession(id: String?) {
        _state.update { it.copy(activeSessionId = id) }
    }

    fun refresh() {
        viewModelScope.launch {
            repo.isReady.filter { it }.first()
            repo.listThreads()
        }
        loadMcpServers()
    }

    fun setCurrentThread(threadId: String?) {
        _state.update { it.copy(currentThreadId = threadId, currentGoal = null) }
        if (threadId != null) {
            repo.getGoal(threadId)
        }
    }

    fun setGoal(objective: String) {
        val threadId = _state.value.currentThreadId ?: return
        if (objective.length > 4000) return
        repo.setGoal(threadId, objective)
        _state.update { it.copy(showGoalEditor = false) }
    }

    fun clearGoal() {
        val threadId = _state.value.currentThreadId ?: return
        repo.clearGoal(threadId)
    }

    fun showGoalEditor() = _state.update { it.copy(showGoalEditor = true) }
    fun hideGoalEditor() = _state.update { it.copy(showGoalEditor = false) }
    fun clearGoalError() = _state.update { it.copy(goalError = null) }

    fun startRename(threadId: String, currentTitle: String) {
        _state.update { it.copy(renamingThreadId = threadId, renameText = currentTitle) }
    }

    fun updateRenameText(text: String) {
        _state.update { it.copy(renameText = text) }
    }

    fun cancelRename() {
        _state.update { it.copy(renamingThreadId = null, renameText = "") }
    }

    fun commitRename() {
        val threadId = _state.value.renamingThreadId ?: return
        val name = _state.value.renameText.trim()
        if (name.isBlank()) {
            cancelRename()
            return
        }
        _state.update { it.copy(renamingThreadId = null, renameText = "") }
        repo.setThreadName(threadId, name)
    }

    fun archiveThread(threadId: String) {
        repo.archiveThread(threadId)
    }

    fun unarchiveThread(threadId: String) {
        repo.unarchiveThread(threadId)
    }

    fun setThreadFilter(filter: ThreadFilter) {
        _state.update { it.copy(threadFilter = filter) }
    }

    fun forkThread(threadId: String, onForked: (String?) -> Unit) {
        _state.update { it.copy(isForkingThread = true) }
        pendingForkCallback = onForked
        repo.forkThread(threadId)
    }

    private var pendingForkCallback: ((String?) -> Unit)? = null

    /**
     * Fetch which threads are currently loaded in server memory.
     * Results arrive via [loadedThreadsFlow] and update [SidebarState.loadedThreadIds].
     */
    fun refreshLoadedThreads() {
        viewModelScope.launch {
            repo.isReady.filter { it }.first()
            repo.listLoadedThreads()
        }
    }

    /**
     * Update opaque key/value [metadata] on [threadId]. Fire-and-forget — useful for
     * storing UI state, project associations, or custom tags alongside the thread.
     */
    fun updateThreadMetadata(threadId: String, metadata: Map<String, String>) {
        repo.updateThreadMetadata(threadId, metadata)
    }

    private fun handleThreadMgmtEvent(event: CodexEvent) {
        when (event) {
            is CodexEvent.ThreadNameAck -> {
                if (!event.success) {
                    Toast.makeText(getApplication(), "Rename failed", Toast.LENGTH_SHORT).show()
                }
            }
            is CodexEvent.ThreadArchiveAck -> {
                if (event.success) {
                    viewModelScope.launch { repo.listThreads() }
                } else {
                    val msg = if (event.archived) "Archive failed" else "Unarchive failed"
                    Toast.makeText(getApplication(), msg, Toast.LENGTH_SHORT).show()
                }
            }
            is CodexEvent.ThreadForkAck -> {
                _state.update { it.copy(isForkingThread = false) }
                val callback = pendingForkCallback
                pendingForkCallback = null
                if (!event.success || event.forkedThreadId == null) {
                    Toast.makeText(getApplication(), "Fork failed", Toast.LENGTH_SHORT).show()
                    callback?.invoke(null)
                } else {
                    viewModelScope.launch { repo.listThreads() }
                    callback?.invoke(event.forkedThreadId)
                }
            }
            else -> Unit
        }
    }

    private fun handleSidebarNotification(msg: RpcMessage) {
        val params = msg.params?.jsonObject ?: return
        when (msg.method) {
            "thread/goal/updated" -> {
                val goalObj = params["goal"]?.jsonObject ?: return
                val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return
                val status = goalObj["status"]?.jsonPrimitive?.contentOrNull ?: "active"
                val tokenBudget = goalObj["tokenBudget"]?.jsonPrimitive?.intOrNull
                val tokensUsed = goalObj["tokensUsed"]?.jsonPrimitive?.intOrNull ?: 0
                _state.update { it.copy(currentGoal = ThreadGoal(objective, status, tokenBudget, tokensUsed), goalError = null) }
            }
            "thread/goal/cleared" -> _state.update { it.copy(currentGoal = null, goalError = null) }
            "mcpServer/startupStatus/updated" -> loadMcpServers()

            // Thread lifecycle — update per-session status indicators
            "thread/started" -> {
                val threadId = params["thread"]?.jsonObject?.get("id")?.jsonPrimitive?.contentOrNull ?: return
                updateSessionStatus(threadId, "active")
            }
            "thread/status/changed" -> {
                val threadObj = params["thread"]?.jsonObject ?: return
                val threadId = threadObj["id"]?.jsonPrimitive?.contentOrNull ?: return
                val statusType = threadObj["status"]?.jsonObject?.get("type")?.jsonPrimitive?.contentOrNull ?: "idle"
                updateSessionStatus(threadId, statusType)
            }
            "thread/closed" -> {
                val threadId = params["thread"]?.jsonObject?.get("id")?.jsonPrimitive?.contentOrNull ?: return
                _state.update { s ->
                    s.copy(projects = s.projects.map { group ->
                        group.copy(sessions = group.sessions.map { session ->
                            if (session.id == threadId) session.copy(isLive = false, threadStatus = "closed")
                            else session
                        })
                    })
                }
            }

            // Thread metadata updates
            "thread/name/updated" -> {
                val threadId = params["thread"]?.jsonObject?.get("id")?.jsonPrimitive?.contentOrNull ?: return
                val name = params["name"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return
                _state.update { s ->
                    s.copy(projects = s.projects.map { group ->
                        group.copy(sessions = group.sessions.map { session ->
                            if (session.id == threadId) session.copy(title = name) else session
                        })
                    })
                }
            }
            "thread/settings/updated" -> {
                // Settings changes (model, policy) are not sidebar-visible — no-op here.
                // ChatViewModel handles the model/policy update for the active thread.
            }
            "thread/archived", "thread/unarchived" -> {
                viewModelScope.launch { repo.listThreads() }
            }
        }
    }

    /** Update the [threadStatus] for a single session item across all project groups. */
    private fun updateSessionStatus(threadId: String, status: String) {
        _state.update { s ->
            s.copy(projects = s.projects.map { group ->
                group.copy(sessions = group.sessions.map { session ->
                    if (session.id == threadId) session.copy(threadStatus = status) else session
                })
            })
        }
    }

    private fun loadMcpServers() { repo.listMcpServers() }

    private fun parseMcpServers(servers: List<JsonObject>) {
        val parsed = servers.mapNotNull { obj ->
            val name = obj["name"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return@mapNotNull null
            val status = obj["status"]?.jsonPrimitive?.contentOrNull ?: "running"
            val tools = obj["tools"]?.jsonArray?.mapNotNull { t ->
                val to = t.jsonObject
                val tName = to["name"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return@mapNotNull null
                val tDesc = to["description"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: ""
                McpTool(tName, tDesc)
            } ?: emptyList()
            McpServerInfo(name, status, tools)
        }
        _state.update { it.copy(mcpServers = parsed) }
    }

    private fun handleThreadList(event: CodexEvent.ThreadList) {
        val threads = event.threads
        if (threads.isEmpty()) {
            _state.update { it.copy(isLoading = false) }
            return
        }

        val sessions = threads.mapNotNull { obj ->
            // Sanitize id before use in navigation routes (Screen.Chat.go uses raw string interpolation)
            val id = obj["id"]?.jsonPrimitive?.content
                ?.filter { it.isLetterOrDigit() || it == '-' || it == '_' }
                ?: return@mapNotNull null
            val cwd = obj["cwd"]?.jsonPrimitive?.content?.sanitizeForDisplay() ?: ""
            val name = obj["name"]?.jsonPrimitive?.content
                ?.sanitizeForDisplay()?.takeIf { it != "null" && it.isNotBlank() }
            val preview = obj["preview"]?.jsonPrimitive?.content
                ?.sanitizeForDisplay()?.takeIf { it != "null" && it.isNotBlank() } ?: "New session"
            val title = name ?: preview.take(60)
            val updatedAt = obj["updatedAt"]?.jsonPrimitive?.longOrNull ?: 0L
            val isLive = obj["status"]?.jsonObject?.get("type")?.jsonPrimitive?.content == "active"
            val threadStatus = obj["status"]?.jsonObject?.get("type")?.jsonPrimitive?.contentOrNull ?: "idle"
            val isArchived = obj["archived"]?.jsonPrimitive?.let {
                it.booleanOrNull == true || it.contentOrNull == "true"
            } == true
            SessionItem(
                id = id,
                title = title,
                cwd = cwd,
                updatedAt = updatedAt,
                isLive = isLive,
                isArchived = isArchived,
                threadStatus = threadStatus,
            )
        }.sortedByDescending { it.updatedAt }

        val groups = sessions
            .groupBy { it.cwd }
            .map { (cwd, items) ->
                val displayName = cwd.split("/", "\\")
                    .filter { it.isNotBlank() }
                    .lastOrNull() ?: cwd.ifBlank { "Global" }
                ProjectGroup(cwd = cwd, displayName = displayName, sessions = items)
            }
            .sortedByDescending { it.sessions.firstOrNull()?.updatedAt ?: 0L }

        _state.update { it.copy(projects = groups, isLoading = false) }
    }

    // Note: onCleared() is intentionally not overridden — the repository owns
    // the connection lifetime, so there's nothing to dispose here.
}
