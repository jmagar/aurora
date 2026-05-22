package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * A single column definition for [AuroraDataTable].
 *
 * @param header Human-readable column label shown in the header row.
 * @param key Key used to look up cell values in each row map.
 * @param weight Relative flex-weight of the column. Defaults to 1.
 * @param sortable Whether TalkBack-accessible sort controls are shown for this column.
 */
@Immutable
public data class AuroraDataColumn(
    val header: String,
    val key: String,
    val weight: Float = 1f,
    val sortable: Boolean = true,
)

private enum class SortDir { Asc, Desc }

/**
 * Sortable data table with sticky column headers. Maps to the web `data-table` component.
 *
 * **Distinction from [AuroraTable]:** this component accepts keyed maps per row and supports
 * interactive column sorting. Use [AuroraTable] for positional, read-only tabular data.
 *
 * **Stability note:** [rows] is typed as [ImmutableList] so Compose can skip recomposition
 * when the list reference is stable. Wrap caller data with `persistentListOf()` or
 * `toPersistentList()` from `kotlinx-collections-immutable`.
 *
 * @param columns Column definitions. Use `@Immutable` [AuroraDataColumn].
 * @param rows Stable list of row maps: column key → cell value string.
 * @param modifier Modifier applied to the root [LazyColumn].
 */
@Composable
public fun AuroraDataTable(
    columns: ImmutableList<AuroraDataColumn>,
    rows: ImmutableList<Map<String, String>>,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    var sortKey by remember { mutableStateOf<String?>(null) }
    var sortDir by remember { mutableStateOf(SortDir.Asc) }

    val sortedRows = remember(rows, sortKey, sortDir) {
        if (sortKey == null) rows
        else {
            val sorted = rows.sortedBy { it[sortKey] ?: "" }
            if (sortDir == SortDir.Desc) sorted.reversed() else sorted
        }
    }

    LazyColumn(modifier = modifier.border(1.dp, aurora.borderDefault)) {
        stickyHeader(key = "header", contentType = "header") {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(horizontal = 12.dp, vertical = 8.dp)
                    .semantics(mergeDescendants = true) { heading() },
            ) {
                columns.forEach { col ->
                    val sortState = when {
                        sortKey != col.key -> ""
                        sortDir == SortDir.Asc -> "sorted ascending"
                        else -> "sorted descending"
                    }
                    Row(
                        modifier = Modifier
                            .weight(col.weight)
                            .then(
                                if (col.sortable) {
                                    Modifier
                                        .clickable(role = Role.Button) {
                                            if (sortKey == col.key) {
                                                sortDir = if (sortDir == SortDir.Asc) SortDir.Desc else SortDir.Asc
                                            } else {
                                                sortKey = col.key
                                                sortDir = SortDir.Asc
                                            }
                                        }
                                        .semantics {
                                            stateDescription = sortState
                                        }
                                } else {
                                    Modifier
                                },
                            ),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                    ) {
                        Text(
                            text = col.header,
                            style = MaterialTheme.typography.labelSmall,
                            color = if (sortKey == col.key) MaterialTheme.colorScheme.primary
                                    else MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        if (col.sortable && sortKey == col.key) {
                            // Decorative — sort state is announced via stateDescription on parent Row
                            Icon(
                                imageVector = if (sortDir == SortDir.Asc) Icons.Default.ArrowUpward
                                              else Icons.Default.ArrowDownward,
                                contentDescription = null,
                            )
                        }
                    }
                }
            }
        }
        itemsIndexed(
            items = sortedRows,
            key = { index, _ -> index },
            contentType = { _, _ -> "row" },
        ) { _, row ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp)
                    .semantics(mergeDescendants = true) {},
            ) {
                columns.forEach { col ->
                    Text(
                        text = row[col.key] ?: "",
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.weight(col.weight),
                    )
                }
            }
        }
    }
}
