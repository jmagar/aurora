package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * Page number row with previous/next controls. Maps to web `pagination`.
 *
 * @param currentPage 1-based current page number
 * @param totalPages total number of pages
 * @param onPageChange called with the new 1-based page number
 */
@Composable
public fun AuroraPagination(
    currentPage: Int,
    totalPages: Int,
    onPageChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    maxVisible: Int = 5,
) {
    val startPage = maxOf(1, currentPage - maxVisible / 2)
    val endPage = minOf(totalPages, startPage + maxVisible - 1)

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        FilledTonalIconButton(
            onClick = { onPageChange(currentPage - 1) },
            enabled = currentPage > 1,
        ) {
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowLeft, contentDescription = "Previous")
        }

        for (page in startPage..endPage) {
            if (page == currentPage) {
                FilledTonalIconButton(onClick = {}) {
                    Text(
                        text = page.toString(),
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            } else {
                TextButton(onClick = { onPageChange(page) }) {
                    Text(page.toString(), style = MaterialTheme.typography.labelMedium)
                }
            }
        }

        FilledTonalIconButton(
            onClick = { onPageChange(currentPage + 1) },
            enabled = currentPage < totalPages,
        ) {
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = "Next")
        }
    }
}
