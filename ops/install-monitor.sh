#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
systemd_root="${AURORA_SYSTEMD_ROOT:-/etc/systemd/system}"

[[ "$EUID" -eq 0 ]] || { echo "install-monitor.sh must run as root" >&2; exit 1; }
install -d -m 0755 /opt/aurora/ops /etc/aurora
install -m 0755 "$root/ops/monitor-container.sh" /opt/aurora/ops/monitor-container.sh
install -m 0644 "$root/ops/systemd/aurora-monitor.service" "$systemd_root/aurora-monitor.service"
install -m 0644 "$root/ops/systemd/aurora-monitor.timer" "$systemd_root/aurora-monitor.timer"
if [[ ! -e /etc/aurora/monitor.env ]]; then
  install -m 0600 /dev/null /etc/aurora/monitor.env
fi
systemctl daemon-reload
systemctl enable --now aurora-monitor.timer
systemctl is-enabled --quiet aurora-monitor.timer
systemctl is-active --quiet aurora-monitor.timer
echo "Aurora monitor timer is installed, enabled, and active."
