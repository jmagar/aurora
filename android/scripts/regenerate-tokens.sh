#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

AURORA_TOKENS_JSON_OUT="$root/android/tokens" \
  AURORA_TOKENS_OUT="$root/android/aurora/src/main/kotlin/tv/tootie/aurora/tokens" \
  pnpm run tokens:generate
