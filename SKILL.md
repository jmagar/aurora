---
name: Aurora Design System
description: Use this skill when designing for Labby — the gateway-admin web UI inside jmagar/lab. Aurora is a dark-first, operator-first design system with a tokenized navy palette, dual-accent system (cyan primary + rose secondary), muted status colors, and a Manrope + Inter type pairing. Apply it whenever the user references Labby, gateway-admin, Aurora tokens, or the lab monorepo's web surface.
---

# Aurora Design System

## Brand & mark

- **Primary mark: stacked plane.** Four isometric diamond planes (dark → light cyan, bottom to top) representing cli · api · mcp · web layers. This is the canonical favicon, app icon, and inline mark.
- **Secondary mark: hub & spoke.** Six nodes radiating from a central core. Used when the "control plane fanning out to services" read is needed. Not the primary corporate mark.
- **Wordmark:** Manrope 800, −0.04em tracking, sentence case. Accent (`--aurora-accent-primary`) on the suffix only — `Lab<accent>by</accent>`.
- `assets/` holds SVG exports of both marks (plateless and with plate, favicon variants).
- `Alternate Logos.html` — decision board documenting all explored directions and their keep/kill rationale.

## Foundations

- **Tokens live in `colors_and_type.css`.** Never use raw hex in product code. Reach for `--aurora-*` semantic vars or `color-mix(in srgb, var(--aurora-accent-primary) var(--aurora-tint-soft), transparent)` for tinted fills.
- **Dark-first.** Apply `.dark` (or default `:root`) for canonical visuals; `.light` is a remap on the same token surface. Both have been verified against the full component set.
- **Manrope** for display (titles, section headers, metric numbers, card titles). **Inter** for working UI (controls, body, tables, forms, metadata). **JetBrains Mono** for code, terminal, paths, IDs, badges — not for general prose or form labels.
- **Locked type ramp** — once a slot is chosen (Display 1 / Display 2 / Compact Title / Card Title / Metric / Body / Control / Dense / Dense Meta / Eyebrow / Badge Label), only color may be overridden.
- **`.aurora-page-shell`** — the canonical page background class (two-radial navy wash). Defined in `colors_and_type.css`; always use this class on `<body>` instead of hand-rolling the gradient. `.aurora-nav-shell` for sidebars/navs.

## Visual rules

- Three lift tiers: Tier 0 page (flat, no shadow), Tier 1 toolbars/headers (`shadow-medium`), Tier 2 inspectors/primary panels (`shadow-strong`). Each elevated surface pairs an outer shadow with an `inset 0 1px 0 rgba(255,255,255,0.035–0.05)` highlight.
- Borders: `--aurora-border-default` for resting, `--aurora-border-strong` for cards / inputs / selected.
- Selected = **border + glow**, not fill. Use `--aurora-active-glow`.
- Primary accent — Aurora cyan (`#29b6f6` / `#67cbfa` / `#1c7fac`). Secondary accent — Aurora rose (`#f9a8c4` / `#fbc4d6` / `#c46b88`). Rose is a **sanctioned secondary accent**: mono code highlights, key labels, send/agent affordance, rose-variant buttons. Maximum one or two rose touch points per screen.
- Status colors are **muted** (`warn #c6a36b`, `error #c78490`, `success #7dd3c7`). Never neon.
- **Buttons (Style D — Aurora glow border):** `border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 40%, transparent)` + `box-shadow: 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 20%, transparent), 0 0 12px color-mix(in srgb, var(--aurora-accent-primary) 15%, transparent)`. Three variants: `.btn-aurora` (cyan), `.btn-aurora-neutral` (muted), `.btn-aurora-rose` (rose). This is the canonical button style — all surfaces use it.
- **No glassmorphism. No imagery on chrome.** The only sanctioned gradient is the two-radial page-shell wash (baked into `.aurora-page-shell`).
- **Lucide line icons only**, 14–18px, stroke 1.5–1.75px. **No emoji as UI.**

## Badges (resolved)

**Style B is the canonical badge throughout the system.** Square chip, JetBrains Mono, 4px radius, optional glow dot in `currentColor`. Used everywhere — tables, status chips, tabs, breadcrumbs.

```html
<span class="badge-b bb-default"><span class="badge-dot"></span>Live</span>
```

The other three styles are available but not the default:
- **Style A (pill + dot + tinted border)** — archived, available if needed.
- **Style C (pill + no border + solid tint)** — low visual noise, list views.
- **Style D (dot-only minimal)** — inline status in sidebars and body copy.

## Banners (resolved)

Two banner styles in use:
- **Style A1 (elevated + glowing dot + dismiss)** — high-priority alerts, error/warning/info.
- **Style C (monospace tag + single-line)** — inline table rows, compact notices.
Style B (left rule) was explored and removed.

## Mono font usage

Mono (`JetBrains Mono`) is for: code blocks, terminal output, file paths, IDs/hashes, badge chips in code contexts, inline code snippets. It is **not** for: form labels, file tree names, body prose, general UI copy, or breadcrumb text.

## Content rules

