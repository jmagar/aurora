package tv.tootie.aurora.components

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AuroraWebViewPolicyTest {
    @Test fun originRequiresHttpsAndNormalizesDefaultPort() {
        assertEquals("https://example.com", webOrigin("https://EXAMPLE.com:443/path"))
        assertEquals("https://example.com:8443", webOrigin("https://example.com:8443/path"))
        assertEquals(null, webOrigin("http://example.com"))
        assertEquals(null, webOrigin("file:///tmp/index.html"))
    }

    @Test fun navigationStaysOnExactInitialOrigin() {
        val origin = "https://example.com"
        assertTrue(isAllowedWebNavigation("https://example.com/next", origin, setOf(origin)))
        assertFalse(isAllowedWebNavigation("https://cdn.example.com/next", origin, setOf(origin)))
        assertFalse(isAllowedWebNavigation("content://example/item", origin, setOf(origin)))
        assertFalse(isAllowedWebNavigation("https://example.com.evil.test", origin, setOf(origin)))
    }
}
