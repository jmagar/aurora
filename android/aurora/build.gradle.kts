import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.roborazzi)
}

android {
    namespace = "tv.tootie.aurora"
    compileSdk = 36

    defaultConfig {
        minSdk = 24
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    testOptions {
        unitTests {
            isIncludeAndroidResources = true
        }
    }
}

kotlin {
    explicitApi()
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

roborazzi {
    // Keep reviewable goldens in source control. Build-local defaults make
    // verifyRoborazzi pass only on the machine that recorded them.
    outputDir.set(file("src/test/snapshots/images"))
}

// Compilation consumes checked-in Kotlin tokens and never requires Node/pnpm.
// Regeneration is an explicit repository workflow; this verification task catches drift.
val checkAuroraTokenDrift by tasks.registering(Exec::class) {
    val sourceDir = projectDir.resolve("src/main/kotlin/tv/tootie/aurora/tokens")
    val jsonDir = rootDir.resolve("tokens")
    workingDir = rootDir.parentFile
    commandLine(
        "bash", "-c",
        // LEARNED: every generated artifact comparison must propagate failure independently.
        "set -euo pipefail; out=\$(mktemp -d); trap 'rm -rf \"\$out\"' EXIT; mkdir -p \"\$out/json\" \"\$out/kotlin\"; " +
            "AURORA_TOKENS_JSON_OUT=\"\$out/json\" AURORA_TOKENS_OUT=\"\$out/kotlin\" pnpm run tokens:generate >/dev/null; " +
            "diff -u '${jsonDir.resolve("aurora.tokens.json")}' \"\$out/json/aurora.tokens.json\"; " +
            "diff -u '${jsonDir.resolve("EXCLUSIONS.json")}' \"\$out/json/EXCLUSIONS.json\"; " +
            "diff -u '${sourceDir.resolve("AuroraColors.kt")}' \"\$out/kotlin/AuroraColors.kt\"; " +
            "diff -u '${sourceDir.resolve("AuroraLightColors.kt")}' \"\$out/kotlin/AuroraLightColors.kt\"",
    )
    description = "Verify checked-in Android JSON and Kotlin tokens match canonical CSS"
}

dependencies {
    val bom = platform(libs.compose.bom)
    // These types appear in Aurora's public Compose API (`@Composable`,
    // `Modifier`, Material color/shape types, and preview annotations), so
    // consumers must receive them on their compile classpath.
    api(bom)
    api(libs.compose.material3)
    api(libs.compose.ui)
    api(libs.compose.ui.tooling.preview)
    debugImplementation(libs.compose.ui.tooling)
    implementation(libs.activity.compose)
    api(libs.kotlinx.collections.immutable)
    implementation(libs.coil.compose)
    implementation(libs.androidx.webkit)
    // Aurora owns the icon surface for both the library and bundled app. Export one
    // resolved artifact instead of declaring duplicate copies in both modules.
    api(libs.compose.material.icons.core)
    testImplementation(libs.junit)
    // Compose UI testing on JVM via Robolectric (no emulator needed).
    // Keep the test activity manifest on every unit-test variant. Restricting this
    // to debug makes release Robolectric/Compose tests fail to resolve
    // ComponentActivity.
    testImplementation(bom)
    testImplementation(libs.compose.ui.test.junit4)
    testImplementation(libs.compose.ui.test.manifest)
    testImplementation(libs.robolectric)
    testImplementation(libs.roborazzi)
    testImplementation(libs.roborazzi.compose)
    testImplementation(libs.roborazzi.rule)
    testImplementation(libs.androidx.test.ext.junit)
    testImplementation(libs.androidx.test.runner)
}
