package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraListboxItem(
    val label: String,
    val value: String,
    val description: String? = null,
)

/**
 * Scrollable selection list. Maps to web `listbox` / `search-results`.
 */
@Composable
public fun AuroraListbox(
    items: List<AuroraListboxItem>,
    selected: String?,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    Column(
        modifier = modifier
            .border(1.dp, aurora.borderStrong, RoundedCornerShape(8.dp)),
    ) {
        items.forEach { item ->
            val isSelected = item.value == selected
            Surface(
                color = if (isSelected) aurora.selectedBg else MaterialTheme.colorScheme.surface,
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(role = Role.Option) { onSelect(item.value) },
            ) {
                Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)) {
                    Text(
                        text = item.label,
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (isSelected) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.onSurface,
                    )
                    item.description?.let {
                        Text(
                            text = it,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
    }
}
