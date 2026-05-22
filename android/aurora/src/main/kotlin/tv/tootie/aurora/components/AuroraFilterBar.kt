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
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * A chip with a label and a selection value for use in [AuroraFilterBar].
 *
 * @property label Human-readable text shown on the chip.
 * @property value Stable identifier passed to [AuroraFilterBar.onToggle].
 * @property selected Whether this chip is currently active.
 */
public data class AuroraFilterChip(
    val label: String,
    val value: String,
    val selected: Boolean = false,
)

/**
 * Horizontal filter bar with chips and an optional clear-all action.
 * Maps to web `filter-bar`.
 *
 * Accessibility notes:
 * - Each chip's [FilterChip] already exposes "checked" / "not checked" via M3 semantics.
 *   An additional [stateDescription] ("Selected" / "Not selected") is attached so TalkBack
 *   uses domain-appropriate language instead of toggle-switch language.
 * - The "Clear all filters" button carries an explicit [contentDescription] so its purpose
 *   is unambiguous (the visual label "Clear" is short).
 * - The bar surface has a [contentDescription] of "Filter bar" for regional navigation.
 *
 * State hoisting: all selection state lives in the caller via [chips] + [onToggle].
 *
 * @param chips Ordered list of filter chips to display.
 * @param onToggle Called with the [AuroraFilterChip.value] of the chip that was tapped.
 * @param modifier Applied to the root [Surface].
 * @param onClearAll When non-null a "Clear" button is shown while any chip is selected.
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
    val anySelected = chips.any { it.selected }

    Surface(
        modifier = modifier
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp))
            .semantics { contentDescription = "Filter bar" },
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
                        // Supplement M3's "checked"/"not checked" with filter-domain language.
                        modifier = Modifier.semantics {
                            stateDescription = if (chip.selected) "Selected" else "Not selected"
                        },
                    )
                }
            }
            if (onClearAll != null && anySelected) {
                TextButton(
                    onClick = onClearAll,
                    modifier = Modifier.semantics {
                        contentDescription = "Clear all filters"
                    },
                ) {
                    // Use M3 error colour token (mapped from aurora.errorBase in AuroraTheme).
                    // Avoids reaching into LocalAuroraColors for a colour already in the scheme.
                    Text("Clear", color = MaterialTheme.colorScheme.error)
                }
            }
        }
    }
}
