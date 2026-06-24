package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraDescriptionItem(
    val label: String,
    val value: String,
)

/**
 * Labeled key-value list. Maps to web `description-list`.
 *
 * Each row merges its label and value into a single TalkBack node so that
 * the service reads them as a unit (e.g. "Status: Active") rather than
 * announcing two disconnected strings.
 */
@Composable
public fun AuroraDescriptionList(
    items: List<AuroraDescriptionItem>,
    modifier: Modifier = Modifier,
    showDividers: Boolean = true,
) {
    val aurora = LocalAuroraColors.current

    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(0.dp)) {
        items.forEachIndexed { index, item ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .semantics(mergeDescendants = true) {},
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text(
                    text = item.label,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.weight(1f),
                )
                Text(
                    text = item.value,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface,
                )
            }
            if (showDividers && index < items.lastIndex) {
                HorizontalDivider(color = aurora.borderDefault, thickness = 0.5.dp)
            }
        }
    }
}
