# Aurora CLI — Canonical Token Reference

The authoritative list of every theme token the **Claude Code CLI** consumes and
the exact value Aurora assigns to it. If a value here disagrees with
`aurora.json`, the JSON is wrong — this doc and the JSON must move together.

> **Scope: CLI only.** These values are the canonical *terminal* palette. They
> intentionally **diverge** from the web registry tokens in
> [`registry/aurora/styles/aurora.css`](../../registry/aurora/styles/aurora.css):
> the CLI cyan and rose are pushed brighter/more saturated so accents survive a
> dark terminal background and low-gamut emulators. **Do not** sync these back
> into the web CSS, Zed, Warp, or Android tokens without an explicit decision to
> re-base the whole system. See [Divergence from web](#divergence-from-web).

The full key set below is exhaustive — it is every theme key Claude Code exposes.
Any key not listed in `aurora.json` falls back to the built-in `dark` base; the
dark theme currently overrides **all** of them.

---

## Core palette

The raw ramps every token draws from. Names are descriptive, not literal keys.

### Cyan — Aurora identity (CLI-brightened)
| Hex | Role |
|------|------|
| `#36c9ff` | **primary** — Claude identity, accents, active state *(web uses `#29b6f6`)* |
| `#7ee0ff` | shimmer / strong cyan |
| `#4dc8fa` | lift — IDE, secondary blue |
| `#1c7fac` | deep — borders, subtle frame |

### Rose — secondary accent (CLI-brightened)
| Hex | Role |
|------|------|
| `#ff7eb6` | **rose** — `remember`, memory accents *(web uses `#f9a8c4`)* |
| `#c78490` | error rose |
| `#d9909a` | error-lift / subagent red |

### Violet — AI / automation identity
| Hex | Role |
|------|------|
| `#a78bfa` | violet — `merged`, `effortUltra`, subagent purple |
| `#8b5cf6` | indigo |
| `#c4b5fd` | violet light |
| `#ddd6fe` | violet shimmer |

### Status & warm
| Hex | Role |
|------|------|
| `#7dd3c7` | success teal |
| `#a0e8e0` | success shimmer |
| `#c6a36b` | warn amber |
| `#e8bf88` | warn amber shimmer |
| `#e8a86b` | orange |
| `#f2c880` | orange shimmer |

### Surfaces — navy ladder
| Hex | Role |
|------|------|
| `#07131c` | page / base background |
| `#0e1e0b` | bash message surface (warm-shifted) |
| `#1c1030` | memory message surface (violet-shifted) |
| `#102535` → `#14304a` | user message bg / hover |
| `#1a3550` | message-actions bg |
| `#1e4560` | selection bg |
| `#1d3d4e` | rate-limit track (empty) |

### Text
| Hex | Role |
|------|------|
| `#e6f4fb` | primary text |
| `#cfe0ec` | inactive / secondary text *(brightened from base `#a7bcc9` for menu legibility)* |
| `#a7bcc9` | muted label (`briefLabelYou`) |
| `#051520` | inverse text (on cyan fills) |

---

## Token reference (dark — canonical)

### Identity, accents & prompt
| Key | Value | Controls |
|-----|-------|----------|
| `claude` | `#36c9ff` | Claude identity color |
| `claudeShimmer` | `#7ee0ff` | shimmer on Claude identity |
| `permission` | `#36c9ff` | permission-prompt accent |
| `permissionShimmer` | `#7ee0ff` | permission shimmer |
| `suggestion` | `#36c9ff` | autocomplete / slash-command description text |
| `remember` | `#ff7eb6` | memory ("remember") accent |
| `ide` | `#4dc8fa` | IDE integration accent |
| `subtle` | `#1c7fac` | subtle secondary text / hints |
| `promptBorder` | `#1c7fac` | input box border |
| `promptBorderShimmer` | `#36c9ff` | input box border shimmer |

### Text & chrome
| Key | Value | Controls |
|-----|-------|----------|
| `text` | `#e6f4fb` | primary body text |
| `inverseText` | `#051520` | text on cyan fills |
| `inactive` | `#cfe0ec` | greyed/secondary text (menus, hints) |
| `inactiveShimmer` | `#dcebf6` | shimmer on inactive |

### Modes & status
| Key | Value | Controls |
|-----|-------|----------|
| `planMode` | `#36c9ff` | plan-mode indicator |
| `autoAccept` | `#7dd3c7` | auto-accept-edits indicator |
| `bashBorder` | `#c6a36b` | bash block border |
| `fastMode` | `#c6a36b` | fast-mode indicator |
| `fastModeShimmer` | `#e8bf88` | fast-mode shimmer |
| `effortUltra` | `#a78bfa` | ultra-effort / ultrathink indicator |
| `success` | `#7dd3c7` | success states |
| `error` | `#c78490` | error states |
| `warning` | `#c6a36b` | warning states |
| `warningShimmer` | `#e8bf88` | warning shimmer |
| `merged` | `#a78bfa` | merged/combined state |

### Mascot & spinner
| Key | Value | Controls |
|-----|-------|----------|
| `clawd_body` | `#36c9ff` | the ASCII Claude robot body |
| `clawd_background` | `#07131c` | backdrop behind the robot |
| `claudeBlue_FOR_SYSTEM_SPINNER` | `#36c9ff` | thinking/processing spinner |
| `claudeBlueShimmer_FOR_SYSTEM_SPINNER` | `#7ee0ff` | spinner shimmer |

### Accent slots (use unclear — keep on-palette)
| Key | Value | Controls |
|-----|-------|----------|
| `background` | `#1c7fac` | general accent slot |
| `professionalBlue` | `#4dc8fa` | secondary blue accent |
| `chromeYellow` | `#e8bf88` | "Claude in Chrome" accent |

### Surfaces
| Key | Value | Controls |
|-----|-------|----------|
| `userMessageBackground` | `#102535` | your message bubble |
| `userMessageBackgroundHover` | `#14304a` | hovered message bubble |
| `messageActionsBackground` | `#1a3550` | message action bar |
| `bashMessageBackgroundColor` | `#0e1e0b` | bash output block |
| `memoryBackgroundColor` | `#1c1030` | memory block |
| `selectionBg` | `#1e4560` | text selection highlight |
| `rate_limit_fill` | `#36c9ff` | rate-limit bar fill |
| `rate_limit_empty` | `#1d3d4e` | rate-limit bar track |

### Brief labels
| Key | Value | Controls |
|-----|-------|----------|
| `briefLabelYou` | `#a7bcc9` | "You" label |
| `briefLabelClaude` | `#36c9ff` | "Claude" label |

### Diff — Aurora rose scheme
Additions stay teal-green; removals are rose (not red), matching the Aurora
error family. Backgrounds are dark hue-tints so foreground text stays readable;
`*Word` highlights are a few shades brighter for inline changes.

| Key | Value | Controls |
|-----|-------|----------|
| `diffAdded` | `#0f2a24` | added-line background |
| `diffAddedDimmed` | `#0a1c18` | added-line bg (dimmed/context) |
| `diffAddedWord` | `#1d5448` | added inline word highlight |
| `diffRemoved` | `#2e151c` | removed-line background |
| `diffRemovedDimmed` | `#1d0d12` | removed-line bg (dimmed/context) |
| `diffRemovedWord` | `#5e2a38` | removed inline word highlight |

### Subagent palette (`*_FOR_SUBAGENTS_ONLY`)
Fixed 8-color wheel used to tint concurrent subagents.

| Key | Value |
|-----|-------|
| `cyan_FOR_SUBAGENTS_ONLY` | `#36c9ff` |
| `blue_FOR_SUBAGENTS_ONLY` | `#7ee0ff` |
| `purple_FOR_SUBAGENTS_ONLY` | `#a78bfa` |
| `pink_FOR_SUBAGENTS_ONLY` | `#ff7eb6` |
| `green_FOR_SUBAGENTS_ONLY` | `#7dd3c7` |
| `yellow_FOR_SUBAGENTS_ONLY` | `#c6a36b` |
| `red_FOR_SUBAGENTS_ONLY` | `#d9909a` |
| `orange_FOR_SUBAGENTS_ONLY` | `#e8a86b` |

### Rainbow ramp (`rainbow_*` + `_shimmer`)
Spectrum used for gradient/celebration effects. Each has a brighter `_shimmer`.

| Key | Value | Shimmer |
|-----|-------|---------|
| `rainbow_red` | `#d9909a` | `#ff7eb6` |
| `rainbow_orange` | `#e8a86b` | `#f2c880` |
| `rainbow_yellow` | `#c6a36b` | `#e8bf88` |
| `rainbow_green` | `#7dd3c7` | `#a0e8e0` |
| `rainbow_blue` | `#36c9ff` | `#7ee0ff` |
| `rainbow_indigo` | `#8b5cf6` | `#a78bfa` |
| `rainbow_violet` | `#c4b5fd` | `#ddd6fe` |

---

## Light variant

`aurora-light.json` (`base: "light"`) mirrors the structure with light-surface
values: cyan primary `#0288d1`, rose `#d63a6f`, text `#07131c` on white. The
light variant keeps the *web* hues (it is not brightness-pushed the way dark is).

Light is at **full key parity** with dark, including the mascot/spinner/accent
keys, mapped to light-surface equivalents:

| Key | Light value |
|-----|-------------|
| `clawd_body` | `#0288d1` |
| `clawd_background` | `#ffffff` |
| `claudeBlue_FOR_SYSTEM_SPINNER` | `#0288d1` |
| `claudeBlueShimmer_FOR_SYSTEM_SPINNER` | `#1aa6e8` |
| `effortUltra` | `#7c3aed` |
| `background` | `#8fb4c4` |
| `professionalBlue` | `#1aa6e8` |
| `chromeYellow` | `#b08a28` |

---

## Divergence from web

These keys are **intentionally** brighter than the web registry source of truth
and must stay CLI-local until a deliberate re-base:

| Token | CLI (this doc) | Web (`aurora.css`) |
|-------|----------------|--------------------|
| cyan primary | `#36c9ff` | `--aurora-accent-primary: #29b6f6` |
| rose | `#ff7eb6` | `--aurora-accent-pink: #f9a8c4` |
| inactive text | `#cfe0ec` | `--aurora-text-muted: #a7bcc9` |
| diff removals | rose tints | (web has no terminal-diff tokens) |

If/when the brightened cyan & rose are promoted system-wide, update `aurora.css`,
`themes/editors/zed/themes/aurora.json`, `themes/editors/warp/themes/aurora.yaml`,
`android/tokens/aurora.tokens.json` (incl. the `#29b6f6XX` alpha variants), the
READMEs, then re-run `scripts/export-aurora-tokens.mjs`.

---

## Deploy & sync

`themes/editors/claude-code/*.json` is canonical; `~/.claude/themes/*.json` are deployed
copies:

```sh
cp themes/editors/claude-code/aurora.json       ~/.claude/themes/aurora.json
cp themes/editors/claude-code/aurora-light.json ~/.claude/themes/aurora-light.json
```

Claude Code caches the theme when selected — after editing, re-run `/theme` and
re-pick **Aurora** (or restart the session) for changes to take effect.
