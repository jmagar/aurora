package tv.tootie.aurora.app.ui.sidebar

import android.app.Application
import android.util.Log
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
import kotlinx.serialization.json.contentOrNull
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

private const val TAG = "SidebarViewModel"

data class McpTool(val name: String, val description: String = "")
data class McpServerInfo(val name: String, val status: String = "running", val toolCount: Int = 0, val tools: List<McpTool> = emptyList())

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
    private val manager: CodexConnectionManager get() = (getApplication<CodexApp>()).connectionManager

    private val _state = MutableStateFlow(SidebarState())
    val state: StateFlow<SidebarState> = _state.asStateFlow()

    init {
        // Subscribe exactly once per ViewModel lifetime.
        // StateFlow replays current value — if already Connected, loadThreads fires immediately.
        manager.connectionState.onEach { state ->
            if (state is ConnectionState.Connected) {
                loadThreads()
                loadMcpServers()
            }
        }.launchIn(viewModelScope)

        // Subscribe to goal and server notifications from the server
        manager.messages.onEach { msg -> handleGoalNotification(msg) }.launchIn(viewModelScope)
    }

    fun connect() {
        val currentState = manager.connectionState.value
        if (currentState is ConnectionState.Connected) { loadThreads(); loadMcpServers(); return }
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
        loadMcpServers()
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

    fun loadMcpServers() {
        manager.listMcpServers { response ->
            if (response.error != null) {
                Log.w(TAG, "listMcpServers error: ${response.error.message}")
                return@listMcpServers
            }
            val result = response.result ?: return@listMcpServers
            // Try result.servers array first, then treat result itself as array
            val servers = runCatching { result.jsonObject["servers"]?.jsonArray }.getOrNull()
                ?: runCatching { result.jsonArray }.getOrNull()?.takeIf { it.isNotEmpty() }
                ?: run {
                    Log.w(TAG, "unexpected mcpServerStatus shape: $result")
                    return@listMcpServers
                }
            val parsed = servers.mapNotNull { elem ->
                val obj = elem.jsonObject
                val name = obj["name"]?.jsonPrimitive?.contentOrNull ?: return@mapNotNull null
                val status = obj["status"]?.jsonPrimitive?.contentOrNull ?: "running"
                val toolsList = obj["tools"]?.jsonArray?.mapNotNull { t ->
                    val to = t.jsonObject
                    val tName = to["name"]?.jsonPrimitive?.contentOrNull ?: return@mapNotNull null
                    val tDesc = to["description"]?.jsonPrimitive?.contentOrNull ?: ""
                    McpTool(tName, tDesc)
                } ?: emptyList()
                McpServerInfo(name, status, toolsList.size, toolsList)
            }
            _state.update { it.copy(mcpServers = parsed) }
        }
    }

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
            "mcpServer/startupStatus/updated" -> {
                // Refresh MCP server list when server status changes
                loadMcpServers()
            }
        }
    }

    override fun onCleared() {
        // Do not disconnect here — manager is a shared singleton owned by CodexApp
        super.onCleared()
    }
}
