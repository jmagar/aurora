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
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.longOrNull
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.CodexEvent
import tv.tootie.aurora.app.codex.CodexRepository
import tv.tootie.aurora.app.codex.RequestKind
import tv.tootie.aurora.app.codex.RpcMessage
import tv.tootie.aurora.app.data.AppSettings

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

        // Subscribe to goal and MCP notifications from sidebar flow
        repo.sidebarNotificationsFlow.onEach { msg ->
            handleSidebarNotification(msg)
        }.launchIn(viewModelScope)

        // Subscribe to goal GET responses from turnEventsFlow
        repo.turnEventsFlow.onEach { event ->
            if (event.originKind == RequestKind.GoalGet && event.msg.error == null) {
                val goalObj = event.msg.result?.jsonObject ?: return@onEach
                val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull ?: return@onEach
                val expectedId = _state.value.currentThreadId ?: return@onEach
                val status = goalObj["status"]?.jsonPrimitive?.contentOrNull ?: "active"
                val tokenBudget = goalObj["tokenBudget"]?.jsonPrimitive?.intOrNull
                val tokensUsed = goalObj["tokensUsed"]?.jsonPrimitive?.intOrNull ?: 0
                _state.update { s ->
                    if (s.currentThreadId == expectedId) {
                        s.copy(currentGoal = ThreadGoal(objective, status, tokenBudget, tokensUsed))
                    } else s
                }
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
        }
    }

    fun setActiveSession(id: String?) {
        _state.update { it.copy(activeSessionId = id) }
    }

    fun refresh() {
        viewModelScope.launch { repo.listThreads() }
    }

    fun setCurrentThread(threadId: String?) {
        _state.update { it.copy(currentThreadId = threadId, currentGoal = null) }
        if (threadId != null) {
            repo.getGoal(threadId)
            // Response handled via turnEventsFlow subscription in init{}
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
                val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull ?: return
                val status = goalObj["status"]?.jsonPrimitive?.contentOrNull ?: "active"
                val tokenBudget = goalObj["tokenBudget"]?.jsonPrimitive?.intOrNull
                val tokensUsed = goalObj["tokensUsed"]?.jsonPrimitive?.intOrNull ?: 0
                _state.update { it.copy(currentGoal = ThreadGoal(objective, status, tokenBudget, tokensUsed)) }
            }
            "thread/goal/cleared" -> _state.update { it.copy(currentGoal = null) }
            "mcpServer/startupStatus/updated" -> loadMcpServers()
        }
    }

    private fun loadMcpServers() { }

    private fun handleThreadList(event: CodexEvent.ThreadList) {
        val threads = event.threads
        if (threads.isEmpty()) {
            _state.update { it.copy(isLoading = false) }
            return
        }

        val sessions = threads.mapNotNull { obj ->
            val id = obj["id"]?.jsonPrimitive?.content ?: return@mapNotNull null
            val cwd = obj["cwd"]?.jsonPrimitive?.content ?: ""
            val name = obj["name"]?.jsonPrimitive?.content?.takeIf { it != "null" && it.isNotBlank() }
            val preview = obj["preview"]?.jsonPrimitive?.content?.takeIf { it != "null" && it.isNotBlank() } ?: "New session"
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

    // Do NOT disconnect here — the repository owns the connection lifetime.
    override fun onCleared() { super.onCleared() }
}
