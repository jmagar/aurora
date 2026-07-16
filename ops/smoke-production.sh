#!/usr/bin/env bash
set -euo pipefail

port="${AURORA_SMOKE_PORT:-39173}"
expected_sha="${AURORA_BUILD_SHA:-0000000000000000000000000000000000000000}"
log_file="$(mktemp)"
headers="$(mktemp)"
html="$(mktemp)"
hydrated_html="$(mktemp)"
browser_log="$(mktemp)"
pid=""
linked_public=false
linked_static=false
cleanup() {
  [[ -n "$pid" ]] && kill "$pid" 2>/dev/null || true
  [[ "$linked_public" == true ]] && rm -f .next/standalone/public
  [[ "$linked_static" == true ]] && rm -f .next/standalone/.next/static
  rm -f "$log_file" "$headers" "$html" "$hydrated_html" "$browser_log"
}
trap cleanup EXIT

# `next build` leaves these beside standalone; the Docker runner copies both.
# Recreate that runner layout with temporary symlinks for the local smoke.
if [[ ! -e .next/standalone/public ]]; then
  ln -s ../../public .next/standalone/public
  linked_public=true
fi
if [[ ! -e .next/standalone/.next/static ]]; then
  ln -s ../../static .next/standalone/.next/static
  linked_static=true
fi

PORT="$port" HOSTNAME=127.0.0.1 AURORA_BUILD_SHA="$expected_sha" node .next/standalone/server.js >"$log_file" 2>&1 &
pid=$!

for _ in $(seq 1 60); do
  if curl --silent --show-error --fail --dump-header "$headers" --output /dev/null "http://127.0.0.1:$port/"; then
    break
  fi
  sleep 1
done

curl --silent --show-error --fail --dump-header "$headers" --output "$html" "http://127.0.0.1:$port/"
grep -Eqi '^content-security-policy:.*script-src[^;]*nonce-' "$headers"
if grep -Eqi '^content-security-policy:.*script-src[^;]*unsafe-inline' "$headers"; then
  echo "production script CSP still permits unsafe-inline" >&2
  exit 1
fi
grep -Eqi '^x-powered-by:' "$headers" && { echo "X-Powered-By must be disabled" >&2; exit 1; }
grep -Eqi "^x-aurora-revision:[[:space:]]*$expected_sha" "$headers"
nonce="$(sed -nE "s/^content-security-policy:.*'nonce-([^']+)'.*/\1/ip" "$headers" | tr -d '\r' | head -1)"
test -n "$nonce"
python - "$html" "$nonce" <<'PY'
import pathlib, re, sys
html = pathlib.Path(sys.argv[1]).read_text()
nonce = sys.argv[2]
scripts = re.findall(r"<script\b[^>]*>", html, flags=re.IGNORECASE)
if not scripts or any(f'nonce="{nonce}"' not in tag for tag in scripts):
    raise SystemExit("every inline/framework script must carry the request CSP nonce")
PY

if find .next/static -type f -name '*.map' -print -quit | grep -q .; then
  echo "browser source maps must not ship in the production static tree" >&2
  exit 1
fi
static_asset="$(sed -nE 's/.*<script[^>]+src="([^"]*\/_next\/static\/[^"]+)".*/\1/p' "$html" | head -1)"
test -n "$static_asset"
curl --silent --show-error --fail --dump-header "$headers" --output /dev/null \
  "http://127.0.0.1:$port$static_asset"
grep -Eqi '^cache-control:.*max-age=31536000.*immutable' "$headers"

chrome="$(command -v google-chrome || command -v chromium || true)"
if [[ -z "$chrome" ]]; then
  echo "Chrome/Chromium is required to prove CSP-compatible hydration" >&2
  exit 1
fi
"$chrome" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage \
  --virtual-time-budget=5000 --dump-dom "http://127.0.0.1:$port/" \
  >"$hydrated_html" 2>"$browser_log"
grep -q '<html' "$hydrated_html"
if grep -Eqi 'Refused to execute inline script|Hydration failed|uncaught|application error' "$browser_log" "$hydrated_html"; then
  echo "browser reported a CSP or hydration failure" >&2
  cat "$browser_log" >&2
  exit 1
fi

curl --silent --show-error --fail --dump-header "$headers" --output /dev/null "http://127.0.0.1:$port/r/aurora-tokens.json"
grep -Eqi '^cache-control:.*max-age=300.*stale-while-revalidate=86400' "$headers"

echo "Production headers, CSP nonce, revision, and registry caching are valid."
