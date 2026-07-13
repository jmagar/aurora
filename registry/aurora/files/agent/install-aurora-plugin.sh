#!/usr/bin/env bash
set -euo pipefail

repo_url="${AURORA_REPO_URL:-https://github.com/jmagar/aurora.git}"
target_dir="${AURORA_PLUGIN_REPO_DIR:-$PWD/.aurora-design-system-plugin}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required" >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "claude CLI is required for Claude Code plugin installation" >&2
  exit 1
fi

if [ ! -d "$target_dir/.git" ]; then
  git clone "$repo_url" "$target_dir"
else
  git -C "$target_dir" pull --ff-only
fi

claude plugin install "$target_dir/plugin"
