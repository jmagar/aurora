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
