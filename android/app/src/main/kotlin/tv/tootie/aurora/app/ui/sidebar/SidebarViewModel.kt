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
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.longOrNull
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.CodexEvent
import tv.tootie.aurora.app.codex.CodexRepository
import tv.tootie.aurora.app.data.AppSettings

data class SidebarState(
    val projects: List<ProjectGroup> = emptyList(),
    val isLoading: Boolean = true,
    val activeSessionId: String? = null,
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
    }

    fun connect() {
        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            repo.connect(url, tok)
            repo.listThreads()
        }
    }

    fun setActiveSession(id: String?) {
        _state.update { it.copy(activeSessionId = id) }
    }

    fun refresh() {
        viewModelScope.launch { repo.listThreads() }
    }

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
