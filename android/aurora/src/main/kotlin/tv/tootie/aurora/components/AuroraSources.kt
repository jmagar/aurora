package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Data model for a single source citation.
 *
 * @property title Display name shown on the pill.
 * @property url   Full URL — used as the stable [LazyRow] item key and domain extraction.
 */
@Immutable
public data class AuroraSource(
    val title: String,
    val url: String,
)

/**
 * Horizontal scrollable row of source/citation pills.
 * Maps to web AI `sources` element.
 *
 * Accessibility:
 * - Each pill carries a [contentDescription] in the form
 *   "Source 1: OpenAI Blog, openai.com" so TalkBack announces both title and domain.
 * - Pills are exposed with [Role.Button] so TalkBack announces "double-tap to activate".
 * - [url] is the stable item key, avoiding mismatched scroll state on list updates.
 *
 * @param sources       Source citations to display. Use [ImmutableList] for Compose stability.
 * @param onSourceClick Invoked when the user taps a source pill.
 * @param modifier      Modifier applied to the outer [LazyRow].
 */
@Composable
public fun AuroraSources(
    sources: ImmutableList<AuroraSource>,
    onSourceClick: (AuroraSource) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    LazyRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = PaddingValues(horizontal = 0.dp),
    ) {
        itemsIndexed(sources, key = { _, source -> source.url }) { index, source ->
            val domain = runCatching {
                java.net.URI(source.url).host.removePrefix("www.")
            }.getOrDefault(source.url)

            val pillDescription = "Source ${index + 1}: ${source.title}, $domain"

            Surface(
                modifier = Modifier
                    .clickable(role = Role.Button) { onSourceClick(source) }
                    .semantics { contentDescription = pillDescription },
                shape = RoundedCornerShape(6.dp),
                color = aurora.accentVioletSurface,
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Text(
                        text = "${index + 1}",
                        style = MaterialTheme.typography.labelSmall,
                        color = aurora.accentViolet,
                    )
                    Text(
                        text = source.title,
                        style = MaterialTheme.typography.labelSmall,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
        }
    }
}
