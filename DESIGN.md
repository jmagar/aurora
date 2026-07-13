---
version: alpha
name: Aurora
description: Operator-first, dark-first design system for Labby, agent products, and homelab control surfaces.
colors:
  primary: "#29b6f6"
  secondary: "#f9a8c4"
  tertiary: "#67cbfa"
  neutral: "#91a8b6"
  surface: "#07131c"
  on-surface: "#e6f4fb"
  error: "#c78490"
  page-bg: "#07131c"
  nav-bg: "#07111a"
  panel-medium: "#102330"
  panel-strong: "#13293a"
  panel-strong-top: "#173245"
  control-surface: "#0c1a24"
  hover-bg: "#17364b"
  border-default: "#1d3d4e"
  border-strong: "#24536c"
  text-primary: "#e6f4fb"
  text-muted: "#a7bcc9"
  accent-primary: "#29b6f6"
  accent-strong: "#67cbfa"
  accent-deep: "#1c7fac"
  accent-lift: "#4dc8fa"
  accent-button: "#1da8e6"
  accent-foreground: "#051520"
  accent-pink: "#f9a8c4"
  accent-pink-strong: "#fbc4d6"
  accent-pink-deep: "#c46b88"
  accent-pink-button: "#e879a0"
  accent-pink-foreground: "#fdeaf1"
  axon-orange: "#ff9645"
  axon-orange-strong: "#ffb474"
  axon-orange-deep: "#c96a1c"
  axon-orange-button: "#f5801f"
  info: "#72c8f5"
  info-foreground: "#dff5ff"
  success: "#7dd3c7"
  success-foreground: "#dcfbf6"
  warn: "#c6a36b"
  warn-foreground: "#f8ead0"
  error-lift: "#d9909a"
  error-foreground: "#fde6eb"
  neutral-foreground: "#d7e3ea"
  code-type: "#b8d9f5"
  preview-allowed: "#00e676"
  preview-unmatched: "#ff9100"
  preview-highlight: "#ffea00"
  light-page-bg: "#f0f6f8"
  light-nav-bg: "#e4f0f5"
  light-panel-medium: "#ffffff"
  light-panel-strong: "#f8fbfc"
  light-control-surface: "#edf5f8"
  light-hover-bg: "#dceef4"
  light-border-default: "#b8d0da"
  light-border-strong: "#8fb4c4"
  light-text-primary: "#07131c"
  light-text-muted: "#3d6070"
  light-accent-primary: "#0288d1"
  light-accent-strong: "#0277bd"
  light-accent-deep: "#01579b"
  light-accent-lift: "#1aa6e8"
  light-accent-button: "#0277bd"
  light-accent-pink: "#d63a6f"
  light-accent-pink-strong: "#e0527f"
  light-accent-pink-deep: "#a0284f"
  light-accent-pink-button: "#b82f60"
  light-axon-orange: "#e0731a"
  light-info: "#0f7db8"
  light-success: "#2d7d6e"
  light-warn: "#8a6914"
  light-error: "#9c3545"
  light-neutral: "#6f8793"
typography:
  display-hero:
    fontFamily: Manrope
    fontSize: 76px
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  display-1:
    fontFamily: Manrope
    fontSize: 34px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.045em"
  display-2:
    fontFamily: Manrope
    fontSize: 19px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  section:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 760
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 480
    lineHeight: 1.58
    letterSpacing: 0
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 480
    lineHeight: 1.5
    letterSpacing: 0.005em
  ui:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 560
    lineHeight: 1.35
    letterSpacing: 0.005em
  control:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 560
    lineHeight: 1.28
    letterSpacing: 0.005em
  table:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 480
    lineHeight: 1.42
    letterSpacing: 0.005em
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: 0.012em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 560
    lineHeight: 1.35
    letterSpacing: 0.012em
  meta:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 560
    lineHeight: 1.35
    letterSpacing: 0.018em
  eyebrow:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: 0.095em
  code:
    fontFamily: JetBrains Mono
    fontSize: 0.93em
    fontWeight: 520
    lineHeight: 1.4
    letterSpacing: 0
