package tv.tootie.aurora.app.ui.chat

import kotlinx.collections.immutable.persistentListOf
import kotlinx.collections.immutable.toImmutableList
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import tv.tootie.aurora.app.codex.CodexEvent

internal sealed interface DecodedChatProtocolEvent {
    data class Approval(val event: ApprovalEvent) : DecodedChatProtocolEvent
    data class Domain(val domain: ChatProtocolDomain) : DecodedChatProtocolEvent
}

internal enum class ChatProtocolDomain { Conversation, Tool, Account, Session, Unknown }

/** Pure protocol decoder. UI orchestration receives typed domain events only. */
internal object ChatProtocolDecoder {
    fun decode(event: CodexEvent.TurnEvent): DecodedChatProtocolEvent {
        decodeApproval(event)?.let { return DecodedChatProtocolEvent.Approval(it) }
        val method = event.msg.method.orEmpty()
        val domain = when {
            method.startsWith("turn/") || method.startsWith("item/agent") || method.startsWith("item/user") -> ChatProtocolDomain.Conversation
            method.startsWith("item/") || method.startsWith("hook/") || method.startsWith("command/") -> ChatProtocolDomain.Tool
            method.startsWith("account/") -> ChatProtocolDomain.Account
            method.startsWith("thread/") || method.startsWith("session/") -> ChatProtocolDomain.Session
            else -> ChatProtocolDomain.Unknown
        }
        return DecodedChatProtocolEvent.Domain(domain)
    }

    private fun decodeApproval(event: CodexEvent.TurnEvent): ApprovalEvent? {
        val msg = event.msg
        val params = msg.params?.jsonObject
        if (msg.method == "serverRequest/resolved") {
            val resolvedId = params?.get("id")
            return if (resolvedId == null) ApprovalEvent.ResolvedAll
            else ApprovalEvent.Resolved(normalizeServerId(resolvedId))
        }
        val rawId = msg.id?.let(::normalizeServerId) ?: return null
        val decisions = params?.get("availableDecisions")?.jsonArray
            ?.mapNotNull { it.jsonPrimitive.contentOrNull }
            ?.toImmutableList()
        val approval = when (msg.method) {
            "item/commandExecution/requestApproval", "execCommandApproval" -> {
                val command = params?.get("command")?.jsonPrimitive?.contentOrNull
                    ?.sanitizeForDisplay().orEmpty()
                val reason = commandReason(msg.method.orEmpty(), params)
                ToolApproval.Command(
                    itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull.orEmpty(),
                    rawServerId = rawId,
                    availableDecisions = decisions ?: persistentListOf("accept", "decline"),
                    command = command,
                    reason = reason,
                )
            }
            "item/fileChange/requestApproval", "applyPatchApproval" -> ToolApproval.FileChange(
                itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull
                    ?: params?.get("callId")?.jsonPrimitive?.contentOrNull.orEmpty(),
                rawServerId = rawId,
                availableDecisions = decisions ?: persistentListOf("accept", "decline"),
                reason = fileChangeReason(msg.method.orEmpty(), params),
            )
            "item/permissions/requestApproval" -> ToolApproval.Permissions(
                itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull.orEmpty(),
                rawServerId = rawId,
                availableDecisions = decisions ?: persistentListOf("accept", "decline"),
                reason = permissionReason(params),
            )
            "mcpServer/elicitation/request", "item/tool/requestUserInput" -> {
                val toolName = params?.get("toolName")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                val message = params?.get("message")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
                    ?: "A tool needs additional information to continue."
                ToolApproval.Elicitation(
                    itemId = params?.get("itemId")?.jsonPrimitive?.contentOrNull.orEmpty(),
                    rawServerId = rawId,
                    availableDecisions = decisions ?: persistentListOf("accept", "cancel"),
                    reason = if (toolName == null) message else "Tool: $toolName\n\n$message",
                )
            }
            else -> return null
        }
        return ApprovalEvent.Requested(approval)
    }

    private fun commandReason(method: String, params: JsonObject?): String? {
        if (method != "execCommandApproval") {
            return params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
        }
        return listOfNotNull(
            params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay(),
            params?.get("workingDirectory")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()?.let { "Working directory: $it" },
            params?.get("sandboxPolicy")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()?.let { "Sandbox policy: $it" },
        ).joinToString("\n").ifBlank { null }
    }

    private fun fileChangeReason(method: String, params: JsonObject?): String? {
        if (method != "applyPatchApproval") {
            return params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()
        }
        val paths = params?.get("fileChanges")?.jsonObject?.keys?.map { it.sanitizeForDisplay() }?.sorted().orEmpty()
        val grantRoot = params?.get("grantRoot")?.jsonPrimitive?.contentOrNull?.toBooleanStrictOrNull()
        return listOfNotNull(
            params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay(),
            paths.takeIf { it.isNotEmpty() }?.let { "Files: ${it.joinToString(", ")}" },
            if (grantRoot == true) "Requires root access" else null,
        ).joinToString("\n").ifBlank { null }
    }

    private fun permissionReason(params: JsonObject?): String? {
        val profile = params?.get("permissionProfile")?.jsonObject
        val reads = profile?.get("readPaths")?.jsonArray?.mapNotNull { it.jsonPrimitive.contentOrNull?.sanitizeForDisplay() }.orEmpty()
        val writes = profile?.get("writePaths")?.jsonArray?.mapNotNull { it.jsonPrimitive.contentOrNull?.sanitizeForDisplay() }.orEmpty()
        val network = profile?.get("networkEnabled")?.jsonPrimitive?.contentOrNull?.toBooleanStrictOrNull()
        return buildList {
            params?.get("reason")?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay()?.let(::add)
            if (reads.isNotEmpty()) add("Read: ${reads.joinToString(", ")}")
            if (writes.isNotEmpty()) add("Write: ${writes.joinToString(", ")}")
            if (network == true) add("Network access")
        }.joinToString("\n\n").ifBlank { null }
    }
}
