#!/usr/bin/env bash
set -euo pipefail

base_url="${AURORA_PUBLIC_URL:-${1:-https://aurora.tootie.tv}}"
expected_sha="${AURORA_EXPECTED_SHA:-${2:-}}"
registry_item="${AURORA_SYNTHETIC_ITEM:-aurora-tokens.json}"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

curl --fail --silent --show-error --location \
  --dump-header "$tmp_dir/landing.headers" \
  --output "$tmp_dir/landing.html" "$base_url/"
grep -Eqi '^content-type:.*text/html' "$tmp_dir/landing.headers"

curl --fail --silent --show-error --location \
  -H 'Accept: application/vnd.shadcn.v1+json' \
  --output "$tmp_dir/registry.json" "$base_url/"
jq -e '.items | type == "array" and length > 0' "$tmp_dir/registry.json" >/dev/null

curl --fail --silent --show-error --location \
  --dump-header "$tmp_dir/item.headers" \
  --output "$tmp_dir/item.json" "$base_url/r/$registry_item"
jq -e '.name and .type and (.files | type == "array")' "$tmp_dir/item.json" >/dev/null

if [[ -f "public/r/$registry_item" ]]; then
  expected_registry_hash="$(sha256sum "public/r/$registry_item" | cut -d' ' -f1)"
  served_registry_hash="$(sha256sum "$tmp_dir/item.json" | cut -d' ' -f1)"
  [[ "$served_registry_hash" == "$expected_registry_hash" ]] || {
    echo "registry checksum mismatch: expected $expected_registry_hash, served $served_registry_hash" >&2
    exit 1
  }
fi

grep -Eqi '^content-security-policy:.*nonce-' "$tmp_dir/landing.headers"
grep -Eqi '^x-aurora-revision:' "$tmp_dir/landing.headers"
if [[ -n "$expected_sha" ]]; then
  grep -Eqi "^x-aurora-revision:[[:space:]]*$expected_sha" "$tmp_dir/landing.headers"
fi

host="${base_url#*://}"
host="${host%%/*}"
host="${host%%:*}"
expiry="$(echo | openssl s_client -servername "$host" -connect "$host:443" 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2-)"
openssl x509 -checkend "${AURORA_TLS_MIN_SECONDS:-1209600}" -noout \
  < <(echo | openssl s_client -servername "$host" -connect "$host:443" 2>/dev/null) >/dev/null

echo "Public path healthy: $base_url; registry=$registry_item; TLS expires=$expiry"