rounded:
  none: 0px
  sm: 14px
  md: 18px
  lg: 22px
  table: 8px
  compact: 10px
  pill: 999px
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 10px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  control-y: 9px
  control-x: 14px
  panel-pad: 16px
  section-gap: 24px
components:
  page-shell:
    backgroundColor: "{colors.page-bg}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
  nav-shell:
    backgroundColor: "{colors.nav-bg}"
    textColor: "{colors.text-primary}"
  panel-tier-1:
    backgroundColor: "{colors.panel-medium}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
  panel-tier-2:
    backgroundColor: "{colors.panel-strong}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
    padding: "{spacing.control-x}"
  button-primary-filled:
    backgroundColor: "{colors.accent-button}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.sm}"
    padding: "{spacing.control-x}"
  button-secondary:
    backgroundColor: "{colors.control-surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
  button-rose:
    backgroundColor: "{colors.accent-pink-button}"
    textColor: "{colors.page-bg}"
    rounded: "{rounded.sm}"
  button-async:
    backgroundColor: "{colors.axon-orange-button}"
    textColor: "{colors.page-bg}"
    rounded: "{rounded.sm}"
  input:
    backgroundColor: "{colors.control-surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.control-x}"
  card:
    backgroundColor: "{colors.panel-strong}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.panel-pad}"
  table:
    backgroundColor: "{colors.panel-medium}"
    textColor: "{colors.text-primary}"
    typography: "{typography.table}"
    rounded: "{rounded.table}"
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.page-bg}"
    typography: "{typography.caption}"
    rounded: "{rounded.compact}"
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.page-bg}"
    typography: "{typography.caption}"
    rounded: "{rounded.compact}"
  badge-warn:
    backgroundColor: "{colors.warn}"
    textColor: "{colors.page-bg}"
    typography: "{typography.caption}"
    rounded: "{rounded.compact}"
  badge-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.page-bg}"
    typography: "{typography.caption}"
    rounded: "{rounded.compact}"
  badge-neutral:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.page-bg}"
    typography: "{typography.caption}"
    rounded: "{rounded.compact}"
---

# Aurora Design System

This file is the agent-readable design contract for Aurora. It follows the Stitch `DESIGN.md` shape: the YAML front matter above contains normative, machine-readable tokens, while the markdown below explains how to apply them in Aurora surfaces.

Source of truth:

- Token layer: `registry/aurora/styles/aurora.css`
- Component styles: `registry/aurora/styles/aurora-components.css`
- Registry manifest: `registry.json`
- Gallery taxonomy: `app/gallery/nav-data.ts`
- Theme catalog: `lib/themes.ts`

Official references checked for this document:

- Google Stitch DESIGN.md overview: <https://stitch.withgoogle.com/docs/design-md/overview/>
- Import from your codebase: <https://stitch.withgoogle.com/docs/design-md/get-instructions/>
- The DESIGN.md specification: <https://stitch.withgoogle.com/docs/design-md/specification/>
- View, edit, and export: <https://stitch.withgoogle.com/docs/design-md/usage/>
- Validate with the CLI: <https://stitch.withgoogle.com/docs/design-md/cli/>
- Linting rules: <https://stitch.withgoogle.com/docs/design-md/linting-rules/>
- Open-source specification repository: <https://github.com/google-labs-code/design.md>

## Overview

Aurora is an operator-first design system for Labby, homelab control planes, agent workflows, code surfaces, and shadcn-compatible product UIs. It should feel calm, precise, legible, and engineered. The visual identity is dark-first navy with cyan as the primary action color, rose as a secondary expressive accent, and Axon orange for async work, heavy jobs, and automation state.

Aurora is not a marketing skin. It is a working interface language for repeated use by technical operators. Screens should favor dense but readable information, direct controls, predictable navigation, restrained motion, clear state, and fast scan paths. Decorative effects are allowed only when they reinforce hierarchy or state.

The system spans web, Android, CLI, editors, terminal, browser, and shell themes. Web components live in this repo as a shadcn registry. Non-web palettes intentionally diverge where terminal and editor contrast require brighter colors; do not paste web hex values into CLI/editor themes without checking the relevant theme source.

