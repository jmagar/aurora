package tv.tootie.aurora.app.ui.chat

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Unit tests for [StreamCoalescer] (GAP-1).
 *
 * StreamCoalescer is the pure buffer/dirty state machine extracted from ChatViewModel.
 * These tests pin down the coalesce + flush guarantees with NO coroutines / virtual time:
 *  - multiple deltas accumulate into one flushed result,
 *  - flush returns the buffered tail even with no intervening timer tick,
 *  - reset() clears buffers so a stale flush after reset emits nothing,
 *  - a delta for a NEW agent message id seeds correctly from prior content (no tail loss/dup),
 *  - reasoning last-line replacement commits the prior line before reset.
 *
 * The timing (delay/flushJob) lives in the ViewModel and is intentionally not tested here.
 */
class StreamCoalescerTest {

    private fun stateWithAssistant(id: String, content: String = ""): ChatState =
        ChatState(msgs = listOf(ChatMsg(id, MsgRole.Assistant, content)))

    @Test
    fun `two agent deltas accumulate into one flushed result`() {
        val c = StreamCoalescer()
        val state = stateWithAssistant("a1")
        c.appendAgentDelta("a1", "Hello", priorContent = "")
        c.appendAgentDelta("a1", " world", priorContent = "Hello")
        assertTrue(c.isDirty)
        val flushed = c.flush(state)
        assertEquals("Hello world", flushed.msgs.single().content)
    }

    @Test
    fun `flush returns the buffered tail with no intervening timer tick`() {
        val c = StreamCoalescer()
        val state = stateWithAssistant("a1")
        c.appendAgentDelta("a1", "tail", priorContent = "")
        // No scheduleFlush / delay -- flush directly still emits the buffered text.
        val flushed = c.flush(state)
        assertEquals("tail", flushed.msgs.single().content)
    }

    @Test
    fun `flush is idempotent when nothing is dirty`() {
        val c = StreamCoalescer()
        val state = stateWithAssistant("a1", "existing")
        assertFalse(c.isDirty)
        val flushed = c.flush(state)
        // Clean buffer returns the same state instance untouched (no double-emit).
        assertSame(state, flushed)
    }

    @Test
    fun `flush clears dirty so a second flush is a no-op`() {
        val c = StreamCoalescer()
        val state = stateWithAssistant("a1")
        c.appendAgentDelta("a1", "x", priorContent = "")
        val first = c.flush(state)
        assertEquals("x", first.msgs.single().content)
        assertFalse(c.isDirty)
        val second = c.flush(first)
        assertSame(first, second)
    }

    @Test
    fun `reset clears buffers so a stale flush after reset emits nothing`() {
        val c = StreamCoalescer()
        val state = stateWithAssistant("a1")
        c.appendAgentDelta("a1", "doomed", priorContent = "")
        assertTrue(c.isDirty)
        c.reset()
        assertFalse(c.isDirty)
        assertEquals(null, c.agentBufferId)
        val flushed = c.flush(state)
        assertSame(state, flushed)
    }

    @Test
    fun `delta for a new agent message id seeds from prior content without tail loss`() {
        val c = StreamCoalescer()
        // Buffer is active on a1 with some accumulated text, not yet flushed.
        c.appendAgentDelta("a1", "first-msg", priorContent = "")
        // Now a delta arrives for a different active id a2 whose bubble already shows "seed".
        // The coalescer must re-seed from a2's prior content, not carry a1's tail.
        c.appendAgentDelta("a2", "-more", priorContent = "seed")
        assertEquals("a2", c.agentBufferId)
        assertEquals("seed-more", c.agentText)
        val state = ChatState(
            msgs = listOf(
                ChatMsg("a1", MsgRole.Assistant, "first-msg"),
                ChatMsg("a2", MsgRole.Assistant, "seed"),
            ),
        )
        val flushed = c.flush(state)
        // a1 untouched, a2 carries seed + the new delta -- no loss, no dup of a1's text.
        assertEquals("first-msg", flushed.msgs[0].content)
        assertEquals("seed-more", flushed.msgs[1].content)
    }

    @Test
    fun `startAgentMessage seeds buffer without marking dirty`() {
        val c = StreamCoalescer()
        // Mirrors the VM new-bubble path: the bubble is emitted directly, buffer only
        // coalesces subsequent deltas, so an immediate flush must be a no-op.
        c.startAgentMessage("a1", "seed")
        assertEquals("a1", c.agentBufferId)
        assertFalse(c.isDirty)
        val state = stateWithAssistant("a1", "seed")
        assertSame(state, c.flush(state))
    }

    @Test
    fun `reasoning last-line replacement commits the prior line before reset`() {
        val c = StreamCoalescer()
        // First reasoning line streams in.
        c.startReasoning("step one")
        c.appendReasoning(" continued")
        var state = ChatState(reasoning = listOf("step one"))
        state = c.flush(state)
        assertEquals(listOf("step one continued"), state.reasoning)
        // A new summary part begins: the VM appends a blank line, then resets the buffer.
        c.resetReasoningLine()
        state = state.copy(reasoning = state.reasoning + "")
        // Next line streams into the now-empty buffer.
        c.appendReasoning("step two")
        state = c.flush(state)
        assertEquals(listOf("step one continued", "step two"), state.reasoning)
    }

    @Test
    fun `command dirty flush emits a fresh toolCalls reference`() {
        val c = StreamCoalescer()
        val tc = ToolCall("t1", "echo hi")
        val state = ChatState(toolCalls = listOf(tc))
        tc.out.append("output")
        c.markCommandDirty()
        assertTrue(c.isDirty)
        val flushed = c.flush(state)
        // Fresh list reference so Compose recomposes; same element identity preserved.
        assertEquals(listOf(tc), flushed.toolCalls)
        assertEquals("output", flushed.toolCalls.single().out.toString())
    }
}
