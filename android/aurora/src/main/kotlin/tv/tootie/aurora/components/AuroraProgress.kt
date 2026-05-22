package tv.tootie.aurora.components

import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraProgressVariant { Default, Success, Warn, Error, Rose }

/**
 * Linear progress bar with Aurora status variants.
 * Pass [value] = null for indeterminate. Maps to web `progress`.
 */
@Composable
public fun AuroraProgress(
    modifier: Modifier = Modifier,
    value: Float? = null,
    variant: AuroraProgressVariant = AuroraProgressVariant.Default,
) {
    val aurora = LocalAuroraColors.current
    val trackColor = MaterialTheme.colorScheme.surfaceVariant
    val indicatorColor: Color = when (variant) {
        AuroraProgressVariant.Default -> MaterialTheme.colorScheme.primary
        AuroraProgressVariant.Success -> aurora.success
        AuroraProgressVariant.Warn    -> aurora.warn
        AuroraProgressVariant.Error   -> aurora.error
        AuroraProgressVariant.Rose    -> aurora.accentPink
    }

    if (value == null) {
        LinearProgressIndicator(
            modifier = modifier,
            color = indicatorColor,
            trackColor = trackColor,
        )
    } else {
        LinearProgressIndicator(
            progress = { value.coerceIn(0f, 1f) },
            modifier = modifier,
            color = indicatorColor,
            trackColor = trackColor,
        )
    }
}
