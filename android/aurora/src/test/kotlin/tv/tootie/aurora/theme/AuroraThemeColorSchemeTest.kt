package tv.tootie.aurora.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import tv.tootie.aurora.tokens.AuroraColors

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class AuroraThemeColorSchemeTest {
    @get:Rule
    val rule = createComposeRule()

    @Test
    fun primaryColorSlotsUseAccentPrimaryBaseToken() {
        var primary: Color? = null
        var primaryFixedDim: Color? = null
        var surfaceTint: Color? = null

        rule.setContent {
            AuroraTheme {
                primary = MaterialTheme.colorScheme.primary
                primaryFixedDim = MaterialTheme.colorScheme.primaryFixedDim
                surfaceTint = MaterialTheme.colorScheme.surfaceTint
            }
        }

        rule.waitForIdle()

        assertEquals(AuroraColors.accentPrimaryBase, primary)
        assertEquals(AuroraColors.accentPrimaryBase, primaryFixedDim)
        assertEquals(AuroraColors.accentPrimaryBase, surfaceTint)
    }
}
