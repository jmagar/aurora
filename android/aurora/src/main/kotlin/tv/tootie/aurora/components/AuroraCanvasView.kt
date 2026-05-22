package tv.tootie.aurora.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import tv.tootie.aurora.theme.LocalAuroraColors

/** A positioned node in an agent topology graph. */
public data class AuroraCanvasNode(
    val id: String,
    /** X coordinate in canvas pixels. */
    val x: Float,
    /** Y coordinate in canvas pixels. */
    val y: Float,
    val label: String,
)

/** A directed edge between two [AuroraCanvasNode] ids. */
public data class AuroraCanvasEdge(val fromId: String, val toId: String)

/**
 * Simple topology canvas for agent/node graphs.
 * Maps to web AI `canvas` element. Renders nodes as violet circles with
 * connecting lines and node label text centred inside each circle.
 *
 * Coordinates are in raw canvas pixels (the [Canvas] composable coordinate
 * space). Use [fillMaxSize] or a fixed size modifier to constrain the canvas.
 *
 * Accessibility: [contentDescription] describes the graph to screen readers.
 * Because the canvas is a custom drawing surface, TalkBack cannot introspect
 * its contents — a meaningful description is the only affordance available.
 *
 * @param nodes List of positioned nodes to render.
 * @param edges Directed edges between node ids.
 * @param contentDescription Human-readable description of the graph shown,
 *   e.g. "Agent topology: 3 nodes — Planner → Executor → Reporter".
 * @param modifier Modifier applied to the [Canvas]. Typically includes a size constraint.
 */
@Composable
public fun AuroraCanvasView(
    nodes: List<AuroraCanvasNode>,
    edges: List<AuroraCanvasEdge>,
    contentDescription: String,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val nodeMap = nodes.associateBy { it.id }
    val textMeasurer = rememberTextMeasurer()

    val edgeColor = aurora.borderStrong
    val nodeColor = aurora.accentViolet.copy(alpha = 0.8f)
    val nodeTextColor = Color.White

    Canvas(
        modifier = modifier
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp))
            .semantics { this.contentDescription = contentDescription },
    ) {
        // Draw edges first so they sit beneath the nodes
        edges.forEach { edge ->
            val from = nodeMap[edge.fromId] ?: return@forEach
            val to = nodeMap[edge.toId] ?: return@forEach
            drawLine(
                color = edgeColor,
                start = Offset(from.x, from.y),
                end = Offset(to.x, to.y),
                strokeWidth = 2f,
            )
        }

        // Draw nodes
        nodes.forEach { node ->
            val center = Offset(node.x, node.y)
            drawCircle(
                color = nodeColor,
                radius = 20f,
                center = center,
            )
            drawNodeLabel(textMeasurer, node.label, center, nodeTextColor)
        }
    }
}

private fun DrawScope.drawNodeLabel(
    measurer: TextMeasurer,
    label: String,
    center: Offset,
    color: Color,
) {
    val style = TextStyle(
        color = color,
        fontSize = 9.sp,
        fontFamily = FontFamily.Monospace,
    )
    val result = measurer.measure(label, style)
    drawText(
        textLayoutResult = result,
        topLeft = Offset(
            center.x - result.size.width / 2f,
            center.y - result.size.height / 2f,
        ),
    )
}
