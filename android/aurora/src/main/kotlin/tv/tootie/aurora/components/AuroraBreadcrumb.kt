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
import androidx.compose.ui.unit.dp

public data class AuroraBreadcrumbItem(
    val label: String,
    val onClick: (() -> Unit)? = null,
)

/**
 * Horizontal breadcrumb trail. Maps to web `breadcrumb`.
 * The last item is rendered as the current page (non-clickable, primary color).
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
            Text(
                text = item.label,
                style = MaterialTheme.typography.bodySmall,
                color = if (isLast) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = if (!isLast && item.onClick != null)
                    Modifier.clickable(role = Role.Button) { item.onClick.invoke() }
                else Modifier,
            )
            if (!isLast) {
                Text(
                    text = separator,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.outline,
                )
            }
        }
    }
}
