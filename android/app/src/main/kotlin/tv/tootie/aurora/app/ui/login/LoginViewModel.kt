package tv.tootie.aurora.app.ui.login

import android.app.Application
import android.net.Uri
import androidx.browser.customtabs.CustomTabsIntent
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
import tv.tootie.aurora.app.codex.CodexClient
import tv.tootie.aurora.app.codex.LoginMethodType
import tv.tootie.aurora.app.data.AppSettings

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

enum class LoginStep {
    SelectMethod,   // initial: user picks which method to use
    ApiKeyForm,     // user enters an API key
    DeviceCodeWait, // waiting for the user to visit a URL and enter code
    BrowserOAuth,   // Chrome Custom Tab opened; waiting for redirect
    TokensForm,     // user enters accessToken + accountId
    LoggingIn,      // request sent; waiting for account/login/completed
    Error,          // something went wrong
    Success,        // account/login/completed received — navigator can leave
}

data class LoginState(
    val step: LoginStep = LoginStep.SelectMethod,
    val errorMessage: String? = null,
    // Device-code flow fields
    val verificationUrl: String? = null,
    val userCode: String? = null,
    val deviceCodeExpiresIn: Int = 300,
)

// ---------------------------------------------------------------------------
// ViewModel
// ---------------------------------------------------------------------------

class LoginViewModel(app: Application) : AndroidViewModel(app) {
    private val settings = AppSettings(app)
    private var client: CodexClient? = null

    private val _state = MutableStateFlow(LoginState())
    val state: StateFlow<LoginState> = _state.asStateFlow()

    /** Connect to the server (without sending credentials yet). */
    fun connect() {
        viewModelScope.launch {
            val url = settings.serverUrl.first()
            // No Bearer token during login — we're establishing an unauthenticated connection.
            val c = CodexClient(url, token = null).also { it.connect() }
            client = c
            c.messages.onEach { msg ->
                when (msg.method) {
                    "account/login/completed" -> {
                        val p = msg.params?.jsonObject
                        val apiKey = p?.get("apiKey")?.jsonPrimitive?.content
                        val accessToken = p?.get("accessToken")?.jsonPrimitive?.content
                        val accountId = p?.get("chatgptAccountId")?.jsonPrimitive?.content
                        // Persist whatever the server returned
                        if (apiKey != null) {
                            settings.setApiKey(apiKey)
                            settings.setAuthMethod(LoginMethodType.apiKey.name)
                        }
                        if (accessToken != null) {
                            settings.setAccessToken(accessToken)
                        }
                        if (accountId != null) {
                            settings.setChatgptAccountId(accountId)
                        }
                        _state.update { it.copy(step = LoginStep.Success) }
                    }
                    "account/login/deviceCode" -> {
                        val p = msg.params?.jsonObject
                        val url2 = p?.get("verificationUrl")?.jsonPrimitive?.content ?: return@onEach
                        val code = p["userCode"]?.jsonPrimitive?.content ?: return@onEach
                        val expires = p["expiresIn"]?.jsonPrimitive?.content?.toIntOrNull() ?: 300
                        _state.update {
                            it.copy(
                                step = LoginStep.DeviceCodeWait,
                                verificationUrl = url2,
                                userCode = code,
                                deviceCodeExpiresIn = expires,
                            )
                        }
                    }
                    "error" -> {
                        val errMsg = msg.params?.jsonObject?.get("error")?.jsonObject
                            ?.get("message")?.jsonPrimitive?.content
                            ?: msg.error?.message
                            ?: "Unknown error"
                        _state.update { it.copy(step = LoginStep.Error, errorMessage = errMsg) }
                    }
                }
            }.launchIn(viewModelScope)
        }
    }

    // -----------------------------------------------------------------------
    // Method: API Key
    // -----------------------------------------------------------------------

    fun selectApiKey() = _state.update { it.copy(step = LoginStep.ApiKeyForm) }

    fun submitApiKey(key: String) {
        if (key.isBlank()) return
        _state.update { it.copy(step = LoginStep.LoggingIn) }
        viewModelScope.launch {
            settings.setApiKey(key)
            settings.setAuthMethod(LoginMethodType.apiKey.name)
            client?.loginWithApiKey(key)
            // account/login/completed will arrive via the messages flow above
        }
    }

    // -----------------------------------------------------------------------
    // Method: ChatGPT browser OAuth
    // -----------------------------------------------------------------------

    fun selectChatGpt() = _state.update { it.copy(step = LoginStep.BrowserOAuth) }

    /**
     * Opens a Chrome Custom Tab for the OAuth redirect URL returned by the server,
     * then sends loginWithChatGpt. The server closes the tab via the redirect URI;
     * account/login/completed arrives over the WebSocket.
     */
    fun startChatGptOAuth(context: android.content.Context, streamlined: Boolean = false) {
        _state.update { it.copy(step = LoginStep.LoggingIn) }
        viewModelScope.launch {
            settings.setAuthMethod(LoginMethodType.chatgpt.name)
            client?.loginWithChatGpt(streamlined)
            // The server will push an oauth URL in a separate notification (not yet in protocol).
            // For now we open the known ChatGPT login URL directly.
            val tabIntent = CustomTabsIntent.Builder().build()
            tabIntent.launchUrl(context, Uri.parse("https://chatgpt.com/login"))
        }
    }

    // -----------------------------------------------------------------------
    // Method: Device Code (headless)
    // -----------------------------------------------------------------------

    fun selectDeviceCode() {
        _state.update { it.copy(step = LoginStep.LoggingIn) }
        viewModelScope.launch {
            settings.setAuthMethod(LoginMethodType.chatgptDeviceCode.name)
            client?.loginWithDeviceCode()
            // Server pushes account/login/deviceCode → handled above in messages flow
        }
    }

    // -----------------------------------------------------------------------
    // Method: Direct token injection
    // -----------------------------------------------------------------------

    fun selectTokens() = _state.update { it.copy(step = LoginStep.TokensForm) }

    fun submitTokens(accessToken: String, accountId: String) {
        if (accessToken.isBlank() || accountId.isBlank()) return
        _state.update { it.copy(step = LoginStep.LoggingIn) }
        viewModelScope.launch {
            settings.setAuthMethod(LoginMethodType.chatgptAuthTokens.name)
            client?.loginWithAuthTokens(accessToken, accountId)
        }
    }

    // -----------------------------------------------------------------------
    // Navigation / error recovery
    // -----------------------------------------------------------------------

    fun back() = _state.update { it.copy(step = LoginStep.SelectMethod, errorMessage = null) }

    override fun onCleared() { client?.disconnect(); super.onCleared() }
}
