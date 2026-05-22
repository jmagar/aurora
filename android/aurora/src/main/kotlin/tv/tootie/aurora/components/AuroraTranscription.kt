package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Live transcription display with confidence indicator.
 * Maps to web AI `transcription` element.
 */
@Composable
public fun AuroraTranscription(
    text: String,
    modifier: Modifier = Modifier,
    confidence: Float? = null,
    isLive: Boolean = false,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surface,
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (isLive) AuroraStatusIndicator(tone = AuroraStatusTone.Syncing, label = "Live")
                confidence?.let {
                    AuroraProgress(value = it, variant = AuroraProgressVariant.Default,
                        modifier = Modifier.weight(1f))
                }
            }
            Text(text, style = MaterialTheme.typography.bodyMedium)
        }
    }
}
