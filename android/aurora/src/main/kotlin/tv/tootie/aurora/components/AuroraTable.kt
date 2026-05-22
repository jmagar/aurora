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
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * A single column definition for [AuroraTable].
 *
 * @param header Human-readable column label shown in the sticky header row.
 * @param weight Relative flex-weight of the column. Defaults to 1.
 */
@Immutable
public data class AuroraTableColumn(
    val header: String,
    val weight: Float = 1f,
)

/**
 * Simple scrollable table with sticky header row. Maps to the web `table` component.
 *
 * **Distinction from [AuroraDataTable]:** this component is positional (rows are
 * `List<List<String>>`) and read-only — no sorting. Use [AuroraDataTable] when you need
 * interactive column sorting or keyed-map row data.
 *
 * **Stability note:** [rows] is typed as [ImmutableList] so Compose can skip recomposition
 * when the list reference is stable. Wrap caller data with `persistentListOf()` or
 * `toPersistentList()` from `kotlinx-collections-immutable`.
 *
 * @param columns Column definitions with header labels and relative widths.
 * @param rows Stable list of rows; each inner list is cell strings matching [columns] order.
 * @param modifier Modifier applied to the root [LazyColumn].
 */
@Composable
public fun AuroraTable(
    columns: ImmutableList<AuroraTableColumn>,
    rows: ImmutableList<ImmutableList<String>>,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    LazyColumn(
        modifier = modifier.border(1.dp, aurora.borderDefault),
    ) {
        stickyHeader(key = "header", contentType = "header") {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(horizontal = 12.dp, vertical = 8.dp)
                    .semantics(mergeDescendants = true) { heading() },
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
        itemsIndexed(
            items = rows,
            key = { index, _ -> index },
            contentType = { _, _ -> "row" },
        ) { _, row ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp)
                    .semantics(mergeDescendants = true) {},
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
