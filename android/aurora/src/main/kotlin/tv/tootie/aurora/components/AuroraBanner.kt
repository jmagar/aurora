package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraBannerVariant { Info, Success, Warn, Error, Neutral }

/**
 * Full-width status strip with icon slot and optional dismiss action.
 * Maps to web `banner` component.
 *
 * The banner uses [LiveRegionMode.Polite] so TalkBack announces variant changes
 * without interrupting ongoing speech. Callers should wrap decorative [leadingIcon]
 * content with `Modifier.clearAndSetSemantics {}` to suppress redundant announcements.
 */
@Composable
public fun AuroraBanner(
    message: String,
    modifier: Modifier = Modifier,
    variant: AuroraBannerVariant = AuroraBannerVariant.Info,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingAction: (@Composable () -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current
    val (bg, contentColor) = when (variant) {
        AuroraBannerVariant.Info    -> aurora.infoSurface to aurora.infoForeground
        AuroraBannerVariant.Success -> aurora.successSurface to aurora.successForeground
        AuroraBannerVariant.Warn    -> aurora.warnSurface to aurora.warnForeground
        AuroraBannerVariant.Error   -> aurora.errorSurface to aurora.errorForeground
        AuroraBannerVariant.Neutral -> aurora.neutralSurface to aurora.neutralForeground
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .semantics { liveRegion = LiveRegionMode.Polite },
        color = bg,
        contentColor = contentColor,
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            leadingIcon?.invoke()
            Text(
                text = message,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.weight(1f),
            )
            trailingAction?.invoke()
        }
    }
}
