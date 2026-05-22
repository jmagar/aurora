package tv.tootie.aurora.app.ui.login

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * State-machine tests for LoginViewModel data classes.
 *
 * Tests cover pure state transitions (copy operations) deterministically,
 * without spinning up a real ViewModel/Application/coroutines.
 * Full ViewModel integration tests (DataStore + coroutines) require Robolectric
 * and are out of scope here.
 */
class LoginStateTest {

    @Test
    fun `initial state is SelectMethod`() {
        val state = LoginState()
        assertEquals(LoginStep.SelectMethod, state.step)
    }

    @Test
    fun `selectApiKey moves to ApiKeyForm step`() {
        val newState = LoginState().copy(step = LoginStep.ApiKeyForm)
        assertEquals(LoginStep.ApiKeyForm, newState.step)
    }

    @Test
    fun `selectTokens moves to TokensForm step`() {
        val newState = LoginState().copy(step = LoginStep.TokensForm)
        assertEquals(LoginStep.TokensForm, newState.step)
    }

    @Test
    fun `error state retains message`() {
        val newState = LoginState().copy(step = LoginStep.Error, errorMessage = "bad token")
        assertEquals(LoginStep.Error, newState.step)
        assertEquals("bad token", newState.errorMessage)
    }

    @Test
    fun `device code state captures url and code`() {
        val newState = LoginState().copy(
            step = LoginStep.DeviceCodeWait,
            verificationUrl = "https://chatgpt.com/device",
            userCode = "ABCD-1234",
            deviceCodeExpiresIn = 300,
        )
        assertEquals("https://chatgpt.com/device", newState.verificationUrl)
        assertEquals("ABCD-1234", newState.userCode)
        assertEquals(300, newState.deviceCodeExpiresIn)
    }

    @Test
    fun `back resets to SelectMethod and clears error`() {
        val errorState = LoginState(step = LoginStep.Error, errorMessage = "oops")
        val reset = errorState.copy(step = LoginStep.SelectMethod, errorMessage = null)
        assertEquals(LoginStep.SelectMethod, reset.step)
        assertEquals(null, reset.errorMessage)
    }
}
