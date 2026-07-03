---
name: aurora-design-system
description: Use this skill when designing or implementing Aurora/Labby UI surfaces, shadcn registry components, registry/aurora tokens, app/gallery demos, or downstream Lab/gateway-admin screens that must follow the Aurora dark-first operator design system. Aurora uses a tokenized navy palette, cyan primary accent, rose secondary accent, muted status colors, and a Manrope + Inter type pairing.
---

# Aurora Design System

## Source of truth

Inspect current repo files before making inventory, route, or API claims:

- `registry/aurora/styles/aurora.css` - canonical token bridge, semantic CSS variables, type classes, `.aurora-page-shell`, and `.aurora-nav-shell`.
- `registry/aurora/ui/` - primitive React components.
- `registry/aurora/blocks/` - composed React blocks.
- `registry.json` - shadcn registry source entries and registry dependencies.
- `public/r/registry.json` - generated shadcn registry output after `pnpm registry:build`.
- `app/gallery/[section]/page.tsx` - gallery route map and generated static params.
- `app/gallery/demos/` - live demos for the real React components.
- `app/globals.css` - imports `registry/aurora/styles/aurora.css`.

Do not hard-code component counts, gallery route counts, or active branch names in deliverables. Derive them from `registry.json`, `app/gallery/[section]/page.tsx`, and git when needed.

## Brand & mark

- **Primary mark: stacked plane.** Four isometric diamond planes (dark to light cyan, bottom to top) representing cli, api, mcp, and web layers. This is the canonical favicon, app icon, and inline mark when available in the current surface.
- **Secondary mark: hub & spoke.** Six nodes radiating from a central core. Use only when the "control plane fanning out to services" read is needed.
- **Wordmark:** Manrope 800, tight tracking, sentence case. Current gallery treatment renders `Labb` in primary text and accents the `y` with `--aurora-accent-pink`; verify `app/gallery/demos/brand-demo.tsx` before changing the canonical mark.

## Foundations

- **Tokens live in `registry/aurora/styles/aurora.css`.** Never use raw hex in product code. Reach for `--aurora-*` semantic vars or `color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)` for tinted fills.
- **Dark-first.** Apply `.dark` or the default root variables for canonical visuals. `.light` remaps the same token surface and must remain usable.
- **Manrope** is for display: titles, section headers, metric numbers, and card titles. **Inter** is for working UI: controls, body, tables, forms, and metadata. **JetBrains Mono** is only for code and terminal content: code blocks, inline code, shell commands, and console/terminal output — never for paths/IDs/hashes shown as data, chips, tables, labels, or decoration.
- **Locked type ramp.** Use the semantic type classes in `registry/aurora/styles/aurora.css`; once a slot is chosen, override color before inventing a new size.
- **Page shell:** use `.aurora-page-shell` for the canonical two-radial navy page wash and `.aurora-nav-shell` for sidebars/navs.

## Visual rules

- Three lift tiers: Tier 0 page is flat; Tier 1 toolbars/headers use `var(--aurora-shadow-medium)`; Tier 2 inspectors/primary panels use `var(--aurora-shadow-strong)`. Pair elevated surfaces with an inset top highlight such as `inset 0 1px 0 rgba(255,255,255,0.04)`.
- Borders: `--aurora-border-default` for resting separators and `--aurora-border-strong` for cards, inputs, and selected surfaces.
- Selected and focused states use **border + glow**, not filled color. Use `var(--aurora-active-glow)`.
- Primary accent is cyan: `--aurora-accent-primary`, `--aurora-accent-strong`, `--aurora-accent-deep`.
- Secondary accent is rose: `--aurora-accent-pink`, `--aurora-accent-pink-strong`, `--aurora-accent-pink-deep`. Rose is sanctioned for mono code highlights, key labels, send/agent affordances, rose buttons, and active filter tags. Keep it to one or two touch points per screen.
- Status colors are muted: `--aurora-warn`, `--aurora-error`, `--aurora-success`. Never use neon status colors.
- **Buttons:** use the registry `Button` component from `registry/aurora/ui/button.tsx` with `variant="aurora" | "neutral" | "rose" | "ghost" | "destructive"`. The canonical style is Aurora glow border, implemented by the component.
- **No glassmorphism. No imagery on chrome.** The only sanctioned chrome gradient is the `.aurora-page-shell` wash.
- **Lucide line icons only**, 14-18px, stroke 1.5-1.75px. No emoji as UI.

## Component API Patterns

- Use `rounded-[var(--aurora-radius-3)]` for the 22px panel radius.
- Use inline or class-supported shadows like `boxShadow: "var(--aurora-shadow-strong)"`.
- Use `boxShadow: "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,0.05)"` for Tier 2 panels when no local helper exists.
- Registry entries should declare `registryDependencies` for Aurora components they import. At minimum, token-dependent components need `aurora-tokens`.
- When adding a gallery demo, register it in the `DEMOS` map in `app/gallery/[section]/page.tsx` and add a nav entry in `app/gallery/nav-data.ts`. There is no demo wiring in `layout.tsx`.
- After registry changes, run `pnpm registry:build` so `public/r/*.json` and `public/r/registry.json` stay aligned.

## Badges

Style B is the canonical badge throughout the system: square chip, JetBrains Mono, 4px radius, optional glow dot in `currentColor`. Use the React `Badge` component and its variants (`default`, `success`, `warn`, `error`, `rose`) before hand-rolling badge CSS.

The other badge patterns are secondary:

