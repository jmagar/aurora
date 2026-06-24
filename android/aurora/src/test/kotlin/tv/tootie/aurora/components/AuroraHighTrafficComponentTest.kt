package tv.tootie.aurora.components

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Test

/**
 * Structural and contract tests for high-traffic Aurora components that render
 * attacker-controlled strings:
 *  - [AuroraToolCall] / [AuroraToolCallList]
 *  - [AuroraPermissionPrompt] (verified via source-pattern inspection)
 *
 * NOTE: Full screenshot regression tests (Roborazzi/Paparazzi) require adding
 * io.github.takahirom.roborazzi and the Robolectric test runner to the build.
 * These JVM tests cover the data-layer and API contracts without a render pipeline.
 *
 * Security focus: the approval prompt and tool-call list render server-supplied
 * strings verbatim. These tests pin the data shapes so a refactor cannot
 * accidentally drop or truncate attacker-controlled content before it reaches the
 * sanitizeForDisplay() call in the ViewModel layer.
 */
class AuroraHighTrafficComponentTest {

    // --- AuroraToolCall data class ---

    @Test
    fun toolCallIdIsPreservedVerbatim() {
        val tc = AuroraToolCall(id = "tool-abc-123", name = "bash", status = AuroraToolCallStatus.Running)
        assertEquals("tool-abc-123", tc.id)
    }

    @Test
    fun toolCallNameAcceptsArbitraryServerString() {
        // Server-supplied tool names may contain unicode, slashes, or long strings.
        val name = "mcp_server/tool‮evil"
        val tc = AuroraToolCall(id = "x", name = name, status = AuroraToolCallStatus.Done)
        // The component must not silently truncate or transform the name —
        // sanitisation is the ViewModel's responsibility, not the component's.
        assertEquals(name, tc.name)
    }

    @Test
    fun toolCallInputAndOutputAreNullableAndPreserved() {
        val withNulls = AuroraToolCall(id = "1", name = "read_file", status = AuroraToolCallStatus.Done)
        assertNull(withNulls.input)
        assertNull(withNulls.output)

        val withValues = AuroraToolCall(
            id = "2",
            name = "read_file",
            status = AuroraToolCallStatus.Done,
            input = """{"path":"/etc/passwd"}""",
            output = "root:x:0:0:root:/root:/bin/bash\n...",
        )
        assertEquals("""{"path":"/etc/passwd"}""", withValues.input)
        assertEquals("root:x:0:0:root:/root:/bin/bash\n...", withValues.output)
    }

    @Test
    fun toolCallStatusEnumCoversAllThreeStates() {
        // Pin the full status surface so a new status added without a
        // corresponding when-branch doesn't silently fall through.
        val states = AuroraToolCallStatus.values()
        assertEquals(3, states.size)
        assert(AuroraToolCallStatus.Running in states)
        assert(AuroraToolCallStatus.Done in states)
        assert(AuroraToolCallStatus.Error in states)
    }

    @Test
    fun toolCallDataClassEquality() {
        val a = AuroraToolCall("id1", "bash", AuroraToolCallStatus.Running, input = "ls")
        val b = AuroraToolCall("id1", "bash", AuroraToolCallStatus.Running, input = "ls")
        val c = AuroraToolCall("id2", "bash", AuroraToolCallStatus.Running, input = "ls")
        assertEquals(a, b)
        assertNotEquals(a, c)
    }

    @Test
    fun toolCallCopyPreservesAllFields() {
        val original = AuroraToolCall(
            id = "orig",
            name = "write_file",
            status = AuroraToolCallStatus.Running,
            input = "data",
            output = null,
        )
        val updated = original.copy(status = AuroraToolCallStatus.Done, output = "ok")
        assertEquals("orig", updated.id)
        assertEquals("write_file", updated.name)
        assertEquals(AuroraToolCallStatus.Done, updated.status)
        assertEquals("data", updated.input)
        assertEquals("ok", updated.output)
    }

    // --- AuroraPermissionPrompt source contract ---

    @Test
    fun permissionPromptSourcePassesTitleAndDescriptionToText() {
        // Verify the composable passes title/description directly to Text() without
        // applying any truncation, transformation, or null-coercion at the component level.
        val sourcePath = listOf(
            java.nio.file.Path.of("src/main/kotlin/tv/tootie/aurora/components/AuroraPermissionPrompt.kt"),
            java.nio.file.Path.of("aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraPermissionPrompt.kt"),
        ).first { it.toFile().isFile }
        val source = sourcePath.toFile().readText()

        assert(source.contains("Text(title)")) {
            "AuroraPermissionPrompt must pass title verbatim to Text()"
        }
        assert(source.contains("Text(description)")) {
            "AuroraPermissionPrompt must pass description verbatim to Text()"
        }
        // No truncation applied at component level — ViewModel owns sanitization.
        assert(!source.contains(".take(")) {
            "AuroraPermissionPrompt must not truncate strings; sanitization belongs in the ViewModel"
        }
    }

    @Test
    fun toolCallListSourceUsesContentDescriptionForToolName() {
        val sourcePath = listOf(
            java.nio.file.Path.of("src/main/kotlin/tv/tootie/aurora/components/AuroraToolCallList.kt"),
            java.nio.file.Path.of("aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraToolCallList.kt"),
        ).first { it.toFile().isFile }
        val source = sourcePath.toFile().readText()

        // TalkBack contract: each row's contentDescription must be the tool name.
        assert(source.contains("contentDescription = call.name")) {
            "AuroraToolCallList rows must set contentDescription to call.name for TalkBack"
        }
        // stateDescription carries execution status (not merged into contentDescription).
        assert(source.contains("stateDescription = statusLabel")) {
            "AuroraToolCallList rows must set stateDescription to convey execution status"
        }
    }
}
