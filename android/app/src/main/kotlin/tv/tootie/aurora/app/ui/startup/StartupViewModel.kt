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
import kotlinx.coroutines.CancellationException
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.intOrNull
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
        // Reset to Loading so a retry from Error state works correctly.
        _state.value = StartupState.Loading
        viewModelScope.launch {
            runCatching { doStartup() }
                .onFailure { t ->
                    if (t is CancellationException) throw t
                    _state.update { StartupState.Error(t.message ?: "Unexpected error") }
                }
        }
    }

    private suspend fun doStartup() {
        val url = settings.serverUrl.first()
        val tok = settings.authToken.first()
        val c = CodexClient(url, tok)
        client = c
        c.connect()

        val msgs = c.messages

        // Wait for the initialize ACK (id=0 result) or a connection error.
        // The server always responds to initialize with id=0, so we pin to that id
        // to avoid accidentally consuming a later response as the init ack.
        val initAckOrError = msgs.first { msg ->
            (msg.method == null && msg.id?.jsonPrimitive?.intOrNull == 0) ||
                msg.error != null
        }
        if (initAckOrError.error != null) {
            _state.update { StartupState.Error(initAckOrError.error.message) }
            return
        }

        // Server has acknowledged initialize. Now request auth status.
        val authId = c.getAuthStatus()

        // Wait for the response matching our request id. Also handle server errors.
        val authMsg = msgs.first { msg ->
            (msg.method == null &&
                msg.id?.jsonPrimitive?.contentOrNull == authId.toString()) ||
                msg.error != null
        }
        if (authMsg.error != null) {
            _state.update { StartupState.Error(authMsg.error.message) }
            return
        }

        val result = authMsg.result?.jsonObject
        val authenticated = result?.get("authenticated")?.jsonPrimitive?.booleanOrNull ?: false
        val method = result?.get("method")?.jsonPrimitive?.contentOrNull

        if (!authenticated) {
            _state.update { StartupState.NeedsLogin }
            return
        }

        val authStatus = when (method) {
            "apiKey"  -> AuthStatus.ApiKey
            "chatgpt" -> AuthStatus.ChatGpt
            else      -> AuthStatus.ApiKey  // future-proof: treat unknown as authenticated
        }
        _state.update { StartupState.Authenticated(authStatus) }
    }

    override fun onCleared() {
        client?.disconnect()
        super.onCleared()
    }
}
