package tv.tootie.aurora.app.ui.login

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class OAuthUrlPolicyTest {
    @Test fun acceptsHttpsProviderOrigin() {
        assertTrue(isAllowedOAuthUrl("https://auth.openai.com/oauth/authorize?client_id=x"))
        assertTrue(isAllowedOAuthUrl("https://chatgpt.com/auth/callback"))
    }

    @Test fun rejectsSchemeOriginPortAndCredentialConfusion() {
        listOf(
            "http://auth.openai.com/oauth",
            "javascript:alert(1)",
            "https://auth.openai.com.evil.example/oauth",
            "https://auth.openai.com@evil.example/oauth",
            "https://auth.openai.com:444/oauth",
            "not a url",
        ).forEach { assertFalse(it, isAllowedOAuthUrl(it)) }
    }
}
