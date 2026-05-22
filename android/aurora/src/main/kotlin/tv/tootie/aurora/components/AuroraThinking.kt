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
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Animated thinking indicator: pulsing dots + label.
 *
 * Maps to web AI `thinking` block. Uses violet for AI identity.
 *
 * Accessibility: the entire row is announced as a live region so TalkBack
 * updates the user when the thinking state appears or changes. The animated
 * dots are decorative and suppressed from the accessibility tree.
 */
@Composable
public fun AuroraThinking(
    modifier: Modifier = Modifier,
    label: String = "Thinking…",
) {
    val aurora = LocalAuroraColors.current
    val transition = rememberInfiniteTransition(label = "thinking")

    Row(
        modifier = modifier
            .padding(8.dp)
            .semantics(mergeDescendants = true) {
                contentDescription = label
                liveRegion = LiveRegionMode.Polite
            },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        // Three pulsing dots — purely decorative; hidden from accessibility tree.
        repeat(3) { index ->
            val alpha by transition.animateFloat(
                initialValue = 0.2f,
                targetValue = 1f,
                animationSpec = infiniteRepeatable(
                    tween(600, delayMillis = index * 200, easing = LinearEasing),
                    RepeatMode.Reverse,
                ),
                label = "dot-$index",
            )
            AuroraSpinner(
                contentDescription = "",
                modifier = Modifier
                    .size(6.dp)
                    .alpha(alpha)
                    .clearAndSetSemantics { },
                size = 6.dp,
                color = aurora.accentViolet,
            )
        }
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = aurora.accentViolet,
        )
    }
}