Current registry footprint from `registry.json`:

- 174 registry items total.
- 3 style entries, 1 base entry, 2 theme entries, 4 file entries, 2 registry item entries, 9 page entries, 79 UI entries, 73 block entries, and 1 lib entry.
- UI primitives live in `registry/aurora/ui/`.
- Product blocks live in `registry/aurora/blocks/`.

## Colors

Aurora's default mode is dark. The dark palette is the canonical product UI palette; light mode is a supported counterpart, not a separate identity.

Primary roles:

- Primary accent: cyan (`#29b6f6`) for focus, active state, primary command affordances, and the one clearest call to action.
- Secondary accent: rose (`#f9a8c4`) for agent affordances, send actions, active filter tags, and small expressive highlights.
- Tertiary/support accent: cyan strong (`#67cbfa`) for hover, active emphasis, selected borders, and elevated cyan affordances.
- Automation accent: Axon orange (`#ff9645`) for async work, slash commands, heavy jobs, automation, and background execution only.
- Status colors: muted info, success, warn, error, and neutral families. Status must read clearly without neon intensity.
- Text: `text-primary` for main content and `text-muted` for metadata, placeholders, descriptions, timestamps, and secondary labels.

Dark mode tokens:

| Role | Token | Value |
|---|---|---|
| Page | `--aurora-page-bg` | `#07131c` |
| Nav | `--aurora-nav-bg` | `#07111a` |
| Tier 1 panel | `--aurora-panel-medium` | `#102330` |
| Tier 2 panel | `--aurora-panel-strong` | `#13293a` |
| Control surface | `--aurora-control-surface` | `#0c1a24` |
| Hover | `--aurora-hover-bg` | `#17364b` |
| Border | `--aurora-border-default` | `#1d3d4e` |
| Strong border | `--aurora-border-strong` | `#24536c` |
| Text | `--aurora-text-primary` | `#e6f4fb` |
| Muted text | `--aurora-text-muted` | `#a7bcc9` |
| Cyan | `--aurora-accent-primary` | `#29b6f6` |
| Cyan strong | `--aurora-accent-strong` | `#67cbfa` |
| Rose | `--aurora-accent-pink` | `#f9a8c4` |
| Axon orange | `--axon-orange` | `#ff9645` |
| Info | `--aurora-info` | `#72c8f5` |
| Success | `--aurora-success` | `#7dd3c7` |
| Warn | `--aurora-warn` | `#c6a36b` |
| Error | `--aurora-error` | `#c78490` |
| Neutral | `--aurora-neutral` | `#91a8b6` |

Light mode tokens:

| Role | Token | Value |
|---|---|---|
| Page | `--aurora-page-bg` | `#f0f6f8` |
| Nav | `--aurora-nav-bg` | `#e4f0f5` |
| Tier 1 panel | `--aurora-panel-medium` | `#ffffff` |
| Tier 2 panel | `--aurora-panel-strong` | `#f8fbfc` |
| Control surface | `--aurora-control-surface` | `#edf5f8` |
| Hover | `--aurora-hover-bg` | `#dceef4` |
| Border | `--aurora-border-default` | `#b8d0da` |
| Strong border | `--aurora-border-strong` | `#8fb4c4` |
| Text | `--aurora-text-primary` | `#07131c` |
| Muted text | `--aurora-text-muted` | `#3d6070` |
| Cyan | `--aurora-accent-primary` | `#0288d1` |
| Rose | `--aurora-accent-pink` | `#d63a6f` |
| Axon orange | `--axon-orange` | `#e0731a` |
| Info | `--aurora-info` | `#0f7db8` |
| Success | `--aurora-success` | `#2d7d6e` |
| Warn | `--aurora-warn` | `#8a6914` |
| Error | `--aurora-error` | `#9c3545` |
| Neutral | `--aurora-neutral` | `#6f8793` |

Color rules:

- Use CSS variables, not raw hex values, in product code.
- Selection and focus use border plus glow. Avoid flooded selected fills.
- Keep rose to one or two meaningful accents per screen.
- Use Axon orange for async and automation identity. Violet is not part of the current web token source.
- Never map Axon orange to `primary`, `tertiary`, default CTAs, or general interaction color.
- Use semantic status tokens for status; do not use brand accents as error, warning, or success shortcuts.
- Use `color-mix()` surface and border tokens for soft fills instead of inventing new translucent colors.

