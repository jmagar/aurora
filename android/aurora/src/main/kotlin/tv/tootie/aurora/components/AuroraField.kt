package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Form field wrapper: label + control + supporting text + error message.
 * Maps to web `field` component. Wrap any input inside [content].
 */
@Composable
public fun AuroraField(
    modifier: Modifier = Modifier,
    label: String? = null,
    description: String? = null,
    error: String? = null,
    required: Boolean = false,
    enabled: Boolean = true,
    content: @Composable () -> Unit,
) {
    val aurora = LocalAuroraColors.current
    val hasError = error != null

    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        if (label != null) {
            Text(
                text = if (required) "$label *" else label,
                style = MaterialTheme.typography.labelMedium,
                color = if (enabled) MaterialTheme.colorScheme.onSurface
                        else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.45f),
            )
        }
        if (description != null) {
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        content()
        if (hasError) {
            Text(
                text = error!!,
                style = MaterialTheme.typography.bodySmall,
                color = aurora.error,
            )
        }
    }
}
