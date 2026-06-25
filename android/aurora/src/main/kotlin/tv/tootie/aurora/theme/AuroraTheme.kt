package tv.tootie.aurora.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.graphics.Color
import tv.tootie.aurora.tokens.AuroraColors

// =================================================================================================
// Aurora → Material3 ColorScheme Mapping Rationale
// =================================================================================================
//
// PRIMARY FAMILY (Cyan — Aurora's identity accent)
//   primary              <- accentPrimary    (#29B6F6) — Aurora's signature cyan
//   onPrimary            <- accentForeground (#051520) — near-black; safe on all cyan shades
//   primaryContainer     <- accentDeep       (#1C7FAC) — darker cyan for container bg
//   onPrimaryContainer   <- accentStrong     (#67CBFA) — brighter cyan readable on deep bg
//   primaryFixed         <- accentStrong     (#67CBFA) — bright cyan for fixed-color contexts
//   primaryFixedDim      <- accentPrimary    (#29B6F6) — dimmed fixed-color cyan
//   onPrimaryFixed       <- accentForeground (#051520) — near-black on bright cyan
//   onPrimaryFixedVariant<- accentDeep       (#1C7FAC) — darker text variant on fixed cyan
//   surfaceTint          <- accentPrimary    — primary drives all M3 surface tinting
//   inversePrimary       <- accentDeep       (#1C7FAC) — darker cyan for light-theme inverse
//
// SECONDARY FAMILY (Pink — Aurora's secondary accent, NOT a surface/panel color)
//   secondary            <- accentPinkButton (#E879A0) — saturated pink; deepest readable hue
//   onSecondary          <- accentForeground (#051520) — near-black; white fails contrast on pink
//   secondaryContainer   <- accentPinkSurface(#2C3342) — dark pink-tinted surface
//   onSecondaryContainer <- accentPinkStrong (#FBC4D6) — light pink readable on dark surface
//   secondaryFixed       <- accentPinkStrong (#FBC4D6) — bright pink for fixed-color contexts
//   secondaryFixedDim    <- accentPinkBase   (#F9A8C4) — slightly dimmed fixed pink
//   onSecondaryFixed     <- accentForeground (#051520) — near-black on bright pink
//   onSecondaryFixedDim  <- accentPinkDeep   (#C46B88) — deeper pink as variant text
//
// TERTIARY FAMILY (AI/automation accent; legacy violet slots now alias cyan tokens)
//   tertiary             <- accentStrong    (#67CBFA)
//   onTertiary           <- accentForeground (#051520)
//   tertiaryContainer    <- selectedBg
//   onTertiaryContainer  <- accentStrong    (#67CBFA)
//
// SURFACE CONTAINER HIERARCHY (darkest → lightest, fits Aurora's navy-to-panel progression)
//   surfaceContainerLowest  <- pageBg          (#07131C) — absolute darkest canvas
//   surfaceContainerLow     <- controlSurface  (#0C1A24) — inputs, controls
//   surfaceContainer        <- panelMedium     (#102330) — default panel/card bg
//   surfaceContainerHigh    <- panelStrong     (#13293A) — elevated panels
//   surfaceContainerHighest <- navBg           (#07111A) — NOTE: navBg is visually similar to
//                                                          pageBg; used here as the "highest"
//                                                          slot because it's a distinct token.
//                                                          Revisit when a lighter panel token
//                                                          is added in a future Aurora release.
//   surfaceDim           <- pageBg             (#07131C) — dimmest possible surface state
//   surfaceBright        <- panelStrong        (#13293A) — brightest dark-mode surface
//
// INVERSE ROLES (for snackbars, tooltips that flip to a contrasting surface)
//   inverseSurface       <- Color(0xFFE8EFF3)  — placeholder light surface; no light-mode
//                                                token exists yet in Aurora. Update when the
//                                                light theme token set ships.
//   inverseOnSurface     <- pageBg             (#07131C) — dark text/icon on light inverse bg
//
// BACKGROUNDS & MISC
//   background           <- pageBg             (#07131C)
//   onBackground         <- textPrimary        (#E6F4FB)
//   surface              <- panelMedium        (#102330)
//   onSurface            <- textPrimary        (#E6F4FB)
//   onSurfaceVariant     <- textMuted          (#A7BCC9)
//   surfaceVariant       <- controlSurface     (#0C1A24)
//   outline              <- borderDefault      (#1D3D4E)
//   outlineVariant       <- borderStrong       (#24536C)
//
// ERROR FAMILY
//   error                <- errorBase          (#C78490)
//   onError              <- errorForeground    (#FDE6EB)
//   errorContainer       <- errorSurface       (#262F3C)
//   onErrorContainer     <- errorForeground    (#FDE6EB)
//
// SCRIM
//   scrim                <- Color(0xFF040A0E)  — solid, no alpha. AuroraColors.overlay has
//                                                0xB8 alpha baked in; M3 applies its own alpha
//                                                on top which would cause double-dimming.
// =================================================================================================

