package tv.tootie.aurora.components.screenshot

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.github.takahirom.roborazzi.RoborazziRule
import com.github.takahirom.roborazzi.RoborazziRule.Options
import com.github.takahirom.roborazzi.RoborazziOptions
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import androidx.compose.ui.test.junit4.v2.createComposeRule
import com.github.takahirom.roborazzi.ExperimentalRoborazziApi
import androidx.compose.ui.test.isRoot
import com.github.takahirom.roborazzi.captureRoboImage
import tv.tootie.aurora.components.AuroraPermissionPrompt
import tv.tootie.aurora.theme.AuroraTheme

/**
 * Roborazzi screenshot tests for [AuroraPermissionPrompt].
 *
 * These tests render the dialog on the JVM via Robolectric + Compose Test Rule and
 * capture PNG snapshots under `aurora/src/test/snapshots/images/`. The snapshots are
 * checked in to source control and verified on CI with:
 *
 *   ./gradlew :aurora:verifyRoborazziDebug
 *
 * To update golden files after an intentional visual change:
 *
 *   ./gradlew :aurora:recordRoborazziDebug
 *
 * Why these components first? [AuroraPermissionPrompt] renders sanitized
 * attacker-controlled strings (command and reason fields from approval requests) and
 * [AuroraToolCallList] renders tool names and I/O — both are high-traffic surfaces
 * where visual regressions or truncation bugs have user-visible security impact.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [34], qualifiers = "w400dp-h800dp-xhdpi")
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@OptIn(ExperimentalRoborazziApi::class)
class AuroraPermissionPromptScreenshotTest {

    private val screenshotOptions = RoborazziOptions()

    @get:Rule
    val composeRule = createComposeRule()

    @get:Rule
    val roborazziRule = RoborazziRule(
        options = Options(
            roborazziOptions = screenshotOptions,
            // Each test captures its Compose root explicitly below. LastImage
            // also requires a captureRoot on the rule and would attempt a
            // second capture after the test, failing before golden comparison.
            captureType = RoborazziRule.CaptureType.None,
        ),
    )

    private fun captureDialog() {
        // Compose Dialog creates a second semantics root. Capture the dialog
        // root (last) rather than requiring the test harness and dialog to
        // collapse into a single root.
        composeRule.onAllNodes(isRoot())[1].captureRoboImage(roborazziOptions = screenshotOptions)
    }

    @Test
    fun permissionPrompt_command_defaultState() {
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp)) {
                    AuroraPermissionPrompt(
                        onDismissRequest = {},
                        title = "Allow command?",
                        description = "Run: git commit -m \"feat: add login\"",
                        onAllow = {},
                        allowLabel = "Allow",
                        denyLabel = "Deny",
                    )
                }
            }
        }
        captureDialog()
    }

    @Test
    fun permissionPrompt_fileChanges_defaultState() {
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp)) {
                    AuroraPermissionPrompt(
                        onDismissRequest = {},
                        title = "Allow file changes?",
                        description = "Write 3 files in src/main/kotlin/",
                        onAllow = {},
                        allowLabel = "Allow",
                        denyLabel = "Deny",
                    )
                }
            }
        }
        captureDialog()
    }

    @Test
    fun permissionPrompt_mixedScriptWarning() {
        // Simulates the mixed-script annotation added in ChatScreen for homoglyph attacks.
        // Verifies the warning prefix renders and the original content is preserved below it.
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp)) {
                    AuroraPermissionPrompt(
                        onDismissRequest = {},
                        title = "Allow command?",
                        description = "⚠ Contains non-Latin or mixed-script characters — " +
                            "verify carefully before allowing.\n\n" +
                            "Run: rm -rf /hоme/user/data",  // Cyrillic 'о' in "hоme"
                        onAllow = {},
                        allowLabel = "Allow",
                        denyLabel = "Deny",
                    )
                }
            }
        }
        captureDialog()
    }

    @Test
    fun permissionPrompt_longCommandTruncation() {
        // Verifies long attacker-controlled strings don't overflow the dialog layout.
        val longCmd = "python3 " + "a".repeat(200) + ".py"
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp)) {
                    AuroraPermissionPrompt(
                        onDismissRequest = {},
                        title = "Allow command?",
                        description = longCmd,
                        onAllow = {},
                    )
                }
            }
        }
        captureDialog()
    }

    @Test
    fun permissionPrompt_destructive() {
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp)) {
                    AuroraPermissionPrompt(
                        onDismissRequest = {},
                        title = "Delete repository?",
                        description = "This action cannot be undone.",
                        onAllow = {},
                        allowLabel = "Delete",
                        denyLabel = "Cancel",
                        destructive = true,
                    )
                }
            }
        }
        captureDialog()
    }
}
