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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Environment variable list with optional value masking.
 * Maps to web AI `environment-variables` element.
 *
 * Keys are rendered as [AuroraSnippet] inline chips. Values are masked by
 * default (showing `••••••••`) to prevent secret leakage in screenshots.
 *
 * @param variables Ordered map of key → value pairs to display.
 * @param modifier Modifier applied to the outer [Surface].
 * @param maskValues When `true` (default) values are replaced with `••••••••`.
 */
@Composable
public fun AuroraEnvironmentVariables(
    variables: Map<String, String>,
    modifier: Modifier = Modifier,
    maskValues: Boolean = true,
) {
    val aurora = LocalAuroraColors.current
    val entries = variables.entries.toList()

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surface,
    ) {
        Column {
            entries.forEachIndexed { index, (key, value) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    AuroraSnippet(code = key)
                    Text(
                        text = if (maskValues) "••••••••" else value,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                if (index < entries.lastIndex) {
                    HorizontalDivider(
                        color = aurora.borderDefault,
                        thickness = 0.5.dp,
                    )
                }
            }
        }
    }
}
