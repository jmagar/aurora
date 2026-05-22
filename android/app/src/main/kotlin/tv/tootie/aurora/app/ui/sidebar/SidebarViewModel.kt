package tv.tootie.aurora.app.ui.sidebar

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.json.intOrNull
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.longOrNull
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.CodexConnectionManager
import tv.tootie.aurora.app.codex.ConnectionState
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
    private val manager: CodexConnectionManager get() = (getApplication<CodexApp>()).connectionManager

    private val _state = MutableStateFlow(SidebarState())
    val state: StateFlow<SidebarState> = _state.asStateFlow()

    init {
        // Subscribe exactly once per ViewModel lifetime.
        // StateFlow replays current value — if already Connected, loadThreads fires immediately.
        manager.connectionState.onEach { state ->
            if (state is ConnectionState.Connected) loadThreads()
        }.launchIn(viewModelScope)

        // Subscribe to goal notifications from the server
        manager.messages.onEach { msg -> handleGoalNotification(msg) }.launchIn(viewModelScope)
    }

    fun connect() {
        val currentState = manager.connectionState.value
        if (currentState is ConnectionState.Connected) { loadThreads(); return }
        if (currentState is ConnectionState.Connecting || currentState is ConnectionState.Reconnecting) return

        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            manager.connect(url, tok)
        }
    }

    fun setActiveSession(id: String?) {
        _state.update { it.copy(activeSessionId = id) }
    }

    fun refresh() {
        loadThreads()
    }

    private fun loadThreads() {
        manager.listThreads { response ->
            handleMsg(response)
        }
    }

    private fun handleMsg(msg: RpcMessage) {
        val result = msg.result?.jsonObject ?: return
        val threads = result["data"]?.jsonArray ?: return
        if (threads.isEmpty()) {
            _state.update { it.copy(isLoading = false) }
            return
        }

        val sessions = threads.mapNotNull { elem ->
            val obj = elem.jsonObject
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

    fun setCurrentThread(threadId: String?) {
        _state.update { it.copy(currentThreadId = threadId) }
        if (threadId != null) {
            manager.getGoal(threadId) { response ->
                val goalObj = response.result?.jsonObject ?: return@getGoal
                val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull ?: return@getGoal
                val status = goalObj["status"]?.jsonPrimitive?.contentOrNull ?: "active"
                val tokenBudget = goalObj["tokenBudget"]?.jsonPrimitive?.intOrNull
                val tokensUsed = goalObj["tokensUsed"]?.jsonPrimitive?.intOrNull ?: 0
                _state.update { it.copy(currentGoal = ThreadGoal(objective, status, tokenBudget, tokensUsed)) }
            }
        } else {
            _state.update { it.copy(currentGoal = null) }
        }
    }

    fun setGoal(objective: String) {
        val threadId = _state.value.currentThreadId ?: return
        manager.setGoal(threadId, objective) { response ->
            if (response.error == null) {
                val goalObj = response.result?.jsonObject
                val budget = goalObj?.get("tokenBudget")?.jsonPrimitive?.intOrNull
                _state.update { it.copy(currentGoal = ThreadGoal(objective, tokenBudget = budget), showGoalEditor = false) }
            }
        }
    }

    fun clearGoal() {
        val threadId = _state.value.currentThreadId ?: return
        manager.clearGoal(threadId) { response ->
            if (response.error == null) {
                _state.update { it.copy(currentGoal = null) }
            }
        }
    }

    fun showGoalEditor() = _state.update { it.copy(showGoalEditor = true) }
    fun hideGoalEditor() = _state.update { it.copy(showGoalEditor = false) }

    private fun handleGoalNotification(msg: RpcMessage) {
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
            "thread/goal/cleared" -> {
                _state.update { it.copy(currentGoal = null) }
            }
        }
    }

    override fun onCleared() {
        // Do not disconnect here — manager is a shared singleton owned by CodexApp
        super.onCleared()
    }
}
