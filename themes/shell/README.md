# Aurora for the shell

Aurora theming for the **command line** — the prompt, the pager, the file
manager, the editor, and the colors zsh paints as you type. Sibling to
[`editors/`](../editors) (which themes GUI apps like Zed and Warp); this folder
themes the tools that run *inside* any terminal.

Everything here is derived from the Aurora design system
(`registry/aurora/styles/aurora.css`, `aurora.tootie.tv`) and the Claude Code
Aurora theme ([`themes/editors/claude-code/aurora.json`](../editors/claude-code/aurora.json)).

## The palette

| Token | Hex | 24-bit | Role |
|-------|-----|--------|------|
| navy (bg) | `#07131c` | `7;19;28` | background |
| panel | `#102330` | `16;35;48` | surfaces |
| white | `#e6f4fb` | `230;244;251` | values / typed text |
| muted | `#a7bcc9` | `167;188;201` | labels / secondary |
| dim | `#3d6070` | `61;96;112` | line numbers / suggestions |
| cyan (primary) | `#29b6f6` | `41;182;246` | identity / commands |
| cyan+ | `#67cbfa` | `103;203;250` | accents |
| deep-blue | `#1c7fac` | `28;127;172` | separators / frame |
| rose | `#f9a8c4` | `249;168;196` | git branch / strings-in-strings |
| rose-deep | `#e879a0` | `232;121;160` | git dirty |
| violet | `#a78bfa` | `167;139;250` | python / language consts |
| teal | `#7dd3c7` | `125;211;199` | success / strings |
| amber | `#c6a36b` | `198;163;107` | timing / numbers |
| error | `#c78490` | `199;132;144` | errors / critical |

## What's here

| Dir | Tool | File | Native color support |
|-----|------|------|----------------------|
| [`p10k/`](p10k) | Powerlevel10k prompt | `aurora-p10k.zsh` | 24-bit hex |
| [`statusline/`](statusline) | Claude Code statusline | `statusline-aurora.sh` | 24-bit ANSI |
| [`bat/`](bat) | bat pager | `Aurora.tmTheme` | tmTheme (24-bit) |
| [`mc/`](mc) | Midnight Commander | `aurora.ini` | 24-bit truecolor skin |
| [`nano/`](nano) | nano editor | `nanorc` | **named colors only** (see note) |
| [`zsh/`](zsh) | eza · dircolors · FSH · fzf | `aurora-*.zsh`, `aurora.dircolors` | 24-bit hex |

## The terminal palette is the foundation

Two of these tools can't take hex and instead inherit the terminal emulator's
**16 ANSI colors**:

- **bat** runs with `--theme=ansi` on hosts where its `cache` subcommand is
  unavailable — it then paints with the terminal's ANSI palette.
- **nano** on a `--enable-utf8`-only build accepts only *named* colors, which
  also resolve through the terminal palette.

So the single highest-leverage surface is the **terminal emulator's ANSI
palette**, which Aurora defines in [`themes/editors/warp/themes/aurora.yaml`](../editors/warp/themes/aurora.yaml)
(`terminal_colors`). Get that right and the named/ansi tools come along for free.

## Install

These are **copies** kept in sync with this repo (same model as `editors/` —
not symlinks, so a `git checkout` of this repo never breaks your live shell).

```sh
AUR=~/workspace/aurora/themes/shell

# Prompt + statusline
mkdir -p ~/.claude ~/.config/bat/themes ~/.local/share/mc/skins
cp  $AUR/p10k/aurora-p10k.zsh        ~/.p10k.zsh
cp  $AUR/statusline/statusline-aurora.sh ~/.claude/statusline-aurora.sh

# Pager (theme file for cache-capable bat; otherwise rely on --theme=ansi)
mkdir -p ~/.config/bat/themes && cp $AUR/bat/Aurora.tmTheme ~/.config/bat/themes/

# File manager
mkdir -p ~/.local/share/mc/skins && cp $AUR/mc/aurora.ini ~/.local/share/mc/skins/
#   then: export MC_SKIN=aurora

# Editor
cp  $AUR/nano/nanorc                 ~/.nanorc

# zsh colors — source the snippets from ~/.zshrc (after the plugin manager):
#   for f in $AUR/zsh/*.zsh; do source "$f"; done
#   eval "$(dircolors $AUR/zsh/aurora.dircolors)"
cp  $AUR/zsh/aurora.dircolors        ~/.dircolors
```

## Source of truth

The files in `shell/` are **canonical**. Live `~` configs are deployed copies —
keep them in sync when editing here. Per-tool READMEs note any served `public/`
copies (for `curl` install from `aurora.tootie.tv`, like `editors/`).
