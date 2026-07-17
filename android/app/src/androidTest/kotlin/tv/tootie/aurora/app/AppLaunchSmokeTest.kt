package tv.tootie.aurora.app

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onRoot
import org.junit.Rule
import org.junit.Test

/** Device/emulator smoke used against both debug and release test builds. */
class AppLaunchSmokeTest {
    @get:Rule val compose = createAndroidComposeRule<MainActivity>()

    @Test fun coldLaunchRendersComposeRoot() {
        compose.onRoot().assertIsDisplayed()
    }
}
