#!/usr/bin/env bash
# Aurora statusline for Claude Code — two lines.
# Line 1: model · dir · git branch (+dirty, +worktree) · output-style
# Line 2: context bar + % + tokens · 5h limit · weekly limit · lines changed
# Reads the Claude Code status JSON on stdin (single read, single jq parse).
# Colors are exact Aurora dark-theme tokens (24-bit truecolor ANSI).
# Palette leans blue / rose / white; escalation runs cyan → rose → deep-rose.

set -uo pipefail

# ── Aurora dark-theme tokens ────────────────────────────────────────
esc() { printf '\033[38;2;%sm' "$1"; }
CYAN=$(esc      '41;182;246')   # #29b6f6  accent-primary   (blue anchor / "ok")
CYAN_HI=$(esc   '103;203;250')  # #67cbfa  accent-strong    (glyph accents)
BLUE_DEEP=$(esc '28;127;172')   # #1c7fac  accent-deep      (separators)
BLUE_TRK=$(esc  '29;61;78')     # #1d3d4e  border-default   (empty bar track)
INFO=$(esc      '114;200;245')  # #72c8f5  info             (output-style tag)
ROSE=$(esc      '249;168;196')  # #f9a8c4  accent-pink      (branch / "caution")
ROSE_DEEP=$(esc '232;121;160')  # #e879a0  pink-button      (dirty marker)
ERROR=$(esc     '199;132;144')  # #c78490  error            ("critical")
WHITE=$(esc     '230;244;251')  # #e6f4fb  text-primary     (values you read)
MUTED=$(esc     '167;188;201')  # #a7bcc9  text-muted       (labels)
R=$'\033[0m'
B=$'\033[1m'

