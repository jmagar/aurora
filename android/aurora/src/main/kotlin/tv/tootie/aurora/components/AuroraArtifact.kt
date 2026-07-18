package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.filled.ContentCopy
import tv.tootie.aurora.icons.filled.OpenInFull
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Artifact panel with type label, copy, and expand actions.
 * Maps to web AI `artifact` block.
 *
 * **Accessibility:**
 * - The root [Surface] carries a `contentDescription` that identifies the artifact
 *   by title and type, e.g. "Artifact: main.kt, kotlin". When [language] is `null`
 *   the type segment is omitted.
 * - Copy and expand [IconButton]s each own a `contentDescription` on the button's
 *   `Modifier.semantics` so TalkBack announces the action without relying on the
 *   inner [Icon]'s label (which is set to `null` to prevent double-reading).
 * - When [isLoading] is `true` an [AuroraSpinner] replaces the content area and
 *   announces "Loading artifact" to screen readers.
 *
 * @param title    Artifact display name shown in the toolbar.
 * @param modifier Modifier applied to the root [Surface].
 * @param language Optional language/type label (e.g. "kotlin", "json", "image").
 * @param isLoading When `true` shows an [AuroraSpinner] instead of [content].
 * @param onCopy   Optional callback; when non-null a copy [IconButton] is shown.
 * @param onExpand Optional callback; when non-null an expand [IconButton] is shown.
 * @param content  Composable content rendered in the artifact body.
 */
@Composable
public fun AuroraArtifact(
    title: String,
    modifier: Modifier = Modifier,
    language: String? = null,
    isLoading: Boolean = false,
    onCopy: (() -> Unit)? = null,
    onExpand: (() -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val aurora = LocalAuroraColors.current

    // Build root contentDescription that names title and, when present, type
    val artifactDescription = buildString {
        append("Artifact: ")
        append(title)
        if (language != null) {
            append(", ")
            append(language)
        }
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(10.dp))
            .semantics { contentDescription = artifactDescription },
        shape = RoundedCornerShape(10.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
    ) {
        Column {
            // Toolbar: title, language label, action buttons
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 12.dp, end = 4.dp, top = 4.dp, bottom = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier.weight(1f),
                )
                // Language label is decorative — already in root contentDescription
                if (language != null) {
                    Text(
                        text = language,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(end = 4.dp),
                    )
                }
                if (onCopy != null) {
                    IconButton(
                        onClick = onCopy,
                        modifier = Modifier.semantics { contentDescription = "Copy artifact" },
                    ) {
                        Icon(
                            imageVector = Icons.Default.ContentCopy,
                            contentDescription = null, // described by parent IconButton semantics
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
                if (onExpand != null) {
                    IconButton(
                        onClick = onExpand,
                        modifier = Modifier.semantics { contentDescription = "Expand artifact" },
                    ) {
                        Icon(
                            imageVector = Icons.Default.OpenInFull,
                            contentDescription = null, // described by parent IconButton semantics
                            tint = aurora.accentViolet,
                        )
                    }
                }
            }

            // Content area
            Surface(color = MaterialTheme.colorScheme.surface) {
                if (isLoading) {
                    AuroraSpinner(
                        contentDescription = "Loading artifact",
                        modifier = Modifier.padding(16.dp),
                    )
                } else {
                    content()
                }
            }
        }
    }
}
