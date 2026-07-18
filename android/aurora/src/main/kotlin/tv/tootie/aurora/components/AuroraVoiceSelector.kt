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
import tv.tootie.aurora.icons.filled.RecordVoiceOver
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
 * TTS voice picker. Standalone dropdown with a voice icon.
 * Maps to web AI `voice-selector` element.
 *
 * Accessibility:
 * - The trigger chip announces: "Voice: <name>. Tap to change."
 * - The currently selected voice shows a leading checkmark in the dropdown.
 * - The expanded state is held with [remember] (not `rememberSaveable`) — dropdown-open
 *   is ephemeral UI state that should not survive a configuration change.
 *
 * @param voices    Available TTS voices. Use [ImmutableList] for Compose stability.
 * @param selected  [AuroraComboboxOption.value] of the currently active voice.
 * @param onSelect  Called with the [AuroraComboboxOption.value] of the chosen voice.
 * @param modifier  Applied to the root composable.
 */
@Composable
public fun AuroraVoiceSelector(
    voices: ImmutableList<AuroraComboboxOption>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    var expanded by remember { mutableStateOf(false) }
    val selectedLabel = voices.find { it.value == selected }?.label ?: selected
    val triggerDescription = "Voice: $selectedLabel. Tap to change."

    AuroraDropdownMenu(
        entries = voices.map { voice ->
            AuroraMenuEntry.Item(
                label = voice.label,
                onClick = { onSelect(voice.value) },
                leadingIcon = if (voice.value == selected) {
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
                    Icon(Icons.Default.RecordVoiceOver, contentDescription = null)
                    Text(selectedLabel, style = MaterialTheme.typography.labelMedium)
                    Icon(Icons.Default.ExpandMore, contentDescription = null)
                }
            }
        },
    )
}
