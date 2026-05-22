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
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraSchemaProperty(
    val name: String,
    val type: String,
    val description: String? = null,
    val required: Boolean = false,
)

/**
 * JSON schema property table. Maps to web AI `schema-display` element.
 */
@Composable
public fun AuroraSchemaDisplay(
    properties: List<AuroraSchemaProperty>,
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
                Text(it, style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp))
                HorizontalDivider(color = aurora.borderDefault)
            }
            properties.forEachIndexed { index, prop ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(prop.name + if (prop.required) " *" else "",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                        modifier = Modifier.weight(0.35f))
                    Text(prop.type,
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.weight(0.25f))
                    prop.description?.let {
                        Text(it, style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.weight(0.4f))
                    }
                }
                if (index < properties.lastIndex) HorizontalDivider(color = aurora.borderDefault, thickness = 0.5.dp)
            }
        }
    }
}
