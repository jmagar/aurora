package tv.tootie.aurora.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList

/** Execution status of a single item in the queue. */
public enum class AuroraQueueStatus { Pending, Running, Done, Error }

/**
 * Data model for a single queue entry.
 *
 * @property id     Stable, unique key used as the [LazyColumn] item key.
 * @property label  Human-readable description of the queued work.
 * @property status Current execution state of the entry.
 */
@Immutable
public data class AuroraQueueItem(
    val id: String,
    val label: String,
    val status: AuroraQueueStatus = AuroraQueueStatus.Pending,
)

/**
 * Vertical queue of pending/running/done/error items with live status indicators.
 * Maps to web AI `queue` element.
 *
 * Each row announces its position and status to TalkBack via [contentDescription].
 *
 * @param items    Queue entries. Use [ImmutableList] for Compose stability.
 * @param modifier Modifier applied to the outer [LazyColumn].
 */
@Composable
public fun AuroraQueueList(
    items: ImmutableList<AuroraQueueItem>,
    modifier: Modifier = Modifier,
) {
    val total = items.size

    LazyColumn(modifier = modifier) {
        itemsIndexed(items, key = { _, item -> item.id }) { index, item ->
            val statusLabel = when (item.status) {
                AuroraQueueStatus.Pending -> "pending"
                AuroraQueueStatus.Running -> "running"
                AuroraQueueStatus.Done    -> "done"
                AuroraQueueStatus.Error   -> "error"
            }
            val statusTone = when (item.status) {
                AuroraQueueStatus.Pending -> AuroraStatusTone.Queued
                AuroraQueueStatus.Running -> AuroraStatusTone.Syncing
                AuroraQueueStatus.Done    -> AuroraStatusTone.Online
                AuroraQueueStatus.Error   -> AuroraStatusTone.Error
            }
            val rowDescription = "${item.label}, item ${index + 1} of $total, $statusLabel"

            androidx.compose.foundation.layout.Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .semantics { contentDescription = rowDescription },
                verticalAlignment = Alignment.CenterVertically,
            ) {
                AuroraStatusIndicator(
                    tone = statusTone,
                    modifier = Modifier.padding(end = 8.dp),
                    dotSize = 8.dp,
                )
                Text(
                    text = item.label,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.weight(1f),
                )
            }
        }
    }
}
