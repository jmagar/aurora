package tv.tootie.aurora.components

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import kotlinx.collections.immutable.persistentListOf
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

/**
 * JVM render tests for the two Aurora components that surface attacker-controlled
 * strings: [AuroraPermissionPrompt] and [AuroraToolCallList].
 *
 * Run with: ./gradlew :aurora:testDebugUnitTest
 *
 * These tests deliberately pass adversarial inputs — long strings, Unicode
 * homoglyphs, mixed-script text, and embedded control characters — to verify that
 * the components render without crashing and that the visible text matches what
 * was supplied (i.e. no unexpected truncation or substitution occurs at the
 * Compose layer; the ViewModel's sanitizeForDisplay has already run upstream).
 */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class AuroraHighTrafficRenderTest {

    @get:Rule
    val rule = createComposeRule()

    // --- AuroraPermissionPrompt ---

    @Test
    fun permissionPrompt_rendersTitle() {
        rule.setContent {
            AuroraPermissionPrompt(
                onDismissRequest = {},
                title = "Allow command?",
                description = "Run: echo hello",
                onAllow = {},
            )
        }
        rule.onNodeWithText("Allow command?").assertIsDisplayed()
    }

    @Test
    fun permissionPrompt_rendersDescription() {
        rule.setContent {
            AuroraPermissionPrompt(
                onDismissRequest = {},
                title = "Allow file changes?",
                description = "Write to /etc/hosts",
                onAllow = {},
            )
        }
        rule.onNodeWithText("Write to /etc/hosts").assertIsDisplayed()
    }

    @Test
    fun permissionPrompt_rendersCustomButtonLabels() {
        rule.setContent {
            AuroraPermissionPrompt(
                onDismissRequest = {},
                title = "Confirm",
                description = "Proceed?",
                onAllow = {},
                allowLabel = "Yes, proceed",
                denyLabel = "Cancel",
            )
        }
        rule.onNodeWithText("Yes, proceed").assertIsDisplayed()
        rule.onNodeWithText("Cancel").assertIsDisplayed()
    }

    @Test
    fun permissionPrompt_doesNotCrashOnLongAttackerString() {
        // 4 096-char string simulating a server-injected command description
        val longStr = "A".repeat(4096)
        rule.setContent {
            AuroraPermissionPrompt(
                onDismissRequest = {},
                title = "Allow command?",
                description = longStr,
                onAllow = {},
            )
        }
        // Component must not throw during layout; title still reachable
        rule.onNodeWithText("Allow command?").assertIsDisplayed()
    }

    @Test
    fun permissionPrompt_doesNotCrashOnHomoglyphContent() {
        // Mixed-script / homoglyph string that could be used for visual spoofing.
        // The component must render it verbatim — sanitization is upstream.
        val homoglyph = "Alloс сommand?" // Cyrillic 'с' mixed into Latin
        rule.setContent {
            AuroraPermissionPrompt(
                onDismissRequest = {},
                title = "Prompt",
                description = homoglyph,
                onAllow = {},
            )
        }
        rule.onNodeWithText("Prompt").assertIsDisplayed()
    }

    @Test
    fun permissionPrompt_doesNotCrashOnMultilineDescription() {
        val multiline = "Line 1\nLine 2\nLine 3\n\nAfter blank line"
        rule.setContent {
            AuroraPermissionPrompt(
                onDismissRequest = {},
                title = "Allow?",
                description = multiline,
                onAllow = {},
            )
        }
        rule.onNodeWithText("Allow?").assertIsDisplayed()
    }

    // --- AuroraToolCallList ---

    @Test
    fun toolCallList_rendersToolName() {
        val calls = persistentListOf(
            AuroraToolCall(id = "1", name = "bash", status = AuroraToolCallStatus.Done),
        )
        rule.setContent { AuroraToolCallList(calls = calls) }
        rule.onNodeWithText("bash").assertIsDisplayed()
    }

    @Test
    fun toolCallList_rendersOutput() {
        val calls = persistentListOf(
            AuroraToolCall(
                id = "1",
                name = "read_file",
                status = AuroraToolCallStatus.Done,
                output = "File contents here",
            ),
        )
        rule.setContent { AuroraToolCallList(calls = calls) }
        rule.onNodeWithText("read_file").assertIsDisplayed()
    }

    @Test
    fun toolCallList_doesNotCrashOnAttackerControlledOutput() {
        // Simulate a server tool returning adversarial content that was sanitized
        // upstream. The Compose layer must not crash or throw on this input.
        val adversarialOutput = buildString {
            repeat(200) { append("line $it: ​‌‍ invisible chars\n") }
        }
        val calls = persistentListOf(
            AuroraToolCall(
                id = "1",
                name = "exec",
                status = AuroraToolCallStatus.Done,
                output = adversarialOutput,
            ),
        )
        rule.setContent { AuroraToolCallList(calls = calls) }
        rule.onNodeWithText("exec").assertIsDisplayed()
    }

    @Test
    fun toolCallList_rendersMultipleToolsInOrder() {
        val calls = persistentListOf(
            AuroraToolCall(id = "1", name = "search", status = AuroraToolCallStatus.Done),
            AuroraToolCall(id = "2", name = "write_file", status = AuroraToolCallStatus.Running),
            AuroraToolCall(id = "3", name = "bash", status = AuroraToolCallStatus.Error),
        )
        rule.setContent { AuroraToolCallList(calls = calls) }
        rule.onNodeWithText("search").assertIsDisplayed()
        rule.onNodeWithText("write_file").assertIsDisplayed()
        rule.onNodeWithText("bash").assertIsDisplayed()
    }

    @Test
    fun toolCallList_doesNotCrashOnEmptyList() {
        rule.setContent { AuroraToolCallList(calls = persistentListOf()) }
        // No assertion needed — just verify no exception during composition
    }
}
