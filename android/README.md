# Aurora Android — Jetpack Compose Library

A Jetpack Compose component library mirroring the [Aurora design system](https://aurora.tootie.tv) web primitives. Shares design token values (colors, typography, radius) with the web layer via a generated token pipeline.

## Installation

The library is not yet published to Maven Central. Add it as a local module:

```kotlin
// settings.gradle.kts
include(":aurora")
project(":aurora").projectDir = file("path/to/aurora-design-system/android/aurora")
```

Then depend on it:

```kotlin
// build.gradle.kts
implementation(project(":aurora"))
```

## Token Pipeline

Design tokens are defined in CSS (`registry/aurora/styles/aurora.css`) and exported to Kotlin via Style Dictionary:

```bash
pnpm run tokens:generate   # Runs from repo root — generates AuroraColors.kt
```

Generated file: `android/aurora/build/generated/aurora-tokens/kotlin/tv/tootie/aurora/tokens/AuroraColors.kt`

## Verification

Run these from the repo root unless noted:

```bash
pnpm run tokens:generate
pnpm run registry:build

cd android
./gradlew :app:testDebugUnitTest --no-daemon
./gradlew :aurora:lintDebug --no-daemon
./gradlew :app:assembleDebug --no-daemon
```

## Token Mapping

| CSS Token | Kotlin Token | Usage |
|-----------|-------------|-------|
| `--aurora-accent-cyan-base` | `AuroraColors.accentCyanBase` | Primary accent, links, focus rings |
| `--aurora-accent-cyan-button` | `AuroraColors.accentCyanButton` | Primary button fill |
| `--aurora-accent-pink-base` | `AuroraColors.accentPinkBase` | Secondary accent |
| `--aurora-accent-pink-button` | `AuroraColors.accentPinkButton` | Secondary button fill |
| `--aurora-accent-violet-base` | `AuroraColors.accentVioletBase` | AI/automation identity |
| `--aurora-base-surface` | `AuroraColors.baseSurface` | Page background (`#07131C`) |
| `--aurora-panel-medium` | `AuroraColors.panelMedium` | Card/panel backgrounds |
| `--aurora-panel-strong` | `AuroraColors.panelStrong` | Elevated surfaces |
| `--aurora-text-primary` | `AuroraColors.textPrimary` | Primary text |
| `--aurora-text-secondary` | `AuroraColors.textSecondary` | Secondary/muted text |
| `--aurora-status-success` | `AuroraColors.statusSuccess` | Success states |
| `--aurora-status-warn` | `AuroraColors.statusWarn` | Warning states |
| `--aurora-status-error` | `AuroraColors.statusError` | Error states |
| `--aurora-border-default` | `AuroraColors.borderDefault` | Default borders/dividers |

## Theme Usage

```kotlin
// Wrap your app or screen:
AuroraTheme {
    // MaterialTheme is configured with Aurora tokens
    AuroraButton(onClick = {}) { Text("Click me") }
}
```

## Components

| Component | Status | Notes |
|-----------|--------|-------|
| `AuroraButton` | Ready | Filled, Outlined, Ghost, Destructive variants; loading state; leading icon |
| `AuroraIconButton` | Ready | Standard, filled, tonal, outlined icon action variants with compact/default/large sizing and preserved 48dp target |
| `AuroraTextField` | Ready | Error semantics via supportingText; compact mode; sensitive values hidden by default with reveal/hide control; keyboard options; visual transformation |
| `AuroraCheckbox` | Ready | Toggleable row pattern; WCAG compliant |
| `AuroraSwitch` | Ready | contentDescription param; `AuroraSwitchRow` for labeled settings rows |
| `AuroraSelect` | Ready | Exposed dropdown menu |
| `AuroraDialog` | Ready | AlertDialog wrapper; DialogProperties support |
| `AuroraBadge` | Ready | 99+ overflow; notification contentDescription |
| `AuroraCard` | Ready | Filled, Outlined, Elevated variants |
| `AuroraTabs` | Ready | TabRow / ScrollableTabRow; ImmutableList; compact labels |
| `AuroraToast` | Ready | SnackbarVisuals-based; variant colors |
| `AuroraSpinner` | Ready | Required contentDescription; configurable size |
| `AuroraSeparator` | Ready | Horizontal and vertical |

## Axon Primitive Migration Mapping

The Android library exposes reusable surfaces for the Axon primitive-convergence inventory without requiring changes to the Aurora web registry:

| Inventory row | Aurora Android surface |
|---------------|------------------------|
| `A-AND-001` compact prompt/settings fields | `AuroraTextField(compact = true)`, `AuroraTextField(sensitive = true)`, `AuroraPromptInput(compact = true, inlineLeadingContent = ..., actionLeft = ..., trailingContent = ...)` |
| `A-AND-002` icon/action buttons | `AuroraIconButton` and `AuroraButton` slots/variants |
| `A-AND-003` tabs/toggles/chips | `AuroraTabs(compact = true)`, `AuroraButtonGroup`, `AuroraSuggestionChip(selected = ...)`, `AuroraSwitchRow` |
| `A-AND-004` progress/status/dot-only | `AuroraProgress(size = ..., variant = ...)`, `AuroraStatusIndicator(size = ..., dotOnly = true, pulse = false)` |
| `A-AND-005` nav/sidebar rows | `AuroraSidebarRow`, `AuroraNavigationRailRow`, `AuroraSidebarRowItem`, `AuroraNavigationRowItem` |

## Requirements

- Android SDK 24+ (minSdk)
- Kotlin 2.1.x
- Jetpack Compose BOM 2026.04.01 (managed by library)
- KSP (for annotation processing if extending)

## Notes

- v1 ships dark theme only; light theme support is planned for a future release.
- Fonts (Manrope, Inter, JetBrains Mono) are bundled as `res/font/` TTF assets — downloadable
  fonts are not used because they fail silently on devices without Google Mobile Services.
- `color-mix()` and gradient tokens in `aurora.css` are resolved to concrete ARGB hex before
  emission by the token extractor; gradient tokens emit `Brush` constants rather than `Color`.
