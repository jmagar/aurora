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
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * Page number row with previous/next controls. Maps to web `pagination`.
 *
 * @param currentPage 1-based current page number
 * @param totalPages total number of pages
 * @param onPageChange called with the new 1-based page number
 * @param maxVisible maximum number of numeric page buttons to show at once
 */
@Composable
public fun AuroraPagination(
    currentPage: Int,
    totalPages: Int,
    onPageChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    maxVisible: Int = 5,
) {
    // Clamp endPage first, then back-fill startPage so we always show up to maxVisible buttons
    // when pages remain at both ends.
    val endPage = minOf(totalPages, currentPage + maxVisible / 2)
    val startPage = maxOf(1, endPage - maxVisible + 1)

    Row(
        modifier = modifier.semantics {
            // Announce current position on every page change for TalkBack users.
            contentDescription = "Page $currentPage of $totalPages"
            liveRegion = LiveRegionMode.Polite
        },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        FilledTonalIconButton(
            onClick = { onPageChange(currentPage - 1) },
            enabled = currentPage > 1,
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.KeyboardArrowLeft,
                contentDescription = "Previous page",
            )
        }

        for (page in startPage..endPage) {
            if (page == currentPage) {
                // Current page: disabled interaction, but clearly announced as selected.
                FilledTonalIconButton(
                    onClick = {},
                    enabled = false,
                    modifier = Modifier.semantics {
                        role = Role.Button
                        selected = true
                        contentDescription = "Page $page, current"
                    },
                ) {
                    Text(
                        text = page.toString(),
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            } else {
                TextButton(
                    onClick = { onPageChange(page) },
                    modifier = Modifier.semantics {
                        contentDescription = "Page $page"
                    },
                ) {
                    Text(page.toString(), style = MaterialTheme.typography.labelMedium)
                }
            }
        }

        FilledTonalIconButton(
            onClick = { onPageChange(currentPage + 1) },
            enabled = currentPage < totalPages,
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                contentDescription = "Next page",
            )
        }
    }
}
