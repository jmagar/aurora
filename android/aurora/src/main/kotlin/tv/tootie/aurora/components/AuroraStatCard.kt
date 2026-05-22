package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Metric display card: label, large value, optional trend/subtitle.
 * Maps to web `stat-card`. Wrap in [AuroraCard] for surface/border.
 */
@Composable
public fun AuroraStatCard(
    label: String,
    value: String,
    modifier: Modifier = Modifier,
    trend: String? = null,
    trendUp: Boolean? = null,
    icon: (@Composable () -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current
    val trendColor = when (trendUp) {
        true  -> aurora.success
        false -> aurora.error
        null  -> MaterialTheme.colorScheme.onSurfaceVariant
    }

    Column(
        modifier = modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = label,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            icon?.invoke()
        }
        Text(
            text = value,
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onSurface,
        )
        if (trend != null) {
            Text(
                text = trend,
                style = MaterialTheme.typography.bodySmall,
                color = trendColor,
            )
        }
    }
}
