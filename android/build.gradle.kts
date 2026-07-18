plugins {
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.compose.compiler) apply false
    alias(libs.plugins.kotlinx.serialization) apply false
}

/**
 * Canonical native gate. CI and release automation should invoke only this task
 * so app/library debug and release variants cannot drift apart.
 */
val verifyGradleWrapper by tasks.registering(Exec::class) {
    group = "verification"
    commandLine("bash", rootDir.resolve("scripts/verify-gradle-wrapper.sh").absolutePath)
}

tasks.register("androidCheck") {
    group = "verification"
    description = "Run all Android unit, lint, release packaging, and visual-regression gates"
    dependsOn(
        verifyGradleWrapper,
        ":app:testDebugUnitTest",
        ":app:testReleaseUnitTest",
        ":app:lintDebug",
        ":app:lintRelease",
        ":app:assembleRelease",
        ":aurora:testDebugUnitTest",
        ":aurora:testReleaseUnitTest",
        ":aurora:lintDebug",
        ":aurora:lintRelease",
        ":aurora:verifyRoborazziDebug",
        ":aurora:checkAuroraTokenDrift",
    )
}

/** Explicit KVM/x86_64 gate for CI hosts that support Gradle managed devices. */
tasks.register("androidManagedDeviceCheck") {
    group = "verification"
    description = "Run Android instrumentation tests on the API 35 managed device"
    dependsOn(":app:pixel2Api35DebugAndroidTest")
}
