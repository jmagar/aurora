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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraStatusTone {
    Online, Syncing, Queued, Degraded, Offline, Error, Automating
}

/**
 * Status dot with optional label. Maps to web `status-indicator`.
 * [AuroraStatusTone.Syncing] and [AuroraStatusTone.Automating] tones pulse automatically.
 */
@Composable
public fun AuroraStatusIndicator(
    tone: AuroraStatusTone,
    modifier: Modifier = Modifier,
    label: String? = null,
    dotSize: Dp = 8.dp,
    pulse: Boolean = tone == AuroraStatusTone.Syncing || tone == AuroraStatusTone.Automating,
) {
    val aurora = LocalAuroraColors.current
    val color: Color = when (tone) {
        AuroraStatusTone.Online     -> aurora.success
        AuroraStatusTone.Syncing    -> aurora.info
        AuroraStatusTone.Queued     -> aurora.neutral
        AuroraStatusTone.Degraded   -> aurora.warn
        AuroraStatusTone.Offline    -> aurora.neutral
        AuroraStatusTone.Error      -> aurora.error
        AuroraStatusTone.Automating -> aurora.accentViolet
    }

    val alpha by if (pulse) {
        rememberInfiniteTransition(label = "pulse").animateFloat(
            initialValue = 1f,
            targetValue = 0.3f,
            animationSpec = infiniteRepeatable(tween(800, easing = LinearEasing), RepeatMode.Reverse),
            label = "pulse-alpha",
        )
    } else {
        remember { mutableFloatStateOf(1f) }
    }

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Box(
            modifier = Modifier
                .size(dotSize)
                .alpha(alpha)
                .background(color, CircleShape),
        )
        if (label != null) {
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface,
            )
        }
    }
}
