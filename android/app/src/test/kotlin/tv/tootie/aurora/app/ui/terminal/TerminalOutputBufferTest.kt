package tv.tootie.aurora.app.ui.terminal

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TerminalOutputBufferTest {
    @Test fun `output is retained in order below limit`() {
        assertEquals("abcdef", appendBoundedTerminalOutput("abc", "def"))
    }

    @Test fun `large streams retain only newest bounded suffix`() {
        var output = ""
        repeat(10_000) { output = appendBoundedTerminalOutput(output, "$it,") }
        assertTrue(output.length <= MAX_TERMINAL_OUTPUT_CHARS)
        assertTrue(output.endsWith("9999,"))
    }

    @Test fun `single oversized delta is bounded`() {
        val delta = "x".repeat(MAX_TERMINAL_OUTPUT_CHARS + 100)
        assertEquals(MAX_TERMINAL_OUTPUT_CHARS, appendBoundedTerminalOutput("old", delta).length)
    }
}
