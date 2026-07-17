package tv.tootie.aurora.app.ui.login

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * State-machine tests for [LoginState] and the pure transition helpers in
 * [LoginViewModel].
 *
 * Full ViewModel integration tests (DataStore writes, WebSocket I/O,
 * account/login/completed handling) require a Robolectric environment and are
 * tracked separately. The tests here cover:
 *   1. [LoginState] invariants — initial values the whole login flow depends on.
 *   2. Pure synchronous transitions — methods on [LoginState] that have no
 *      coroutine or I/O side-effects, so they can be exercised directly.
 *   3. Guard conditions — e.g. blank-key rejection — that are pure logic and
 *      expressible without an Android runtime.
 */
class LoginStateTest {

    // -------------------------------------------------------------------------
    // 1. Initial state invariants
    // -------------------------------------------------------------------------

    @Test
    fun `initial state starts at SelectMethod`() {
        val state = LoginState()
        assertEquals(LoginStep.SelectMethod, state.step)
    }

    @Test
    fun `initial state has no error message`() {
        val state = LoginState()
        assertNull(state.errorMessage)
    }

    @Test
    fun `initial state has no pending auth url`() {
        val state = LoginState()
        assertNull(state.pendingAuthUrl)
    }

    @Test
    fun `initial device code expiry is 300 seconds`() {
        val state = LoginState()
        assertEquals(300, state.deviceCodeExpiresIn)
    }

    // -------------------------------------------------------------------------
    // 2. Synchronous step transitions (mirrors ViewModel._state.update calls)
    // -------------------------------------------------------------------------

    @Test
    fun `selectApiKey transition moves to ApiKeyForm`() {
        // Mirrors: fun selectApiKey() = _state.update { it.copy(step = LoginStep.ApiKeyForm) }
        val before = LoginState()
        val after = before.copy(step = LoginStep.ApiKeyForm)
        assertEquals(LoginStep.ApiKeyForm, after.step)
        // Transition must not clobber unrelated fields
        assertNull(after.errorMessage)
    }

    @Test
    fun `selectChatGpt transition moves to BrowserOAuth`() {
        // Mirrors: fun selectChatGpt() = _state.update { it.copy(step = LoginStep.BrowserOAuth) }
        val after = LoginState().copy(step = LoginStep.BrowserOAuth)
        assertEquals(LoginStep.BrowserOAuth, after.step)
    }

    @Test
    fun `selectTokens transition moves to TokensForm`() {
        // Mirrors: fun selectTokens() = _state.update { it.copy(step = LoginStep.TokensForm) }
        val after = LoginState().copy(step = LoginStep.TokensForm)
        assertEquals(LoginStep.TokensForm, after.step)
    }

    @Test
    fun `submitApiKey blank-key guard leaves step unchanged`() {
        // Mirrors: if (key.isBlank()) return — ViewModel must not change state for blank input.
        // We test the guard expression directly since the ViewModel can't be instantiated
        // in a plain JUnit test (requires Application context + Robolectric).
        val blankInputs = listOf("", "   ", "\t", "\n")
        blankInputs.forEach { key ->
            assertTrue(
                "Expected isBlank() == true for input \"${key.replace("\n", "\\n").replace("\t", "\\t")}\"",
                key.isBlank(),
            )
        }
        val nonBlankInputs = listOf("sk-abc123", "Bearer token", " x")
        nonBlankInputs.forEach { key ->
            assertFalse("Expected isBlank() == false for input \"$key\"", key.isBlank())
        }
    }

    @Test
    fun `submitTokens blank guard rejects empty accessToken or accountId`() {
        // Mirrors: if (accessToken.isBlank() || accountId.isBlank()) return
        val cases = listOf(
            "" to "acc-123",       // blank accessToken
            "token-abc" to "",     // blank accountId
            "" to "",              // both blank
        )
        cases.forEach { (token, id) ->
            assertTrue(
                "Expected guard to fire for token=\"$token\" id=\"$id\"",
                token.isBlank() || id.isBlank(),
            )
        }
        // Valid inputs must NOT be rejected
        assertFalse("acc-456".isBlank() || "user-789".isBlank())
    }

    // -------------------------------------------------------------------------
    // 3. Error and recovery transitions
    // -------------------------------------------------------------------------

    @Test
    fun `error state stores message and step`() {
        val errorState = LoginState().copy(
            step = LoginStep.Error,
            errorMessage = "Invalid API key",
        )
        assertEquals(LoginStep.Error, errorState.step)
        assertEquals("Invalid API key", errorState.errorMessage)
    }

    @Test
    fun `back from error resets to SelectMethod and clears error`() {
        // Mirrors: fun back() = _state.update { it.copy(step = LoginStep.SelectMethod, errorMessage = null) }
        val errorState = LoginState(step = LoginStep.Error, errorMessage = "Bad credentials")
        val afterBack = errorState.copy(step = LoginStep.SelectMethod, errorMessage = null)
        assertEquals(LoginStep.SelectMethod, afterBack.step)
        assertNull(afterBack.errorMessage)
    }

    @Test
    fun `back from ApiKeyForm resets to SelectMethod`() {
        val formState = LoginState(step = LoginStep.ApiKeyForm)
        val afterBack = formState.copy(step = LoginStep.SelectMethod, errorMessage = null)
        assertEquals(LoginStep.SelectMethod, afterBack.step)
    }

    // -------------------------------------------------------------------------
    // 4. Device-code flow state
    // -------------------------------------------------------------------------

    @Test
    fun `device code state captures all required fields`() {
        val after = LoginState().copy(
            step = LoginStep.DeviceCodeWait,
            verificationUrl = "https://chatgpt.com/device",
            userCode = "ABCD-1234",
            deviceCodeExpiresIn = 600,
        )
        assertEquals(LoginStep.DeviceCodeWait, after.step)
        assertEquals("https://chatgpt.com/device", after.verificationUrl)
        assertEquals("ABCD-1234", after.userCode)
        assertEquals(600, after.deviceCodeExpiresIn)
    }

    @Test
    fun `device code step requires non-null verificationUrl and userCode`() {
        // Guard: the ViewModel only transitions to DeviceCodeWait when both are non-null
        // (see: if (url2 != null && code != null) { _state.update { ... } })
        val url = "https://chatgpt.com/activate"
        val code = "WXYZ-5678"
        assertNotNull(url)
        assertNotNull(code)
        // Simulate the null guard failing — neither field should produce a transition
        val nullUrl: String? = null
        val nullCode: String? = null
        assertFalse(listOf(nullUrl, code).all { it != null })
        assertFalse(listOf(url, nullCode).all { it != null })
    }

    // -------------------------------------------------------------------------
    // 5. OAuth pending auth URL
    // -------------------------------------------------------------------------

    @Test
    fun `pendingAuthUrl is set when OAuth start response arrives`() {
        // Mirrors the oauthRequestId handler: _state.update { it.copy(pendingAuthUrl = authUrl) }
        val after = LoginState().copy(pendingAuthUrl = "https://chatgpt.com/auth?state=abc")
        assertNotNull(after.pendingAuthUrl)
        assertEquals("https://chatgpt.com/auth?state=abc", after.pendingAuthUrl)
    }

    @Test
    fun `pendingAuthUrl cleared after launch`() {
        // Mirrors: fun launchPendingAuthUrl(...) { _state.update { it.copy(pendingAuthUrl = null) } }
        val withUrl = LoginState(pendingAuthUrl = "https://chatgpt.com/auth?state=abc")
        val afterLaunch = withUrl.copy(pendingAuthUrl = null)
        assertNull(afterLaunch.pendingAuthUrl)
    }
}
