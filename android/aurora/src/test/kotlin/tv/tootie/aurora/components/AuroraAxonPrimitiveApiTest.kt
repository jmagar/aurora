package tv.tootie.aurora.components

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Test
import java.nio.file.Path

class AuroraAxonPrimitiveApiTest {
    @Test
    fun iconButtonSizesKeepCompactVisualsAndLargeTouchTargetOption() {
        assertEquals(36f, AuroraIconButtonSize.Compact.containerSize.value)
        assertEquals(18f, AuroraIconButtonSize.Compact.iconSize.value)
        assertEquals(48f, AuroraIconButtonSize.Large.containerSize.value)
        assertEquals(24f, AuroraIconButtonSize.Large.iconSize.value)
    }

    @Test
    fun progressAndStatusExposeCompactAndLargeSizing() {
        assertEquals(3f, AuroraProgressSize.Compact.height.value)
        assertEquals(8f, AuroraProgressSize.Large.height.value)
        assertEquals(6f, AuroraStatusIndicatorSize.Compact.dotSize.value)
        assertEquals(12f, AuroraStatusIndicatorSize.Large.dotSize.value)
    }

    @Test
    fun navigationRowsCarryGenericMigrationDataWithoutAxonLabels() {
        val sidebarRow = AuroraSidebarRowItem(
            label = "Jobs",
            value = "jobs",
            supportingText = "12 running",
            badge = "12",
            enabled = false,
        )
        val railRow = AuroraNavigationRowItem(
            label = "Ask",
            value = "ask",
            badge = "new",
            enabled = false,
        )

        assertEquals("jobs", sidebarRow.value)
        assertEquals("12 running", sidebarRow.supportingText)
        assertFalse(sidebarRow.enabled)
        assertEquals("new", railRow.badge)
        assertFalse(railRow.enabled)
    }

    @Test
    fun sidebarRowExposesDisabledSemanticsWithoutCallingDisabledItems() {
        val sourcePath = listOf(
            Path.of("src/main/kotlin/tv/tootie/aurora/components/AuroraSidebar.kt"),
            Path.of("aurora/src/main/kotlin/tv/tootie/aurora/components/AuroraSidebar.kt"),
        ).first { it.toFile().isFile }
        val source = sourcePath.toFile().readText()

        assert(source.contains("if (!item.enabled) disabled()")) {
            "AuroraSidebarRow must expose disabled semantics when item.enabled is false"
        }
        assert(source.contains("onClick = { if (item.enabled) onClick() }")) {
            "AuroraSidebarRow must not invoke disabled row actions"
        }
    }
}
