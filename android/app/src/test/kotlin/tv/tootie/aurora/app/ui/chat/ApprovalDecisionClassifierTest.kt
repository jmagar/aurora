package tv.tootie.aurora.app.ui.chat

import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import tv.tootie.aurora.app.codex.CodexEvent
import tv.tootie.aurora.app.codex.RpcMessage

class ApprovalDecisionClassifierTest {
    @Test fun shuffledFourChoiceListPreservesAllKnownChoicesAndRejectsFirst() {
        val result = classifyApprovalDecisions(listOf("acceptForSession", "decline", "accept", "cancel"))
        assertEquals(4, result.size)
        assertEquals(listOf("decline", "cancel"), result.take(2).map { it.wireValue })
        assertTrue(result.first().semantics == ApprovalDecisionSemantics.Reject)
    }

    @Test fun permissiveOnlyListGetsSyntheticFailClosedChoice() {
        val result = classifyApprovalDecisions(listOf("accept", "allowForSession"))
        assertTrue(result.any { it.wireValue == "decline" && it.synthetic })
    }

    @Test fun unknownAndEmptyListsNeverBecomePermissive() {
        for (input in listOf(emptyList(), listOf("launchMissiles", "maybe"))) {
            val result = classifyApprovalDecisions(input)
            assertEquals(1, result.size)
            assertEquals(ApprovalDecisionSemantics.Reject, result.single().semantics)
            assertFalse(result.any { it.semantics == ApprovalDecisionSemantics.Allow })
        }
    }

    @Test fun elicitationFailsClosedWithCancel() {
        assertEquals("cancel", classifyApprovalDecisions(emptyList(), elicitation = true).single().wireValue)
    }

    @Test fun decoderProducesTypedApprovalWithAdversarialOrdering() {
        val event = CodexEvent.TurnEvent(
            RpcMessage(
                id = JsonPrimitive("req-7"),
                method = "item/commandExecution/requestApproval",
                params = JsonObject(mapOf(
                    "command" to JsonPrimitive("rm -rf /tmp/example"),
                    "availableDecisions" to JsonArray(listOf(
                        JsonPrimitive("acceptForSession"), JsonPrimitive("accept"), JsonPrimitive("decline"),
                    )),
                )),
            ),
        )
        val decoded = ChatProtocolDecoder.decode(event) as DecodedChatProtocolEvent.Approval
        val approval = (decoded.event as ApprovalEvent.Requested).approval
        assertEquals(listOf("acceptForSession", "accept", "decline"), approval.availableDecisions)
        assertEquals(JsonPrimitive("req-7"), approval.rawServerId)
    }
}
