package tv.tootie.aurora.app.ui.startup

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.withTimeout
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.codex.AuthStatus
import tv.tootie.aurora.app.codex.LoginMethodType
import tv.tootie.aurora.app.codex.CodexRepository
import tv.tootie.aurora.app.data.AppSettings

/** UI state for the startup/splash screen. */
sealed class StartupState {
    /** Still checking local credentials or connecting. */
    object Loading : StartupState()

    /** Stored credentials are present and the shared connection is ready. */
    data class Authenticated(val status: AuthStatus) : StartupState()

    /** No complete local credential set is available — must log in. */
    object NeedsLogin : StartupState()

    /** WebSocket connection failed before auth check. */
    data class Error(val message: String) : StartupState()
}

class StartupViewModel(app: Application) : AndroidViewModel(app) {

    private val settings = AppSettings(app)
    private val repo: CodexRepository = (app as CodexApp).repository

    private val _state = MutableStateFlow<StartupState>(StartupState.Loading)
    val state: StateFlow<StartupState> = _state.asStateFlow()

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

        val localMethod = settings.authMethod.first()
        val authStatus = localAuthStatus(localMethod)
        if (authStatus == null) {
            _state.update { StartupState.NeedsLogin }
            return
        }

        repo.connect(url, tok)
        try {
            withTimeout(10_000) { repo.isReady.filter { it }.first() }
            _state.update { StartupState.Authenticated(authStatus) }
        } catch (_: TimeoutCancellationException) {
            _state.update { StartupState.Error("Server handshake did not complete") }
        }
    }

    private suspend fun localAuthStatus(method: String?): AuthStatus? {
        val authToken = settings.authToken.first()
        val apiKey = settings.apiKey.first()
        val accessToken = settings.accessToken.first()
        val accountId = settings.chatgptAccountId.first()

        fun has(value: String?) = !value.isNullOrBlank()

        return when (method) {
            LoginMethodType.apiKey.name ->
                if (has(apiKey) || has(authToken)) AuthStatus.ApiKey else null
            LoginMethodType.chatgpt.name,
            LoginMethodType.chatgptDeviceCode.name ->
                if (has(accessToken) || has(authToken)) AuthStatus.ChatGpt else null
            LoginMethodType.chatgptAuthTokens.name ->
                if ((has(accessToken) || has(authToken)) && has(accountId)) AuthStatus.ChatGpt else null
            else -> null
        }
    }
}
