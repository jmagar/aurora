---
date: 2026-05-31
branch: main
beads: aurora-design-system-ec4l, -a4kf, -8sri (closed)
commits: 91231d8 (site + 500 fix), 34a11f0 (reorg + docs)
---

# Themes-first site redesign + themes/ cohabitation reorg

## User request

"The repo has become more than just our components + shadcn registry — make sure
everything is organized properly to cohabitate in peace. Update/create any and
all necessary docs. Redesign aurora.tootie.tv to accommodate all our new themes
as first-class citizens." Follow-ups: align with the actual design system; make
it unique/aesthetic (frontend-design), take risks; work autonomously; push to
main; finish everything.

## What shipped (on main)

### Website (app/(marketing))
- `/` is now a real Aurora **landing** (was a redirect to /gallery/buttons):
  aurora-ribbon hero, cyan→violet gradient display type, a literal **palette
  spectrum rail**, three pillar cards, and a **bento surface grid** of live
  theme previews. shadcn CLI content-negotiation on `/` preserved — a `shadcn`
  UA / `Accept: application/vnd.shadcn.v1+json` returns the registry JSON
  (verified); browsers get the landing.
- `/themes` **hub**: Editors / Browser / Shell segmented control with live
  counts, theme cards with palette-faithful preview images, per-theme spectrum
  bars, Aurora `Button`/`Badge`, copy-install.
- Catalog extracted to `lib/themes.ts` (single source of truth). Shared chrome
  in `components/site/` (`site-shell`, `site-ui`, `themes-grid`, `style-tokens`).
  Pages use only real Aurora tokens/components — zero hand-set colors;
  reduced-motion safe.

### Reorg / cohabitation
- Unified `editors/` + `shell/` into a `themes/` umbrella via `git mv` (history
  preserved): `themes/editors/{zed,warp,claude-code}`, `themes/browser/chrome`,
  `themes/shell/{p10k,statusline,bat,mc,nano,zsh}`.
- **Served `public/{chrome,zed,warp}/` URLs kept stable**; card previews at
  `public/themes/previews/`. Fixed the Chrome generator's repo-root depth
  (`../..` → `../../..` after moving one level deeper).
- **dinglebear** (a separate site co-hosted via host rewrite) quarantined:
  served assets → `public/dinglebear/`, source export → `dinglebear/`,
  `app/dinglebear/route.ts` repointed, `dinglebear/README.md` documents it.

### Docs
- `README.md` themes section rewritten for `themes/` + the live `/themes` URL.
- `CLAUDE.md` directory map updated (app/(marketing), lib/themes.ts,
  components/site, themes/ umbrella, dinglebear tenant, served-path rule).
- New `themes/README.md` catalog; per-tool README/TOKENS path fixes.
- `eslint.config.mjs` ignores: `editors/`,`shell/` → `themes/`,`dinglebear/`.

## Verification
- `pnpm lint` → exit 0 (after fixing two react-hooks/set-state-in-effect errors
  in site-shell + themes-grid with scoped disables — legit client-only mount sync).
- `pnpm build` → exit 0; clean rebuild emitted `/` (index) + `/themes` + gallery
  + `/dinglebear`.
- Dev `/` 200, real render verified by headless-Chrome screenshot (ribbon hero,
  gradient headline, spectrum rail, pillars, bento all present).
- shadcn UA on `/` → registry JSON (`schema/registry.json`), not the landing.
- `git push origin main` → `8af5c81..34a11f0`, local == remote (in sync).
  `bd dolt push` → complete.

## Notes / gotchas
- **Branch switched mid-session.** `feat/zed-aurora-theme` was merged into `main`
  and deleted by a concurrent agent (seen in reflog). Per the user's explicit
  call this session, work landed on `main` and was pushed there.
- **`/` 500 bug, caught and fixed.** The landing (a server component) imported
  `tint`/`panelStrong` from a `"use client"` module; client exports can't be
  invoked during server render. Moved the pure helpers to
  `components/site/style-tokens.ts` (no "use client").
- Preview images are palette-faithful HTML renders (via
  `docs/mockups/theme-previews.html` + headless Chrome), not literal app
  captures. Possible follow-up: real Zed/Warp/Chrome/shell screenshots.
- `public/aurora.css` (a stale lab gateway-admin export) left in place — appears
  orphaned but not confirmed unreferenced by the dinglebear `.jsx`; left untouched.
- **Environment instability:** long-running `pnpm dev`/`pnpm build` foreground
  processes were repeatedly SIGTERM'd (exit 144 / -1) and `/tmp` files
  intermittently vanished. The zsh-tool task runner + writing results to files
  then Read were the reliable paths; clean `pnpm build` confirmed exit 0 there.

## Next steps
- Optional: replace card previews with literal tool screenshots.
- Confirm the live `aurora.tootie.tv` (served from this working tree) shows the
  new landing once redeployed.
