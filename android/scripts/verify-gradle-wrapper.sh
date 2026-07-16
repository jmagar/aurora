#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_JAR_SHA="2db75c40782f5e8ba1fc278a5574bab070adccb2d21ca5a6e5ed840888448046"
EXPECTED_DIST_SHA="20f1b1176237254a6fc204d8434196fa11a4cfb387567519c61556e8710aed78"

printf '%s  %s\n' "$EXPECTED_JAR_SHA" "$ROOT/gradle/wrapper/gradle-wrapper.jar" | sha256sum --check --status
grep -q "^distributionSha256Sum=$EXPECTED_DIST_SHA$" "$ROOT/gradle/wrapper/gradle-wrapper.properties"
grep -q '^validateDistributionUrl=true$' "$ROOT/gradle/wrapper/gradle-wrapper.properties"

echo "Gradle wrapper JAR, distribution checksum, and URL validation are pinned."
