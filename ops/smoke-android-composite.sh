#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

mkdir -p "$tmp/app/src/main/kotlin/example" "$tmp/app/src/main"
sed "s|__AURORA_ANDROID__|$root/android|g" > "$tmp/settings.gradle.kts" <<'EOF'
pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { google(); mavenCentral() }
}
includeBuild("__AURORA_ANDROID__") {
    dependencySubstitution {
        substitute(module("tv.tootie.aurora:aurora")).using(project(":aurora"))
    }
}
rootProject.name = "aurora-composite-smoke"
include(":app")
EOF

agp="$(sed -n 's/^agp = "\([^"]*\)"/\1/p' "$root/android/gradle/libs.versions.toml")"
kotlin="$(sed -n 's/^kotlin = "\([^"]*\)"/\1/p' "$root/android/gradle/libs.versions.toml")"
cat > "$tmp/build.gradle.kts" <<EOF
plugins {
    id("com.android.application") version "$agp" apply false
    id("org.jetbrains.kotlin.android") version "$kotlin" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "$kotlin" apply false
}
EOF
cat > "$tmp/gradle.properties" <<'EOF'
android.useAndroidX=true
EOF
cat > "$tmp/app/build.gradle.kts" <<'EOF'
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}
android {
    namespace = "dev.aurora.smoke"
    compileSdk = 36
    defaultConfig { minSdk = 24 }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
    }
}
dependencies {
    implementation("tv.tootie.aurora:aurora:0.0.0-local")
}
EOF
cat > "$tmp/app/src/main/AndroidManifest.xml" <<'EOF'
<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application /></manifest>
EOF
cat > "$tmp/app/src/main/kotlin/example/Smoke.kt" <<'EOF'
package dev.aurora.smoke

import androidx.compose.runtime.Composable
import tv.tootie.aurora.theme.AuroraTheme

@Composable
fun CompositeSmoke() = AuroraTheme { }
EOF

"$root/android/gradlew" -p "$tmp" :app:compileDebugKotlin --no-daemon --stacktrace
echo "External consumer resolved tv.tootie.aurora:aurora through the local composite."
