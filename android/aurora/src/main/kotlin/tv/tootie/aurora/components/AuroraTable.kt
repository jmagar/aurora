package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraTableColumn(
    val header: String,
    val weight: Float = 1f,
)

/**
 * Simple scrollable table with sticky header. Maps to web `table`.
 *
 * @param columns column definitions with header labels and relative widths
 * @param rows list of rows; each row is a list of cell strings matching [columns] order
 */
@Composable
public fun AuroraTable(
    columns: List<AuroraTableColumn>,
    rows: List<List<String>>,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    LazyColumn(
        modifier = modifier.border(1.dp, aurora.borderDefault),
    ) {
        // Header
        stickyHeader {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(horizontal = 12.dp, vertical = 8.dp),
            ) {
                columns.forEach { col ->
                    Text(
                        text = col.header,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.weight(col.weight),
                    )
                }
            }
        }
        // Rows
        itemsIndexed(rows) { _, row ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
            ) {
                columns.forEachIndexed { colIndex, col ->
                    Text(
                        text = row.getOrElse(colIndex) { "" },
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.weight(col.weight),
                    )
                }
            }
        }
    }
}
