package tv.tootie.aurora.app.ui.plugins

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.CodexApp

data class PluginItem(
    val id: String,
    val name: String,
    val description: String,
    val version: String,
    val installed: Boolean,
)

data class PluginBrowserState(
    val isLoading: Boolean = true,
    val available: List<PluginItem> = emptyList(),
    val installed: List<PluginItem> = emptyList(),
    val error: String? = null,
)

class PluginBrowserViewModel(app: Application) : AndroidViewModel(app) {

    private val repo = (app as CodexApp).repository

    private val _state = MutableStateFlow(PluginBrowserState())
    val state: StateFlow<PluginBrowserState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            // Wait for connection before issuing requests
            repo.isReady.first { it }
            repo.listPlugins()
            repo.listInstalledPlugins()
        }
        viewModelScope.launch {
            repo.pluginsFlow.collect { event ->
                val installedIds = event.installed.map { pluginId(it) }.toSet()
                _state.update {
                    it.copy(
                        isLoading = false,
                        available = event.available.map { toItem(it, installedIds) },
                        installed = event.installed.map { toItem(it, installedIds) },
                        error = null,
                    )
                }
            }
        }
    }

    fun refresh() {
        _state.update { it.copy(isLoading = true, error = null) }
        viewModelScope.launch {
            repo.isReady.first { it }
            repo.listPlugins()
            repo.listInstalledPlugins()
        }
    }

    private fun pluginId(obj: JsonObject): String =
        obj["id"]?.jsonPrimitive?.contentOrNull
            ?: obj["pluginId"]?.jsonPrimitive?.contentOrNull
            ?: ""

    private fun toItem(obj: JsonObject, installedIds: Set<String>): PluginItem {
        val id = pluginId(obj)
        val manifest = obj["manifest"]?.jsonObject ?: obj
        return PluginItem(
            id = id,
            name = manifest["name"]?.jsonPrimitive?.contentOrNull ?: id,
            description = manifest["description"]?.jsonPrimitive?.contentOrNull ?: "",
            version = manifest["version"]?.jsonPrimitive?.contentOrNull ?: "",
            installed = id in installedIds,
        )
    }
}
