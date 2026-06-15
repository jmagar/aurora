package tv.tootie.aurora.app.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

/**
 * JVM unit tests for the lenient-decrypt pre-validation (P1-2 follow-up). These cover the
 * branches that classify a stored value as "absent" BEFORE any AndroidKeyStore touch — the
 * legacy-plaintext / corrupt-entry migration path — without needing Robolectric. The Android
 * Base64 stub is dodged by injecting a java.util.Base64-backed decoder, matching the same
 * IV ‖ ciphertext layout production uses.
 */
class SecretEnvelopeTest {
    private val dec: (String) -> ByteArray = { java.util.Base64.getDecoder().decode(it) }
    private fun b64(bytes: ByteArray): String = java.util.Base64.getEncoder().encodeToString(bytes)

    @Test
    fun `null and empty inputs are absent`() {
        assertNull(parseSecretEnvelope(null, dec))
        assertNull(parseSecretEnvelope("", dec))
    }

    @Test
    fun `non-base64 input is absent, not a throw`() {
        // A legacy plaintext token written before encryption was added decodes as garbage.
        assertNull(parseSecretEnvelope("!!! not base64 !!!", dec))
    }

    @Test
    fun `envelope no longer than the IV is absent (boundary)`() {
        // Exactly IV_LENGTH bytes => no ciphertext => treated as absent (the <= boundary).
        assertNull(parseSecretEnvelope(b64(ByteArray(SECRET_IV_LENGTH)), dec))
        // One byte short of a full IV is also absent.
        assertNull(parseSecretEnvelope(b64(ByteArray(SECRET_IV_LENGTH - 1)), dec))
    }

    @Test
    fun `valid-length envelope splits IV from ciphertext`() {
        val raw = ByteArray(SECRET_IV_LENGTH + 16) { it.toByte() }
        val (iv, ciphertext) = parseSecretEnvelope(b64(raw), dec)!!
        assertEquals(SECRET_IV_LENGTH, iv.size)
        assertEquals(16, ciphertext.size)
        // IV is the leading SECRET_IV_LENGTH bytes; ciphertext is the remainder.
        assertEquals(0.toByte(), iv[0])
        assertEquals(SECRET_IV_LENGTH.toByte(), ciphertext[0])
    }
}
