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
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.codex.CodexClient
import tv.tootie.aurora.app.data.AppSettings
import tv.tootie.aurora.app.data.AuthRepository

sealed class SettingsUiEvent {
    /** Emitted once after a successful logout — UI should navigate away. */
    object LoggedOut : SettingsUiEvent()
}

data class SettingsState(
    val isLoggingOut: Boolean = false,
    val logoutError: String? = null,
    /** Non-null when the UI should navigate; consumed by the composable. */
    val pendingEvent: SettingsUiEvent? = null,
)

class SettingsViewModel(app: Application) : AndroidViewModel(app) {

    private val settings = AppSettings(app)
    private val authRepo = AuthRepository(app)

    private val _state = MutableStateFlow(SettingsState())
    val state: StateFlow<SettingsState> = _state.asStateFlow()

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
        client.connect()

        // Give the server 5 seconds to accept logout. If it times out or the server
        // is unreachable, we still clear credentials locally — the user is logged out.
        try {
            withTimeout(5_000L) {
                val logoutId = client.logout()
                // Wait for the response matching our logout request id, or any error.
                client.messages.first { msg ->
                    (msg.method == null &&
                        msg.id?.jsonPrimitive?.contentOrNull == logoutId.toString()) ||
                        msg.error != null
                }
            }
        } catch (_: TimeoutCancellationException) {
            // Server unreachable or slow — proceed to local cleanup anyway
        }

        client.disconnect()
        authRepo.clearCredentials()

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
