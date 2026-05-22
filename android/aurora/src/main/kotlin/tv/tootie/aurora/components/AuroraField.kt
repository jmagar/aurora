package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * Form field wrapper: label + control + supporting text + error message.
 * Maps to web `field` component. Wrap any input inside [content].
 *
 * Accessibility notes:
 * - When [error] is non-null the error [Text] carries `semantics { error(...) }` so TalkBack
 *   announces it with the "Error:" prefix automatically.
 * - When [required] is true the label text reads "… (required)" via [contentDescription] so the
 *   visual asterisk is not the only signal for assistive technology.
 * - [description] is annotated as a live region so changes are announced without focus movement.
 *
 * @param modifier Applied to the root [Column].
 * @param label Optional field label shown above the control.
 * @param description Optional hint text shown below the label.
 * @param error When non-null the field is in error state; this string is shown (and announced by
 *   TalkBack) as the error message.
 * @param required When true appends a visual asterisk to [label] and adds "(required)" to the
 *   label's accessibility description.
 * @param enabled When false the label and description are rendered at reduced opacity.
 * @param content The form control (e.g. [AuroraTextField]) rendered between description and error.
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
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        if (label != null) {
            val visualLabel = if (required) "$label *" else label
            // Provide a screen-reader-friendly description that replaces the visual asterisk
            // with "(required)" so assistive technology users get full context.
            val a11yLabel = if (required) "$label (required)" else label
            Text(
                text = visualLabel,
                style = MaterialTheme.typography.labelMedium,
                color = if (enabled) MaterialTheme.colorScheme.onSurface
                        else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.45f),
                modifier = Modifier.semantics { contentDescription = a11yLabel },
            )
        }
        if (description != null) {
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                // Mark as a live region so TalkBack announces hint-text changes automatically
                // without requiring the user to move focus to this node.
                modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            )
        }
        content()
        if (error != null) {
            // Capture to a local val so the semantics lambda captures the non-null string
            // without shadowing ambiguity between the param name and the semantics extension.
            val errorMessage = error
            Text(
                text = errorMessage,
                style = MaterialTheme.typography.bodySmall,
                // Use colorScheme.error for M3 semantic correctness rather than the extra-color
                // token. The M3 error colour is mapped from aurora.errorBase in AuroraTheme.
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.semantics {
                    // Surfaces the error to TalkBack with the "Error: …" prefix even though this
                    // Text is not inside an OutlinedTextField's supportingText slot.
                    error(errorMessage)
                    liveRegion = LiveRegionMode.Polite
                },
            )
        }
    }
}
