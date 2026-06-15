package tv.tootie.aurora.app.ui.chat

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Security-control test for [sanitizeForDisplay] (P1-3).
 *
 * sanitizeForDisplay strips terminal escape sequences (CSI/OSC/DCS/APC/Fe), C0/C1
 * control chars, Bidi override codepoints, and zero-width/BOM characters from
 * server-supplied strings before they reach UI state, while preserving tab, newline,
 * and carriage return.
 *
 * All control / invisible characters are built from code points via [cp] so the
 * source file stays pure ASCII -- no raw 0x1B (ESC), bidi, or zero-width bytes.
 */
class SanitizeForDisplayTest {

    /** Build a one-char String from a Unicode code point (keeps source ASCII-only). */
    private fun cp(code: Int): String = code.toChar().toString()

    private val esc = cp(0x1B)   // ESC
    private val bel = cp(0x07)   // BEL

    @Test
    fun `strips CSI color sequence`() {
        // Red foreground SGR then reset around "hi".
        val input = "${esc}[31mhi${esc}[0m"
        assertEquals("hi", input.sanitizeForDisplay())
    }

    @Test
    fun `strips CSI cursor and erase sequences`() {
        val input = "a${esc}[2J${esc}[1;1Hb"
        assertEquals("ab", input.sanitizeForDisplay())
    }

    @Test
    fun `strips OSC title-injection sequence ST terminated with surrounding text`() {
        // OSC 0 = set window/tab title, a classic terminal title-injection vector.
        // ST-terminated (ESC backslash) so the run is bounded and trailing text survives.
        val input = "before${esc}]0;malicious-title${bel}${esc}\\after"
        assertEquals("beforeafter", input.sanitizeForDisplay())
    }

    @Test
    fun `strips OSC sequence ST terminated`() {
        // String Terminator form: ESC backslash. The ESC] run is consumed up to the
        // ESC of the ST; the trailing backslash is then removed with the ST itself.
        val input = "x${esc}]0;evil${esc}\\y"
        assertEquals("xy", input.sanitizeForDisplay())
    }

    @Test
    fun `removes Bidi override codepoints`() {
        // U+202E RIGHT-TO-LEFT OVERRIDE, the classic filename-spoof char.
        val rlo = cp(0x202E)
        val input = "file${rlo}gnp.exe"
        val out = input.sanitizeForDisplay()
        assertFalse(out.contains(rlo))
        assertEquals("filegnp.exe", out)
        // LRO (U+202D), LRI (U+2066), RLM (U+200F) also stripped.
        assertEquals("ab", "a${cp(0x202D)}b${cp(0x2066)}".sanitizeForDisplay())
        assertEquals("cd", "c${cp(0x200F)}d".sanitizeForDisplay())
    }

    @Test
    fun `strips zero-width and BOM characters`() {
        // ZWSP(200B) ZWNJ(200C) ZWJ(200D) BOM/ZWNBSP(FEFF) -- the U+200B..U+200D
        // range plus U+FEFF that the implementation strips.
        val input = "a${cp(0x200B)}b${cp(0x200C)}c${cp(0x200D)}d${cp(0xFEFF)}e"
        assertEquals("abcde", input.sanitizeForDisplay())
    }

    @Test
    fun `preserves tab newline and carriage return`() {
        val input = "col1\tcol2\nline2\r\nline3"
        assertEquals(input, input.sanitizeForDisplay())
    }

    @Test
    fun `strips C1 controls and stray ESC`() {
        // C1 control U+0085 (NEL) and a lone ESC byte are both removed.
        val input = "ab${cp(0x85)}${esc}c"
        assertEquals("abc", input.sanitizeForDisplay())
    }

    @Test
    fun `strips C0 controls except whitespace`() {
        // NUL(00) BEL(07) VT(0B) FF(0C) are control chars; tab/newline/CR are kept.
        val input = "a${cp(0x00)}b${cp(0x07)}c${cp(0x0B)}d${cp(0x0C)}e\tf\ng\rh"
        assertEquals("abcde\tf\ng\rh", input.sanitizeForDisplay())
    }

    @Test
    fun `passes through empty and plain strings unchanged`() {
        assertEquals("", "".sanitizeForDisplay())
        assertEquals("hello world", "hello world".sanitizeForDisplay())
        val plain = "ls -la /home/user && echo done"
        assertEquals(plain, plain.sanitizeForDisplay())
    }

    @Test
    fun `strips 2-byte Fe escape sequence`() {
        // ESC followed by a single 0x40-0x5F byte (e.g. ESC D = Index).
        val input = "x${esc}Dy"
        val out = input.sanitizeForDisplay()
        assertFalse(out.contains(esc))
        assertTrue(out.startsWith("x") && out.endsWith("y"))
    }
}
