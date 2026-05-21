plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
}

kotlin {
    explicitApi()
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

    kotlinOptions {
        jvmTarget = "17"
    }
}

// Token generation task — tracks the source files that produce tokens JSON before compileKotlin
val generatedTokensDir = layout.buildDirectory.dir("generated/aurora-tokens/kotlin")

val generateAuroraTokens by tasks.registering(Exec::class) {
    workingDir = rootDir.parentFile  // project root (where package.json lives)
    commandLine("pnpm", "run", "tokens:generate")

    // Tell sd.config.mjs where to write AuroraColors.kt — the package subpath must
    // be included because Style Dictionary writes the file directly at buildPath.
    environment(
        "AURORA_TOKENS_OUT",
        generatedTokensDir.map { it.asFile.resolve("tv/tootie/aurora/tokens").absolutePath },
    )

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

android.sourceSets["main"].kotlin.srcDir(generatedTokensDir)

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    dependsOn(generateAuroraTokens)
}

dependencies {
    val bom = platform(libs.compose.bom)
    implementation(bom)
    implementation(libs.compose.material3)
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    debugImplementation(libs.compose.ui.tooling)
    implementation(libs.kotlinx.collections.immutable)
}
