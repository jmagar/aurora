#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$tmp/bin" "$tmp/docker-root"

cat >"$tmp/bin/docker" <<'EOF'
#!/usr/bin/env bash
case "$1" in
  inspect) printf '%s\n' "${MOCK_STATE:-running healthy false 0}" ;;
  info) printf '%s\n' "$MOCK_DOCKER_ROOT" ;;
  stats) printf '%s\n' "${MOCK_MEMORY:-42.5%}" ;;
  *) exit 2 ;;
esac
EOF
cat >"$tmp/bin/df" <<'EOF'
#!/usr/bin/env bash
printf 'Use%%\n%s%%\n' "${MOCK_DISK:-40}"
EOF
cat >"$tmp/bin/curl" <<'EOF'
#!/usr/bin/env bash
cat >"$MOCK_ALERT_FILE"
EOF
chmod +x "$tmp/bin/docker" "$tmp/bin/df" "$tmp/bin/curl"

PATH="$tmp/bin:$PATH" MOCK_DOCKER_ROOT="$tmp/docker-root" "$root/ops/monitor-container.sh" >/dev/null
if PATH="$tmp/bin:$PATH" MOCK_DOCKER_ROOT="$tmp/docker-root" MOCK_MEMORY=90% "$root/ops/monitor-container.sh" >/dev/null 2>&1; then
  echo "memory threshold should fail" >&2
  exit 1
fi
if PATH="$tmp/bin:$PATH" MOCK_DOCKER_ROOT="$tmp/docker-root" MOCK_DISK=90 "$root/ops/monitor-container.sh" >/dev/null 2>&1; then
  echo "disk threshold should fail" >&2
  exit 1
fi
alert_file="$tmp/alert.json"
if PATH="$tmp/bin:$PATH" MOCK_DOCKER_ROOT="" MOCK_ALERT_FILE="$alert_file" \
  AURORA_ALERT_WEBHOOK_URL="https://alerts.invalid/aurora" "$root/ops/monitor-container.sh" >/dev/null 2>&1; then
  echo "missing Docker root should fail" >&2
  exit 1
fi
jq -e '.service == "aurora" and (.message | contains("Docker root directory is unavailable"))' "$alert_file" >/dev/null
echo "Aurora monitor health and resource thresholds passed."
