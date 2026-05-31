# Aurora for Claude Code

The Aurora theme for [Claude Code](https://code.claude.com) — **the origin theme
that the whole shell/editor system aligns to.**

- **`aurora.json`** — dark, navy base `#07131c`, cyan primary `#29b6f6`,
  Claude identity cyan, rose `remember`, frame/borders deep-blue `#1c7fac`.
- **`aurora-light.json`** — light variant, cyan primary `#0288d1`.

## Install

Claude Code reads custom themes from `~/.claude/themes/`:

```sh
cp editors/claude-code/aurora.json       ~/.claude/themes/aurora.json
cp editors/claude-code/aurora-light.json ~/.claude/themes/aurora-light.json
```

`~/.claude/settings.json`:

```json
{ "theme": "custom:aurora" }
```

Run `/theme` and pick **Aurora** (a running session caches the theme).

## Palette

| Role | Dark | Light |
|------|------|-------|
| background | `#07131c` | `#ffffff` |
| Claude / primary | `#29b6f6` | `#0288d1` |
| remember (rose) | `#f9a8c4` | `#d63a6f` |
| success | `#7dd3c7` | `#2d7d6e` |
| error | `#c78490` | `#9c3545` |
| prompt border | `#1c7fac` | `#8fb4c4` |

## Source of truth

`editors/claude-code/*.json` is canonical; `~/.claude/themes/*.json` are deployed
copies. The shell tools ([`../../shell`](../../shell)) and the other editor themes
all derive their palette from this.
