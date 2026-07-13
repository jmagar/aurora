# Aurora for zsh (eza · dircolors · fast-syntax-highlighting · fzf)

Sourceable zsh snippets, all exact Aurora 24-bit hex.

| File | Sets | Colors |
|------|------|--------|
| `aurora-eza.zsh` | `EZA_COLORS` | eza listing columns; size magnitude escalates muted→teal→amber→rose→rose-deep |
| `aurora.dircolors` | `LS_COLORS` (via `dircolors`) | filenames by type/extension in `ls`/eza/completion |
| `aurora-fsh.zsh` | `FAST_HIGHLIGHT_STYLES`, `ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE` | command-line highlighting: white text/paths, cyan commands, teal strings, rose vars, red errors; dim-slate suggestions |
| `aurora-fzf.zsh` | `FZF_*_OPTS` | fzf: navy bg, deep-blue border, cyan highlight, rose pointer, teal marker, violet spinner |

## Install

Source them from `~/.zshrc` **after** your plugin manager loads (FSH reads its
styles live):

```sh
AUR=~/workspace/aurora/shell/zsh
for f in "$AUR"/*.zsh; do [[ -r $f ]] && source "$f"; done
[[ -r "$AUR/aurora.dircolors" ]] && eval "$(dircolors "$AUR/aurora.dircolors")"
```

Or copy the values inline (the current deployed setup keeps these inline in
`~/.zshrc` and `~/.dircolors` — keep them in sync with these files).

## Source of truth

Files in `themes/shell/zsh/` are canonical.
