package tv.tootie.aurora.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import tv.tootie.aurora.tokens.AuroraColors

// Token allocation: which Aurora tokens map to M3 ColorScheme slots vs LocalAuroraColors
// M3 slot              <- Aurora token
// primary              <- accentPrimary    (#29b6f6 cyan)
// onPrimary            <- accentForeground (#051520 near-black)
// primaryContainer     <- accentDeep
// onPrimaryContainer   <- accentStrong
// secondary            <- panelStrong
// onSecondary          <- textPrimary
// tertiary             <- accentVioletBase (#a78bfa)
// onTertiary           <- accentForeground
// background           <- pageBg           (#07131c navy)
// onBackground         <- textPrimary      (#e6f4fb light)
// surface              <- panelMedium      (#102330)
// onSurface            <- textPrimary
// onSurfaceVariant     <- textMuted        (#a7bcc9)
// surfaceVariant       <- controlSurface   (#0c1a24)
// surfaceContainer     <- panelMedium
// outline              <- borderDefault    (#1d3d4e)
// outlineVariant       <- borderStrong     (#24536c)
// error                <- errorBase        (#c78490)
// onError              <- errorForeground  (#fde6eb)
// errorContainer       <- errorSurface
// onErrorContainer     <- errorForeground
// scrim                <- overlay

private val AuroraDarkColorScheme = darkColorScheme(
    primary              = AuroraColors.accentPrimary,
    onPrimary            = AuroraColors.accentForeground,
    primaryContainer     = AuroraColors.accentDeep,
    onPrimaryContainer   = AuroraColors.accentStrong,
    secondary            = AuroraColors.panelStrong,
    onSecondary          = AuroraColors.textPrimary,
    tertiary             = AuroraColors.accentVioletBase,
    onTertiary           = AuroraColors.accentForeground,
    background           = AuroraColors.pageBg,
    onBackground         = AuroraColors.textPrimary,
    surface              = AuroraColors.panelMedium,
    onSurface            = AuroraColors.textPrimary,
    onSurfaceVariant     = AuroraColors.textMuted,
    surfaceVariant       = AuroraColors.controlSurface,
    surfaceContainer     = AuroraColors.panelMedium,
    outline              = AuroraColors.borderDefault,
    outlineVariant       = AuroraColors.borderStrong,
    error                = AuroraColors.errorBase,
    onError              = AuroraColors.errorForeground,
    errorContainer       = AuroraColors.errorSurface,
    onErrorContainer     = AuroraColors.errorForeground,
    scrim                = AuroraColors.overlay,
)

/**
 * Aurora design system theme wrapper.
 *
 * Wrap all Aurora UI in this composable to apply Aurora colors, typography, and shapes.
 * v1: dark theme only. Light theme is a follow-on bead.
 *
 * Usage:
 * ```kotlin
 * AuroraTheme {
 *     // Your composable content
 * }
 * ```
 */
@Composable
fun AuroraTheme(
    content: @Composable () -> Unit,
) {
    // Wrap in remember to avoid reallocating ColorScheme/Typography on every recomposition
    val colorScheme = remember { AuroraDarkColorScheme }
    val typography  = remember { AuroraTypography }
    val shapes      = remember { AuroraShapes }

    CompositionLocalProvider(
        LocalAuroraColors provides DarkAuroraExtraColors,
    ) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography  = typography,
            shapes      = shapes,
            content     = content,
        )
    }
}
