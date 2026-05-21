package tv.tootie.aurora.components

import androidx.compose.foundation.layout.BoxScope
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics

/**
 * Compose equivalent of Aurora's Badge shadcn component.
 *
 * When [count] is non-null the badge renders a numeric label, capped at "99+"
 * to prevent overflow of the capsule shape. The [contentDescriptionSuffix] is
 * appended to the count to form an accessible label (e.g. "5 notifications").
 *
 * When [count] is null a dot-only indicator is shown. Supply [contentDescription]
 * to give screen-readers a meaningful label for that state.
 */
@Composable
fun AuroraBadge(
    modifier: Modifier = Modifier,
    count: Int? = null,
    contentDescriptionSuffix: String = "notifications",
    contentDescription: String? = null,
    content: @Composable BoxScope.() -> Unit,
) {
    val semanticsModifier = when {
        count != null -> Modifier.semantics {
            this.contentDescription = "$count $contentDescriptionSuffix"
        }
        contentDescription != null -> Modifier.semantics {
            this.contentDescription = contentDescription
        }
        else -> Modifier
    }

    BadgedBox(
        modifier = modifier.then(semanticsModifier),
        badge = {
            if (count != null) {
                Badge { Text(if (count > 99) "99+" else count.toString()) }
            } else {
                Badge()
            }
        },
        content = content,
    )
}
