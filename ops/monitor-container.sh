#!/usr/bin/env bash
set -euo pipefail

container="${AURORA_CONTAINER:-aurora}"
alert_url="${AURORA_ALERT_WEBHOOK_URL:-}"

send_alert() {
  local message="$1"
  echo "$message" >&2
  if [[ -n "$alert_url" ]]; then
    jq -n --arg message "$message" '{message: $message, service: "aurora"}' \
      | curl --fail --silent --show-error -H 'Content-Type: application/json' --data-binary @- "$alert_url"
  fi
}

state="$(docker inspect --format '{{.State.Status}} {{.State.Health.Status}} {{.State.OOMKilled}} {{.RestartCount}}' "$container" 2>/dev/null || true)"
docker_root="$(docker info --format '{{.DockerRootDir}}' 2>/dev/null || true)"
if [[ -z "$docker_root" || ! -d "$docker_root" ]]; then
  # LEARNED: monitor failures need the same out-of-band alert path as service failures.
  send_alert "Aurora monitor failure: Docker root directory is unavailable: ${docker_root:-unknown}"
  exit 1
fi
disk_percent="$(df --output=pcent -- "$docker_root" 2>/dev/null | tail -1 | tr -dc '0-9' || true)"
memory="$(docker stats --no-stream --format '{{.MemPerc}}' "$container" 2>/dev/null || true)"
memory_percent="$(tr -dc '0-9.' <<<"$memory")"
disk_threshold="${AURORA_DISK_ALERT_PERCENT:-85}"
memory_threshold="${AURORA_MEMORY_ALERT_PERCENT:-85}"

if [[ -z "$disk_percent" || -z "$memory_percent" ]]; then
  message="Aurora monitor failure: unable to collect resource metrics docker_root=[$docker_root] docker_disk=${disk_percent:-unknown}% memory=${memory:-unknown}"
elif [[ "$state" != 'running healthy false '* ]] || (( disk_percent >= disk_threshold )) || awk -v value="$memory_percent" -v limit="$memory_threshold" 'BEGIN { exit !(value >= limit) }'; then
  message="Aurora monitor failure: state=[$state] docker_disk=${disk_percent:-unknown}% memory=${memory:-unknown}"
else
  message=""
fi

if [[ -n "$message" ]]; then
  send_alert "$message"
  exit 1
fi

echo "Aurora container healthy: state=[$state] docker_root=[$docker_root] docker_disk=${disk_percent}% memory=${memory}"
