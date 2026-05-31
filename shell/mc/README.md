# Aurora for Midnight Commander

`aurora.ini` — a **truecolor** mc skin (`truecolors = true`): navy panels, cyan
directories, teal executables, violet symlinks, rose-marked files, deep-blue
frames, cyan/teal/amber/error in the diff viewer.

## Requirements

mc's truecolor skins need (all true on the primary host):

- mc ≥ 4.8.19 built against **S-Lang** (not ncurses), 64-bit
- `TERM=*-256color` and `COLORTERM=truecolor`

256-only mc falls back to nearest indices automatically.

## Install

```sh
mkdir -p ~/.local/share/mc/skins
cp shell/mc/aurora.ini ~/.local/share/mc/skins/
export MC_SKIN=aurora           # in ~/.zshrc
# or pick it in mc: Options → Appearance → aurora
```

## Source of truth

`shell/mc/aurora.ini` is canonical; `~/.local/share/mc/skins/aurora.ini` is a
deployed copy. Format reference: `/usr/share/mc/skins/seasons-*16M.ini`.
