package tv.tootie.aurora.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * AI-specific shimmer placeholder (uses violet instead of neutral shimmer).
 * Maps to web AI `shimmer` element. For generic shimmer use [AuroraSkeleton].
 *
 * An animated sweep runs from [aurora.accentVioletSurface] through a brighter
 * [aurora.accentVioletBorder] highlight and back, giving the AI loading feel.
 */
@Composable
public fun AuroraAiShimmer(
    modifier: Modifier = Modifier,
    height: Dp = 16.dp,
    cornerRadius: Dp = 4.dp,
) {
    val aurora = LocalAuroraColors.current

    val transition = rememberInfiniteTransition(label = "ai-shimmer")
    val progress by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart,
        ),
        label = "shimmer-sweep",
    )

    val shimmerBrush = Brush.horizontalGradient(
        colors = listOf(
            aurora.accentVioletSurface,
            aurora.accentVioletBorder,
            aurora.accentVioletSurface,
        ),
        startX = progress * 1000f - 500f,
        endX = progress * 1000f + 500f,
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .clip(RoundedCornerShape(cornerRadius))
            .background(shimmerBrush),
    )
}
