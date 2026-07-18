# Aurora Android — Jetpack Compose Library

A Jetpack Compose component library mirroring the [Aurora design system](https://aurora.tootie.tv) web primitives. Shares design token values (colors, typography, radius) with the web layer via a generated token pipeline.

## Installation

The library is not yet published to Maven Central. Consume the repository as a
composite build so Gradle builds the library with its own settings and token task:

```kotlin
// settings.gradle.kts in the consumer
includeBuild("../aurora/android") {
    dependencySubstitution {
        substitute(module("tv.tootie.aurora:aurora"))
            .using(project(":aurora"))
    }
}
```

Then depend on it:

```kotlin
// build.gradle.kts
implementation("tv.tootie.aurora:aurora")
```

## Token Pipeline

Design tokens are defined in CSS (`registry/aurora/styles/aurora.css`) and exported to Kotlin via Style Dictionary:

```bash
bash android/scripts/regenerate-tokens.sh
```

Generated files are checked in as `AuroraColors.kt` and `AuroraLightColors.kt` under
`android/aurora/src/main/kotlin/tv/tootie/aurora/tokens/`. Android compilation consumes
these files directly and therefore does not require Node or pnpm. `androidCheck` runs
`checkAuroraTokenDrift` to prove they still match the canonical CSS. The
regeneration script writes all four authoritative checked-in artifacts (token
JSON, exclusions JSON, and both Kotlin objects). The drift task generates that
same set in a temporary directory and never mutates the worktree.

## Verification

Run these from the repo root unless noted:

```bash
bash android/scripts/regenerate-tokens.sh
pnpm run registry:build

cd android
./gradlew androidCheck --no-daemon
bash scripts/verify-gradle-wrapper.sh

# On an x86_64 host with KVM (the explicit managed-device CI gate):
./gradlew androidManagedDeviceCheck --no-daemon

# With an emulator/device already attached:
./gradlew :app:connectedDebugAndroidTest --no-daemon
bash scripts/smoke-release-apk.sh
```

## Token Mapping

| CSS Token | Kotlin Token | Usage |
|-----------|-------------|-------|
| `--aurora-accent-primary` | `AuroraColors.accentPrimaryBase` | Primary accent, links, focus rings |
| `--aurora-accent-button` | `AuroraColors.accentButton` | Primary button fill |
| `--aurora-accent-pink` | `AuroraColors.accentPinkBase` | Secondary accent |
| `--aurora-accent-pink-button` | `AuroraColors.accentPinkButton` | Secondary button fill |
| `--axon-orange` | `AuroraColors.axonOrangeBase` | AI/automation identity |
| `--axon-orange-surface` | `AuroraColors.axonOrangeSurface` | AI/automation tinted surfaces |
| `--axon-orange-border` | `AuroraColors.axonOrangeBorder` | AI/automation borders |
| `--aurora-page-bg` | `AuroraColors.pageBg` | Page background (`#07131C`) |
| `--aurora-panel-medium` | `AuroraColors.panelMediumBase` | Card/panel backgrounds |
| `--aurora-panel-strong` | `AuroraColors.panelStrongBase` | Elevated surfaces |
| `--aurora-text-primary` | `AuroraColors.textPrimary` | Primary text |
| `--aurora-text-muted` | `AuroraColors.textMuted` | Secondary/muted text |
| `--aurora-success` | `AuroraColors.successBase` | Success states |
| `--aurora-warn` | `AuroraColors.warnBase` | Warning states |
| `--aurora-error` | `AuroraColors.errorBase` | Error states |
| `--aurora-border-default` | `AuroraColors.borderDefault` | Default borders/dividers |

`AuroraExtraColors.accentViolet*` remains as a compatibility alias for existing AI component call sites, but those fields now point at Axon-orange tokens. New Android code should prefer `axonOrange*` for AI/automation styling.

## Theme Usage

```kotlin
// Wrap your app or screen:
AuroraTheme {
    // MaterialTheme is configured with Aurora tokens
    AuroraButton(onClick = {}) { Text("Click me") }
}
```

`AuroraTheme` follows the system by default. Pass `darkTheme = true` or
`darkTheme = false` to select the generated dark or light scheme explicitly.

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

## Notes

- Dark and light themes are generated from the matching canonical CSS namespaces.
- Fonts (Manrope, Inter, JetBrains Mono) are bundled as `res/font/` TTF assets — downloadable
  fonts are not used because they fail silently on devices without Google Mobile Services.
- `color-mix()` and gradient tokens in `aurora.css` are resolved to concrete ARGB hex before
  emission by the token extractor; gradient tokens emit `Brush` constants rather than `Color`.
