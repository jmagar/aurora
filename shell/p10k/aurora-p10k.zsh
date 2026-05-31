# Powerlevel10k configuration — Aurora edition.
#
# Hand-written from scratch (not `p10k configure` output) to align the prompt
# with the Aurora Claude Code theme (~/.claude/themes/aurora.json) and the
# Aurora statusline (~/.claude/statusline-aurora.sh). Lean, framed two-line
# style. Every variable is defined exactly once — no duplicates.
#
# Aurora dark-theme tokens used throughout (all 24-bit hex, terminal must
# support truecolor — yours reports COLORTERM=truecolor):
#   accent-primary  #29b6f6   cyan   — identity / anchors / jobs
#   accent-strong   #67cbfa   cyan+  — (reserved)
#   accent-deep     #1c7fac   blue   — frame, separators, the @ in context
#   accent-pink     #f9a8c4   rose   — git branch (clean), context user
#   pink-button     #e879a0   rose+  — git dirty (modified/untracked)
#   accent-violet   #a78bfa   violet — python/virtualenv (minor accent)
#   info            #72c8f5   blue   — docker
#   success         #7dd3c7   teal   — prompt-ok, status-ok, node
#   warn            #c6a36b   amber  — exec time, rust, remote context
#   error           #c78490   red    — prompt-error, status-error, git conflict, root
#   text-primary    #e6f4fb   white  — directory body (the value you read)
#   text-muted      #a7bcc9   muted  — shortened dirs, time, vcs loading

'builtin' 'local' '-a' 'p10k_config_opts'
[[ ! -o 'aliases'         ]] || p10k_config_opts+=('aliases')
[[ ! -o 'sh_glob'         ]] || p10k_config_opts+=('sh_glob')
[[ ! -o 'no_brace_expand' ]] || p10k_config_opts+=('no_brace_expand')
'builtin' 'setopt' 'no_aliases' 'no_sh_glob' 'brace_expand'

