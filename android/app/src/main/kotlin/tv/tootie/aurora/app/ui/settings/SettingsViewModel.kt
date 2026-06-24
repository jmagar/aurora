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
 * Account information from [account/read] and [account/updated] push notifications.
 * Fields are nullable — the server may omit any subset.
 */
data class AccountInfo(
    val planType: String? = null,
    val email: String? = null,
    val creditsBalance: String? = null,
)

/**
 * Rate-limit state from [account/rateLimits/read] and [account/rateLimits/updated].
 */
data class RateLimitsInfo(
    val requestsRemaining: Int? = null,
    val resetTime: String? = null,
)

/**
 * A single effective config entry shown in the config viewer.
 *
 * [key] is the config key (e.g. "model", "approvalPolicy").
 * [value] is its effective value as a display string.
 * [layer] is the name of the layer that supplied this value (e.g. "user", "project", "defaults"),
 *   or null when layer information was not included in the response.
 */
data class ConfigEntry(val key: String, val value: String, val layer: String? = null)

data class SettingsState(
    val isLoggingOut: Boolean = false,
    val logoutError: String? = null,
    /** Non-null when the UI should navigate; consumed by the composable. */
    val pendingEvent: SettingsUiEvent? = null,
    val accountInfo: AccountInfo? = null,
    val rateLimits: RateLimitsInfo? = null,
    // --- Config viewer ---
    val isLoadingConfig: Boolean = false,
    val configEntries: List<ConfigEntry> = emptyList(),
    val configError: String? = null,
)

class SettingsViewModel(app: Application) : AndroidViewModel(app) {

    private val settings = AppSettings(app)
    private val authRepo = AuthRepository(app)
    private val repo = (app as CodexApp).repository

    private val _state = MutableStateFlow(SettingsState())
    val state: StateFlow<SettingsState> = _state.asStateFlow()

    init {
        // Subscribe to push notifications so the UI stays current without polling.
        repo.accountFlow.onEach { event ->
            _state.update { it.copy(accountInfo = parseAccountInfo(event)) }
        }.launchIn(viewModelScope)

        repo.rateLimitsFlow.onEach { event ->
            _state.update { it.copy(rateLimits = parseRateLimits(event)) }
        }.launchIn(viewModelScope)

        // Subscribe to config/read responses. Repeated loadConfig() calls surface here.
        repo.configFlow.onEach { result ->
            val entries = result.config?.entries?.map { (key, value) ->
                val layer = (result.layers?.get(key) as? JsonPrimitive)?.contentOrNull
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

        // Fetch initial values once on creation.
        fetchAccountInfo()
    }

    /** Trigger fresh account/read and account/rateLimits/read requests. */
    fun fetchAccountInfo() {
        repo.readAccount()
        repo.readRateLimits()
    }

    private fun parseAccountInfo(event: CodexEvent.AccountInfo): AccountInfo {
        val d = event.data
        return AccountInfo(
            planType = d["planType"]?.jsonPrimitive?.contentOrNull
                ?: d["plan"]?.jsonPrimitive?.contentOrNull,
            email = d["email"]?.jsonPrimitive?.contentOrNull,
            creditsBalance = d["creditsBalance"]?.jsonPrimitive?.contentOrNull
                ?: d["credits"]?.jsonPrimitive?.contentOrNull,
        )
    }

    private fun parseRateLimits(event: CodexEvent.RateLimitsInfo): RateLimitsInfo {
        val d = event.data
        return RateLimitsInfo(
            requestsRemaining = d["requestsRemaining"]?.jsonPrimitive?.contentOrNull?.toIntOrNull()
                ?: d["remaining"]?.jsonPrimitive?.contentOrNull?.toIntOrNull(),
            resetTime = d["resetTime"]?.jsonPrimitive?.contentOrNull
                ?: d["resetsAt"]?.jsonPrimitive?.contentOrNull,
        )
    }

    /** Trigger a config/read RPC. Response arrives on [state].configEntries. */
    fun loadConfig(cwd: String? = null) {
        if (_state.value.isLoadingConfig) return
        _state.update { it.copy(isLoadingConfig = true, configError = null) }
        repo.readConfig(cwd = cwd, includeLayers = true)
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
