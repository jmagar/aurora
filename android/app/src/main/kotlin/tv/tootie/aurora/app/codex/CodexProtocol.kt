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

/** Auth state inferred from locally stored credentials during startup. */
sealed class AuthStatus {
    /** Server is authenticated via a static API key configured in the server config. */
    object ApiKey : AuthStatus()

    /** Server is authenticated via a cached ChatGPT OAuth token. */
    object ChatGpt : AuthStatus()

    /** Server has no auth — user must run account/login/start. */
    object Unauthenticated : AuthStatus()
}

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

/**
 * Params for the legacy `execCommandApproval` server request.
 *
 * Sent by older codex-app-server versions instead of `item/commandExecution/requestApproval`.
 * The client responds with allow/deny keyed to the same request id.
 */
@Serializable
data class ExecCommandApprovalParams(
    val command: String,
    val workingDirectory: String? = null,
    val sandboxPolicy: String? = null,
    val reason: String? = null,
    val availableDecisions: List<String>? = null,
)

/**
 * Params for the legacy `applyPatchApproval` server request.
 *
 * Sent by older codex-app-server versions for file-patch approval.
 * [fileChanges] maps absolute file paths to their before/after content.
 * Correlates with patchApplyBeginEvent/patchApplyEndEvent notifications.
 */
@Serializable
data class ApplyPatchApprovalParams(
    val callId: String? = null,
    val conversationId: String? = null,
    /** Map of absolute path → `{ "before": String?, "after": String? }`. */
    val fileChanges: JsonObject? = null,
    val grantRoot: Boolean? = null,
    val reason: String? = null,
)

/**
 * Additional filesystem/network permissions the agent is requesting beyond its sandbox policy.
 *
 * Received in `item/permissions/requestApproval` params under the `permissionProfile` key.
 * All fields are optional — absence means no change to that dimension.
 */
@Serializable
data class AdditionalPermissionProfile(
    /** Absolute paths the agent wants read access to. */
    val readPaths: List<String>? = null,
    /** Absolute paths the agent wants write access to. */
    val writePaths: List<String>? = null,
    /** Whether the agent is requesting network access. */
    val networkEnabled: Boolean? = null,
)

/**
 * Params received in an `account/chatgptAuthTokens/refresh` server request.
 *
 * The server sends this when it receives a 401 upstream while the client session
 * is authenticated via chatgptAuthTokens. The client must respond with fresh tokens
 * using [ChatGptAuthTokensRefreshResult] keyed to the same request id.
 */
@Serializable
data class ChatGptAuthTokensRefreshParams(
    /** The account id that triggered the 401. Used to confirm we're refreshing the right account. */
    val previousAccountId: String? = null,
    /** Reason code from the server (e.g. "tokenExpired"). Informational; may be null. */
    val reason: String? = null,
)

/**
 * Result sent back to the server in response to `account/chatgptAuthTokens/refresh`.
 * Both fields are required — the server uses them to resume the upstream request.
 */
@Serializable
data class ChatGptAuthTokensRefreshResult(
    val accessToken: String,
    val chatgptAccountId: String,
)
