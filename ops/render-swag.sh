#!/usr/bin/env bash
set -euo pipefail

env_file="${1:-ops/compose/production.env}"
output_dir="${2:-ops/rendered-swag}"

if [[ ! -f "$env_file" ]]; then
  echo "missing deployment environment file: $env_file" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090 -- operator-selected non-secret deployment topology.
source "$env_file"
set +a

: "${AURORA_UPSTREAM_HOST:?AURORA_UPSTREAM_HOST is required}"
: "${AURORA_PUBLIC_PORT:?AURORA_PUBLIC_PORT is required}"

mkdir -p "$output_dir"
for template in ops/swag/*.conf.template; do
  destination="$output_dir/$(basename "${template%.template}")"
  envsubst '${AURORA_UPSTREAM_HOST} ${AURORA_PUBLIC_PORT}' < "$template" > "$destination"
done

echo "Rendered SWAG configs in $output_dir; validate with nginx -t before installation."
