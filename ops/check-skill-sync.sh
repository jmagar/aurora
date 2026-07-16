#!/usr/bin/env bash
set -euo pipefail

canonical=plugin/skills/aurora/SKILL.md
generated=SKILL.md

if ! cmp --silent "$canonical" <(sed 's#plugin/skills/aurora/references/#references/#g' "$generated"); then
  echo "$generated is stale; regenerate it from $canonical" >&2
  exit 1
fi

for path in \
  registry/aurora/styles/aurora.css \
  app/gallery/demo-map.tsx \
  references/android.md; do
  rg -q -F "$path" "$canonical" || {
    echo "canonical skill does not reference current path: $path" >&2
    exit 1
  }
done

if rg -q 'badgeVariants' "$canonical"; then
  echo "canonical skill contains a retired Badge or demo-map API" >&2
  exit 1
fi

echo "Root and packaged Aurora skills match the canonical source."
