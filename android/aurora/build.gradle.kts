plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.roborazzi)
}

kotlin {
    explicitApi()
}

// Token generation task — tracks the source files that produce tokens JSON before compileKotlin
val generatedTokensDir = layout.buildDirectory.dir("generated/aurora-tokens/kotlin")

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

    kotlinOptions {
        jvmTarget = "17"
    }

    testOptions {
        unitTests {
            isIncludeAndroidResources = true
        }
    }
}

val generateAuroraTokens by tasks.registering(Exec::class) {
    workingDir = rootDir.parentFile  // project root (where package.json lives)
    commandLine("pnpm", "run", "tokens:generate")

    // Resolve the Provider at execution time (not configuration time) so Gradle
    // doesn't stringify the Provider object as the env-var value.
    doFirst {
        environment(
            "AURORA_TOKENS_OUT",
            generatedTokensDir.get().asFile.resolve("tv/tootie/aurora/tokens").absolutePath,
        )
    }

    inputs.file(rootDir.parentFile.resolve("registry/aurora/styles/aurora.css"))
    inputs.file(rootDir.parentFile.resolve("scripts/export-aurora-tokens.mjs"))
    inputs.file(rootDir.parentFile.resolve("android/sd.config.mjs"))
    inputs.file(rootDir.parentFile.resolve("package.json"))
    inputs.file(rootDir.parentFile.resolve("pnpm-lock.yaml"))
    outputs.file(rootDir.parentFile.resolve("android/tokens/aurora.tokens.json"))
    outputs.file(rootDir.parentFile.resolve("android/tokens/EXCLUSIONS.json"))
    outputs.dir(generatedTokensDir)

    description = "Generate Android token JSON and Kotlin token files from Aurora CSS"
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    dependsOn(generateAuroraTokens)
}

android.sourceSets["main"].kotlin.srcDir(generatedTokensDir)

dependencies {
    val bom = platform(libs.compose.bom)
    implementation(bom)
    implementation(libs.compose.material3)
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    debugImplementation(libs.compose.ui.tooling)
    implementation(libs.activity.compose)
    implementation(libs.kotlinx.collections.immutable)
    implementation(libs.coil.compose)
    implementation(libs.androidx.webkit)
    implementation(libs.compose.material.icons.extended)
    testImplementation(libs.junit)
    // Compose UI testing on JVM via Robolectric (no emulator needed).
    // ui-test-manifest is debugImplementation so AGP merges its AndroidManifest
    // with the test APK, enabling Robolectric to resolve Activity themes.
    testImplementation(bom)
    testImplementation(libs.compose.ui.test.junit4)
    debugImplementation(libs.compose.ui.test.manifest)
    testImplementation(libs.robolectric)
    testImplementation(libs.roborazzi)
    testImplementation(libs.roborazzi.compose)
    testImplementation(libs.roborazzi.rule)
    testImplementation(libs.androidx.test.ext.junit)
    testImplementation(libs.androidx.test.runner)
}
