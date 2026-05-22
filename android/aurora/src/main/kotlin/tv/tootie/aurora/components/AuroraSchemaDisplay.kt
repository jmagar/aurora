package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Descriptor for a single JSON schema property row.
 *
 * Marked [@Immutable] so Compose can skip recomposition when the containing
 * [ImmutableList] is unchanged.
 */
@Immutable
public data class AuroraSchemaProperty(
    val name: String,
    val type: String,
    val description: String? = null,
    val required: Boolean = false,
)

/**
 * JSON schema property table. Maps to web AI `schema-display` element.
 *
 * Each row is annotated with a merged `contentDescription` of the form
 * `"<name> <type>[, required][: description]"` so TalkBack gives a complete
 * announcement in a single focus stop without reading three separate cells.
 *
 * **Stability:** [properties] is typed as [ImmutableList] so Compose can skip
 * recomposition when the list reference is unchanged. Callers should wrap with
 * `toPersistentList()` from `kotlinx-collections-immutable`.
 *
 * @param properties Ordered list of schema property descriptors.
 * @param modifier   Modifier applied to the root [Surface].
 * @param title      Optional title shown above the property rows.
 */
@Composable
public fun AuroraSchemaDisplay(
    properties: ImmutableList<AuroraSchemaProperty>,
    modifier: Modifier = Modifier,
    title: String? = null,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surface,
    ) {
        Column {
            title?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                )
                HorizontalDivider(color = aurora.borderDefault)
            }
            properties.forEachIndexed { index, prop ->
                // Build a single accessible label for the row: "name type[, required][: description]"
                val rowDescription = buildString {
                    append(prop.name)
                    append(" ")
                    append(prop.type)
                    if (prop.required) append(", required")
                    if (prop.description != null) {
                        append(": ")
                        append(prop.description)
                    }
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .semantics(mergeDescendants = true) {
                            contentDescription = rowDescription
                        }
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(
                        text = prop.name + if (prop.required) " *" else "",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                        modifier = Modifier.weight(0.35f),
                    )
                    Text(
                        text = prop.type,
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                        color = aurora.codeType,
                        modifier = Modifier.weight(0.25f),
                    )
                    if (prop.description != null) {
                        Text(
                            text = prop.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.weight(0.4f),
                        )
                    }
                }
                if (index < properties.lastIndex) {
                    HorizontalDivider(color = aurora.borderDefault, thickness = 0.5.dp)
                }
            }
        }
    }
}
