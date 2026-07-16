#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ADB="${ADB:-adb}"
APK="$ROOT/app/build/outputs/apk/release/app-release-unsigned.apk"
PACKAGE="tv.tootie.aurora.app"
ACTIVITY="$PACKAGE/.MainActivity"

"$ROOT/gradlew" -p "$ROOT" :app:assembleRelease --no-daemon
"$ADB" get-state >/dev/null
"$ADB" logcat -c
"$ADB" install -r "$APK"
"$ADB" shell am force-stop "$PACKAGE"
"$ADB" shell am start -W -n "$ACTIVITY" | tee /tmp/aurora-release-launch.txt
grep -q 'Status: ok' /tmp/aurora-release-launch.txt
! "$ADB" logcat -d -b crash | grep -q "$PACKAGE"
"$ADB" shell dumpsys package "$PACKAGE" | grep -q 'versionName=1.0'

echo "Release APK installed and launched without a recorded crash."
