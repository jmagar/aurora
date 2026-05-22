package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Microphone/audio input device selector.
 * Maps to web AI `mic-selector` element.
 */
@Composable
public fun AuroraMicSelector(
    devices: List<AuroraComboboxOption>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    var expanded by remember { mutableStateOf(false) }
    val selectedLabel = devices.find { it.value == selected }?.label ?: selected

    AuroraDropdownMenu(
        entries = devices.map { d -> AuroraMenuEntry.Item(label = d.label, onClick = { onSelect(d.value) }) },
        expanded = expanded,
        onDismissRequest = { expanded = false },
        anchor = {
            Surface(
                modifier = modifier
                    .border(1.dp, aurora.borderStrong, RoundedCornerShape(8.dp))
                    .clickable(role = Role.Button) { expanded = !expanded },
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.surfaceVariant,
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    Icon(Icons.Default.Mic, contentDescription = null)
                    Text(selectedLabel, style = MaterialTheme.typography.labelMedium)
                    Icon(Icons.Default.ExpandMore, contentDescription = null)
                }
            }
        },
    )
}
