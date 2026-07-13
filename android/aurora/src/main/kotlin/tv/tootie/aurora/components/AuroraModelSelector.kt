package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * An AI model option shown in [AuroraModelSelector].
 *
 * @param value      Stable identifier sent to [AuroraModelSelector.onSelect] (e.g. `"claude-3-5-sonnet"`).
 * @param label      Human-readable display name (e.g. `"Claude 3.5 Sonnet"`).
 * @param capability Short capability summary read by TalkBack as part of the button description
 *                   (e.g. `"200K context, vision, tools"`). May be null for simple voice lists.
 */
@Immutable
public data class AuroraModelOption(
    val value: String,
    val label: String,
    val capability: String? = null,
)

/**
 * AI model picker button. Uses Axon-orange accent (AI identity).
 * Maps to web AI `model-selector` element.
 *
 * Accessibility:
 * - The trigger chip announces: "Model: <name>[, <capability>]. Tap to change."
 * - The selected model label is a live region so TalkBack announces the change
 *   when [selected] updates (e.g. after the caller applies a new selection).
 * - The currently selected item in the dropdown shows a leading checkmark.
 * - The expanded state is held with [remember] (not `rememberSaveable`) — dropdown-open
 *   is ephemeral UI state that should not survive a configuration change.
 *
 * @param models    Available models. Use [ImmutableList] for Compose stability.
 * @param selected  [AuroraModelOption.value] of the currently active model.
 * @param onSelect  Called with the [AuroraModelOption.value] of the chosen model.
 * @param modifier  Applied to the root composable.
 */
@Composable
public fun AuroraModelSelector(
    models: ImmutableList<AuroraModelOption>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    var expanded by remember { mutableStateOf(false) }
    val selectedModel = models.find { it.value == selected }
    val selectedLabel = selectedModel?.label ?: selected
    val triggerDescription = buildString {
        append("Model: ")
        append(selectedLabel)
        selectedModel?.capability?.let { append(", "); append(it) }
        append(". Tap to change.")
    }

    AuroraDropdownMenu(
        entries = models.map { model ->
            AuroraMenuEntry.Item(
                label = model.label,
                trailingText = model.capability,
                onClick = { onSelect(model.value) },
                leadingIcon = if (model.value == selected) {
                    { Icon(Icons.Default.Check, contentDescription = "Selected") }
                } else null,
            )
        },
        expanded = expanded,
        onDismissRequest = { expanded = false },
        anchor = {
            Surface(
                modifier = modifier
                    .border(1.dp, aurora.accentVioletBorder, RoundedCornerShape(8.dp))
                    .clickable(role = Role.Button) { expanded = !expanded }
                    .semantics { contentDescription = triggerDescription },
                shape = RoundedCornerShape(8.dp),
                color = aurora.accentVioletSurface,
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    Icon(
                        Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = aurora.accentViolet,
                    )
                    Text(
                        text = selectedLabel,
                        style = MaterialTheme.typography.labelMedium,
                        color = aurora.accentViolet,
                        modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                    )
                    Icon(
                        Icons.Default.ExpandMore,
                        contentDescription = null,
                        tint = aurora.accentViolet,
                    )
                }
            }
        },
    )
}
