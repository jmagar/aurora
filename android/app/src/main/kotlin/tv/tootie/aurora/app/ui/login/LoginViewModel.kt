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
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.codex.CodexClient
import tv.tootie.aurora.app.codex.LoginMethodType
import tv.tootie.aurora.app.data.AppSettings
import tv.tootie.aurora.app.data.SecretPersistException
import java.net.URI

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
    // OAuth flow: server-provided URL to open in a Custom Tab.
    // Populated from the account/login/start response before the tab is launched.
    val pendingAuthUrl: String? = null,
)

// ---------------------------------------------------------------------------
// ViewModel
// ---------------------------------------------------------------------------

class LoginViewModel(app: Application) : AndroidViewModel(app) {
    private val settings = AppSettings(app)
    private var client: CodexClient? = null

    /**
     * Request ID returned by [CodexClient.loginWithDeviceCode].
     * The server's *response* to that request carries the device-code data
     * (verificationUrl, userCode) — different from the *notification* path.
     */
    private var deviceCodeRequestId: Int = -1

    /**
     * Request ID returned by [CodexClient.loginWithChatGpt].
     * The server's *response* to that request carries the `authUrl` the app
     * must open in a Custom Tab.
     */
    private var oauthRequestId: Int = -1
    private var pendingLoginMethod: LoginMethodType? = null

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
                // Extract numeric request id for response routing.
                val idNum: Int? = try {
                    msg.id?.jsonPrimitive?.content?.toIntOrNull()
                } catch (_: Exception) { null }

                // ── Responses (method == null, id present) ────────────────────
                if (msg.method == null && idNum != null) {
                    when (idNum) {
                        deviceCodeRequestId -> {
                            // account/login/start (deviceCode) response — device-code data
                            // arrives in result.data[0] or directly in result.
                            val result = msg.result?.jsonObject
                            val data = result?.get("data")?.jsonArray
                                ?.firstOrNull()?.jsonObject
                                ?: result
                            val url2 = data?.get("verificationUrl")?.jsonPrimitive?.content
                            val code = data?.get("userCode")?.jsonPrimitive?.content
                            val expires = data?.get("expiresIn")?.jsonPrimitive?.content
                                ?.toIntOrNull() ?: 300
                            if (url2 != null && code != null) {
                                _state.update {
                                    it.copy(
                                        step = LoginStep.DeviceCodeWait,
                                        verificationUrl = url2,
                                        userCode = code,
                                        deviceCodeExpiresIn = expires,
                                    )
                                }
                            }
                        }
                        oauthRequestId -> {
                            // account/login/start (chatgpt) response — carries authUrl
                            val result = msg.result?.jsonObject
                            val data = result?.get("data")?.jsonArray
                                ?.firstOrNull()?.jsonObject
                                ?: result
                            val authUrl = data?.get("authUrl")?.jsonPrimitive?.content
                            if (authUrl != null && isAllowedOAuthUrl(authUrl)) {
                                _state.update { it.copy(pendingAuthUrl = authUrl) }
                            } else if (authUrl != null) {
                                _state.update {
                                    it.copy(
                                        step = LoginStep.Error,
                                        pendingAuthUrl = null,
                                        errorMessage = "The server returned an untrusted OAuth address.",
                                    )
                                }
                            }
                        }
                    }
                    return@onEach
                }

