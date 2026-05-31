# Aurora fzf colors + preview options.
# Part of the Aurora design system shell theming. Source this from ~/.zshrc.
# Bright bold-white text on a visible selection bar (#1e4560); bold rose pointer;
# cyan match highlights; teal match-counter; deep-blue borders/scrollbar; violet
# spinner. Requires fzf >= ~0.57 for label/separator/scrollbar keys + :bold attrs.
export FZF_DEFAULT_OPTS='--height 50% --layout=reverse --border --color=fg:#a7bcc9,fg+:#e6f4fb:bold,bg:-1,bg+:#1e4560,gutter:-1,hl:#29b6f6,hl+:#67cbfa:bold,border:#1c7fac,separator:#1d3d4e,scrollbar:#1c7fac,preview-border:#1c7fac,label:#67cbfa,preview-label:#67cbfa,prompt:#29b6f6:bold,pointer:#f9a8c4:bold,marker:#7dd3c7:bold,spinner:#a78bfa,info:#7dd3c7,header:#a7bcc9,query:#e6f4fb'
export FZF_CTRL_T_OPTS='--preview "bat --color=always --line-range :100 {}" --preview-window=right:60%'
export FZF_ALT_C_OPTS='--preview "eza --icons --tree --level=2 --color=always {}"'
