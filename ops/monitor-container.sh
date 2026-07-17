#!/usr/bin/env bash
set -euo pipefail

container="${AURORA_CONTAINER:-aurora}"
alert_url="${AURORA_ALERT_WEBHOOK_URL:-}"

state="$(docker inspect --format '{{.State.Status}} {{.State.Health.Status}} {{.State.OOMKilled}} {{.RestartCount}}' "$container" 2>/dev/null || true)"
disk_percent="$(df --output=pcent /var/lib/docker 2>/dev/null | tail -1 | tr -dc '0-9' || true)"
memory="$(docker stats --no-stream --format '{{.MemPerc}}' "$container" 2>/dev/null || true)"

if [[ "$state" != 'running healthy false '* ]] || [[ -n "$disk_percent" && "$disk_percent" -ge "${AURORA_DISK_ALERT_PERCENT:-85}" ]]; then
  message="Aurora monitor failure: state=[$state] docker_disk=${disk_percent:-unknown}% memory=${memory:-unknown}"
  echo "$message" >&2
  if [[ -n "$alert_url" ]]; then
    jq -n --arg message "$message" '{message: $message, service: "aurora"}' \
      | curl --fail --silent --show-error -H 'Content-Type: application/json' --data-binary @- "$alert_url"
  fi
  exit 1
fi

echo "Aurora container healthy: state=[$state] docker_disk=${disk_percent:-unknown}% memory=${memory:-unknown}"
