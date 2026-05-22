package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Agent control buttons (stop, pause, retry).
 * Maps to web AI `controls` element.
 */
@Composable
public fun AuroraControls(
    modifier: Modifier = Modifier,
    onStop: (() -> Unit)? = null,
    onPause: (() -> Unit)? = null,
    onRetry: (() -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        if (onStop != null) {
            IconButton(onClick = onStop) {
                Icon(Icons.Default.Stop, contentDescription = "Stop", tint = aurora.error)
            }
        }
        if (onPause != null) {
            IconButton(onClick = onPause) {
                Icon(Icons.Default.Pause, contentDescription = "Pause", tint = aurora.warn)
            }
        }
        if (onRetry != null) {
            IconButton(onClick = onRetry) {
                Icon(Icons.Default.Refresh, contentDescription = "Retry", tint = aurora.accentViolet)
            }
        }
    }
}
