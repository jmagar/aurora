# Aurora fast-syntax-highlighting + zsh-autosuggestions styles.
# Part of the Aurora design system shell theming. Source this from ~/.zshrc
# AFTER the plugin manager has loaded FSH (it reads FAST_HIGHLIGHT_STYLES live).
# Exact Aurora dark-theme hex. Typed text & paths white (no underline);
# valid commands cyan; strings teal; vars/globs rose; errors red; flags muted.
typeset -gA FAST_HIGHLIGHT_STYLES
FAST_HIGHLIGHT_STYLES[default]='fg=#e6f4fb'
FAST_HIGHLIGHT_STYLES[unknown-token]='fg=#c78490'
FAST_HIGHLIGHT_STYLES[reserved-word]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[alias]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[suffix-alias]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[global-alias]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[builtin]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[function]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[command]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[precommand]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[hashed-command]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[arg0]='fg=#29b6f6'
FAST_HIGHLIGHT_STYLES[commandseparator]='fg=#1c7fac'
FAST_HIGHLIGHT_STYLES[path]='fg=#e6f4fb'
FAST_HIGHLIGHT_STYLES[path-to-dir]='fg=#e6f4fb'
FAST_HIGHLIGHT_STYLES[path_pathseparator]='fg=#1c7fac'
FAST_HIGHLIGHT_STYLES[autodirectory]='fg=#67cbfa'
FAST_HIGHLIGHT_STYLES[globbing]='fg=#f9a8c4'
FAST_HIGHLIGHT_STYLES[history-expansion]='fg=#f9a8c4'
FAST_HIGHLIGHT_STYLES[single-quoted-argument]='fg=#7dd3c7'
FAST_HIGHLIGHT_STYLES[double-quoted-argument]='fg=#7dd3c7'
FAST_HIGHLIGHT_STYLES[dollar-quoted-argument]='fg=#7dd3c7'
FAST_HIGHLIGHT_STYLES[back-quoted-argument]='fg=#7dd3c7'
FAST_HIGHLIGHT_STYLES[rc-quote]='fg=#7dd3c7'
FAST_HIGHLIGHT_STYLES[dollar-double-quoted-argument]='fg=#f9a8c4'
FAST_HIGHLIGHT_STYLES[back-double-quoted-argument]='fg=#f9a8c4'
FAST_HIGHLIGHT_STYLES[variable]='fg=#f9a8c4'
FAST_HIGHLIGHT_STYLES[assign]='fg=#e6f4fb'
FAST_HIGHLIGHT_STYLES[redirection]='fg=#c6a36b'
FAST_HIGHLIGHT_STYLES[named-fd]='fg=#c6a36b'
FAST_HIGHLIGHT_STYLES[numeric-fd]='fg=#c6a36b'
FAST_HIGHLIGHT_STYLES[single-hyphen-option]='fg=#a7bcc9'
FAST_HIGHLIGHT_STYLES[double-hyphen-option]='fg=#a7bcc9'
FAST_HIGHLIGHT_STYLES[comment]='fg=#a7bcc9'

# zsh-autosuggestions — dim slate so the ghost text recedes against the navy bg.
typeset -g ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=#3d6070'
