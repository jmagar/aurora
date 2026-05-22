package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Code
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * Git commit row: hash + message + timestamp.
 * Maps to web AI `commit` element.
 *
 * Accessibility:
 * - The full [hash] is used in [contentDescription] even though only 7 chars
 *   are displayed, so screen readers can read the complete SHA.
 * - [author] and [message] are combined into a single coherent description on
 *   the row container.
 * - The decorative git icon has `contentDescription = null`.
 */
@Composable
public fun AuroraCommitRow(
    hash: String,
    message: String,
    modifier: Modifier = Modifier,
    timestamp: String? = null,
    author: String? = null,
) {
    val shortHash = hash.take(7)
    val authorPart = author?.let { "by $it" } ?: ""
    val timestampPart = timestamp?.let { "at $it" } ?: ""
    val rowDescription = buildString {
        append("Commit $hash")
        if (authorPart.isNotEmpty()) append(", $authorPart")
        append(": $message")
        if (timestampPart.isNotEmpty()) append(", $timestampPart")
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .semantics(mergeDescendants = true) {
                contentDescription = rowDescription
            },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Icon(
            Icons.Default.Code,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
        )
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(2.dp),
        ) {
            Text(message, style = MaterialTheme.typography.bodySmall)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AuroraSnippet(shortHash)
                author?.let {
                    Text(
                        it,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
        timestamp?.let {
            Text(
                it,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
