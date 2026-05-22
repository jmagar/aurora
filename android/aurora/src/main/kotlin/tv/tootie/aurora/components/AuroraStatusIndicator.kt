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
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/** Status tones supported by [AuroraStatusIndicator]. */
public enum class AuroraStatusTone {
    Online, Syncing, Queued, Degraded, Offline, Error, Automating;

    /** Human-readable label announced by TalkBack when no explicit [AuroraStatusIndicator.label] is provided. */
    internal val defaultDescription: String
        get() = when (this) {
            Online     -> "Online"
            Syncing    -> "Syncing"
            Queued     -> "Queued"
            Degraded   -> "Degraded"
            Offline    -> "Offline"
            Error      -> "Error"
            Automating -> "Automating"
        }
}

/**
 * Status dot with optional text label. Maps to the web `status-indicator` component.
 *
 * [AuroraStatusTone.Syncing] and [AuroraStatusTone.Automating] tones pulse automatically.
 *
 * **Accessibility:** the root [Row] merges descendants and carries a `contentDescription`
 * derived from [tone] (e.g. "Online", "Error") so TalkBack announces the status even when
 * [label] is `null` and only a colored dot is visible.
 *
 * @param tone The status tone controlling dot color and default pulse behaviour.
 * @param modifier Modifier applied to the root [Row].
 * @param label Optional text shown next to the dot. When provided it is also used as the
 *   accessible description; [tone] name is used as a fallback.
 * @param dotSize Diameter of the status dot. Defaults to 8 dp.
 * @param pulse Whether the dot pulses. Defaults to `true` for [AuroraStatusTone.Syncing]
 *   and [AuroraStatusTone.Automating].
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

    // Merge descendants so TalkBack reads dot + label as one node.
    // The contentDescription ensures a meaningful announcement even when label is null.
    val accessibleDescription = label ?: tone.defaultDescription

    Row(
        modifier = modifier.semantics(mergeDescendants = true) {
            contentDescription = accessibleDescription
        },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        // Decorative within the merged node — description is on the Row above
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