() {
  emulate -L zsh -o extended_glob

  # Unset all POWERLEVEL9K_* so a stale value from a previous config can't leak in.
  unset -m '(POWERLEVEL9K_*|DEFAULT_USER)~POWERLEVEL9K_GITSTATUS_DIR'

  # Aurora token shorthands (local to this function).
  local cyan='#29b6f6' cyan_hi='#67cbfa' blue='#1c7fac' rose='#f9a8c4' rose_hi='#e879a0'
  local violet='#a78bfa' info='#72c8f5' teal='#7dd3c7' amber='#c6a36b' red='#c78490'
  local white='#e6f4fb' muted='#a7bcc9'

  ############################# Prompt layout #############################

  typeset -g POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(
    os_icon                 # OS identifier glyph
    dir                     # current directory
    vcs                     # git status
    newline                 # \n
    prompt_char             # ❯ / ❮
  )

  typeset -g POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(
    status                  # exit code of the last command (only on error)
    command_execution_time  # duration of the last command (>= 5s)
    background_jobs         # presence of background jobs
    node_version            # node version (in JS/TS projects)
    rust_version            # rust version (in rust projects)
    virtualenv              # python virtualenv
    docker_context          # non-default docker context
    context                 # user@host (only over SSH or as root)
    time                    # current time
    newline
  )

  # Lean style: transparent background, no powerline separators.
  typeset -g POWERLEVEL9K_BACKGROUND=
  typeset -g POWERLEVEL9K_{LEFT,RIGHT}_{LEFT,RIGHT}_WHITESPACE=
  typeset -g POWERLEVEL9K_{LEFT,RIGHT}_SUBSEGMENT_SEPARATOR=" %F{$blue}·%f "
  typeset -g POWERLEVEL9K_{LEFT,RIGHT}_SEGMENT_SEPARATOR=
  typeset -g POWERLEVEL9K_VISUAL_IDENTIFIER_EXPANSION='${P9K_VISUAL_IDENTIFIER}'
  typeset -g POWERLEVEL9K_EMPTY_LINE_LEFT_PROMPT_FIRST_SEGMENT_END_SYMBOL='%{%}'
  typeset -g POWERLEVEL9K_EMPTY_LINE_RIGHT_PROMPT_FIRST_SEGMENT_START_SYMBOL='%{%}'

  # Two-line prompt with a blank line above and an Aurora-blue connecting frame.
  typeset -g POWERLEVEL9K_PROMPT_ADD_NEWLINE=true
  # Frameless (no ╭─├─╰─ corners) — matches the statusline's clean look. The gap
  # ruler below still connects the left prompt to the right-side info.
  typeset -g POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX=
  typeset -g POWERLEVEL9K_MULTILINE_NEWLINE_PROMPT_PREFIX=
  typeset -g POWERLEVEL9K_MULTILINE_LAST_PROMPT_PREFIX=
  typeset -g POWERLEVEL9K_MULTILINE_FIRST_PROMPT_SUFFIX=
  typeset -g POWERLEVEL9K_MULTILINE_NEWLINE_PROMPT_SUFFIX=
  typeset -g POWERLEVEL9K_MULTILINE_LAST_PROMPT_SUFFIX=
  # Fill the gap between left and right prompt with a dim Aurora-blue ruler.
  typeset -g POWERLEVEL9K_MULTILINE_FIRST_PROMPT_GAP_CHAR='─'
  typeset -g POWERLEVEL9K_MULTILINE_FIRST_PROMPT_GAP_FOREGROUND="$blue"
  typeset -g POWERLEVEL9K_MULTILINE_FIRST_PROMPT_GAP_INVERSE_FOREGROUND=

  ############################# General #############################

  typeset -g POWERLEVEL9K_MODE=nerdfont-v3
  typeset -g POWERLEVEL9K_ICON_PADDING=none
  typeset -g POWERLEVEL9K_DISABLE_HOT_RELOAD=true
  typeset -g POWERLEVEL9K_INSTANT_PROMPT=verbose
  typeset -g POWERLEVEL9K_TRANSIENT_PROMPT=always

  ############################# os_icon #############################
  typeset -g POWERLEVEL9K_OS_ICON_FOREGROUND="$cyan"

  ############################# dir #############################
  # White path body, muted shortened parents, cyan bold anchors — mirrors the
  # statusline (muted parents, white leaf, cyan accent).
  typeset -g POWERLEVEL9K_DIR_FOREGROUND="$white"
  typeset -g POWERLEVEL9K_DIR_SHORTENED_FOREGROUND="$muted"
  typeset -g POWERLEVEL9K_DIR_ANCHOR_FOREGROUND="$white"
  typeset -g POWERLEVEL9K_DIR_ANCHOR_BOLD=true
  # No leading folder icon — let the path speak for itself.
  typeset -g POWERLEVEL9K_DIR_VISUAL_IDENTIFIER_EXPANSION=
  # Shorten parents to the shortest unique prefix (tab-completable). Only
  # collapse the whole path once it exceeds 80 columns.
  typeset -g POWERLEVEL9K_SHORTEN_STRATEGY=truncate_to_unique
  typeset -g POWERLEVEL9K_SHORTEN_DELIMITER=
  typeset -g POWERLEVEL9K_DIR_MAX_LENGTH=80
  typeset -g POWERLEVEL9K_DIR_MIN_COMMAND_COLUMNS=40
  typeset -g POWERLEVEL9K_DIR_MIN_COMMAND_COLUMNS_PCT=50
  typeset -g POWERLEVEL9K_DIR_HYPERLINK=false
  typeset -g POWERLEVEL9K_SHOW_RULER=false
  # Directories that contain any of these files are never shortened (anchors).
  local anchor_files=(
    .bzr .citc .git .hg .node-version .python-version .go-version .ruby-version
    .lua-version .java-version .perl-version .php-version .tool-versions
    .mise.toml .shorten_folder_marker .svn .terraform CVS Cargo.toml
    composer.json go.mod package.json stack.yaml
  )
  typeset -g POWERLEVEL9K_SHORTEN_FOLDER_MARKER="(${(j:|:)anchor_files})"
  typeset -g POWERLEVEL9K_DIR_TRUNCATE_BEFORE_MARKER=false

  ############################# vcs (git) #############################
  # Mirrors the statusline: branch rose when clean, rose-deep on any dirt,
  # error on conflict, muted while loading.
  typeset -g POWERLEVEL9K_VCS_BRANCH_ICON=' '
  # Don't show the untracked-files marker (the "?" next to the branch).
  typeset -g POWERLEVEL9K_VCS_UNTRACKED_ICON=
  typeset -g POWERLEVEL9K_VCS_CLEAN_FOREGROUND="$rose"
  typeset -g POWERLEVEL9K_VCS_MODIFIED_FOREGROUND="$rose_hi"
  typeset -g POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND="$rose_hi"
  typeset -g POWERLEVEL9K_VCS_CONFLICTED_FOREGROUND="$red"
  typeset -g POWERLEVEL9K_VCS_LOADING_FOREGROUND="$muted"
  typeset -g POWERLEVEL9K_VCS_VISUAL_IDENTIFIER_EXPANSION=
  typeset -g POWERLEVEL9K_VCS_BACKENDS=(git)

  ############################# prompt_char #############################
  # Teal ❯ on success, red ❯ on error. ❮ in vi command mode.
  typeset -g POWERLEVEL9K_PROMPT_CHAR_LEFT_PROMPT_FIRST_SEGMENT_START_SYMBOL=
  typeset -g POWERLEVEL9K_PROMPT_CHAR_LEFT_{LEFT,RIGHT}_WHITESPACE=
  typeset -g POWERLEVEL9K_PROMPT_CHAR_BACKGROUND=
  typeset -g POWERLEVEL9K_PROMPT_CHAR_OK_{VIINS,VICMD,VIVIS,VIOWR}_FOREGROUND="$teal"
  typeset -g POWERLEVEL9K_PROMPT_CHAR_ERROR_{VIINS,VICMD,VIVIS,VIOWR}_FOREGROUND="$red"
  typeset -g POWERLEVEL9K_PROMPT_CHAR_{OK,ERROR}_VIINS_CONTENT_EXPANSION='❯'
  typeset -g POWERLEVEL9K_PROMPT_CHAR_{OK,ERROR}_VICMD_CONTENT_EXPANSION='❮'
  typeset -g POWERLEVEL9K_PROMPT_CHAR_{OK,ERROR}_VIVIS_CONTENT_EXPANSION='Ⅴ'
  typeset -g POWERLEVEL9K_PROMPT_CHAR_{OK,ERROR}_VIOWR_CONTENT_EXPANSION='▶'

  ############################# status #############################
  # Only shown on failure (teal ok-icon suppressed). Error states in Aurora red.
  typeset -g POWERLEVEL9K_STATUS_EXTENDED_STATES=true
  typeset -g POWERLEVEL9K_STATUS_OK=false
  typeset -g POWERLEVEL9K_STATUS_OK_FOREGROUND="$teal"
  typeset -g POWERLEVEL9K_STATUS_OK_VISUAL_IDENTIFIER_EXPANSION='󰄬'
  typeset -g POWERLEVEL9K_STATUS_OK_PIPE=false
  typeset -g POWERLEVEL9K_STATUS_OK_PIPE_FOREGROUND="$teal"
  typeset -g POWERLEVEL9K_STATUS_OK_PIPE_VISUAL_IDENTIFIER_EXPANSION='󰄬'
  typeset -g POWERLEVEL9K_STATUS_ERROR=true
  typeset -g POWERLEVEL9K_STATUS_ERROR_FOREGROUND="$red"
  typeset -g POWERLEVEL9K_STATUS_ERROR_VISUAL_IDENTIFIER_EXPANSION='󰅖'
  typeset -g POWERLEVEL9K_STATUS_ERROR_SIGNAL=true
  typeset -g POWERLEVEL9K_STATUS_ERROR_SIGNAL_FOREGROUND="$red"
  typeset -g POWERLEVEL9K_STATUS_ERROR_SIGNAL_VISUAL_IDENTIFIER_EXPANSION='󰅖'
  typeset -g POWERLEVEL9K_STATUS_ERROR_PIPE=true
  typeset -g POWERLEVEL9K_STATUS_ERROR_PIPE_FOREGROUND="$red"
  typeset -g POWERLEVEL9K_STATUS_ERROR_PIPE_VISUAL_IDENTIFIER_EXPANSION='󰅖'

  ############################# command_execution_time #############################
  typeset -g POWERLEVEL9K_COMMAND_EXECUTION_TIME_THRESHOLD=5
  typeset -g POWERLEVEL9K_COMMAND_EXECUTION_TIME_PRECISION=0
  typeset -g POWERLEVEL9K_COMMAND_EXECUTION_TIME_FOREGROUND="$amber"
  typeset -g POWERLEVEL9K_COMMAND_EXECUTION_TIME_VISUAL_IDENTIFIER_EXPANSION=

  ############################# background_jobs #############################
  typeset -g POWERLEVEL9K_BACKGROUND_JOBS_VERBOSE=false
  typeset -g POWERLEVEL9K_BACKGROUND_JOBS_FOREGROUND="$cyan"
  typeset -g POWERLEVEL9K_BACKGROUND_JOBS_VISUAL_IDENTIFIER_EXPANSION='󰒋'

  ############################# node_version #############################
  typeset -g POWERLEVEL9K_NODE_VERSION_FOREGROUND="$teal"
  typeset -g POWERLEVEL9K_NODE_VERSION_PROJECT_ONLY=true
  typeset -g POWERLEVEL9K_NODE_VERSION_SHOW_ON_UPGLOB='*.js|*.ts|*.jsx|*.tsx|package.json|.nvmrc|.node-version'
  typeset -g POWERLEVEL9K_NODE_VERSION_VISUAL_IDENTIFIER_EXPANSION='󰎙'

  ############################# rust_version #############################
  typeset -g POWERLEVEL9K_RUST_VERSION_FOREGROUND="$amber"
  typeset -g POWERLEVEL9K_RUST_VERSION_PROJECT_ONLY=true
  typeset -g POWERLEVEL9K_RUST_VERSION_SHOW_ON_UPGLOB='*.rs|Cargo.toml|Cargo.lock'
  typeset -g POWERLEVEL9K_RUST_VERSION_VISUAL_IDENTIFIER_EXPANSION='󱘗 '

  ############################# virtualenv #############################
  typeset -g POWERLEVEL9K_VIRTUALENV_FOREGROUND="$violet"
  typeset -g POWERLEVEL9K_VIRTUALENV_SHOW_PYTHON_VERSION=false
  typeset -g POWERLEVEL9K_VIRTUALENV_{LEFT,RIGHT}_DELIMITER=
  typeset -g POWERLEVEL9K_VIRTUALENV_VISUAL_IDENTIFIER_EXPANSION='󰌠'

  ############################# docker_context #############################
  typeset -g POWERLEVEL9K_DOCKER_CONTEXT_FOREGROUND="$info"
  typeset -g POWERLEVEL9K_DOCKER_CONTEXT_SHOW_ON_COMMAND='docker|docker-compose|docker compose'
  typeset -g POWERLEVEL9K_DOCKER_CONTEXT_VISUAL_IDENTIFIER_EXPANSION='󰡨'

  ############################# time #############################
  typeset -g POWERLEVEL9K_TIME_FOREGROUND="$muted"
  typeset -g POWERLEVEL9K_TIME_FORMAT='%D{%I:%M}'
  typeset -g POWERLEVEL9K_TIME_UPDATE_ON_COMMAND=false
  typeset -g POWERLEVEL9K_TIME_VISUAL_IDENTIFIER_EXPANSION=

  ############################# context (user@host) #############################
  # Rose user, deep-blue @, cyan host — echoes the statusline's color roles.
  # Shown only over SSH or as root; hidden for local non-root sessions.
  typeset -g POWERLEVEL9K_CONTEXT_ROOT_FOREGROUND="$red"
  typeset -g POWERLEVEL9K_CONTEXT_{REMOTE,REMOTE_SUDO}_FOREGROUND="$amber"
  typeset -g POWERLEVEL9K_CONTEXT_FOREGROUND="$muted"
  typeset -g POWERLEVEL9K_CONTEXT_TEMPLATE="%F{$rose}%n%f%F{$blue}@%f%F{$cyan}%m%f"
  typeset -g POWERLEVEL9K_CONTEXT_ROOT_TEMPLATE="%F{$red}%n%f%F{$blue}@%f%F{$cyan}%m%f"
  # Hide the segment entirely for local, non-root sessions.
  typeset -g POWERLEVEL9K_CONTEXT_{DEFAULT,SUDO}_{CONTENT,VISUAL_IDENTIFIER}_EXPANSION=

  ############################# Transient & misc #############################
  # Transient prompt collapses past prompts to a bare ❯ to keep scrollback clean.
  typeset -g POWERLEVEL9K_TRANSIENT_PROMPT=always

  # If p10k is already loaded, reload configuration (works even with hot reload off).
  (( ! $+functions[p10k] )) || p10k reload
}

# Tell `p10k configure` which file it should overwrite.
typeset -g POWERLEVEL9K_CONFIG_FILE=${${(%):-%x}:a}

(( ${#p10k_config_opts} )) && setopt ${p10k_config_opts[@]}
'builtin' 'unset' 'p10k_config_opts'