# ── Read stdin once, parse once ─────────────────────────────────────
input=$(cat)
IFS=$'\t' read -r MODEL CWD CTX_PCT CTX_TOK CTX_MAX FIVE_H WEEK ADDED REMOVED STYLE <<EOF
$(printf '%s' "$input" | jq -r '
  [ (.model.display_name // "?")
  , (.workspace.current_dir // .cwd // ".")
  , (.context_window.used_percentage // -1)
  , (.context_window.total_input_tokens // 0)
  , (.context_window.context_window_size // 0)
  , (.rate_limits.five_hour.used_percentage // -1)
  , (.rate_limits.seven_day.used_percentage // -1)
  , (.cost.total_lines_added // 0)
  , (.cost.total_lines_removed // 0)
  , (.output_style.name // "")
  ] | @tsv')
EOF

# Floats -> ints; -1 means "absent / not yet available"
ctx=${CTX_PCT%.*};  ctx=${ctx:--1}
five=${FIVE_H%.*};  five=${five:--1}
week=${WEEK%.*};    week=${week:--1}

# ── Helpers ─────────────────────────────────────────────────────────
# Escalation color by percentage: cyan (ok) -> rose (caution) -> error (critical).
level_color() {
  local p=$1
  if   (( p >= 85 )); then printf '%s' "$ERROR"
  elif (( p >= 60 )); then printf '%s' "$ROSE"
  else                     printf '%s' "$CYAN"; fi
}

# Compact token count: 136000 -> 136k, 1000000 -> 1.0M
human() {
  local t=$1
  if   (( t >= 1000000 )); then printf '%d.%dM' $((t/1000000)) $(((t%1000000)/100000))
  elif (( t >= 1000 ));    then printf '%dk' $((t/1000))
  else                          printf '%d' "$t"; fi
}

# 10-char bar, filled cells in the escalation color, empty cells in dim blue.
bar() {
  local p=$1 width=10 filled i out=""
  (( p < 0 )) && p=0; (( p > 100 )) && p=100
  filled=$(( (p * width + 50) / 100 ))
  out="$(level_color "$p")"
  for ((i=0; i<width; i++)); do (( i < filled )) && out+="▓" || out+="${BLUE_TRK}░$(level_color "$p")"; done
  printf '%s%s' "$out" "$R"
}

# "label NN%" color-coded, or "label —" when absent.
rl() {
  local p=$1 label=$2
  if (( p < 0 )); then
    printf '%s%s —%s' "$MUTED" "$label" "$R"
  else
    printf '%s%s%s %s%d%%%s' "$MUTED" "$label" "$R" "$(level_color "$p")" "$p" "$R"
  fi
}

# Truncate a path to its last 3 segments: parents muted, leaf white-bold.
fmt_dir() {
  local raw=${1/#$HOME/\~} lead="" trunc=0
  [[ $raw == /* ]] && lead="/"
  local IFS='/' P seg=()
  read -ra P <<<"$raw"
  local p; for p in "${P[@]}"; do [ -n "$p" ] && seg+=("$p"); done
  local n=${#seg[@]} keep=3 start=0
  (( n == 0 )) && { printf '%s/%s' "$WHITE$B" "$R"; return; }
  if (( n > keep )); then start=$((n-keep)); trunc=1; fi
  local out=""
  (( trunc )) && out="${MUTED}…/${R}" || out="${MUTED}${lead}${R}"
  local i
  for ((i=start; i<n-1; i++)); do out+="${MUTED}${seg[i]}/${R}"; done
  out+="${WHITE}${B}${seg[n-1]}${R}"
  printf '%s' "$out"
}

sep=" ${BLUE_DEEP}·${R} "

# ── Line 1: identity + git + output-style ───────────────────────────
line1=" ${CYAN}${B}${MODEL}${R}${sep}$(fmt_dir "$CWD")"

if git -C "$CWD" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  branch=$(git -C "$CWD" symbolic-ref --short HEAD 2>/dev/null \
           || git -C "$CWD" rev-parse --short HEAD 2>/dev/null)
  dirty=""
  [ -n "$(git -C "$CWD" status --porcelain 2>/dev/null)" ] && dirty=" ${ROSE_DEEP}±${R}"

  # Worktree: show the primary repo branch alongside the worktree branch.
  gd=$(git -C "$CWD" rev-parse --git-dir 2>/dev/null)
  gcd=$(git -C "$CWD" rev-parse --git-common-dir 2>/dev/null)
  if [ -n "$gd" ] && [ "$gd" != "$gcd" ]; then
    main_branch=$(git -C "$(dirname "$gcd")" symbolic-ref --short HEAD 2>/dev/null)
    if [ -n "$main_branch" ] && [ "$main_branch" != "$branch" ]; then
      line1+="${sep}${ROSE}${main_branch}${R} ${CYAN_HI}⑂${R} ${ROSE}${branch}${R}${dirty}"
    else
      line1+="${sep}${CYAN_HI}⑂${R} ${ROSE}${branch}${R}${dirty}"
    fi
  else
    line1+="${sep}${ROSE}${branch}${R}${dirty}"
  fi
fi

# Output-style tag only when it isn't the default.
shopt -s nocasematch
if [[ -n "$STYLE" && "$STYLE" != "null" && "$STYLE" != "default"* ]]; then
  line1+="${sep}${INFO}❖ ${STYLE}${R}"
fi
shopt -u nocasematch

# ── Line 2: context + rate limits + lines changed ───────────────────
if (( ctx < 0 )); then
  ctx_seg="${MUTED}context —${R}"
else
  tok=""
  (( CTX_MAX > 0 )) && tok=" ${MUTED}$(human "$CTX_TOK")/$(human "$CTX_MAX")${R}"
  ctx_seg="$(bar "$ctx") ${WHITE}${ctx}%${R} ${MUTED}ctx${R}${tok}"
fi
line2=" ${ctx_seg}${sep}$(rl "$five" '5h')${sep}$(rl "$week" 'wk')"

if (( ADDED > 0 || REMOVED > 0 )); then
  line2+="${sep}${CYAN}+${ADDED}${R}${MUTED}/${R}${ROSE}-${REMOVED}${R}"
fi

printf '%s\n%s' "$line1" "$line2"
