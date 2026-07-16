package tv.tootie.aurora.components

import androidx.compose.foundation.layout.size
import androidx.compose.ui.Modifier
import androidx.compose.ui.test.assertHeightIsEqualTo
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import tv.tootie.aurora.theme.AuroraTheme

@RunWith(RobolectricTestRunner::class)
class AuroraToastHostTest {
    @get:Rule val compose = createComposeRule()

    @Test fun modifierIsAppliedToRootHost() {
        compose.setContent {
            AuroraTheme {
                AuroraToastHost(AuroraToastState(), Modifier.size(123.dp).testTag("toast-host"))
            }
        }
        compose.onNodeWithTag("toast-host").assertHeightIsEqualTo(123.dp)
    }
}
