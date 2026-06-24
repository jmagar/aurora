package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraCalloutVariant { Info, Success, Warn, Error, Neutral }

/**
 * Tinted info/status block with icon slot. Maps to web `callout`.
 *
 * Descendants are merged into a single TalkBack node and announced politely
 * when content changes. The decorative [icon] slot is hidden from the
 * accessibility tree via [clearAndSetSemantics] — its meaning is conveyed
 * by [title] and [message].
 */
@Composable
public fun AuroraCallout(
    message: String,
    modifier: Modifier = Modifier,
    variant: AuroraCalloutVariant = AuroraCalloutVariant.Info,
    title: String? = null,
    icon: (@Composable () -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current
    val (surfaceColor, borderColor, titleColor) = when (variant) {
        AuroraCalloutVariant.Info    -> Triple(aurora.infoSurface, aurora.infoBorder, aurora.infoForeground)
        AuroraCalloutVariant.Success -> Triple(aurora.successSurface, aurora.successBorder, aurora.successForeground)
        AuroraCalloutVariant.Warn    -> Triple(aurora.warnSurface, aurora.warnBorder, aurora.warnForeground)
        AuroraCalloutVariant.Error   -> Triple(aurora.errorSurface, aurora.errorBorder, aurora.errorForeground)
        AuroraCalloutVariant.Neutral -> Triple(aurora.neutralSurface, aurora.neutralBorder, aurora.neutralForeground)
    }

    Surface(
        modifier = modifier
            .border(1.dp, borderColor, RoundedCornerShape(8.dp))
            .semantics(mergeDescendants = true) { liveRegion = LiveRegionMode.Polite },
        shape = RoundedCornerShape(8.dp),
        color = surfaceColor,
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            if (icon != null) {
                Box(
                    // Icon is decorative — meaning conveyed by title/message.
                    modifier = Modifier.size(18.dp).clearAndSetSemantics {},
                    contentAlignment = Alignment.Center,
                ) {
                    icon()
                }
            }
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                title?.let {
                    Text(it, style = MaterialTheme.typography.labelMedium, color = titleColor)
                }
                Text(message, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
