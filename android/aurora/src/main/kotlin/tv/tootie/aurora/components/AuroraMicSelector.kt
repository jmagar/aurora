package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import tv.tootie.aurora.icons.filled.ExpandMore
import tv.tootie.aurora.icons.filled.Mic
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
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Microphone / audio-input device selector.
 * Maps to web AI `mic-selector` element.
 *
 * Accessibility:
 * - The trigger chip announces the currently selected device:
 *   "Microphone: <device name>. Tap to change."
 * - Each dropdown option shows a checkmark icon for the currently selected item and
 *   its option label is used as the menu item text, which TalkBack reads directly.
 * - The expanded state is held with [remember] (not `rememberSaveable`) — dropdown-open
 *   is ephemeral UI state that should not survive a configuration change.
 *
 * @param devices       Available audio input devices. Use [ImmutableList] for Compose stability.
 * @param selected      [AuroraComboboxOption.value] of the currently selected device.
 * @param onSelect      Called with the [AuroraComboboxOption.value] of the chosen device.
 * @param modifier      Applied to the root composable.
 */
@Composable
public fun AuroraMicSelector(
    devices: ImmutableList<AuroraComboboxOption>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    var expanded by remember { mutableStateOf(false) }
    val selectedLabel = devices.find { it.value == selected }?.label ?: selected
    val triggerDescription = "Microphone: $selectedLabel. Tap to change."

    AuroraDropdownMenu(
        entries = devices.map { device ->
            AuroraMenuEntry.Item(
                label = device.label,
                onClick = { onSelect(device.value) },
                leadingIcon = if (device.value == selected) {
                    { Icon(Icons.Default.Check, contentDescription = "Selected") }
                } else null,
            )
        },
        expanded = expanded,
        onDismissRequest = { expanded = false },
        anchor = {
            Surface(
                modifier = modifier
                    .border(1.dp, aurora.borderStrong, RoundedCornerShape(8.dp))
                    .clickable(role = Role.Button) { expanded = !expanded }
                    .semantics { contentDescription = triggerDescription },
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
