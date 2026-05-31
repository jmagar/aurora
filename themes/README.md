# Aurora themes

The Aurora palette, hand-ported to the editors, terminals, browser, and shell
tools you work in. These are the **canonical** theme sources; the copies under
`~/` (your machine) and `public/` (served from `aurora.tootie.tv`) are deploys —
keep them in sync when palette values change.

> Theme sources are hand-authored in each tool's native format and are excluded
> from the Next build, TypeScript, and ESLint. They mirror the token contract in
> [`registry/aurora/styles/aurora.css`](../registry/aurora/styles/aurora.css) —
> when a token value changes there, re-derive the affected themes and re-sync
> the served copies.

## Layout

```
themes/
  editors/
    zed/           Aurora Neon — Zed UI theme + 60-glyph icon theme (+ generator)
    warp/          Aurora — Warp terminal theme (dark + light, + glow generator)
    claude-code/   Aurora — Claude Code CLI theme (canonical origin) + TOKENS.md
  browser/
    chrome/        Aurora — Google Chrome MV3 theme (dark + light, + generator)
  shell/
    p10k/          Powerlevel10k prompt
    statusline/    Claude Code statusline script
    bat/           bat / less syntax theme (.tmTheme)
    mc/            Midnight Commander skin (.ini)
    nano/          nano syntax + UI theme (nanorc)
    zsh/           eza, dircolors, fzf, fast-syntax-highlighting color configs
```

Each subdirectory has its own README with a palette table, install commands, and
a source-of-truth note.

## Catalog

| Theme | Tool | Source | Served install |
|---|---|---|---|
| Aurora Neon | Zed editor + icons | `themes/editors/zed/` | `aurora.tootie.tv/zed/aurora.json` |
| Aurora | Warp terminal | `themes/editors/warp/` | `aurora.tootie.tv/warp/aurora.yaml` |
| Aurora | Claude Code CLI | `themes/editors/claude-code/` | `themes/editors/claude-code/aurora.json` |
| Aurora / Aurora Light | Google Chrome | `themes/browser/chrome/` | `aurora.tootie.tv/chrome/aurora.zip`, `…/aurora-light.zip` |
| Aurora prompt | Powerlevel10k | `themes/shell/p10k/` | `themes/shell/p10k/aurora-p10k.zsh` |
| Aurora statusline | Claude Code statusline | `themes/shell/statusline/` | `themes/shell/statusline/statusline-aurora.sh` |
| Aurora | bat | `themes/shell/bat/` | `themes/shell/bat/Aurora.tmTheme` |
| Aurora | Midnight Commander | `themes/shell/mc/` | `themes/shell/mc/aurora.ini` |
| Aurora | nano | `themes/shell/nano/` | `themes/shell/nano/nanorc` |
| Aurora colors | zsh (eza/dircolors/fzf/f-sy-h) | `themes/shell/zsh/` | `themes/shell/zsh/*.zsh` |

The web catalog at [`aurora.tootie.tv/themes`](https://aurora.tootie.tv/themes)
renders from [`lib/themes.ts`](../lib/themes.ts) — update that file when adding a
theme so the site, card previews, and install commands stay in sync.

## Served copies (don't move these URLs)

Generators write source here **and** a served copy under `public/`:

| Source | Served (stable URL) |
|---|---|
| `themes/browser/chrome/` | `public/chrome/` → `aurora.tootie.tv/chrome/…` |
| `themes/editors/zed/` | `public/zed/` → `aurora.tootie.tv/zed/…` |
| `themes/editors/warp/` | `public/warp/` → `aurora.tootie.tv/warp/…` |
| card previews | `public/themes/previews/` → `aurora.tootie.tv/themes/previews/…` |

The `public/` paths are **canonical install URLs** referenced by docs and
external users — keep them stable even if source moves.

## Regenerating

| Theme | Command (run from repo root) |
|---|---|
| Chrome | `python3 themes/browser/chrome/generate-manifests.py` |
| Warp glow | `python3 themes/editors/warp/aurora_bg.py` |
| Zed icons | `python3 themes/editors/zed/generate-icons.py` |

After regenerating, re-sync the served copy under `public/` if the generator
doesn't write it directly.
