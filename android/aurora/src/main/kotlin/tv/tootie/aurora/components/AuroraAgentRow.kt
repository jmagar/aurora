package tv.tootie.aurora.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraAgentStatus { Idle, Running, Waiting, Error, Done }

/**
 * Agent header row with animated status indicator, name, and optional description.
 *
 * Maps to the web AI `agent` element. Violet accent signals AI identity. The status
 * dot pulses when [status] is [AuroraAgentStatus.Running]. The row is announced to
 * TalkBack as "Agent: [name], [status]" and uses [LiveRegionMode.Polite] so status
 * changes are spoken without interrupting ongoing speech.
 *
 * @param name          Display name of the agent.
 * @param status        Current operational status.
 * @param modifier      Caller-supplied modifier applied to the root [Row].
 * @param description   Optional subtitle shown below the name.
 * @param trailingContent Optional composable slotted at the trailing edge.
 */
@Composable
public fun AuroraAgentRow(
    name: String,
    status: AuroraAgentStatus,
    modifier: Modifier = Modifier,
    description: String? = null,
    trailingContent: (@Composable () -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current
    val isRunning = status == AuroraAgentStatus.Running

    val dotAlpha by if (isRunning) {
        rememberInfiniteTransition(label = "agent-pulse").animateFloat(
            initialValue = 1f,
            targetValue = 0.25f,
            animationSpec = infiniteRepeatable(tween(600, easing = LinearEasing), RepeatMode.Reverse),
            label = "agent-dot-alpha",
        )
    } else {
        remember { mutableFloatStateOf(1f) }
    }

    val dotColor = when (status) {
        AuroraAgentStatus.Idle    -> aurora.neutral
        AuroraAgentStatus.Running -> aurora.accentViolet
        AuroraAgentStatus.Waiting -> aurora.warn
        AuroraAgentStatus.Error   -> aurora.error
        AuroraAgentStatus.Done    -> aurora.success
    }

    val statusLabel = when (status) {
        AuroraAgentStatus.Idle    -> "idle"
        AuroraAgentStatus.Running -> "running"
        AuroraAgentStatus.Waiting -> "waiting"
        AuroraAgentStatus.Error   -> "error"
        AuroraAgentStatus.Done    -> "done"
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 8.dp)
            .semantics(mergeDescendants = true) {
                contentDescription = "Agent: $name, $statusLabel"
                liveRegion = LiveRegionMode.Polite
            },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        // Status dot — decorative; state is expressed via the merged contentDescription above.
        Box(
            modifier = Modifier
                .size(10.dp)
                .alpha(dotAlpha)
                .background(dotColor, CircleShape)
                .semantics { contentDescription = "" },
        )

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = name,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurface,
            )
            if (description != null) {
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        trailingContent?.invoke()
    }
}
