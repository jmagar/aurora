package tv.tootie.aurora.components.screenshot

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.github.takahirom.roborazzi.RoborazziRule
import com.github.takahirom.roborazzi.RoborazziOptions
import kotlinx.collections.immutable.persistentListOf
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onRoot
import com.github.takahirom.roborazzi.captureRoboImage
import tv.tootie.aurora.components.AuroraToolCall
import tv.tootie.aurora.components.AuroraToolCallList
import tv.tootie.aurora.components.AuroraToolCallStatus
import tv.tootie.aurora.theme.AuroraTheme

/**
 * Roborazzi screenshot tests for [AuroraToolCallList].
 *
 * See [AuroraPermissionPromptScreenshotTest] for the general setup notes.
 *
 * [AuroraToolCallList] renders tool names and I/O payloads from the server —
 * both are attacker-influenced surfaces. Screenshot tests catch:
 *   - Layout regressions when tool names or I/O strings are long
 *   - Status dot rendering for Running / Done / Error states
 *   - Mixed / empty I/O payload edge cases
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [34], qualifiers = "w400dp-h800dp-xhdpi")
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class AuroraToolCallListScreenshotTest {

    @get:Rule
    val composeRule = createComposeRule()

    @get:Rule
    val roborazziRule = RoborazziRule(
        options = RoborazziRule.Options(
            roborazziOptions = RoborazziOptions(),
            captureType = RoborazziRule.CaptureType.LastImage(),
        ),
    )

    @Test
    fun toolCallList_singleRunning() {
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp).fillMaxWidth()) {
                    AuroraToolCallList(
                        calls = persistentListOf(
                            AuroraToolCall(
                                id = "1",
                                name = "bash",
                                status = AuroraToolCallStatus.Running,
                            ),
                        ),
                    )
                }
            }
        }
        composeRule.onRoot().captureRoboImage()
    }

    @Test
    fun toolCallList_mixedStatuses() {
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp).fillMaxWidth()) {
                    AuroraToolCallList(
                        calls = persistentListOf(
                            AuroraToolCall(
                                id = "1",
                                name = "read_file",
                                status = AuroraToolCallStatus.Done,
                                input = """{"path": "src/main/App.kt"}""",
                                output = "// file content here",
                            ),
                            AuroraToolCall(
                                id = "2",
                                name = "bash",
                                status = AuroraToolCallStatus.Running,
                                input = """{"cmd": "git status"}""",
                            ),
                            AuroraToolCall(
                                id = "3",
                                name = "write_file",
                                status = AuroraToolCallStatus.Error,
                                input = """{"path": "/etc/passwd"}""",
                                output = "Permission denied",
                            ),
                        ),
                    )
                }
            }
        }
        composeRule.onRoot().captureRoboImage()
    }

    @Test
    fun toolCallList_longToolName() {
        // Verifies attacker-controlled tool names don't overflow the row layout.
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp).fillMaxWidth()) {
                    AuroraToolCallList(
                        calls = persistentListOf(
                            AuroraToolCall(
                                id = "1",
                                name = "mcp__very_long_server_name__tool_with_a_very_long_name_that_might_overflow",
                                status = AuroraToolCallStatus.Done,
                            ),
                        ),
                    )
                }
            }
        }
        composeRule.onRoot().captureRoboImage()
    }

    @Test
    fun toolCallList_noInputOrOutput() {
        // Collapsed state — no input/output payload, just the tool name row.
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp).fillMaxWidth()) {
                    AuroraToolCallList(
                        calls = persistentListOf(
                            AuroraToolCall(
                                id = "1",
                                name = "list_directory",
                                status = AuroraToolCallStatus.Done,
                                input = null,
                                output = null,
                            ),
                        ),
                    )
                }
            }
        }
        composeRule.onRoot().captureRoboImage()
    }

    @Test
    fun toolCallList_empty() {
        // Edge case: empty list should render nothing (no crash, no phantom rows).
        composeRule.setContent {
            AuroraTheme {
                Box(modifier = Modifier.padding(16.dp).fillMaxWidth()) {
                    AuroraToolCallList(calls = persistentListOf())
                }
            }
        }
        composeRule.onRoot().captureRoboImage()
    }
}
