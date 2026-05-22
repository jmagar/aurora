package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList

public data class AuroraMarketplaceItem(
    val id: String,
    val title: String,
    val description: String,
    val author: String? = null,
    val badge: String? = null,
)

/**
 * Grid of installable items. Maps to web `marketplace`.
 *
 * Renders each item in an [AuroraCard] with [AuroraCardVariant.Outlined].
 * Each card carries a `contentDescription` combining title + description so TalkBack
 * gives users a complete summary when focus lands on the card.
 *
 * When [isLoading] is true a centered [AuroraSpinner] is shown instead of the grid,
 * announced as "Loading marketplace items".
 *
 * The optional [AuroraMarketplaceItem.badge] field is reserved for future use
 * (e.g. "New", "Beta") and not yet rendered.
 *
 * @param items       Items to display. Use [ImmutableList] for Compose stability.
 * @param onItemClick Called when the user taps an item card.
 * @param modifier    Applied to the root layout.
 * @param columns     Number of grid columns (default 2).
 * @param isLoading   When true shows a loading spinner instead of the grid.
 */
@Composable
public fun AuroraMarketplace(
    items: ImmutableList<AuroraMarketplaceItem>,
    onItemClick: (AuroraMarketplaceItem) -> Unit,
    modifier: Modifier = Modifier,
    columns: Int = 2,
    isLoading: Boolean = false,
) {
    if (isLoading) {
        Box(
            modifier = modifier.fillMaxSize(),
            contentAlignment = Alignment.Center,
        ) {
            AuroraSpinner(contentDescription = "Loading marketplace items")
        }
        return
    }

    LazyVerticalGrid(
        columns = GridCells.Fixed(columns),
        modifier = modifier,
        contentPadding = PaddingValues(12.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        items(items, key = { it.id }) { item ->
            // TalkBack summary: "Title. Description. By author."
            val itemDescription = buildString {
                append(item.title)
                append(". ")
                append(item.description)
                item.author?.let { append(". By $it") }
            }
            AuroraCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .semantics { contentDescription = itemDescription }
                    .clickable(role = Role.Button) { onItemClick(item) },
                variant = AuroraCardVariant.Outlined,
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Text(
                        item.title,
                        style = MaterialTheme.typography.labelLarge,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        item.description,
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    item.author?.let {
                        Text(
                            it,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
    }
}
