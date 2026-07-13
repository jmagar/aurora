package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Small label for graph edges in agent topology views.
 * Maps to web AI `edge` element.
 *
 * When [active] is `true` the chip uses Axon-orange accent tokens; otherwise it
 * uses neutral surface tokens to indicate an idle or inactive edge.
 *
 * @param label Text describing the edge relationship or data flow.
 * @param modifier Modifier applied to the [Text] composable.
 * @param active Whether this edge is currently active/highlighted.
 */
@Composable
public fun AuroraAiEdge(
    label: String,
    modifier: Modifier = Modifier,
    active: Boolean = false,
) {
    val aurora = LocalAuroraColors.current

    val backgroundColor = if (active) aurora.accentVioletSurface else aurora.neutralSurface
    val borderColor = if (active) aurora.accentVioletBorder else aurora.neutralBorder
    val textColor = if (active) aurora.accentViolet else aurora.neutral

    Text(
        text = label,
        style = MaterialTheme.typography.labelSmall,
        color = textColor,
        modifier = modifier
            .background(backgroundColor, RoundedCornerShape(4.dp))
            .border(0.5.dp, borderColor, RoundedCornerShape(4.dp))
            .padding(horizontal = 6.dp, vertical = 2.dp),
    )
}
