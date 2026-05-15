package tv.tootie.aurora.components

import androidx.compose.material3.Switch
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Compose equivalent of Aurora's Switch shadcn component. State is fully hoisted.
 *
 * Note: thumbContent is not used because material-icons-core is not in the dependency set.
 * The switch renders with the default M3 thumb (no check icon).
 */
@Composable
fun AuroraSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Switch(
        checked = checked,
        onCheckedChange = onCheckedChange,
        modifier = modifier,
        enabled = enabled,
        thumbContent = null,
    )
}
