package tv.tootie.aurora.app.ui.chat

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.advanceTimeBy
import kotlinx.coroutines.test.runCurrent
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Timing tests for the streaming-flush scheduler (P0-2 / GAP-1 follow-up). These cover the two
 * properties the perf fix trades off — the 50ms coalesce window and the sub-window completion
 * flush — that the StreamCoalescer (pure state) tests can't reach. Uses virtual time via runTest
 * so there is no real delay and no Robolectric/Application dependency.
 */
@OptIn(ExperimentalCoroutinesApi::class)
class StreamFlushSchedulerTest {

    @Test
    fun `a burst of schedules within one window flushes exactly once`() = runTest {
        var flushes = 0
        val scheduler = StreamFlushScheduler(this, 50L) { flushes++ }

        // Simulate a burst of streamed deltas arriving inside one window.
        repeat(10) { scheduler.schedule() }

        advanceTimeBy(49)
        runCurrent()
        assertEquals("flush must not fire before the window elapses", 0, flushes)

        advanceTimeBy(1)
        runCurrent()
        assertEquals("the whole burst collapses to a single flush", 1, flushes)
    }

    @Test
    fun `flushNow before the window flushes immediately and cancels the pending flush`() = runTest {
        var flushes = 0
        val scheduler = StreamFlushScheduler(this, 50L) { flushes++ }

        scheduler.schedule()
        advanceTimeBy(10) // still inside the 50ms window — pending flush has not fired
        runCurrent()
        assertEquals(0, flushes)

        // Completion event lands mid-window: must flush the tail right away.
        scheduler.flushNow()
        assertEquals("completion flushes synchronously", 1, flushes)

        // The previously-scheduled flush must have been cancelled — no double-emit.
        advanceTimeBy(100)
        runCurrent()
        assertEquals("no second flush from the cancelled pending job", 1, flushes)
    }

    @Test
    fun `cancel drops a pending flush without flushing`() = runTest {
        var flushes = 0
        val scheduler = StreamFlushScheduler(this, 50L) { flushes++ }

        scheduler.schedule()
        scheduler.cancel()
        advanceTimeBy(100)
        runCurrent()
        assertEquals("cancel must not flush", 0, flushes)
    }
}
