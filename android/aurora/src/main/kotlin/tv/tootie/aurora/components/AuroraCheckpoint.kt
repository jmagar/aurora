package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.filled.Cancel
import androidx.compose.material.icons.filled.CheckCircle
import tv.tootie.aurora.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraCheckpointStatus { Pending, Done, Failed }

/**
 * Step/milestone row with completion status icon.
 *
 * Maps to web AI `checkpoint` element.
 *
 * Accessibility: status is communicated via the merged `contentDescription`
 * ("Pending: …", "Done: …", "Failed: …") rather than relying on icon colour
 * alone. The status icon is therefore decorative ([contentDescription] = null).
 */
@Composable
public fun AuroraCheckpoint(
    label: String,
    status: AuroraCheckpointStatus,
    modifier: Modifier = Modifier,
    description: String? = null,
) {
    val aurora = LocalAuroraColors.current

    val (icon, tint, statusText) = when (status) {
        AuroraCheckpointStatus.Pending -> Triple(Icons.Default.RadioButtonUnchecked, aurora.neutral, "Pending")
        AuroraCheckpointStatus.Done    -> Triple(Icons.Default.CheckCircle,          aurora.success, "Done")
        AuroraCheckpointStatus.Failed  -> Triple(Icons.Default.Cancel,               aurora.error,   "Failed")
    }

    // Build a single merged description so TalkBack reads status before the label.
    val mergedDescription = buildString {
        append(statusText)
        append(": ")
        append(label)
        if (description != null) {
            append(". ")
            append(description)
        }
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .semantics(mergeDescendants = true) {
                contentDescription = mergedDescription
            },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        // Icon is decorative — status is announced via the merged contentDescription above.
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = tint,
            modifier = Modifier.clearAndSetSemantics { },
        )
        Column {
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
            )
            if (description != null) {
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}