- **Sentence case** for all UI copy: buttons, headers, table columns, menu items. *Active gateways*, not *Active Gateways*.
- **UPPERCASE only** for eyebrows (`AURORA_MUTED_LABEL`, 0.18em tracking, weight 700) and badge labels (`AURORA_BADGE_LABEL`, 0.14em).
- **No exclamation marks** anywhere in chrome.
- **No "we"**, **no apology framing**, **no marketing verbs**.
- Status copy is matter-of-fact: *"Backend unavailable."*, *"Plex authorized."*, *"Couldn't reach gateway. Retrying."*

## When designing new surfaces

1. Add `class="aurora-page-shell"` to `<body>` — never hand-roll the radial wash.
2. Build the working area on Tier 2 panels with `border-aurora-border-strong`, `radius-3` (22px), and `shadow-strong + highlight-strong`.
3. Use the typography ramp; never invent sizes. Keep mono strictly for code/paths/IDs.
4. Reach for the named tint scale through `color-mix()` for accent-tinted fills.
5. Make selected and focus states use border + glow, not flooded color.
6. Use Style D (Aurora glow border) buttons everywhere — import from the shell CSS or the shadcn registry.
7. Verify the same surface in `.light` before shipping.

## Component inventory

All 46 components are documented in `Design System Gallery.html` (shell) + `gallery/*.html` (sections):

**Foundations:** colors, type, spacing, brand

**Controls:** button (Style D), badge (Style B canonical), switch, avatar, progress

**Form elements:** input, select, textarea, checkbox/radio, tabs, pills

**Feedback:** banner (A1/C), toast (Labby stacked-plane mark + slide animation), tooltip, empty-state, skeleton

**Navigation:** breadcrumb (badge left of name), sidebar (Zed-style), command palette (⌘K), scrollbars

**Data:** stat cards (narrow — `auto-fill minmax(175px, 220px)`), data table (sortable, 8px radius), filter bar (rose tags for active filters), pagination

**Overlays:** modal/dialog, dropdown menu, context menu, permissions dropdown, thinking disclosure

**Chat & AI:** prompt input (with `/` + `@` popups, model selector, streaming state), tool calls (grouped consecutive), reasoning/plans, code block, artifact, terminal (Aurora-native chrome — no Mac chrome, stacked-plane mark in titlebar), permission prompt, ask-user-question, attachment

**Content:** file picker, file tree (sans font for file names), code editor, web preview (Aurora browser chrome), share dialog

**Auth & Errors:** login, OAuth flow, error pages (404/403/500)

### Additional design decisions captured here

- **Terminal chrome**: Aurora-native only. No macOS circles/dots. Title bar uses `--aurora-panel-strong`, stacked-plane SVG mark, Kill/Clear/Run buttons in Style D.
- **Left-border glow**: Always use `border-left: 3px solid` for active/inprog indicators (straight edge). Never `box-shadow` on rounded elements — it produces a rounded glow.
- **Breadcrumb badge position**: Badge goes LEFT of the item name.
- **Stat cards**: Never stretch full-width. Use `grid-template-columns: repeat(auto-fill, minmax(175px, 220px))`.
- **Table radii**: Tables use `border-radius: 8px` on the wrapper — not the default 22px panel radius.
- **Active filter tags**: Use rose (`filter-tag-rose`) for active filters, not cyan. Cyan blends into the control surface.
- **Toasts**: Labby stacked-plane SVG replaces all colored dot/circle icons. Dismiss `×` is colored by status type.

## File map

- `colors_and_type.css` — full token surface + semantic type classes + `.aurora-page-shell` + `.aurora-nav-shell`
- `Design System Gallery.html` — nav shell; loads `gallery/*.html` sections on click
- `gallery/` — 46 individual section fragments (HTML only, no `<head>`). All shared component CSS lives in the shell, not in individual fragments.
- `preview/` — legacy Type, Colors, Spacing, Components, Brand preview pages
- `ui_kits/gateway-admin/dashboard.html` — hi-fi admin shell (uses `.aurora-page-shell`)
- `assets/` — Labby stacked-plane + hub-and-spoke marks, favicons
- `exports/` — SVG exports of both marks (plateless + plate variants)
- `Alternate Logos.html` — logo decision board

## shadcn registry

React components published at **`github.com/jmagar/aurora-design-system`** under `registry/aurora/`:
- `registry/aurora/aurora.css` — token bridge (CSS vars → shadcn semantic vars)
- `registry/aurora/ui/` — 22 primitive components (tsx): button, badge, input, select, textarea, avatar, progress, switch, tabs, breadcrumb, pagination, dialog, dropdown-menu, tooltip, context-menu, checkbox, banner, toast, empty-state, skeleton, stat-card, data-table, filter-bar
- `registry/aurora/blocks/` — 19 composed/AI components (tsx): code-block, prompt-input, sidebar, terminal, thinking, tool-calls, artifact, permission-prompt, ask-user-question, permissions-dropdown, attachment, command-palette, share-dialog, file-picker, file-tree, code-editor, web-preview, login, oauth, error-page

The repo also ships a **live Next.js gallery** at `app/gallery/` — 46 demo routes rendering the real React components. Run `pnpm dev` and open `/gallery` to browse.

Install any component:
```bash
npx shadcn add https://raw.githubusercontent.com/jmagar/aurora-design-system/main/registry.json aurora-button
```

Active branch: `feat/functional-components` — adds sortable DataTable, interactive pagination, and fully wired interactive demos for all components.
