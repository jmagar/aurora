package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

public data class AuroraBreadcrumbItem(
    val label: String,
    val onClick: (() -> Unit)? = null,
)

/**
 * Horizontal breadcrumb trail. Maps to web `breadcrumb`.
 * The last item is rendered as the current page (non-clickable, primary color,
 * marked as [selected] for accessibility). Separator glyphs are hidden from
 * TalkBack via [clearAndSetSemantics].
 */
@Composable
public fun AuroraBreadcrumb(
    items: List<AuroraBreadcrumbItem>,
    modifier: Modifier = Modifier,
    separator: String = "/",
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        items.forEachIndexed { index, item ->
            val isLast = index == items.lastIndex
            // Capture onClick to enable smart-cast inside the lambda.
            val onClick = item.onClick
            Text(
                text = item.label,
                style = MaterialTheme.typography.bodySmall,
                color = if (isLast) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = when {
                    isLast -> Modifier.semantics { selected = true }
                    onClick != null -> Modifier.clickable(role = Role.Link) { onClick() }
                    else -> Modifier
                },
            )
            if (!isLast) {
                Text(
                    text = separator,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.outline,
                    // Decorative separator — hidden from TalkBack.
                    modifier = Modifier.clearAndSetSemantics {},
                )
            }
        }
    }
}
