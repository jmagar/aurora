package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.filled.AttachFile
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * File attachment chip/card. Maps to web `attachment`.
 *
 * Touch targets meet the 48 dp minimum required by accessibility guidelines:
 * the remove [IconButton] uses [defaultMinSize] to guarantee a 48 × 48 dp hit area.
 *
 * @param fileName Display name of the attached file.
 * @param modifier Caller-supplied modifier applied to the root [Surface].
 * @param fileSize Optional human-readable file size (e.g. "2.4 MB").
 * @param fileTypeDescription Accessibility label for the attachment icon, describing the file type
 *   (e.g. "PDF", "JPEG"). Defaults to "File attachment".
 * @param onClick Optional callback when the chip itself is tapped.
 * @param onRemove Optional callback for the remove (×) button. When non-null the button is shown.
 */
@Composable
public fun AuroraAttachment(
    fileName: String,
    modifier: Modifier = Modifier,
    fileSize: String? = null,
    fileTypeDescription: String = "File attachment",
    onClick: (() -> Unit)? = null,
    onRemove: (() -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp))
            .then(
                if (onClick != null) {
                    Modifier.clickable(role = Role.Button, onClick = onClick)
                } else {
                    Modifier
                },
            ),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Icon(
                imageVector = Icons.Default.AttachFile,
                // Describes the file type to screen readers (e.g. "PDF", "JPEG image").
                contentDescription = fileTypeDescription,
                modifier = Modifier.size(18.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = fileName,
                    style = MaterialTheme.typography.labelMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                fileSize?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            if (onRemove != null) {
                // defaultMinSize ensures the touch target is at least 48 × 48 dp even though
                // the visible icon is smaller, satisfying WCAG 2.5.5 Target Size.
                IconButton(
                    onClick = onRemove,
                    modifier = Modifier
                        .defaultMinSize(minWidth = 48.dp, minHeight = 48.dp)
                        .semantics { contentDescription = "Remove $fileName" },
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = null, // described by parent IconButton semantics
                        modifier = Modifier.size(16.dp),
                    )
                }
            }
        }
    }
}