                // ── Notifications (method != null) ────────────────────────────
                when (msg.method) {
                    "account/login/completed" -> {
                        val p = msg.params?.jsonObject
                        val apiKey = p?.get("apiKey")?.jsonPrimitive?.content
                        val accessToken = p?.get("accessToken")?.jsonPrimitive?.content
                        val accountId = p?.get("chatgptAccountId")?.jsonPrimitive?.content
                        // Persist whatever the server returned.
                        // AUTH_TOKEN is the credential that CodexRepository uses for
                        // authenticated connections — always write it so that ChatViewModel
                        // (and any other ViewModel that calls repo.connect()) can authenticate.
                        // The secret setters throw SecretPersistException if Keystore
                        // encryption fails; catch it here so the login flow surfaces an
                        // error to the user instead of cancelling the message collection
                        // (an uncaught throw would tear down this launchIn coroutine).
                        try {
                            if (apiKey != null) {
                                settings.setApiKey(apiKey)
                                settings.setAuthMethod(LoginMethodType.apiKey.name)
                                settings.setAuthToken(apiKey)
                            }
                            if (accessToken != null) {
                                settings.setAccessToken(accessToken)
                                // For ChatGPT methods, accessToken is the credential used
                                // as the Bearer token on the main authenticated connection.
                                if (apiKey == null) settings.setAuthToken(accessToken)
                            }
                            if (accountId != null) {
                                settings.setChatgptAccountId(accountId)
                            }
                            if (apiKey == null && (accessToken != null || accountId != null)) {
                                val completedMethod = pendingLoginMethod ?: LoginMethodType.chatgpt
                                settings.setAuthMethod(completedMethod.name)
                            }
                            _state.update { it.copy(step = LoginStep.Success) }
                        } catch (e: SecretPersistException) {
                            // The setters are sequential and non-atomic: an earlier one may
                            // have committed before a later one threw, leaving a half-saved
                            // auth state. Roll back to a clean slate so the next launch
                            // doesn't read a method/key without a usable auth token.
                            // clearAuth() only removes keys (no encryption) so it can't throw.
                            settings.clearAuth()
                            _state.update {
                                it.copy(
                                    step = LoginStep.Error,
                                    errorMessage = "Couldn't securely store your credentials on this device. Please try again.",
                                )
                            }
                        }
                    }
                    "account/login/deviceCode" -> {
                        // Notification path (server-push) — same shape as response path above.
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
            pendingLoginMethod = LoginMethodType.apiKey
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
     *
     * The `authUrl` is extracted from the server's response to `account/login/start`
     * and stored in [LoginState.pendingAuthUrl]. The composable caller should watch
     * that field and call [launchPendingAuthUrl] when it becomes non-null.
     */
    fun startChatGptOAuth(context: android.content.Context, streamlined: Boolean = false) {
        _state.update { it.copy(step = LoginStep.LoggingIn) }
        viewModelScope.launch {
            pendingLoginMethod = LoginMethodType.chatgpt
            val id = client?.loginWithChatGpt(streamlined)
            if (id != null) oauthRequestId = id
            // The server's response to account/login/start carries the authUrl.
            // pendingAuthUrl will be set by the message handler once the response
            // arrives; the UI should then call launchPendingAuthUrl().
        }
    }

    /**
     * Launch the server-provided OAuth URL in a Chrome Custom Tab.
     * Called by the UI when [LoginState.pendingAuthUrl] becomes non-null.
     */
    fun launchPendingAuthUrl(context: android.content.Context) {
        val authUrl = _state.value.pendingAuthUrl ?: return
        _state.update { it.copy(pendingAuthUrl = null) }
        if (!isAllowedOAuthUrl(authUrl)) {
            _state.update {
                it.copy(step = LoginStep.Error, errorMessage = "Blocked an untrusted OAuth address.")
            }
            return
        }
        CustomTabsIntent.Builder().build()
            .launchUrl(context, Uri.parse(authUrl))
    }

    // -----------------------------------------------------------------------
    // Method: Device Code (headless)
    // -----------------------------------------------------------------------

    fun selectDeviceCode() {
        _state.update { it.copy(step = LoginStep.LoggingIn) }
        viewModelScope.launch {
            pendingLoginMethod = LoginMethodType.chatgptDeviceCode
            // Capture the request id so the message handler can route the server's
            // response (which carries verificationUrl/userCode) to the right branch.
            val id = client?.loginWithDeviceCode()
            if (id != null) deviceCodeRequestId = id
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
            pendingLoginMethod = LoginMethodType.chatgptAuthTokens
            client?.loginWithAuthTokens(accessToken, accountId)
        }
    }

    // -----------------------------------------------------------------------
    // Navigation / error recovery
    // -----------------------------------------------------------------------

    fun back() = _state.update { it.copy(step = LoginStep.SelectMethod, errorMessage = null) }

    override fun onCleared() { client?.disconnect(); super.onCleared() }
}

internal val TRUSTED_OAUTH_ORIGINS: Set<String> = setOf(
    "https://auth.openai.com",
    "https://auth0.openai.com",
    "https://chatgpt.com",
)

internal fun isAllowedOAuthUrl(value: String, allowedOrigins: Set<String> = TRUSTED_OAUTH_ORIGINS): Boolean =
    runCatching {
        val uri = URI(value)
        if (!uri.scheme.equals("https", ignoreCase = true)) return@runCatching false
        if (uri.host.isNullOrBlank() || uri.userInfo != null) return@runCatching false
        val port = if (uri.port == -1 || uri.port == 443) "" else ":${uri.port}"
        val origin = "https://${uri.host.lowercase()}$port"
        origin in allowedOrigins
    }.getOrDefault(false)
