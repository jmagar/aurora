# Aurora for Powerlevel10k

Hand-written p10k config (not `p10k configure` output) — a **frameless,
two-line lean** prompt in the Aurora palette, matching the Claude Code
statusline.

- **Line 1:** `os_icon · dir · git` with a deep-blue `·` separator + a gap ruler
  to the right-side info.
- **Line 2:** `❯` (teal on success, red on error).
- **Right:** exit status, exec time, jobs, node/rust, virtualenv, docker,
  user@host, clock.

## Palette

| Element | Aurora |
|---------|--------|
| os_icon, dir anchors, jobs | cyan `#29b6f6` |
| dir body / shortened parents | white `#e6f4fb` / muted `#a7bcc9` |
| git clean / dirty / conflict | rose `#f9a8c4` / rose-deep `#e879a0` / error `#c78490` |
| separators + gap ruler | deep-blue `#1c7fac` |
| prompt ok / error | teal `#7dd3c7` / error `#c78490` |
| node · rust · venv · docker | teal · amber · violet · info-blue |
| time · context | muted `#a7bcc9` |

p10k accepts 24-bit hex via `%F{#rrggbb}` when the terminal is truecolor.

## Install

```sh
cp shell/p10k/aurora-p10k.zsh ~/.p10k.zsh
# ~/.zshrc already sources ~/.p10k.zsh last; `exec zsh` to apply.
```

## Source of truth

`shell/p10k/aurora-p10k.zsh` is canonical; `~/.p10k.zsh` is a deployed copy.
