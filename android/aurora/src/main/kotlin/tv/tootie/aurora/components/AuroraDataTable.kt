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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraDataColumn(
    val header: String,
    val key: String,
    val weight: Float = 1f,
    val sortable: Boolean = true,
)

private enum class SortDir { Asc, Desc }

/**
 * Sortable data table with column headers. Maps to web `data-table`.
 *
 * @param columns column definitions
 * @param rows list of maps: column key → cell value
 */
@Composable
public fun AuroraDataTable(
    columns: List<AuroraDataColumn>,
    rows: List<Map<String, String>>,
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
        stickyHeader {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(horizontal = 12.dp, vertical = 8.dp),
            ) {
                columns.forEach { col ->
                    Row(
                        modifier = Modifier
                            .weight(col.weight)
                            .then(
                                if (col.sortable)
                                    Modifier.clickable(role = Role.Button) {
                                        if (sortKey == col.key) {
                                            sortDir = if (sortDir == SortDir.Asc) SortDir.Desc else SortDir.Asc
                                        } else {
                                            sortKey = col.key
                                            sortDir = SortDir.Asc
                                        }
                                    }
                                else Modifier,
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
                            Icon(
                                imageVector = if (sortDir == SortDir.Asc) Icons.Default.ArrowUpward
                                              else Icons.Default.ArrowDownward,
                                contentDescription = null,
                                modifier = Modifier.padding(0.dp),
                            )
                        }
                    }
                }
            }
        }
        itemsIndexed(sortedRows) { _, row ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
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
