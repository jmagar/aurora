package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Live transcription display with optional speaker label, confidence bar, and copy support.
 * Maps to web AI `transcription` element.
 *
 * Accessibility:
 * - The transcribed text node carries [LiveRegionMode.Polite] so TalkBack announces
 *   new words as they stream in without interrupting the current utterance.
 * - When a [speaker] label is provided it is prepended to the [contentDescription]
 *   so screen readers announce "Alice: Hello world" rather than just "Hello world".
 * - The text is wrapped in [SelectionContainer] so users can long-press to copy.
 *
 * @param text       Transcribed (or streaming) text to display.
 * @param modifier   Modifier applied to the outer [Surface].
 * @param speaker    Optional speaker label (e.g. "Alice", "Agent").
 * @param confidence Optional 0–1 confidence score shown as a progress bar.
 * @param isLive     When `true` a "Live" status indicator is shown.
 */
@Composable
public fun AuroraTranscription(
    text: String,
    modifier: Modifier = Modifier,
    speaker: String? = null,
    confidence: Float? = null,
    isLive: Boolean = false,
) {
    val aurora = LocalAuroraColors.current

    // Build the accessible text description — include speaker if present.
    val textDescription = if (speaker != null) "$speaker: $text" else text

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, androidx.compose.foundation.shape.RoundedCornerShape(8.dp)),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surface,
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            // Status row: live indicator + optional confidence bar.
            if (isLive || confidence != null) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (isLive) {
                        AuroraStatusIndicator(tone = AuroraStatusTone.Syncing, label = "Live")
                    }
                    confidence?.let {
                        AuroraProgress(
                            value = it,
                            variant = AuroraProgressVariant.Default,
                            modifier = Modifier.weight(1f),
                        )
                    }
                }
            }

            // Speaker label — displayed as a small chip / prefix text above the body.
            speaker?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                )
            }

            // Transcription body — selectable + live region for TalkBack streaming updates.
            SelectionContainer {
                Text(
                    text = text,
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.semantics {
                        // Polite: TalkBack announces new text without interrupting current speech.
                        liveRegion = LiveRegionMode.Polite
                        contentDescription = textDescription
                    },
                )
            }
        }
    }
}
