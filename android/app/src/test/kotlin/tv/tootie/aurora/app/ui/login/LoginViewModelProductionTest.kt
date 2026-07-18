package tv.tootie.aurora.app.ui.login

import android.app.Application
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner

/** Exercises production ViewModel methods rather than copied LoginState transitions. */
@RunWith(RobolectricTestRunner::class)
class LoginViewModelProductionTest {
    private fun viewModel() = LoginViewModel(ApplicationProvider.getApplicationContext<Application>())

    @Test fun `method selection and back execute production transitions`() {
        val vm = viewModel()
        vm.selectApiKey()
        assertEquals(LoginStep.ApiKeyForm, vm.state.value.step)
        vm.back()
        assertEquals(LoginStep.SelectMethod, vm.state.value.step)
        assertNull(vm.state.value.errorMessage)
        vm.selectChatGpt()
        assertEquals(LoginStep.BrowserOAuth, vm.state.value.step)
        vm.selectTokens()
        assertEquals(LoginStep.TokensForm, vm.state.value.step)
    }

    @Test fun `blank credentials do not advance production state`() {
        val vm = viewModel()
        vm.selectApiKey()
        vm.submitApiKey("  ")
        assertEquals(LoginStep.ApiKeyForm, vm.state.value.step)
        vm.selectTokens()
        vm.submitTokens("", "account")
        assertEquals(LoginStep.TokensForm, vm.state.value.step)
    }
}
