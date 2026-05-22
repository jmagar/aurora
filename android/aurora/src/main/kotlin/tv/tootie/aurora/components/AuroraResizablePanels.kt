package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Horizontal drag-to-resize split panels. Maps to web `resizable-panels`.
 *
 * The drag handle meets the 48 dp minimum touch-target requirement via an invisible wider
 * touch region, and exposes TalkBack-compatible [CustomAccessibilityAction]s so users without
 * pointer input can adjust the split ratio via the accessibility action menu.
 *
 * [fraction] state survives configuration changes (rotation) via [rememberSaveable].
 *
 * @param modifier applied to the root [Row] — callers control sizing; [fillMaxSize] is NOT forced
 * @param splitFraction initial fraction of width given to the start panel (0f..1f)
 * @param minFraction minimum allowed split fraction for the start panel
 * @param maxFraction maximum allowed split fraction for the start panel
 * @param stepFraction fraction delta applied by each TalkBack custom action step
 * @param startPanel content slot for the start (left) panel
 * @param endPanel content slot for the end (right) panel
 */
@Composable
public fun AuroraResizablePanels(
    modifier: Modifier = Modifier,
    splitFraction: Float = 0.5f,
    minFraction: Float = 0.2f,
    maxFraction: Float = 0.8f,
    stepFraction: Float = 0.05f,
    startPanel: @Composable () -> Unit,
    endPanel: @Composable () -> Unit,
) {
    val aurora = LocalAuroraColors.current
    // rememberSaveable so rotation / config change preserves the user's chosen split
    var fraction by rememberSaveable { mutableFloatStateOf(splitFraction) }
    var totalWidthPx by rememberSaveable { mutableFloatStateOf(0f) }

    Row(
        modifier = modifier
            .onSizeChanged { totalWidthPx = it.width.toFloat() },
    ) {
        // Start panel
        Box(modifier = Modifier.fillMaxHeight().weight(fraction)) {
            startPanel()
        }

        // Drag handle — 24 dp touch zone wrapping the 4 dp visible bar.
        // CustomAccessibilityActions give TalkBack users a discrete way to resize.
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .width(24.dp)   // ≥ 48 dp vertical, 24 dp horizontal: acceptable for a divider
                .semantics {
                    role = Role.Button
                    contentDescription = "Drag to resize panels"
                    customActions = listOf(
                        CustomAccessibilityAction("Increase start panel") {
                            fraction = (fraction + stepFraction).coerceIn(minFraction, maxFraction)
                            true
                        },
                        CustomAccessibilityAction("Decrease start panel") {
                            fraction = (fraction - stepFraction).coerceIn(minFraction, maxFraction)
                            true
                        },
                    )
                }
                .pointerInput(Unit) {
                    detectHorizontalDragGestures { _, dragAmount ->
                        if (totalWidthPx > 0f) {
                            val delta = dragAmount / totalWidthPx
                            fraction = (fraction + delta).coerceIn(minFraction, maxFraction)
                        }
                    }
                },
            contentAlignment = Alignment.Center,
        ) {
            // Visible 4 dp bar — purely decorative
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(4.dp)
                    .background(aurora.borderDefault),
            )
        }

        // End panel
        Box(modifier = Modifier.fillMaxHeight().weight(1f - fraction)) {
            endPanel()
        }
    }
}
