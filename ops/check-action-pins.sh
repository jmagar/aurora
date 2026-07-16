#!/usr/bin/env bash
set -euo pipefail

status=0
while IFS=: read -r file line usage; do
  ref="${usage##*@}"
  if [[ "$usage" == ./* ]]; then
    continue
  fi
  if [[ ! "$ref" =~ ^[0-9a-f]{40}([[:space:]]*#.*)?$ && ! "$ref" =~ ^sha256:[0-9a-f]{64}([[:space:]]*#.*)?$ ]]; then
    echo "$file:$line: action is not pinned to a full commit SHA: $usage" >&2
    status=1
  fi
done < <(grep -RInoE --include='*.yml' --include='*.yaml' 'uses:[[:space:]]*[^[:space:]]+([[:space:]]*#.*)?' .github/workflows)

exit "$status"