- Style A: pill + dot + tinted border; archived but available if a specific surface needs it.
- Style C: pill + no border + solid tint; useful for low-noise list views.
- Style D: dot-only minimal; useful inline in sidebars and body copy.

## Banners

Two banner styles are in use:

- Style A1: elevated + glowing dot + dismiss for high-priority alerts, error, warning, and info.
- Style C: monospace tag + single-line for inline table rows and compact notices.

Style B (left rule) was explored and removed.

## Mono Font Usage

Mono (`JetBrains Mono`) is **only** for code and terminal content: code blocks, inline code snippets, shell commands, and console/terminal output. Nothing else. Do NOT use mono for data tables, log-row UI, version/dependency chips, file paths shown as data, IDs/hashes shown as data, timestamps, section labels, form labels, file tree names, body prose, general UI copy, or breadcrumb text — those all use the sans stack (Inter / `--aurora-font-sans`). Mono must read as *literal code or terminal*, never as generic "techy" decoration.

## Content Rules

- Use sentence case for UI copy: buttons, headers, table columns, and menu items. Use *Active gateways*, not *Active Gateways*.
- Uppercase only for eyebrows and badge labels.
- No exclamation marks in chrome.
- No "we", no apology framing, no marketing verbs.
- Status copy is matter-of-fact: *"Backend unavailable."*, *"Plex authorized."*, *"Couldn't reach gateway. Retrying."*

## Designing New Surfaces

1. Add `className="aurora-page-shell"` or `class="aurora-page-shell"` to the page shell when the surface owns the page background.
2. Build working areas on Tier 2 panels with `borderColor: "var(--aurora-border-strong)"`, `borderRadius: "var(--aurora-radius-3)"`, and `boxShadow: "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,0.05)"`.
3. Use the semantic typography ramp from `registry/aurora/styles/aurora.css`; never invent sizes unless the ramp is missing a real use case.
4. Keep mono strictly for code and terminal content — never for paths/IDs/labels/chips shown as data.
5. Use tokenized tint fills through `color-mix()` and Aurora semantic vars.
6. Make selected and focus states use border + glow, not flooded color.
7. Use the registry `Button` variants everywhere a React surface can import them.
8. Verify the same surface in `.light` before shipping.

## Component Inventory Guidance

Use this section as a category map, not as a count source. Verify exact inventory from `registry.json` and exact gallery routes from `app/gallery/[section]/page.tsx`.

**Foundations:** colors, type, spacing, brand

**Controls:** button, button group, badge, switch, avatar, progress, spinner, toolbar, kbd, separator, accordion, toggle, toggle group

**Form elements:** field, input, input group, input OTP, select, native select, textarea, checkbox, radio group, label, slider, number input, combobox, date picker, tabs, pills

**Feedback:** alert/callout, banner, toast/sonner, tooltip, empty-state, skeleton, shimmer

**Navigation:** breadcrumb, sidebar, command palette, navigation menu, menubar, scroll area/scrollbars, pagination

**Data:** stat cards, card, item, table, data table, chart, carousel, filter bar, marketplace catalog, status indicator, timeline, description list, search results, calendar

**Overlays:** dialog, alert dialog, dropdown menu, context menu, hover card, popover, sheet/drawer, collapsible, permissions dropdown, thinking disclosure

**Chat & AI:** prompt input, AI elements, message, inline citation, sources, suggestion, queue, checkpoint, confirmation, context, conversation, model selector, tool calls, reasoning/plans/chain-of-thought, code block, artifact, terminal, permission prompt, ask-user-question, attachment, agent, commit, package info, sandbox, schema display, snippet, stack trace, test results, environment variables

**Voice & workflow:** audio player, mic selector, persona, speech input, transcription, voice selector, canvas, connection, controls, edge, node, panel

**Content:** aspect ratio, direction, image, open in chat, file picker, file tree, code editor, JSX preview, web preview, share dialog, callout, resizable panels

**Auth & Errors:** login, OAuth flow, error pages

## Resolved Decisions

- **Terminal chrome:** Aurora-native only. No macOS circles/dots. Title bar uses `--aurora-panel-strong`, the stacked-plane mark when available, and Style D/Aurora `Button` actions for kill, clear, and run.
- **Left-border glow:** Use `border-left: 3px solid` for active/in-progress indicators. Avoid box-shadow on rounded elements for left-edge indicators because it creates a rounded glow.
- **Breadcrumb badge position:** Badge goes left of the item name.
- **Stat cards:** Do not stretch full-width. Use narrow tracks like `repeat(auto-fill, minmax(175px, 220px))`.
- **Table radii:** Tables use `border-radius: 8px` on the wrapper, not the default 22px panel radius.
- **Active filter tags:** Use rose for active filters. Cyan blends into the control surface.
- **Toasts:** The Labby stacked-plane mark replaces generic colored dot/circle icons where the mark is available. Dismiss `x` is colored by status type.

## shadcn Registry Workflow

React components are published from `github.com/jmagar/aurora-design-system` under `registry/aurora/`.

Install any component:

```bash
npx shadcn add https://raw.githubusercontent.com/jmagar/aurora-design-system/main/registry.json aurora-button
```

Before claiming registry status:

1. Inspect `registry.json`.
2. Run `pnpm registry:build` after registry edits.
3. Inspect `public/r/registry.json` or the specific generated `public/r/aurora-*.json` file.
4. Run `pnpm lint` and, for route/demo changes, `pnpm build`.