## Typography

Aurora uses three type families:

- Manrope for display and section headings.
- Inter for working UI, body, controls, labels, tables, metadata, and captions.
- JetBrains Mono only for code, file paths, command snippets, IDs, hashes, terminal output, and code-context badges.

Canonical text classes:

| Class | Role |
|---|---|
| `.aurora-text-display-hero` | Marketing hero text only. |
| `.aurora-text-display-1` | Page heroes and large numbers. |
| `.aurora-text-display-2` | Section heroes and compact display text. |
| `.aurora-text-section` | Section headers and card titles. |
| `.aurora-text-body` | Default prose and app body text. |
| `.aurora-text-body-sm` | Compact descriptions and secondary body text. |
| `.aurora-text-ui` | Working UI copy in rows, menus, and compact panels. |
| `.aurora-text-control` | Buttons and control labels. |
| `.aurora-text-table` | Table cells. |
| `.aurora-text-label` | Form labels. |
| `.aurora-text-caption` | Captions and small support text. |
| `.aurora-text-meta` | Metadata, timestamps, counts, and quiet identifiers. |
| `.aurora-text-eyebrow` | Uppercase eyebrow labels. Use sparingly. |
| `.aurora-text-code` | Inline code, paths, IDs, and terminal-like text. |

Typography rules:

- Match type scale to the container. Compact panels, sidebars, cards, and toolbars should not use hero-scale type.
- Use sentence case for UI copy. Reserve uppercase for eyebrows and terse technical labels.
- Mono is restricted. Do not use mono for ordinary labels, body text, form labels, breadcrumbs, or file names unless the string is truly code-like.
- Keep line lengths short enough for scanning. Dense app surfaces should prefer compact sections over long prose.
- Marketing-only type may be larger; app and operator surfaces should stay tighter.

## Layout

Aurora layouts should feel like tools, not landing pages. The page shell is flat; content is organized by navigation, work area, inspector/detail surfaces, and repeated rows or tiles.

Core structure:

- Use `.aurora-page-shell` at the top of web app surfaces.
- Use `.aurora-nav-shell` for sidebars and nav rails.
- Use a constrained inner width for marketing/docs pages.
- Use stable dimensions for boards, tables, toolbars, icon buttons, counters, and tiles so hover and loading states do not shift layout.
- Prefer full-width bands or unframed sections for page structure.
- Use cards for repeated items, panels, modals, and genuinely framed tools. Do not nest cards inside cards.

Spacing:

- Base scale is 4, 8, 10, 12, 16, 20, and 24 px.
- Controls are compact and predictable: 13 px text, 9-12 px vertical padding, and 12-14 px horizontal padding depending on density.
- Stat cards should use narrow tracks, not stretch across the full page.
- Dense lists and tables should preserve scan rhythm through consistent row height and borders.

Responsive behavior:

- Mobile keeps the same product surface first. Do not replace the app with a marketing hero.
- Primary navigation may collapse, but active state and page identity must remain visible.
- Text must not overlap or clip inside buttons, cards, rows, or sidebars.
- Fixed-format UI elements need explicit responsive constraints such as `minmax()`, `aspect-ratio`, min/max widths, or stable track sizing.

## Elevation & Depth

Aurora has three practical lift tiers:

| Tier | Use | Tokens |
|---|---|---|
| Tier 0 | Page background and full-page shell. | `--aurora-page-bg`, `--aurora-shell-bg` |
| Tier 1 | Toolbars, headers, side panels, light cards, list containers. | `--aurora-panel-medium`, `--aurora-shadow-medium`, `--aurora-highlight-medium` |
| Tier 2 | Primary panels, inspectors, popovers, dialogs, featured cards. | `--aurora-panel-strong`, `--aurora-shadow-strong`, `--aurora-highlight-strong` |

Depth rules:

