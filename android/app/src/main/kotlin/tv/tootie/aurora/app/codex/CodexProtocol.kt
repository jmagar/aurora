package tv.tootie.aurora.app.codex

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject

@Serializable
data class RpcMessage(
    val method: String? = null,
    val id: JsonElement? = null,
    val params: JsonElement? = null,
    val result: JsonElement? = null,
    val error: RpcError? = null,
)

@Serializable
data class RpcError(val code: Int, val message: String)

/** Auth state returned by the server for the `getAuthStatus` request. */
sealed class AuthStatus {
    /** Server is authenticated via a static API key configured in the server config. */
    object ApiKey : AuthStatus()

    /** Server is authenticated via a cached ChatGPT OAuth token. */
    object ChatGpt : AuthStatus()

    /** Server has no auth — user must run account/login/start. */
    object Unauthenticated : AuthStatus()
}

/** Raw deserialization target for the getAuthStatus result object.
 *  Used for structured parsing of the server response in StartupViewModel. */
@Serializable
data class AuthStatusResult(
    val authenticated: Boolean,
    val method: String? = null,
)

/**
 * Client capabilities sent in the `initialize` request params.
 *
 * Protocol reference (server-side Rust struct, camelCase over the wire):
 * ```
 * InitializeCapabilities {
 *   experimentalApi: bool,          // enables experimental methods/fields
 *   requestAttestation: bool,       // enables attestation/generate flow
 *   optOutNotificationMethods: String[] | null,  // suppress specific notifications
 * }
 * ```
 */
data class InitializeCapabilities(
    val experimentalApi: Boolean = false,
    val requestAttestation: Boolean = false,
    val optOutNotificationMethods: List<String>? = null,
)

/** The four authentication strategies Codex supports via account/login/start. */
enum class LoginMethodType {
    apiKey,
    chatgpt,
    chatgptDeviceCode,
    chatgptAuthTokens,
}

/** Params sent with account/login/start for the apiKey method. */
@Serializable
data class ApiKeyLoginParams(
    val type: String = "apiKey",
    val apiKey: String,
)

/** Params sent for chatgpt browser-OAuth method. */
@Serializable
data class ChatGptLoginParams(
    val type: String = "chatgpt",
    /** If true the server uses a streamlined OAuth flow that skips the consent page. */
    val codexStreamlinedLogin: Boolean = false,
)

/** Params sent for chatgptDeviceCode — headless / TV devices. */
@Serializable
data class ChatGptDeviceCodeLoginParams(
    val type: String = "chatgptDeviceCode",
)

/**
 * Params for chatgptAuthTokens — direct token injection (internal/testing use).
 * Both fields are required.
 */
@Serializable
data class ChatGptAuthTokensLoginParams(
    val type: String = "chatgptAuthTokens",
    val accessToken: String,
    val chatgptAccountId: String,
)

/** Shape of the account/login/completed notification params. */
@Serializable
data class LoginCompletedParams(
    /** The resolved API key, if the server exchanged tokens for one. */
    val apiKey: String? = null,
    /**
     * Present for chatgpt and chatgptDeviceCode after exchange.
     * The app should persist this for subsequent connections.
     */
    val accessToken: String? = null,
    val chatgptAccountId: String? = null,
    /** Human-readable display name for the authenticated account. */
    val accountName: String? = null,
)

/** Notification sent by the server during chatgptDeviceCode to show the user a URL + code. */
@Serializable
data class DeviceCodeParams(
    val verificationUrl: String,
    val userCode: String,
    /** Seconds until the code expires. */
    val expiresIn: Int = 300,
)
