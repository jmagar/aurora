package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
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
 * Package/dependency info card. Maps to web AI `package-info` element.
 *
 * Accessibility:
 * - [contentDescription] surfaces all metadata (name, version, license) to
 *   screen readers so they are not reliant on visual layout interpretation.
 * - [mergeDescendants] collapses the card into a single accessibility node.
 */
@Composable
public fun AuroraPackageInfo(
    name: String,
    version: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    license: String? = null,
) {
    val aurora = LocalAuroraColors.current

    val cardDescription = buildString {
        append("Package $name, version $version")
        license?.let { append(", license $it") }
        description?.let { append(". $it") }
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp))
            .semantics(mergeDescendants = true) {
                contentDescription = cardDescription
            },
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(2.dp),
            ) {
                Text(name, style = MaterialTheme.typography.labelMedium)
                description?.let {
                    Text(
                        it,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            Column(
                horizontalAlignment = Alignment.End,
                verticalArrangement = Arrangement.spacedBy(2.dp),
            ) {
                AuroraSnippet(version)
                license?.let {
                    Text(
                        it,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}
