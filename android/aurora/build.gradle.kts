import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.roborazzi)
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
    implementation(libs.compose.material.icons.extended)
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
