package tv.tootie.aurora.app.ui.chat

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Owns the streaming-flush timing extracted from ChatViewModel (P0-2 / GAP-1 follow-up).
 *
 * The coalesce window and the cancel/flush ordering are the historically fragile bits, so
 * they live here behind a tiny seam that is unit-testable with a TestScope + virtual time
 * (no Application, no Robolectric). The pure buffer state lives in [StreamCoalescer]; this
 * class only schedules when [onFlush] runs.
 *
 * Contract:
 *  - [schedule] coalesces: the first call arms a single flush [flushMs] out; further calls
 *    while that flush is still pending are no-ops (a burst of N deltas → one flush).
 *  - [flushNow] is the completion path: cancel any pending flush and flush immediately, so a
 *    completion event that lands inside the window never strands the buffered tail.
 *  - [cancel] is the teardown path: cancel any pending flush WITHOUT flushing (the caller is
 *    about to reset/clear the buffers).
 *
 * [onFlush] is expected to be idempotent (it is — [StreamCoalescer.flush] is gated on dirty),
 * so a redundant flush is harmless.
 */
internal class StreamFlushScheduler(
    private val scope: CoroutineScope,
    private val flushMs: Long,
    private val onFlush: () -> Unit,
) {
    private var job: Job? = null

    fun schedule() {
        if (job?.isActive == true) return
        job = scope.launch {
            delay(flushMs)
            onFlush()
        }
    }

    fun flushNow() {
        job?.cancel()
        job = null
        onFlush()
    }

    fun cancel() {
        job?.cancel()
        job = null
    }
}
