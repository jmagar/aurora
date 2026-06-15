package tv.tootie.aurora.app.ui.chat

/**
 * Pure state machine for the streaming-coalesce buffers (P0-2 / GAP-1).
 *
 * Extracted from ChatViewModel so the buffer/dirty bookkeeping can be unit-tested
 * with NO coroutines and NO virtual time. It owns:
 *  - the active agent-message buffer ([agentBufferId] + accumulated text),
 *  - the reasoning-summary line buffer (replaces the last reasoning entry on flush),
 *  - the command-output dirty flag (ToolCall.out is mutated in place; flush only needs
 *    to emit a fresh list reference so Compose recomposes),
 *  - the dirty flags (stream/reasoning/command) that gate what [flush] emits.
 *
 * The ViewModel keeps all timing/scheduling: viewModelScope, delay(STREAM_FLUSH_MS),
 * and the flushJob. The VM calls a mutator (append/start/markCommandDirty) then
 * schedules a flush; on the debounce tick (or at completion) it calls [flush] and
 * pushes the result into _state.
 *
 * Behavior is identical to the inline version: [flush] is idempotent (returns the
 * input state untouched when nothing is dirty) and folds at most one of each buffer
 * into the supplied state.
 */
internal class StreamCoalescer {
    // visible streaming agent-message text + the message id it belongs to
    private val agentMessageBuffer = StringBuilder()
    var agentBufferId: String? = null
        private set

    // the reasoning-summary line currently being streamed; on flush its contents
    // replace the last entry of ChatState.reasoning
    private val reasoningBuffer = StringBuilder()
    private var reasoningDirty = false

    // set when buffered streaming text has not yet been snapshotted into ChatState
    private var streamDirty = false
    // set when a ToolCall.out StringBuilder was mutated in place and the list needs a
    // fresh reference emitted so Compose recomposes (StringBuilder identity is equal)
    private var commandOutputDirty = false

    /** True when buffered text still needs to be flushed into ChatState. */
    val isDirty: Boolean get() = streamDirty

    /** Current agent-message buffer contents (test/inspection helper). */
    val agentText: String get() = agentMessageBuffer.toString()

    /**
     * Append a delta to the active agent message [id]. If the buffer currently holds a
     * different (prior) message, it is re-seeded from [priorContent] first so no tail is
     * lost or duplicated when the active message id changes.
     */
    fun appendAgentDelta(id: String, delta: String, priorContent: String) {
        if (agentBufferId != id) {
            agentMessageBuffer.setLength(0)
            agentMessageBuffer.append(priorContent)
            agentBufferId = id
        }
        agentMessageBuffer.append(delta)
        streamDirty = true
    }

    /**
     * Seed the buffer for a brand-new agent message [id] with [seed] (the just-emitted
     * first delta). Does NOT mark dirty -- the VM emits the new bubble immediately and the
     * buffer only coalesces subsequent deltas.
     */
    fun startAgentMessage(id: String, seed: String) {
        agentMessageBuffer.setLength(0)
        agentMessageBuffer.append(seed)
        agentBufferId = id
    }

    /** Clear the active agent-message id (e.g. after item/agentMessage completed). */
    fun clearAgentBuffer() {
        agentBufferId = null
    }

    /**
     * Seed the reasoning buffer with the first streamed [delta] (a new reasoning line was
     * just emitted into state by the VM). Marks the stream dirty for coalescing.
     */
    fun startReasoning(delta: String) {
        reasoningBuffer.setLength(0)
        reasoningBuffer.append(delta)
        reasoningDirty = true
        streamDirty = true
    }

    /** Append a streamed delta to the current reasoning line. */
    fun appendReasoning(delta: String) {
        reasoningBuffer.append(delta)
        reasoningDirty = true
        streamDirty = true
    }

    /**
     * A new reasoning summary part begins. The prior line's buffered tail must already
     * have been committed via [flush]; this resets the buffer for the next line.
     */
    fun resetReasoningLine() {
        reasoningBuffer.setLength(0)
    }

    /** Mark that a ToolCall.out StringBuilder was mutated in place. */
    fun markCommandDirty() {
        commandOutputDirty = true
        streamDirty = true
    }

    /** Reset every buffer + dirty flag. The VM cancels the flushJob separately. */
    fun reset() {
        agentMessageBuffer.setLength(0)
        agentBufferId = null
        reasoningBuffer.setLength(0)
        reasoningDirty = false
        commandOutputDirty = false
        streamDirty = false
    }

    /**
     * Fold all buffered streaming text into [state] and return the new state. Idempotent:
     * returns [state] unchanged when nothing is dirty. Clears the dirty flags it consumes.
     */
    fun flush(state: ChatState): ChatState {
        if (!streamDirty) return state
        val emitAgent = agentBufferId != null
        val emitReasoning = reasoningDirty
        val emitCommand = commandOutputDirty
        streamDirty = false
        reasoningDirty = false
        commandOutputDirty = false
        val aid = agentBufferId
        val agentTextSnapshot = agentMessageBuffer.toString()
        val reasoningText = reasoningBuffer.toString()
        var next = state
        if (emitAgent && aid != null) {
            next = next.copy(msgs = next.msgs.map { if (it.id == aid) it.copy(content = agentTextSnapshot) else it })
        }
        if (emitReasoning && next.reasoning.isNotEmpty()) {
            val lines = next.reasoning.toMutableList()
            lines[lines.lastIndex] = reasoningText
            next = next.copy(reasoning = lines)
        }
        if (emitCommand) {
            // ToolCall.out is mutated in place; emit a fresh list reference so the
            // streamed command output recomposes in the UI.
            next = next.copy(toolCalls = next.toolCalls.toList())
        }
        return next
    }
}
