package tv.tootie.aurora.components

import androidx.compose.foundation.layout.height
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraProgressVariant { Default, Success, Warn, Error, Rose }

public enum class AuroraProgressSize(public val height: Dp) {
    Compact(3.dp),
    Default(4.dp),
    Large(8.dp),
}

/**
 * Linear progress bar with Aurora status variants.
 * Pass [value] = null for indeterminate. Maps to web `progress`.
 */
@Composable
public fun AuroraProgress(
    modifier: Modifier = Modifier,
    value: Float? = null,
    variant: AuroraProgressVariant = AuroraProgressVariant.Default,
    size: AuroraProgressSize = AuroraProgressSize.Default,
    trackColor: Color = MaterialTheme.colorScheme.surfaceVariant,
) {
    val aurora = LocalAuroraColors.current
    val indicatorColor: Color = when (variant) {
        AuroraProgressVariant.Default -> MaterialTheme.colorScheme.primary
        AuroraProgressVariant.Success -> aurora.success
        AuroraProgressVariant.Warn    -> aurora.warn
        AuroraProgressVariant.Error   -> aurora.error
        AuroraProgressVariant.Rose    -> aurora.accentPink
    }

    if (value == null) {
        LinearProgressIndicator(
            modifier = modifier.height(size.height),
            color = indicatorColor,
            trackColor = trackColor,
            gapSize = 0.dp,
        )
    } else {
        LinearProgressIndicator(
            progress = { value.coerceIn(0f, 1f) },
            modifier = modifier.height(size.height),
            color = indicatorColor,
            trackColor = trackColor,
            gapSize = 0.dp,
            drawStopIndicator = {},
        )
    }
}
