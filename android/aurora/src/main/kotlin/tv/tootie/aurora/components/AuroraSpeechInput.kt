package tv.tootie.aurora.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Microphone record button with pulse animation when recording.
 * Maps to web AI `speech-input` element.
 *
 * Accessibility:
 * - The mic button `contentDescription` reflects recording state: "Start recording" /
 *   "Stop recording".
 * - The "Recording…" status label is marked as a live region so TalkBack announces
 *   it when it appears (i.e. when recording starts).
 * - The decorative pulse ring has its semantics cleared so screen readers skip it.
 *
 * @param isRecording Whether audio is currently being captured.
 * @param onToggle    Called to start or stop recording.
 * @param modifier    Applied to the root [Row].
 */
@Composable
public fun AuroraSpeechInput(
    isRecording: Boolean,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val scale by if (isRecording) {
        rememberInfiniteTransition(label = "mic-pulse").animateFloat(
            initialValue = 1f, targetValue = 1.15f,
            animationSpec = infiniteRepeatable(tween(500, easing = LinearEasing), RepeatMode.Reverse),
            label = "mic-scale",
        )
    } else {
        androidx.compose.runtime.remember { androidx.compose.runtime.mutableFloatStateOf(1f) }
    }

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Box(contentAlignment = Alignment.Center) {
            if (isRecording) {
                // Purely decorative pulse ring — excluded from accessibility tree.
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .scale(scale)
                        .border(2.dp, aurora.error.copy(alpha = 0.4f), CircleShape)
                        .clearAndSetSemantics {},
                )
            }
            FilledIconButton(
                onClick = onToggle,
                modifier = Modifier.size(44.dp),
                colors = IconButtonDefaults.filledIconButtonColors(
                    containerColor = if (isRecording) aurora.error else MaterialTheme.colorScheme.surfaceVariant,
                    contentColor = if (isRecording) MaterialTheme.colorScheme.onError else MaterialTheme.colorScheme.onSurface,
                ),
            ) {
                Icon(
                    imageVector = if (isRecording) Icons.Default.MicOff else Icons.Default.Mic,
                    contentDescription = if (isRecording) "Stop recording" else "Start recording",
                )
            }
        }
        if (isRecording) {
            Text(
                text = "Recording…",
                style = MaterialTheme.typography.bodySmall,
                color = aurora.error,
                modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            )
        }
    }
}
