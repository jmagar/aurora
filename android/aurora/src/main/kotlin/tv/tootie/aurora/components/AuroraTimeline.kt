package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * A single event entry in an [AuroraTimeline].
 *
 * @param title Short summary shown in bold.
 * @param description Optional longer description shown below the title.
 * @param meta Optional timestamp or metadata shown trailing on the title row.
 * @param tone Status dot color corresponding to event state. Defaults to [AuroraStatusTone.Queued].
 */
@Immutable
public data class AuroraTimelineItem(
    val title: String,
    val description: String? = null,
    val meta: String? = null,
    val tone: AuroraStatusTone = AuroraStatusTone.Queued,
)

/**
 * Vertical timeline with a connecting line and status dots per entry.
 * Maps to the web `timeline` component.
 *
 * Implemented as an eager [Column] (not [LazyColumn]) because the dot-to-connector layout
 * relies on [IntrinsicSize.Min] + [Modifier.fillMaxHeight] to draw the line segment, which
 * is incompatible with lazy measurement. For very long lists consider virtualising the list
 * and drawing the connecting line as a canvas decoration instead.
 *
 * **Accessibility:** each timeline entry [Row] merges descendants and carries a
 * `contentDescription` that includes the tone name, title, and description so TalkBack
 * reads each item as a single meaningful utterance in document order.
 *
 * **Stability note:** [items] is typed as [ImmutableList] so Compose can skip recomposition
 * when the list reference is stable.
 *
 * @param items Stable ordered list of timeline entries (oldest or newest first — caller's choice).
 * @param modifier Modifier applied to the root [Column].
 */
@Composable
public fun AuroraTimeline(
    items: ImmutableList<AuroraTimelineItem>,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(0.dp)) {
        items.forEachIndexed { index, item ->
            val dotColor: Color = when (item.tone) {
                AuroraStatusTone.Online     -> aurora.success
                AuroraStatusTone.Syncing    -> aurora.info
                AuroraStatusTone.Queued     -> aurora.neutral
                AuroraStatusTone.Degraded   -> aurora.warn
                AuroraStatusTone.Offline    -> aurora.neutral
                AuroraStatusTone.Error      -> aurora.error
                AuroraStatusTone.Automating -> aurora.accentViolet
            }
            val isLast = index == items.lastIndex

            // Build a single TalkBack utterance: "<Tone>: <title>[, description]"
            val itemDescription = buildString {
                append(item.tone.defaultDescription)
                append(": ")
                append(item.title)
                item.description?.let {
                    append(", ")
                    append(it)
                }
            }

            Row(
                modifier = Modifier
                    .height(IntrinsicSize.Min)
                    .semantics(mergeDescendants = true) {
                        contentDescription = itemDescription
                    },
            ) {
                // Left column: dot + connector line
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.width(20.dp),
                ) {
                    // Decorative within the merged semantic node
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .background(dotColor, CircleShape),
                    )
                    if (!isLast) {
                        Box(
                            modifier = Modifier
                                .width(2.dp)
                                .fillMaxHeight()
                                .background(aurora.borderDefault),
                        )
                    }
                }

                Spacer(Modifier.width(12.dp))

                // Right column: content
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .padding(bottom = if (isLast) 0.dp else 16.dp),
                    verticalArrangement = Arrangement.spacedBy(2.dp),
                ) {
                    Row(horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(
                            text = item.title,
                            style = MaterialTheme.typography.labelMedium,
                            modifier = Modifier.weight(1f),
                        )
                        item.meta?.let {
                            Text(
                                text = it,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                    item.description?.let {
                        Text(
                            text = it,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
    }
}
