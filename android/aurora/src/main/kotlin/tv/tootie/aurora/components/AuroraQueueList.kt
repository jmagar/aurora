package tv.tootie.aurora.components

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

public data class AuroraQueueItem(val id: String, val label: String, val running: Boolean = false)

/**
 * Vertical queue of pending items with running indicator.
 * Maps to web AI `queue` element.
 */
@Composable
public fun AuroraQueueList(
    items: List<AuroraQueueItem>,
    modifier: Modifier = Modifier,
) {
    Column(modifier = modifier) {
        items.forEach { item ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                AuroraStatusIndicator(
                    tone = if (item.running) AuroraStatusTone.Syncing else AuroraStatusTone.Queued,
                    modifier = Modifier.padding(end = 8.dp),
                    dotSize = 8.dp,
                )
                Text(
                    item.label,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.weight(1f),
                )
            }
        }
    }
}
