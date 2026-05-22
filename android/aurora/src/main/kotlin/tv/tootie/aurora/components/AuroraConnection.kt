package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.TrendingFlat
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Two-node connection label (from → to). Maps to web AI `connection` element.
 *
 * Renders `from` and `to` labels separated by a directional arrow icon.
 * When [active] is true the text and arrow are tinted with [aurora.accentViolet],
 * otherwise they use muted surface-variant tones.
 *
 * @param from Source node label.
 * @param to Destination node label.
 * @param modifier Modifier applied to the root [Row].
 * @param active Whether the connection is currently active/highlighted.
 */
@Composable
public fun AuroraConnection(
    from: String,
    to: String,
    modifier: Modifier = Modifier,
    active: Boolean = false,
) {
    val aurora = LocalAuroraColors.current
    val labelColor = if (active) aurora.accentViolet else MaterialTheme.colorScheme.onSurfaceVariant
    val arrowColor = if (active) aurora.accentViolet else aurora.borderStrong

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text(
            text = from,
            style = MaterialTheme.typography.labelSmall,
            color = labelColor,
        )
        Icon(
            imageVector = Icons.AutoMirrored.Filled.TrendingFlat,
            contentDescription = "to",
            modifier = Modifier.size(16.dp),
            tint = arrowColor,
        )
        Text(
            text = to,
            style = MaterialTheme.typography.labelSmall,
            color = labelColor,
        )
    }
}
