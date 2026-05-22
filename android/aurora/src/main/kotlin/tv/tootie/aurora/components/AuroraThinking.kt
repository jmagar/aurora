package tv.tootie.aurora.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Animated thinking indicator: pulsing dots + "Thinking…" label.
 * Maps to web AI `thinking` block. Uses violet for AI identity.
 */
@Composable
public fun AuroraThinking(
    modifier: Modifier = Modifier,
    label: String = "Thinking…",
) {
    val aurora = LocalAuroraColors.current
    val transition = rememberInfiniteTransition(label = "thinking")

    Row(
        modifier = modifier.padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        repeat(3) { index ->
            val alpha by transition.animateFloat(
                initialValue = 0.2f, targetValue = 1f,
                animationSpec = infiniteRepeatable(
                    tween(600, delayMillis = index * 200, easing = LinearEasing),
                    RepeatMode.Reverse,
                ),
                label = "dot-$index",
            )
            AuroraSpinner(
                contentDescription = "",
                modifier = Modifier.size(6.dp).alpha(alpha),
                size = 6.dp,
                color = aurora.accentViolet,
            )
        }
        Text(label, style = MaterialTheme.typography.bodySmall, color = aurora.accentViolet)
    }
}