- Pair elevated surfaces with a border and subtle inset top highlight.
- Use shadows as hierarchy, not decoration.
- Use border plus glow for active, selected, and focus-visible states.
- Avoid glassmorphism, blur-heavy chrome, decorative orbs, bokeh, and atmospheric backgrounds.
- Left-border glow is the active/in-progress list indicator. Do not use rounded box-shadows for left-edge indicators.

## Shapes

Aurora shapes are moderately rounded but still engineered:

- `14px` for buttons, chips, and compact controls.
- `18px` for small cards, popovers, and medium raised surfaces.
- `22px` for Tier 2 panels and strong cards.
- `8px` for tables and fixed data wrappers.
- `999px` or `9999px` only for pills, avatars, slider thumbs, and circular controls.

Shape rules:

- Do not mix sharp and heavily rounded primitives in the same cluster.
- Tables are intentionally tighter than panels.
- Icon buttons must keep a stable square hit area.
- Pills are for filters and compact tags, not every button.

## Components

Aurora is a shadcn-compatible registry. Component architecture should remain close to shadcn where possible: Radix primitives, `Slot`/`asChild` where appropriate, `class-variance-authority` for variants, and tokenized visual layers.

Use registry components when available. Do not hand-roll local lookalikes beside Aurora primitives.

Component families in the gallery:

- Foundations: colors, typography, spacing, brand, direction.
- Controls: buttons, button group, badges, toggles, switch, avatar, progress, spinner, separator, toolbar, kbd.
- Form elements: inputs, fields, labels, input group, OTP, native select, select, combobox, checkbox, radio, slider, number input, textarea, calendar, date picker, tabs.
- Feedback: alerts, banners, callouts, toasts, tooltip, empty states, skeleton, status indicator, shimmer, confirmation.
- Navigation: breadcrumb, pagination, command, navigation menu, menubar.
- Data: stat cards, tables, data table, filters, timeline, description list, search results, listbox, marketplace.
- Overlays: modal, dialog, alert dialog, accordion, collapsible, dropdown, context menu, popover, hover card, sheet, drawer, share dialog.
- Chat and AI: prompt input, message, conversation, model selector, persona, reasoning, tool calls, thinking, chain of thought, plan, task, queue, suggestion, artifact, terminal, permission prompt, ask user question, command palette, sidebar.
- Runtime and execution: agent, checkpoint, commit, context, environment variables, package info, schema display, sandbox, snippet, JSX preview, stack trace, test results, panels, controls, canvas, connection, edge, node.
- Media and voice: audio player, mic selector, speech input, transcription, voice selector.
- Content and files: attachment, sources, inline citation, file picker, file tree, code editor, code workspace, web preview, aspect ratio, card, carousel, chart, image, item, resizable panels, scroll area.
- Auth and errors: login, OAuth, error pages.

Component rules:

- Buttons default to lit-outline neutral or cyan. Filled buttons are reserved for the one primary/armed action on a surface.
- Icon buttons should use lucide-react icons at 14-18 px with 1.5-1.75 px stroke.
- Badges use tone plus fill, not ad hoc colors. Valid tones are info, success, warn, error, neutral, rose, and cyan. Deprecated violet falls back to cyan in the current component.
- Inputs use Aurora borders, validation rings, and control-surface backgrounds. Validation states map to error, warn, and success tokens.
- Cards use Tier 1 or Tier 2 surfaces, optional cyan or rose accent edges, and optional interactive lift. Do not create card-in-card layouts.
- Tables use 8 px radius, strong borders, 13 px table text, sortable header affordances, and tabular numeric alignment where needed.
- Prompt input and agent controls use rose for send/agent emphasis and Axon orange for slash commands, mentions, async state, and heavy work.
- Terminal, code, file tree, and stack trace surfaces may use mono, but only for code-like text.

## Do's and Don'ts

Do:

- Do import `aurora.css` once at the app root before using components.
- Do install the token layer before installing individual registry items.
- Do use `var(--aurora-*)` tokens in web code.
- Do keep dark mode as the default and verify light mode before shipping.
- Do use semantic text classes before inventing a custom type size.
- Do use border plus glow for focus, selection, and active state.
- Do keep command surfaces dense, scannable, and predictable.
- Do keep primary and default call-to-action affordances in the cyan family.
- Do use Lucide icons for recognizable actions.
- Do preserve accessibility labels, focus-visible state, keyboard activation, and ARIA state.
- Do update registry source first, rebuild generated registry JSON, and then sync consumers.

