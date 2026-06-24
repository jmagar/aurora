package tv.tootie.aurora.app.ui.chat

import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.toImmutableList

/**
 * Pure state machine for the streaming-coalesce buffers.
 *
 * Extracted from ChatViewModel so the buffer/dirty bookkeeping can be unit-tested
 * with NO coroutines and NO virtual time. It owns:
 *  - the active agent-message buffer ([agentBufferId] + accumulated text),
 *  - the reasoning-summary line buffer (replaces the last reasoning entry on flush),
 *  - the command-output buffer (per active item id, accumulated as a String so
 *    ToolCall.out stays immutable and is only snapshotted into ChatState on flush),
 *  - the dirty flags (stream/reasoning/command) that gate what [flush] emits.
 *
 * The ViewModel keeps all timing/scheduling: viewModelScope, delay(STREAM_FLUSH_MS),
 * and the flushJob. The VM calls a mutator (append/start/appendCommandDelta) then
 * schedules a flush; on the debounce tick (or at completion) it calls [flush] and
 * pushes the result into _state.
 *
 * Behavior contract:
 *  - [flush] is idempotent: returns the input state untouched when nothing is dirty.
 *  - [flush] clears only the dirty flags it consumed; it does NOT clear the buffers
 *    themselves (the agent/reasoning buffers keep their seed so re-seeds are cheap).
 *  - ToolCall.out is NEVER mutated in place; [appendCommandDelta] accumulates into an
 *    internal StringBuilder and [flush] snapshots it via a single .toString() call.
 */
internal class StreamCoalescer {
    // ---------------------------------------------------------------------------
    // Agent message buffer
    // ---------------------------------------------------------------------------

    private val agentMessageBuffer = StringBuilder()
    var agentBufferId: String? = null
        private set

    // ---------------------------------------------------------------------------
    // Reasoning-summary line buffer
    // ---------------------------------------------------------------------------

    private val reasoningBuffer = StringBuilder()
    private var reasoningDirty = false

    // ---------------------------------------------------------------------------
    // Command output buffer (replaces mutable StringBuilder on ToolCall)
    // ---------------------------------------------------------------------------

    /** The item id whose output is currently being accumulated. */
    private var commandBufferId: String? = null
    private val commandOutputBuffer = StringBuilder()
    private var commandOutputDirty = false

    // ---------------------------------------------------------------------------
    // Top-level dirty flag
    // ---------------------------------------------------------------------------

    /** Set when any buffered text still needs to be flushed into ChatState. */
    private var streamDirty = false

    /**
     * True when any buffered text still needs to be flushed. Derived from all
     * sub-flags so the flush gate can't drift from them.
     */
    val isDirty: Boolean get() = streamDirty || reasoningDirty || commandOutputDirty

    /** Current agent-message buffer contents (test/inspection helper). */
    val agentText: String get() = agentMessageBuffer.toString()

    // ---------------------------------------------------------------------------
    // Agent message mutators
    // ---------------------------------------------------------------------------

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
     * first delta). Does NOT mark dirty — the VM emits the new bubble immediately and the
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

    // ---------------------------------------------------------------------------
    // Reasoning summary mutators
    // ---------------------------------------------------------------------------

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

    // ---------------------------------------------------------------------------
    // Command output mutators
    // ---------------------------------------------------------------------------

    /**
     * Append [delta] to the command output buffer for [itemId].
     *
     * If [itemId] differs from the currently buffered item, the prior buffer is
     * discarded (its content was already flushed or will be overwritten by the new
     * item). [currentToolCalls] is consulted to seed the buffer from the existing
     * [ToolCall.out] value so a mid-stream item switch never loses prior output.
     *
     * This replaces the old mutable [StringBuilder] in [ToolCall.out]: the buffer
     * lives here and is snapshotted into an immutable [String] only on [flush].
     */
    fun appendCommandDelta(
        itemId: String,
        delta: String,
        currentToolCalls: ImmutableList<ToolCall>,
    ) {
        if (commandBufferId != itemId) {
            commandOutputBuffer.setLength(0)
            // Seed from whatever is already in state so a late item switch doesn't lose output.
            val existing = currentToolCalls.find { it.id == itemId }?.out ?: ""
            commandOutputBuffer.append(existing)
            commandBufferId = itemId
        }
        commandOutputBuffer.append(delta)
        commandOutputDirty = true
        streamDirty = true
    }

    // ---------------------------------------------------------------------------
    // Reset
    // ---------------------------------------------------------------------------

    /** Reset every buffer + dirty flag. The VM cancels the flushJob separately. */
    fun reset() {
        agentMessageBuffer.setLength(0)
        agentBufferId = null
        reasoningBuffer.setLength(0)
        reasoningDirty = false
        commandOutputBuffer.setLength(0)
        commandBufferId = null
        commandOutputDirty = false
        streamDirty = false
    }

    // ---------------------------------------------------------------------------
    // Flush
    // ---------------------------------------------------------------------------

    /**
     * Fold all buffered streaming text into [state] and return the new state.
     *
     * Idempotent: returns [state] unchanged when nothing is dirty. Clears the dirty
     * flags it consumes. Snapshots:
     *  - agent message text into the matching [ChatMsg.content],
     *  - reasoning line into the last entry of [ChatState.reasoning],
     *  - command output into the matching [ToolCall.out] (String, never StringBuilder).
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
        val cmdId = commandBufferId
        val cmdText = commandOutputBuffer.toString()

        var next = state

        if (emitAgent && aid != null) {
            next = next.copy(
                msgs = next.msgs.map {
                    if (it.id == aid) it.copy(content = agentTextSnapshot) else it
                }.toImmutableList()
            )
        }

        if (emitReasoning && next.reasoning.isNotEmpty()) {
            val lines = next.reasoning.toMutableList()
            lines[lines.lastIndex] = reasoningText
            next = next.copy(reasoning = lines.toImmutableList())
        }

        if (emitCommand && cmdId != null) {
            // Snapshot the accumulated String into ToolCall.out — no mutable field,
            // no identity trick; Compose sees a genuinely new value and recomposes.
            next = next.copy(
                toolCalls = next.toolCalls.map { tc ->
                    if (tc.id == cmdId) tc.copy(out = cmdText) else tc
                }.toImmutableList()
            )
        }

        return next
    }
}
