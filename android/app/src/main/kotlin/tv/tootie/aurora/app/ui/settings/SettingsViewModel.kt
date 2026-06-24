package tv.tootie.aurora.app.ui.settings

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.CodexClient
import tv.tootie.aurora.app.codex.CodexEvent
import tv.tootie.aurora.app.data.AppSettings
import tv.tootie.aurora.app.data.AuthRepository

sealed class SettingsUiEvent {
    /** Emitted once after a successful logout — UI should navigate away. */
    object LoggedOut : SettingsUiEvent()
}

/**
 * A single effective config entry shown in the config viewer.
 *
 * [key] is the config key (e.g. "model", "approvalPolicy").
 * [value] is its effective value as a display string.
 * [layer] is the name of the layer that supplied this value (e.g. "user", "project", "defaults"),
 *   or null when layer information was not included in the response.
 */
data class ConfigEntry(val key: String, val value: String, val layer: String? = null)

/**
 * A single experimental feature as returned by experimentalFeature/list.
 *
 * [name] is the feature identifier used in enablement/set calls.
 * [enabled] is the current state.
 * [description] is optional human-readable text from the server.
 */
data class ExperimentalFeature(
    val name: String,
    val enabled: Boolean,
    val description: String? = null,
)

data class SettingsState(
    val isLoggingOut: Boolean = false,
    val logoutError: String? = null,
    /** Non-null when the UI should navigate; consumed by the composable. */
    val pendingEvent: SettingsUiEvent? = null,
    // --- Config viewer ---
    val isLoadingConfig: Boolean = false,
    val configEntries: List<ConfigEntry> = emptyList(),
    val configError: String? = null,
    // --- Experimental features ---
    val isLoadingExperimental: Boolean = false,
    val experimentalFeatures: List<ExperimentalFeature> = emptyList(),
    val experimentalError: String? = null,
)

class SettingsViewModel(app: Application) : AndroidViewModel(app) {

    private val settings = AppSettings(app)
    private val authRepo = AuthRepository(app)
    private val repo = (app as CodexApp).repository

    private val _state = MutableStateFlow(SettingsState())
    val state: StateFlow<SettingsState> = _state.asStateFlow()

    init {
        // Subscribe to config/read responses from the repository. The reply flow has
        // replay=1 so a result that arrived before this init (unlikely but possible)
        // is not lost. The subscription is always active so repeated loadConfig() calls
        // surface their responses here without requiring a new subscription each time.
        repo.configFlow.onEach { result ->
            val entries = result.config?.entries?.map { (key, value) ->
                val layer = (result.layers?.get(key) as? JsonPrimitive)?.contentOrNull
                // Scalars render as their content string; objects/arrays render as JSON.
                val display = (value as? JsonPrimitive)?.contentOrNull ?: value.toString()
                ConfigEntry(key = key, value = display, layer = layer)
            }?.sortedBy { it.key } ?: emptyList()
            _state.update {
                it.copy(
                    isLoadingConfig = false,
                    configEntries = entries,
                    configError = result.error,
                )
            }
        }.launchIn(viewModelScope)

        // Subscribe to experimentalFeature/list responses.
        repo.experimentalFeaturesFlow.onEach { result ->
            val features = result.features.mapNotNull { obj ->
                val name = (obj["name"] as? JsonPrimitive)?.contentOrNull ?: return@mapNotNull null
                val enabled = (obj["enabled"] as? JsonPrimitive)?.booleanOrNull ?: false
                val description = (obj["description"] as? JsonPrimitive)?.contentOrNull
                ExperimentalFeature(name = name, enabled = enabled, description = description)
            }.sortedBy { it.name }
            _state.update {
                it.copy(
                    isLoadingExperimental = false,
                    experimentalFeatures = features,
                    experimentalError = result.error,
                )
            }
        }.launchIn(viewModelScope)
    }

    /** Trigger a config/read RPC. Response arrives on [state].configEntries. */
    fun loadConfig(cwd: String? = null) {
        if (_state.value.isLoadingConfig) return
        _state.update { it.copy(isLoadingConfig = true, configError = null) }
        repo.readConfig(cwd = cwd, includeLayers = true)
    }

    /** Trigger an experimentalFeature/list RPC. Response arrives on [state].experimentalFeatures. */
    fun loadExperimentalFeatures() {
        if (_state.value.isLoadingExperimental) return
        _state.update { it.copy(isLoadingExperimental = true, experimentalError = null) }
        repo.listExperimentalFeatures()
    }

    /**
     * Toggle a named experimental feature. Optimistically updates the local list,
     * then fires the RPC — the repository re-fetches the authoritative list on success
     * or surfaces an error on failure, both of which update state via the flow.
     */
    fun toggleFeature(name: String, enabled: Boolean) {
        // Optimistic update so the switch feels instant.
        _state.update { s ->
            s.copy(experimentalFeatures = s.experimentalFeatures.map { f ->
                if (f.name == name) f.copy(enabled = enabled) else f
            })
        }
        repo.setFeatureEnablement(name, enabled)
    }

    fun logout() {
        if (_state.value.isLoggingOut) return
        _state.update { it.copy(isLoggingOut = true, logoutError = null) }

        viewModelScope.launch {
            runCatching { doLogout() }
                .onFailure { t ->
                    if (t is CancellationException) throw t
                    _state.update {
                        it.copy(
                            isLoggingOut = false,
                            logoutError = t.message ?: "Logout failed",
                        )
                    }
                }
        }
    }

    private suspend fun doLogout() {
        val url = settings.serverUrl.first()
        val tok = settings.authToken.first()
        val client = CodexClient(url, tok)

        // Always disconnect and clear credentials regardless of whether the remote
        // logout RPC succeeds, times out, or throws (e.g. invalid URL, network error).
        // CancellationException is never caught here so coroutine cancellation is honoured.
        try {
            client.connect()

            // Give the server 5 seconds for the full logout exchange. If it times out or the
            // server is unreachable, we still clear credentials locally — the user is logged out.
            withTimeout(5_000L) {
                // Wait for the initialize ACK (id=0) before sending any other request.
                // connect() sends initialize immediately in onOpen, so this also implicitly
                // waits for the WebSocket to open.
                val initOrError = client.messages.first { msg ->
                    (msg.method == null && msg.id?.jsonPrimitive?.contentOrNull == "0") ||
                        msg.error != null
                }
                if (initOrError.error != null) return@withTimeout

                val logoutId = client.logout()
                // Wait for the response matching our logout request id, or any error.
                client.messages.first { msg ->
                    (msg.method == null &&
                        msg.id?.jsonPrimitive?.contentOrNull == logoutId.toString()) ||
                        msg.error != null
                }
            }
        } catch (t: Throwable) {
            // Swallow TimeoutCancellationException and any I/O failure from connect()/RPC.
            // Re-throw only true coroutine cancellation so the job is still cancellable.
            if (t is CancellationException && t !is TimeoutCancellationException) throw t
            // Otherwise: server unreachable, slow, or RPC failed — fall through to finally
        } finally {
            client.disconnect()
            authRepo.clearCredentials()
        }

        _state.update {
            it.copy(
                isLoggingOut = false,
                pendingEvent = SettingsUiEvent.LoggedOut,
            )
        }
    }

    /** Called by the composable after it has acted on [SettingsState.pendingEvent]. */
    fun consumeEvent() {
        _state.update { it.copy(pendingEvent = null) }
    }
}
