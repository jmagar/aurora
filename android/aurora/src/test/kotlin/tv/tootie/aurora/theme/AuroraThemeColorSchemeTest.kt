package tv.tootie.aurora.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.test.junit4.v2.createComposeRule
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import tv.tootie.aurora.tokens.AuroraColors
import tv.tootie.aurora.tokens.AuroraLightColors

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
            AuroraTheme(darkTheme = true) {
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

    @Test
    fun lightThemeUsesGeneratedLightTokens() {
        var primary: Color? = null
        var background: Color? = null
        var onBackground: Color? = null
        rule.setContent {
            AuroraTheme(darkTheme = false) {
                primary = MaterialTheme.colorScheme.primary
                background = MaterialTheme.colorScheme.background
                onBackground = MaterialTheme.colorScheme.onBackground
            }
        }
        rule.waitForIdle()
        assertEquals(AuroraLightColors.accentPrimaryBase, primary)
        assertEquals(AuroraLightColors.pageBg, background)
        assertEquals(AuroraLightColors.textPrimary, onBackground)
    }
}
