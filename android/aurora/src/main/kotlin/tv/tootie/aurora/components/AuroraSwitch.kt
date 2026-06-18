package tv.tootie.aurora.components

import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchColors
import androidx.compose.material3.SwitchDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics

/**
 * Compose equivalent of Aurora's Switch shadcn component. State is fully hoisted.
 *
 * Note: thumbContent is not used because material-icons-core is not in the dependency set.
 * The switch renders with the default M3 thumb (no check icon).
 *
 * @param checked Current checked state.
 * @param onCheckedChange Called when the user toggles the switch.
 * @param modifier Modifier applied to the [Switch].
 * @param contentDescription Accessibility label read by TalkBack. Without this, TalkBack
 *   announces only "Switch, on/off" with no context about what is being toggled.
 * @param enabled Whether the control responds to input.
 * @param colors Color overrides for the switch track and thumb.
 */
@Composable
public fun AuroraSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    enabled: Boolean = true,
    colors: SwitchColors = SwitchDefaults.colors(),
) {
    Switch(
        checked = checked,
        onCheckedChange = onCheckedChange,
        modifier = modifier.then(
            if (contentDescription != null)
                Modifier.semantics { this.contentDescription = contentDescription }
            else Modifier
        ),
        enabled = enabled,
        colors = colors,
    )
}

@Composable
public fun AuroraSwitchRow(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    enabled: Boolean = true,
    contentDescription: String = label,
) {
    AuroraItem(
        title = label,
        modifier = modifier,
        description = description,
        trailingContent = {
            AuroraSwitch(
                checked = checked,
                onCheckedChange = onCheckedChange,
                contentDescription = contentDescription,
                enabled = enabled,
            )
        },
    )
}
