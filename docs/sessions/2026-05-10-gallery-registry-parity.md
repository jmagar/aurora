# 2026-05-10 Gallery Registry Parity

## Context

Repository: `/home/jmagar/workspace/aurora-design-system`

Branch: `main`

The session focused on finishing Aurora registry/gallery parity after adding many shadcn and AI Elements components. The main user concern was that components, especially AI Elements, should not be randomly grouped behind a generic parity page. Each installable registry item should have a first-class gallery surface.

## Completed Work

- Split AI Elements gallery coverage so every individual AI element has a dedicated demo module and route.
- Added a shared AI element demo renderer in `app/gallery/demos/ai-element-page.tsx`.
- Added dedicated AI demo files such as `ai-message-demo.tsx`, `ai-tool-demo.tsx`, `ai-open-in-chat-demo.tsx`, and the rest of the AI Elements set.
- Replaced the old generic shadcn parity bucket with explicit component route mappings in `app/gallery/[section]/page.tsx`.
- Added dedicated demo modules for shadcn parity components including `alert`, `alert-dialog`, `aspect-ratio`, `calendar`, `card`, `carousel`, `chart`, `collapsible`, `date-picker`, `field`, `hover-card`, `input-group`, `input-otp`, `item`, `label`, `menubar`, `navigation-menu`, `popover`, `radio-group`, `scroll-area`, `table`, `toggle`, and `toggle-group`.
- Split previously grouped newer primitives into their own pages: `number-input`, `combobox`, `sheet`, `callout`, `status-indicator`, `timeline`, `description-list`, `resizable-panels`, `listbox`, `search-results`, `kbd`, and `toolbar`.
- Added canonical registry-name aliases for old gallery group names:
  - `button` -> `buttons`
  - `badge` -> `badges`
  - `checkbox` -> `checkboxes`
  - `banner` -> `banners`
  - `toast` -> `toasts`
  - `empty-state` -> `empty`
  - `stat-card` -> `stats`
  - `filter-bar` -> `filters`
  - `dialog` -> `modals`
  - `dropdown-menu` -> `dropdowns`
  - `error-page` -> `error-pages`
- Added AI canonical registry aliases through `AI_CANONICAL_DEMOS`, so registry names like `ai-message` and `ai-open-in-chat` also map to working gallery demos.
- Updated the gallery sidebar so newly split components are reachable individually rather than only through "New primitives."
- Confirmed `next.config.ts` has shadcn registry root rewrites:
  - `/` requests with `Accept: application/vnd.shadcn.v1+json` rewrite to `/r/registry.json`.
  - `/` requests with `User-Agent: shadcn` rewrite to `/r/registry.json`.
  - root response varies on `Accept, User-Agent`.

## Verification

Commands that passed during the implementation pass:

```bash
pnpm audit:composition
pnpm lint
pnpm build
pnpm registry:build
```

Build evidence:

- `pnpm build` completed successfully.
- The Next build generated `199` static gallery pages under `/gallery/[section]`.
- `pnpm registry:build` completed successfully and rebuilt the public registry JSON files.

Coverage check run after the route split:

```text
registry: 128
modeledRoutes: 194
missing: 0
missingItems: []
```

This means every `registry.json` item currently has a modeled gallery route, including canonical `ai-*` registry names.

## Current State

- `git branch --show-current` reported `main`.
- `git status --short` reported a clean working tree before this note was created.
- This session note is the new working tree change.

## Open Questions

- Decide whether old grouped gallery routes like `/gallery/buttons`, `/gallery/stats`, and `/gallery/error-pages` should remain as convenience aliases long term or be redirected to singular canonical registry names.
- Decide whether to add explicit `next.config.ts` redirects for old gallery routes. Current behavior supports aliases inside `/gallery/[section]`; it does not force URL canonicalization.
- Consider adding a small automated test/script that asserts every registry item has a gallery route so parity does not drift again.