Don't:

- Don't hardcode Tailwind default colors or raw hex values in product code.
- Don't reintroduce violet as the AI identity in web components; use Axon orange for automation.
- Don't use Axon orange as the primary color, tertiary color, default CTA color, or generic interaction accent.
- Don't use glassmorphism, decorative gradient blobs, or atmospheric imagery as app chrome.
- Don't flood selected rows or cards with heavy fills.
- Don't use rose everywhere. It is an accent, not a second primary palette.
- Don't use mono for general UI prose, labels, breadcrumbs, or ordinary filenames.
- Don't hand-roll a control that already exists in `registry/aurora/ui`.
- Don't patch a consuming app in a way that diverges from the Aurora registry.
- Don't put cards inside cards.
- Don't make marketing copy the first screen of a tool or app surface.

## Consumer behavior for unknown content

Aurora consumers should be forgiving but explicit:

| Scenario | Behavior |
|---|---|
| Unknown markdown section | Preserve it and continue. |
| Unknown color token with a valid hex value | Accept it, but do not map it to Aurora UI automatically. |
| Unknown typography token | Preserve it and treat it as project-specific. |
| Unknown component token | Preserve it and warn when it cannot be applied. |
| Duplicate canonical section | Reject the file or ask for correction. |
| Raw color in product code | Treat as a design-system violation unless it is a generated asset or external brand requirement. |
| Missing Aurora token | Add it to the source token layer first, then consume it. |

## Implementation and source of truth

Aurora has one source of truth per surface:

- Web: `registry/aurora/styles`, `registry/aurora/ui`, `registry/aurora/blocks`, and `registry.json`.
- Android: `android/aurora` and generated token outputs from `pnpm tokens:generate`.
- Editor, terminal, shell, and browser themes: `themes/` plus served copies under `public/{chrome,zed,warp}`.

When making changes:

1. Update source files, not generated registry files first.
2. If `registry/aurora/**` changed, run `pnpm registry:build`.
3. If token values changed, run `pnpm tokens:generate`.
4. Keep served theme URLs stable.
5. Keep consuming apps synced from Aurora instead of forking styles locally.

## Accessibility

Aurora should be usable by keyboard, screen reader, and low-vision users:

- Every interactive element needs visible focus state.
- Icon-only buttons need accessible labels.
- Status cannot rely on color alone.
- Text contrast should meet WCAG AA for normal text.
- Touch targets should remain large enough on mobile and dense enough on desktop.
- Motion must respect `prefers-reduced-motion`.
- Disabled and loading states must preserve layout width and communicate state.

## Motion

Motion is small and functional:

- Instant: `100ms`.
- Fast: `160ms`.
- Medium: `240ms`.
- Slow: `360ms`.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` for ease-out and `cubic-bezier(0.4, 0, 0.2, 1)` for ease-in-out.

Use motion for disclosure, hover, focus, loading, and state transitions. Avoid bouncing, excessive parallax, or animation that distracts from operational work.

## Recommended token names

Use these names when extending Aurora:

- Colors: `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error`, plus Aurora-specific names such as `panel-medium`, `panel-strong`, `accent-primary`, `accent-pink`, and `axon-orange`. In Aurora, `tertiary` stays in the cyan family; automation-specific orange remains named `axon-orange`.
- Typography: `display-hero`, `display-1`, `display-2`, `section`, `body`, `body-sm`, `ui`, `control`, `table`, `label`, `caption`, `meta`, `eyebrow`, `code`.
- Rounded: `none`, `sm`, `md`, `lg`, `table`, `compact`, `pill`, `full`.
- Spacing: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `control-y`, `control-x`, `panel-pad`, `section-gap`.
- Components: use hyphenated component identifiers, such as `button-primary`, `button-primary-filled`, `input`, `card`, `table`, `badge-info`, and `prompt-input`.
