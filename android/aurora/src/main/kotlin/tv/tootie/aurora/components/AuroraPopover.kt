package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties

/**
 * Positioned floating surface anchored to its layout position.
 * Maps to web `popover`. For tooltip-style usage prefer [AuroraTooltip].
 */
@Composable
public fun AuroraPopover(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    if (visible) {
        Popup(
            onDismissRequest = onDismissRequest,
            properties = PopupProperties(focusable = true),
        ) {
            Surface(
                shape = MaterialTheme.shapes.medium,
                shadowElevation = 8.dp,
                tonalElevation = 2.dp,
                modifier = modifier,
            ) {
                Box(Modifier.padding(12.dp)) { content() }
            }
        }
    }
}

/**
 * Hover card — same as [AuroraPopover] with lighter shadow.
 * Maps to web `hover-card`. On Android trigger on click (no hover on touch).
 */
@Composable
public fun AuroraHoverCard(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
): Unit = AuroraPopover(visible = visible, onDismissRequest = onDismissRequest, modifier = modifier, content = content)
