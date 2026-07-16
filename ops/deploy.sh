#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
env_file="${1:-ops/compose/production.env}"

if [[ ! -f "$env_file" ]]; then
  echo "missing deployment environment file: $env_file" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090 -- operator-selected non-secret deployment topology.
source "$env_file"
set +a

: "${AURORA_IMAGE_REF:?AURORA_IMAGE_REF is required}"
: "${AURORA_EXPECTED_SHA:?AURORA_EXPECTED_SHA is required}"
[[ "$AURORA_IMAGE_REF" =~ @sha256:[0-9a-f]{64}$ ]] || {
  echo "AURORA_IMAGE_REF must be an immutable sha256 digest" >&2
  exit 1
}
[[ "$AURORA_IMAGE_REF" != *'@sha256:0000000000000000000000000000000000000000000000000000000000000000' ]] || {
  echo "refusing placeholder image digest" >&2
  exit 1
}
[[ "$AURORA_EXPECTED_SHA" =~ ^[0-9a-f]{40}$ ]] || {
  echo "AURORA_EXPECTED_SHA must be a full 40-character Git SHA" >&2
  exit 1
}

command -v cosign >/dev/null || { echo "cosign is required" >&2; exit 1; }
cosign verify \
  --certificate-identity-regexp '^https://github.com/jmagar/aurora/.github/workflows/publish.yml@refs/heads/main$' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  "$AURORA_IMAGE_REF" >/dev/null

docker compose --env-file "$env_file" -f ops/compose/production.yaml pull
docker compose --env-file "$env_file" -f ops/compose/production.yaml up -d --remove-orphans
AURORA_PUBLIC_URL="${AURORA_PUBLIC_URL:-https://aurora.tootie.tv}" \
  AURORA_EXPECTED_SHA="$AURORA_EXPECTED_SHA" \
  ops/synthetic-check.sh

echo "Deployed and verified $AURORA_IMAGE_REF ($AURORA_EXPECTED_SHA)."
