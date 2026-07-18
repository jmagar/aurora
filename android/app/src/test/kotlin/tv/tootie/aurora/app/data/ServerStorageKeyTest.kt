package tv.tootie.aurora.app.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test

class ServerStorageKeyTest {
    @Test fun `canonical key is stable SHA-256`() {
        val key = Keys.serverKey("wss://example.com/rpc")
        assertEquals(64, key.length)
        assertEquals(key, Keys.serverKey(" wss://example.com/rpc "))
    }

    @Test fun `known Java hash collision does not collide`() {
        assertEquals("Aa".hashCode(), "BB".hashCode())
        assertNotEquals(Keys.serverKey("Aa"), Keys.serverKey("BB"))
    }
}
