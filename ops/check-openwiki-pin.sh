#!/usr/bin/env bash
set -euo pipefail

expected_version=0.1.2
expected_integrity='sha512-mq4pxTNm3vYBBEFD1nRgSZv0wT10yHc2JeOR1Tk3it2425E3Q4xR+wqYs7koUw3rMtsFgDFuNfwOl7fmsUJi3g=='

node -e 'const p = require("./package.json"); if (p.devDependencies.openwiki !== process.argv[1]) process.exit(1)' "$expected_version"
grep -q "^  openwiki@$expected_version:" pnpm-lock.yaml
grep -q -F "resolution: {integrity: $expected_integrity}" pnpm-lock.yaml

echo "OpenWiki package version and integrity are pinned."
