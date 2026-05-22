package tv.tootie.aurora.app.ui.startup

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.codex.AuthStatus
import tv.tootie.aurora.app.codex.CodexClient
import tv.tootie.aurora.app.data.AppSettings

/** UI state for the startup/splash screen. */
sealed class StartupState {
    /** Still connecting or waiting for getAuthStatus response. */
    object Loading : StartupState()

    /** getAuthStatus returned authenticated=true. */
    data class Authenticated(val status: AuthStatus) : StartupState()

    /** getAuthStatus returned authenticated=false — must log in. */
    object NeedsLogin : StartupState()

    /** WebSocket connection failed before auth check. */
    data class Error(val message: String) : StartupState()
}

class StartupViewModel(app: Application) : AndroidViewModel(app) {

    private val settings = AppSettings(app)

    private val _state = MutableStateFlow<StartupState>(StartupState.Loading)
    val state: StateFlow<StartupState> = _state.asStateFlow()

    /** The client is exposed so NavHost can hand it to ChatViewModel / SidebarViewModel. */
    var client: CodexClient? = null
        private set

    fun start() {
        if (_state.value != StartupState.Loading) return
        viewModelScope.launch {
            val url = settings.serverUrl.first()
            val tok = settings.authToken.first()
            val c = CodexClient(url, tok)
            client = c
            c.connect()

            // Drain messages until we find the initialize response (id present, no method,
            // no error) — that's the server's acknowledgement of our initialize request.
            val msgs = c.messages
            msgs.first { msg ->
                msg.method == null && msg.error == null && msg.result != null
            }
            // Server has acknowledged initialize. Now request auth status.
            val authId = c.getAuthStatus()

            // Wait for the response matching our request id.
            val authMsg = msgs.first { msg ->
                msg.method == null &&
                    msg.id?.jsonPrimitive?.contentOrNull == authId.toString()
            }

            if (authMsg.error != null) {
                _state.update { StartupState.Error(authMsg.error.message) }
                return@launch
            }

            val result = authMsg.result?.jsonObject
            val authenticated = result?.get("authenticated")?.jsonPrimitive?.booleanOrNull ?: false
            val method = result?.get("method")?.jsonPrimitive?.contentOrNull

            if (!authenticated) {
                _state.update { StartupState.NeedsLogin }
                return@launch
            }

            val authStatus = when (method) {
                "apiKey"  -> AuthStatus.ApiKey
                "chatgpt" -> AuthStatus.ChatGpt
                else      -> AuthStatus.ApiKey  // future-proof: treat unknown as authenticated
            }
            _state.update { StartupState.Authenticated(authStatus) }
        }
    }

    override fun onCleared() {
        client?.disconnect()
        super.onCleared()
    }
}
