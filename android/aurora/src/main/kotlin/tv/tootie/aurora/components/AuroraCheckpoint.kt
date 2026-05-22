package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraCheckpointStatus { Pending, Done, Failed }

/**
 * Step/milestone row with completion status icon.
 * Maps to web AI `checkpoint` element.
 */
@Composable
public fun AuroraCheckpoint(
    label: String,
    status: AuroraCheckpointStatus,
    modifier: Modifier = Modifier,
    description: String? = null,
) {
    val aurora = LocalAuroraColors.current
    val (icon, tint) = when (status) {
        AuroraCheckpointStatus.Pending -> Icons.Default.RadioButtonUnchecked to aurora.neutral
        AuroraCheckpointStatus.Done    -> Icons.Default.CheckCircle to aurora.success
        AuroraCheckpointStatus.Failed  -> Icons.Default.Cancel to aurora.error
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Icon(icon, contentDescription = status.name, tint = tint)
        Column {
            Text(label, style = MaterialTheme.typography.bodyMedium)
            description?.let {
                Text(
                    it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}
