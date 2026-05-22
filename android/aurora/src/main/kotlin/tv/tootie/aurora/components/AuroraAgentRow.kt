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
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraAgentStatus { Idle, Running, Waiting, Error, Done }

/**
 * Agent header row with status indicator and name.
 * Maps to web AI `agent` element. Uses violet for AI identity.
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
            initialValue = 1f, targetValue = 0.25f,
            animationSpec = infiniteRepeatable(tween(600, easing = LinearEasing), RepeatMode.Reverse),
            label = "agent-dot-alpha",
        )
    } else {
        androidx.compose.runtime.remember { androidx.compose.runtime.mutableFloatStateOf(1f) }
    }

    val dotColor = when (status) {
        AuroraAgentStatus.Idle    -> aurora.neutral
        AuroraAgentStatus.Running -> aurora.accentViolet
        AuroraAgentStatus.Waiting -> aurora.warn
        AuroraAgentStatus.Error   -> aurora.error
        AuroraAgentStatus.Done    -> aurora.success
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Box(
            modifier = Modifier
                .size(10.dp)
                .alpha(dotAlpha)
                .background(dotColor, CircleShape),
        )
        androidx.compose.foundation.layout.Column(modifier = Modifier.weight(1f)) {
            Text(name, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurface)
            description?.let { Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) }
        }
        trailingContent?.invoke()
    }
}
