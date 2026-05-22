package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraFilterChip(
    val label: String,
    val value: String,
    val selected: Boolean = false,
)

/**
 * Horizontal scrollable filter bar with chips and clear-all.
 * Maps to web `filter-bar`.
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
public fun AuroraFilterBar(
    chips: List<AuroraFilterChip>,
    onToggle: (String) -> Unit,
    modifier: Modifier = Modifier,
    onClearAll: (() -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            FlowRow(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                chips.forEach { chip ->
                    FilterChip(
                        selected = chip.selected,
                        onClick = { onToggle(chip.value) },
                        label = { Text(chip.label) },
                    )
                }
            }
            if (onClearAll != null && chips.any { it.selected }) {
                TextButton(onClick = onClearAll) {
                    Text("Clear", color = aurora.error)
                }
            }
        }
    }
}
