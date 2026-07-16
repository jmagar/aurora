#!/usr/bin/env bash
set -euo pipefail

status=0
while IFS=: read -r file line command; do
  source_path="$(sed -E 's/.*cp[[:space:]]+([^[:space:]]+).*/\1/' <<<"$command")"
  [[ "$source_path" == '$'* || "$source_path" == *'*'* ]] && continue
  source_path="${source_path#./}"
  if [[ ! -e "$source_path" ]]; then
    echo "$file:$line: documented copy source does not exist: $source_path" >&2
    status=1
  fi
done < <(grep -RInE --include='*.md' 'cp[[:space:]]+(\./)?themes/' README.md plugin themes)

publish_headings="$(grep -c '^## Publish$' themes/editors/zed/README.md || true)"
if [[ "${publish_headings:-0}" -ne 1 ]]; then
  echo "themes/editors/zed/README.md must contain exactly one Publish section" >&2
  status=1
fi

exit "$status"
