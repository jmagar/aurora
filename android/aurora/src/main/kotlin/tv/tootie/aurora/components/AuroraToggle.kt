package tv.tootie.aurora.components

import androidx.compose.material3.FilledIconToggleButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconToggleButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Icon toggle button. Maps to web `toggle` component.
 * Use [filled] = true for a filled background when checked.
 */
@Composable
public fun AuroraToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    icon: ImageVector,
    contentDescription: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    filled: Boolean = false,
) {
    if (filled) {
        FilledIconToggleButton(
            checked = checked,
            onCheckedChange = onCheckedChange,
            modifier = modifier,
            enabled = enabled,
        ) {
            Icon(icon, contentDescription = contentDescription)
        }
    } else {
        IconToggleButton(
            checked = checked,
            onCheckedChange = onCheckedChange,
            modifier = modifier,
            enabled = enabled,
        ) {
            Icon(icon, contentDescription = contentDescription)
        }
    }
}
