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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraTimelineItem(
    val title: String,
    val description: String? = null,
    val meta: String? = null,
    val tone: AuroraStatusTone = AuroraStatusTone.Queued,
)

/**
 * Vertical timeline with connecting line and status dots.
 * Maps to web `timeline`.
 */
@Composable
public fun AuroraTimeline(
    items: List<AuroraTimelineItem>,
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

            Row(
                modifier = Modifier.height(IntrinsicSize.Min),
            ) {
                // Left column: dot + connector line
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.width(20.dp),
                ) {
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
                    Row(
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.then(Modifier),
                    ) {
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
