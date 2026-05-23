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
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.withTimeoutOrNull
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
        // Disconnect any previous client created by an earlier (failed) attempt
        // before creating a new one, so retry doesn't leak WebSocket connections.
        client?.disconnect()
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

        // Server has acknowledged initialize. Try the experimental `getAuthStatus`
        // RPC; it is not in the public Codex app-server protocol (developers.openai.com
        // /codex/app-server lists no such method), so the call may time out or return
        // a JSON-RPC method-not-found error. In either case, fall back to the local
        // AUTH_METHOD record — if the user has previously stored credentials we treat
        // them as authenticated; otherwise we route to login.
        val authId = c.getAuthStatus()
        val authMsg = withTimeoutOrNull(3_000) {
            msgs.first { msg ->
                (msg.method == null &&
                    msg.id?.jsonPrimitive?.contentOrNull == authId.toString()) ||
                    msg.error != null
            }
        }

        // Trust local DataStore: if a credential is stored, we're authenticated.
        // Server response is informational only because (a) `getAuthStatus` is not in
        // the public Codex protocol and (b) it returns `authenticated:false` for
        // unauthenticated servers even when no auth is needed on loopback.
        val localMethod = settings.authMethod.first()
        val authenticated: Boolean = localMethod != null
        val method: String? = localMethod

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
