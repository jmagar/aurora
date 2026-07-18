package tv.tootie.aurora.app.ui.chat

import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.assertEquals
import org.junit.Test

class ConnectionStateReducerTest {
    @Test fun `connecting never publishes readiness`() {
        val state = reduceConnection(ChatState(connected = true, error = "old"), ConnectionTransition.Connecting)
        assertFalse(state.connected)
        assertNull(state.error)
    }

    @Test fun `only ready publishes connected`() {
        assertTrue(reduceConnection(ChatState(), ConnectionTransition.Ready).connected)
    }

    @Test fun `failure clears connected and thinking`() {
        val state = reduceConnection(ChatState(connected = true, thinking = true), ConnectionTransition.Failed("timeout"))
        assertFalse(state.connected)
        assertFalse(state.thinking)
        assertEquals("timeout", state.error)
    }

}
