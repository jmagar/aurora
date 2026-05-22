package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Horizontal drag-to-resize split panels. Maps to web `resizable-panels`.
 *
 * @param splitFraction initial fraction of width given to the start panel (0f..1f)
 */
@Composable
public fun AuroraResizablePanels(
    modifier: Modifier = Modifier,
    splitFraction: Float = 0.5f,
    minFraction: Float = 0.2f,
    maxFraction: Float = 0.8f,
    startPanel: @Composable () -> Unit,
    endPanel: @Composable () -> Unit,
) {
    val aurora = LocalAuroraColors.current
    var fraction by remember { mutableFloatStateOf(splitFraction) }
    var totalWidthPx by remember { mutableFloatStateOf(0f) }
    val density = LocalDensity.current

    Row(
        modifier = modifier
            .fillMaxSize()
            .onSizeChanged { totalWidthPx = it.width.toFloat() },
    ) {
        // Start panel
        Box(modifier = Modifier.fillMaxHeight().weight(fraction)) {
            startPanel()
        }

        // Drag handle
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .width(4.dp)
                .background(aurora.borderDefault)
                .pointerInput(Unit) {
                    detectHorizontalDragGestures { _, dragAmount ->
                        if (totalWidthPx > 0f) {
                            val delta = dragAmount / totalWidthPx
                            fraction = (fraction + delta).coerceIn(minFraction, maxFraction)
                        }
                    }
                },
        )

        // End panel
        Box(modifier = Modifier.fillMaxHeight().weight(1f - fraction)) {
            endPanel()
        }
    }
}
