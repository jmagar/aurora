# Aurora on Android (Jetpack Compose)

Aurora's Android surface is the **`tv.tootie.aurora:aurora`** library, sourced at
`~/workspace/aurora/android/aurora` (package `tv.tootie.aurora.theme`:
`AuroraTheme`, color tokens, `AuroraShapes`). It is the **source of truth** for Android —
the Compose equivalent of the web shadcn registry. Read it before claiming an Android
token/shape exists.

Aurora is not published to Maven. Consumers use a normal dependency coordinate
with an explicit local composite substitution. Use a configurable absolute path;
do not hard-code the retired `aurora-design-system` checkout name or silently
fall back to a nonexistent Maven artifact:

```kotlin
// settings.gradle.kts
val auroraAndroidPath = providers.gradleProperty("auroraAndroidPath")
    .orElse(providers.environmentVariable("AURORA_ANDROID_PATH"))
    .orNull
    ?: error("Set -PauroraAndroidPath=/path/to/aurora/android or AURORA_ANDROID_PATH")

includeBuild(file(auroraAndroidPath)) {
    dependencySubstitution {
        substitute(module("tv.tootie.aurora:aurora")).using(project(":aurora"))
    }
}
```

```kotlin
// app/build.gradle.kts — the version is a placeholder consumed by substitution.
dependencies {
    implementation("tv.tootie.aurora:aurora:0.0.0-local")
}
```

## The contract is the same — expressed in Compose

- Dark-first navy lift tiers; cyan primary, rose secondary, muted status
  (never neon). Light mode must stay usable.
- **Tokens, never raw hex.** The Compose equivalent of `var(--aurora-*)` is reading colors
  from `AuroraColors`, `LocalAuroraColors`, or `MaterialTheme.colorScheme` — **not**
  `Color(0xFF29B6F6)`. A `Color(0x…)` literal outside the theme package is the Android
  split-brain signal. Consuming apps can expose their own theme wrappers, but those wrappers
  should derive from Aurora rather than redefining its hex values.
- Manrope (display), Inter / Noto Sans (body), JetBrains Mono (code and terminal content only).
- Selection and focus = border + glow, not flooded fills.
- Sentence-case, matter-of-fact copy. Lucide-equivalent line icons, no emoji as UI.

## Upstream-first on Android

Same rule as the web — fix the library, then sync the app:

- A color / shape / type value that should be Aurora-wide belongs in `tv.tootie.aurora`,
  **not** re-hardcoded in the app's theme. App `*Palette` / `*Theme` objects should
  **derive** from the library (read its tokens / `colorScheme`), not redefine its hex.
- If a token is missing from the library, add it there (on a branch), then consume it.
- Don't keep a second app-local color object alongside the theme — **fold it in**.
- Never paste a hex value that already exists as a token; reference the token.
- Carry only environment glue downstream (DI wiring, `R.font.*` references) — not duplicated
  token values.

## Anti-patterns — the Android split-brain

These are the Compose forms of "primitives bypassed". If you see them, consolidate:

- `Color(0xFF…)` literals in screen composables — re-typing token values inline. Many will
  be exact token matches (e.g. `0xFF29B6F6` = accent primary, `0xFFC6A36B` = warn); a few are
  true one-offs that should become named tokens or be justified.
- An app `*Palette` / `*Colors` object that re-hardcodes the library's tokens as hex instead
  of deriving from the library.
- A vestigial second color object duplicating a handful of the same colors.
- Hand-rolled composables that restyle what a library component already provides.

## Verifying Android changes

- **Build:** `AURORA_ANDROID_PATH=/path/to/aurora/android ./gradlew :app:assembleDebug`.
- **Contract smoke:** Aurora CI runs `ops/smoke-android-composite.sh`, which
  creates an external temporary Android consumer, resolves the dependency
  coordinate through substitution, imports `AuroraTheme`, and compiles it.
- **Tests:** `./gradlew test` (theme tests live under `ui/theme/`, e.g. `AxonThemeTest`).
- **Visual parity:** screenshot before/after on an emulator (use the `claude-in-mobile` /
  `android-app-testing` skills). When consolidating tokens, hold appearance constant — a
  token swap should be a no-op visually.
- **Guardrail:** after consolidation there should be **no** `Color(0x` outside the theme
  package — `grep -rn "Color(0x" --include=*.kt app/src/main/java/.../ui | grep -v /theme/`
  should return nothing.
