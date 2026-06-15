package tv.tootie.aurora.app.ui.chat

import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonPrimitive
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Unit tests for [reduceApprovals] (P1-6).
 *
 * The reducer is the pure core of the human-in-the-loop approval flow. These tests
 * pin down the correlation guarantees:
 *  - approve/resolve targets the right entry by rawServerId identity, never by position
 *  - serverRequest/resolved without an id clears ALL pending approvals
 *  - a request with a missing (default) id is handled without crashing
 */
class ApprovalReducerTest {

    private fun approval(serverId: JsonElement, itemId: String, type: String = "command") =
        ToolApproval(itemId = itemId, rawServerId = serverId, type = type, command = "echo $itemId")

    private val idA: JsonElement = JsonPrimitive("req-A")
    private val idB: JsonElement = JsonPrimitive("req-B")
    private val idC: JsonElement = JsonPrimitive(42) // numeric server id

    @Test
    fun `requested appends to the pending list preserving order`() {
        val a = approval(idA, "item-A")
        val b = approval(idB, "item-B")
        var state = reduceApprovals(emptyList(), ApprovalEvent.Requested(a))
        state = reduceApprovals(state, ApprovalEvent.Requested(b))
        assertEquals(listOf(a, b), state)
    }

    @Test
    fun `approved removes only the matching rawServerId not the first`() {
        // Two pending; approve the SECOND by id. firstOrNull() would wrongly drop the
        // first -- the reducer must target by identity.
        val a = approval(idA, "item-A")
        val b = approval(idB, "item-B")
        val pending = listOf(a, b)
        val after = reduceApprovals(pending, ApprovalEvent.Approved(idB))
        assertEquals(listOf(a), after)
    }

    @Test
    fun `approved by first id leaves the rest intact`() {
        val a = approval(idA, "item-A")
        val b = approval(idB, "item-B")
        val after = reduceApprovals(listOf(a, b), ApprovalEvent.Approved(idA))
        assertEquals(listOf(b), after)
    }

    @Test
    fun `approved with a numeric server id correlates correctly`() {
        val a = approval(idA, "item-A")
        val c = approval(idC, "item-C")
        val after = reduceApprovals(listOf(a, c), ApprovalEvent.Approved(idC))
        assertEquals(listOf(a), after)
    }

    @Test
    fun `resolved with id removes only that approval`() {
        val a = approval(idA, "item-A")
        val b = approval(idB, "item-B")
        val after = reduceApprovals(listOf(a, b), ApprovalEvent.Resolved(idA))
        assertEquals(listOf(b), after)
    }

    @Test
    fun `resolvedAll clears all pending approvals`() {
        val a = approval(idA, "item-A")
        val b = approval(idB, "item-B")
        val after = reduceApprovals(listOf(a, b), ApprovalEvent.ResolvedAll)
        assertTrue(after.isEmpty())
    }

    @Test
    fun `resolved with unknown id is a no-op`() {
        val a = approval(idA, "item-A")
        val after = reduceApprovals(listOf(a), ApprovalEvent.Resolved(JsonPrimitive("does-not-exist")))
        assertEquals(listOf(a), after)
    }

    @Test
    fun `request with default empty itemId does not crash and is retained`() {
        // Mirrors the requestApproval branch where itemId may be absent ("").
        val missing = ToolApproval(itemId = "", rawServerId = idA, type = "fileChange")
        val after = reduceApprovals(emptyList(), ApprovalEvent.Requested(missing))
        assertEquals(listOf(missing), after)
    }

    @Test
    fun `duplicate rawServerId approve removes all entries sharing that id`() {
        // Defensive: identity filter drops every entry with the matching id.
        val a1 = approval(idA, "item-A1")
        val a2 = approval(idA, "item-A2")
        val b = approval(idB, "item-B")
        val after = reduceApprovals(listOf(a1, a2, b), ApprovalEvent.Approved(idA))
        assertEquals(listOf(b), after)
    }
}
