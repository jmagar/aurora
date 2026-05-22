package tv.tootie.aurora.components

import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.VerticalDivider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraSeparatorOrientation { Horizontal, Vertical }

/**
 * Compose equivalent of Aurora's Separator shadcn component.
 *
 * Uses LocalAuroraColors.current.borderDefault — NOT MaterialTheme.colorScheme.outlineVariant.
 * Aurora's border token can drift independently from M3's outlineVariant mapping.
 */
@Composable
public fun AuroraSeparator(
    modifier: Modifier = Modifier,
    orientation: AuroraSeparatorOrientation = AuroraSeparatorOrientation.Horizontal,
    thickness: Dp = 1.dp,
) {
    val color = LocalAuroraColors.current.borderDefault

    when (orientation) {
        AuroraSeparatorOrientation.Horizontal -> HorizontalDivider(
            modifier = Modifier.fillMaxWidth().then(modifier),
            thickness = thickness,
            color = color,
        )
        AuroraSeparatorOrientation.Vertical -> VerticalDivider(
            modifier = Modifier.fillMaxHeight().then(modifier),
            thickness = thickness,
            color = color,
        )
    }
}
