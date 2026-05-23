package tv.tootie.aurora.app.ui.sidebar

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
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

data class SidebarState(
    val projects: List<ProjectGroup> = emptyList(),
    val isLoading: Boolean = true,
    val activeSessionId: String? = null,
    val currentGoal: ThreadGoal? = null,
    val showGoalEditor: Boolean = false,
    val currentThreadId: String? = null,
    val mcpServers: List<McpServerInfo> = emptyList(),
)

class SidebarViewModel(app: Application) : AndroidViewModel(app) {
    private val settings = AppSettings(app)
    private val repo: CodexRepository = (app as CodexApp).repository

    // Captured at setCurrentThread() call time so the async GoalGet response
    // can guard against stale results if the user switches threads mid-flight
    private var pendingGoalThreadId: String? = null

    private val _state = MutableStateFlow(SidebarState())
    val state: StateFlow<SidebarState> = _state.asStateFlow()

    init {
        repo.threadsFlow
            .onEach { event -> handleThreadList(event) }
            .launchIn(viewModelScope)

        repo.mcpServersFlow.onEach { event ->
            parseMcpServers(event.servers)
        }.launchIn(viewModelScope)

        // Clear sidebar state when server URL/token changes (mirrors ChatViewModel pattern)
        repo.sessionInvalidated.onEach {
            _state.update { it.copy(currentThreadId = null, currentGoal = null, mcpServers = emptyList()) }
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
                        // Use pendingGoalThreadId (captured at call time) to guard against
                        // stale responses when the user switches threads before the response arrives
                        val expected = pendingGoalThreadId ?: return@onEach
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
                        // Server rejected the goal — re-open the editor so the user can fix their input
                        _state.update { it.copy(showGoalEditor = true) }
                        android.util.Log.w("SidebarViewModel", "setGoal failed: ${event.msg.error.message}")
                    }
                    // On success: thread/goal/updated notification updates state via handleSidebarNotification
                }
                else -> { /* other response kinds not handled here */ }
            }
        }.launchIn(viewModelScope)
    }

    fun connect() {
        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            repo.connect(url, tok)
            // Wait for the initialize/initialized handshake to complete before
            // sending thread/list — otherwise the request can arrive before the
            // server has finished its handshake and will be silently ignored.
            repo.isReady.filter { it }.first()
            repo.listThreads()
            loadMcpServers()
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
        pendingGoalThreadId = threadId  // capture before the async call so response handler sees the right value
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

    private fun handleSidebarNotification(msg: RpcMessage) {
        val params = msg.params?.jsonObject ?: return
        when (msg.method) {
            "thread/goal/updated" -> {
                val goalObj = params["goal"]?.jsonObject ?: return
                val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return
                val status = goalObj["status"]?.jsonPrimitive?.contentOrNull ?: "active"
                val tokenBudget = goalObj["tokenBudget"]?.jsonPrimitive?.intOrNull
                val tokensUsed = goalObj["tokensUsed"]?.jsonPrimitive?.intOrNull ?: 0
                _state.update { it.copy(currentGoal = ThreadGoal(objective, status, tokenBudget, tokensUsed)) }
            }
            "thread/goal/cleared" -> _state.update { it.copy(currentGoal = null) }
            "mcpServer/startupStatus/updated" -> loadMcpServers()
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
            val id = obj["id"]?.jsonPrimitive?.content ?: return@mapNotNull null
            val cwd = obj["cwd"]?.jsonPrimitive?.content?.sanitizeForDisplay() ?: ""
            val name = obj["name"]?.jsonPrimitive?.content
                ?.sanitizeForDisplay()?.takeIf { it != "null" && it.isNotBlank() }
            val preview = obj["preview"]?.jsonPrimitive?.content
                ?.sanitizeForDisplay()?.takeIf { it != "null" && it.isNotBlank() } ?: "New session"
            val title = name ?: preview.take(60)
            val updatedAt = obj["updatedAt"]?.jsonPrimitive?.longOrNull ?: 0L
            val isLive = obj["status"]?.jsonObject?.get("type")?.jsonPrimitive?.content == "active"
            SessionItem(id = id, title = title, cwd = cwd, updatedAt = updatedAt, isLive = isLive)
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
