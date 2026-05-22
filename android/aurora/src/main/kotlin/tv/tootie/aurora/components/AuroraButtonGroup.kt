package tv.tootie.aurora.components

import androidx.compose.material3.MultiChoiceSegmentedButtonRow
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

public data class AuroraSegmentedOption(
    val label: String,
    val value: String,
)

/** Single-select segmented control. Maps to web `button-group` and `PillGroup`. */
@Composable
public fun AuroraButtonGroup(
    options: List<AuroraSegmentedOption>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    SingleChoiceSegmentedButtonRow(modifier = modifier) {
        options.forEachIndexed { index, option ->
            SegmentedButton(
                shape = SegmentedButtonDefaults.itemShape(index = index, count = options.size),
                onClick = { onSelect(option.value) },
                selected = option.value == selected,
                label = { Text(option.label) },
            )
        }
    }
}

/** Multi-select segmented control. Maps to web `toggle-group` multi variant. */
@Composable
public fun AuroraMultiButtonGroup(
    options: List<AuroraSegmentedOption>,
    selected: Set<String>,
    onToggle: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    MultiChoiceSegmentedButtonRow(modifier = modifier) {
        options.forEachIndexed { index, option ->
            SegmentedButton(
                shape = SegmentedButtonDefaults.itemShape(index = index, count = options.size),
                checked = option.value in selected,
                onCheckedChange = { onToggle(option.value) },
                label = { Text(option.label) },
            )
        }
    }
}
