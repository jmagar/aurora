package tv.tootie.aurora.components

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.PlainTooltip
import androidx.compose.material3.RichTooltip
import androidx.compose.material3.Text
import androidx.compose.material3.TooltipBox
import androidx.compose.material3.TooltipAnchorPosition
import androidx.compose.material3.TooltipDefaults
import androidx.compose.material3.rememberTooltipState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Plain text tooltip on long-press. Maps to web `tooltip`.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun AuroraTooltip(
    text: String,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    TooltipBox(
        positionProvider = TooltipDefaults.rememberTooltipPositionProvider(TooltipAnchorPosition.Above),
        tooltip = { PlainTooltip { Text(text) } },
        state = rememberTooltipState(),
        modifier = modifier,
        content = content,
    )
}

/**
 * Rich tooltip with title and optional action. Maps to web `hover-card` rich variant.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun AuroraRichTooltip(
    title: String,
    text: String,
    modifier: Modifier = Modifier,
    action: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    TooltipBox(
        positionProvider = TooltipDefaults.rememberTooltipPositionProvider(TooltipAnchorPosition.Above),
        tooltip = {
            RichTooltip(
                title = { Text(title) },
                action = action,
            ) { Text(text) }
        },
        state = rememberTooltipState(isPersistent = action != null),
        modifier = modifier,
        content = content,
    )
}