private val AuroraDarkColorScheme = darkColorScheme(
    // Primary — cyan family
    primary                  = AuroraColors.accentPrimary,
    onPrimary                = AuroraColors.accentForeground,
    primaryContainer         = AuroraColors.accentDeep,
    onPrimaryContainer       = AuroraColors.accentStrong,
    primaryFixed             = AuroraColors.accentStrong,
    primaryFixedDim          = AuroraColors.accentPrimary,
    onPrimaryFixed           = AuroraColors.accentForeground,
    onPrimaryFixedVariant    = AuroraColors.accentDeep,
    surfaceTint              = AuroraColors.accentPrimary,
    inversePrimary           = AuroraColors.accentDeep,

    // Secondary — pink family (replaces incorrect panelStrong mapping)
    secondary                = AuroraColors.accentPinkButton,
    onSecondary              = AuroraColors.accentForeground,
    secondaryContainer       = AuroraColors.accentPinkSurface,
    onSecondaryContainer     = AuroraColors.accentPinkStrong,
    secondaryFixed           = AuroraColors.accentPinkStrong,
    secondaryFixedDim        = AuroraColors.accentPinkBase,
    onSecondaryFixed         = AuroraColors.accentForeground,
    onSecondaryFixedVariant  = AuroraColors.accentPinkDeep,

    // Tertiary — AI/automation accent, aliased to the surviving cyan family.
    tertiary                 = AuroraColors.accentStrong,
    onTertiary               = AuroraColors.accentForeground,
    tertiaryContainer        = AuroraColors.selectedBg,
    onTertiaryContainer      = AuroraColors.accentStrong,

    // Backgrounds
    background               = AuroraColors.pageBg,
    onBackground             = AuroraColors.textPrimary,

    // Surface & variants
    surface                  = AuroraColors.panelMediumBase,
    onSurface                = AuroraColors.textPrimary,
    onSurfaceVariant         = AuroraColors.textMuted,
    surfaceVariant           = AuroraColors.controlSurfaceBase,

    // Surface container hierarchy (darkest → elevated)
    surfaceContainerLowest   = AuroraColors.pageBg,
    surfaceContainerLow      = AuroraColors.controlSurfaceBase,
    surfaceContainer         = AuroraColors.panelMediumBase,
    surfaceContainerHigh     = AuroraColors.panelStrongBase,
    surfaceContainerHighest  = AuroraColors.navBg,
    surfaceDim               = AuroraColors.pageBg,
    surfaceBright            = AuroraColors.panelStrongBase,

    // Inverse roles (for snackbars/tooltips; light-mode placeholder until Aurora ships light tokens)
    inverseSurface           = Color(0xFFE8EFF3),
    inverseOnSurface         = AuroraColors.pageBg,

    // Outline
    outline                  = AuroraColors.borderDefault,
    outlineVariant           = AuroraColors.borderStrong,

    // Error family
    error                    = AuroraColors.errorBase,
    onError                  = AuroraColors.errorForeground,
    errorContainer           = AuroraColors.errorSurface,
    onErrorContainer         = AuroraColors.errorForeground,

    // Scrim — solid base color; M3 applies its own alpha so we must NOT pre-bake alpha here.
    // AuroraColors.overlay (#B8040A0E) has 0xB8 alpha already, which would cause double-dimming.
    scrim                    = Color(0xFF040A0E),
)

/**
 * Aurora design system theme wrapper.
 *
 * Wrap all Aurora UI in this composable to apply Aurora colors, typography, and shapes.
 *
 * The [darkTheme] parameter defaults to the system setting via [isSystemInDarkTheme]. Light theme
 * is planned; currently both `darkTheme = true` and `darkTheme = false` resolve to the dark color
 * scheme and dark extra-colors until the Aurora light token set ships.
 *
 * Usage:
 * ```kotlin
 * AuroraTheme {
 *     // Your composable content
 * }
 * ```
 */
@Composable
public fun AuroraTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) AuroraDarkColorScheme else AuroraDarkColorScheme
    val extraColors = if (darkTheme) DarkAuroraExtraColors else DarkAuroraExtraColors

    CompositionLocalProvider(
        LocalAuroraColors provides extraColors,
    ) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography  = AuroraTypography,
            shapes      = AuroraShapes,
            content     = content,
        )
    }
}
