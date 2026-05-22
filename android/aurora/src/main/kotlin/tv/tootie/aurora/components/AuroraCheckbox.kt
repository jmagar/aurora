package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.toggleable
import androidx.compose.material3.Checkbox
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * Compose equivalent of Aurora's Checkbox shadcn component. State is fully hoisted.
 *
 * The entire row is a single [Role.Checkbox] toggleable target so TalkBack announces the
 * correct role and checked state regardless of whether the user taps the box or the label.
 *
 * @param checked Current checked state.
 * @param onCheckedChange Called when the user toggles the checkbox.
 * @param modifier Modifier applied to the outer [Row].
 * @param label Optional visible label rendered to the right of the checkbox.
 * @param contentDescription Accessibility label read by TalkBack. Supply this when [label] is
 *   null or when the visible label alone is insufficient context.
 * @param enabled Whether the control responds to input.
 */
@Composable
public fun AuroraCheckbox(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    contentDescription: String? = null,
    enabled: Boolean = true,
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .toggleable(
                value = checked,
                role = Role.Checkbox,
                enabled = enabled,
                onValueChange = onCheckedChange,
            )
            .then(
                if (contentDescription != null)
                    Modifier.semantics { this.contentDescription = contentDescription }
                else Modifier
            ),
    ) {
        Checkbox(
            checked = checked,
            onCheckedChange = null, // interaction handled by the row toggleable
            enabled = enabled,
        )
        if (label != null) {
            Spacer(Modifier.width(8.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                color = if (enabled) MaterialTheme.colorScheme.onSurface
                        else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f),
            )
        }
    }
}
