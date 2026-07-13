package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Titled panel with Axon-orange AI identity accent on the header.
 * Maps to web AI `panel` element.
 *
 * Accessibility:
 * - Root surface is marked as a traversal group so TalkBack navigates inside it as a unit.
 * - The title [Text] is marked as a heading so screen readers can jump between panels.
 * - [headerTrailing] should contain a close/collapse button with its own [contentDescription].
 */
@Composable
public fun AuroraAiPanel(
    title: String,
    modifier: Modifier = Modifier,
    icon: (@Composable () -> Unit)? = null,
    headerTrailing: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.accentVioletBorder, RoundedCornerShape(10.dp))
            .semantics { isTraversalGroup = true },
        shape = RoundedCornerShape(10.dp),
        color = aurora.accentVioletSurface,
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                icon?.invoke()
                if (icon != null) Spacer(Modifier.width(8.dp))
                Text(
                    title,
                    style = MaterialTheme.typography.labelMedium,
                    color = aurora.accentViolet,
                    modifier = Modifier
                        .weight(1f)
                        .semantics { heading() },
                )
                headerTrailing?.invoke()
            }
            Surface(color = MaterialTheme.colorScheme.surface) {
                content()
            }
        }
    }
}
