plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
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

// Token generation task — checks freshness of tokens JSON before compileKotlin
val generateAuroraTokens by tasks.registering(Exec::class) {
    workingDir = rootDir.parentFile  // project root (where package.json lives)
    commandLine("pnpm", "run", "tokens:generate")

    inputs.file(rootDir.parentFile.resolve("android/tokens/aurora.tokens.json"))
    outputs.dir(layout.projectDirectory.dir("src/main/kotlin/tv/tootie/aurora/tokens"))

    description = "Generate Kotlin token files from aurora.tokens.json via Style Dictionary"
}

tasks.matching { it.name.startsWith("compile") && it.name.contains("Kotlin") }.configureEach {
    dependsOn(generateAuroraTokens)
}

dependencies {
    val bom = platform(libs.compose.bom)
    implementation(bom)
    implementation(libs.compose.material3)
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    debugImplementation(libs.compose.ui.tooling)
}
