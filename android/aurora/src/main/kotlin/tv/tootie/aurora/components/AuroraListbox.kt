package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selectableGroup
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * A selectable item for use in [AuroraListbox].
 *
 * @property label Human-readable display text.
 * @property value Stable identifier used for selection tracking.
 * @property description Optional secondary text shown below [label].
 * @property enabled When false the item cannot be selected.
 */
public data class AuroraListboxItem(
    val label: String,
    val value: String,
    val description: String? = null,
    val enabled: Boolean = true,
)

/**
 * Scrollable selection list. Maps to web `listbox` / `search-results`.
 *
 * Accessibility notes:
 * - The outer container has [selectableGroup] semantics so TalkBack treats it as a single
 *   coherent selection group (analogous to ARIA `role="listbox"`).
 * - Each item has [Role.RadioButton] in the semantics tree and carries [selected] state so
 *   TalkBack announces "selected" / "not selected" automatically.
 * - Disabled items have their click action removed and carry a `contentDescription` suffix
 *   of "(unavailable)" for assistive technology clarity.
 * - Uses [LazyColumn] so arbitrarily long lists do not cause frame drops or OOM from a
 *   non-recycling [Column] + [forEach].
 *
 * State hoisting: [selected] + [onSelect] — the caller owns the selection.
 *
 * @param items Ordered list of options to render.
 * @param selected [AuroraListboxItem.value] of the currently selected item, or null for none.
 * @param onSelect Called with the [AuroraListboxItem.value] of the tapped item.
 * @param modifier Applied to the root container.
 * @param maxHeight Maximum height of the scrollable list. Defaults to [Dp.Unspecified] (fills
 *   the available space constrained by the parent).
 */
@Composable
public fun AuroraListbox(
    items: List<AuroraListboxItem>,
    selected: String?,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    maxHeight: Dp = Dp.Unspecified,
) {
    val aurora = LocalAuroraColors.current

    LazyColumn(
        modifier = modifier
            .border(1.dp, aurora.borderStrong, RoundedCornerShape(8.dp))
            // selectableGroup informs TalkBack / accessibility services that this is a
            // coherent single-selection group — equivalent to ARIA role="listbox".
            .semantics { selectableGroup() }
            .then(if (maxHeight != Dp.Unspecified) Modifier.heightIn(max = maxHeight) else Modifier),
    ) {
        items(items, key = { it.value }) { item ->
            val isSelected = item.value == selected

            Surface(
                color = when {
                    isSelected -> aurora.selectedBg
                    !item.enabled -> aurora.disabledSurface
                    else -> MaterialTheme.colorScheme.surface
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .then(
                        if (item.enabled) {
                            Modifier.clickable(
                                // Role.RadioButton maps to ARIA option semantics — each item in
                                // the listbox is selectable but the group is single-selection.
                                role = Role.RadioButton,
                                onClickLabel = if (isSelected) "Deselect ${item.label}" else "Select ${item.label}",
                                onClick = { onSelect(item.value) },
                            )
                        } else {
                            Modifier
                        }
                    )
                    .semantics(mergeDescendants = true) {
                        // Expose selected state so TalkBack announces "selected" / "not selected".
                        this.selected = isSelected
                        // Role must be set here (in addition to clickable) for disabled items
                        // where clickable is not applied.
                        role = Role.RadioButton
                        if (!item.enabled) {
                            contentDescription = "${item.label} (unavailable)"
                        }
                    },
            ) {
                Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)) {
                    Text(
                        text = item.label,
                        style = MaterialTheme.typography.bodyMedium,
                        color = when {
                            !item.enabled -> aurora.disabledText
                            isSelected -> MaterialTheme.colorScheme.primary
                            else -> MaterialTheme.colorScheme.onSurface
                        },
                    )
                    item.description?.let {
                        Text(
                            text = it,
                            style = MaterialTheme.typography.bodySmall,
                            color = if (item.enabled) {
                                MaterialTheme.colorScheme.onSurfaceVariant
                            } else {
                                aurora.disabledText
                            },
                        )
                    }
                }
            }
        }
    }
}
