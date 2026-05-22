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
