package tv.tootie.aurora.app.ui.chat

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Extension
import androidx.compose.material.icons.filled.Keyboard
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

@Composable
public fun ToolCallTimeline(
    calls: ImmutableList<ToolCall>,
    modifier: Modifier = Modifier,
) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(2.dp)) {
        calls.forEach { call ->
            ToolCallRow(call = call)
        }
    }
}

@Composable
private fun ToolCallRow(call: ToolCall) {
    val aurora = LocalAuroraColors.current
    var expanded by remember(call.id) { mutableStateOf(false) }

    val dotColor: Color = when {
        call.failed -> aurora.error
        call.done -> aurora.success
        else -> aurora.info
    }
    val statusDescription = when {
        call.failed -> "failed"
        call.done -> "completed"
        else -> "running"
    }
    val displayCmd = call.cmd.sanitizeForDisplay().substringAfterLast(" -lc ").trim().trim('\'', '"')
    val terminalBackground = MaterialTheme.colorScheme.surface.copy(alpha = 0.96f)
    val terminalText = MaterialTheme.colorScheme.onSurface
    val terminalMutedText = MaterialTheme.colorScheme.onSurfaceVariant

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(6.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
    ) {
        // Collapsed header row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .semantics {
                    contentDescription = "Command ${displayCmd.take(80)}"
                    stateDescription = if (expanded) "$statusDescription, expanded" else "$statusDescription, collapsed"
                }
                .clickable(role = Role.Button) { expanded = !expanded }
                .padding(horizontal = 10.dp, vertical = 7.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            // Status dot
            Box(
                modifier = Modifier
                    .size(7.dp)
                    .background(dotColor, CircleShape),
            )

            // Terminal icon
            Icon(
                Icons.Default.Terminal,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(13.dp),
            )

            // Command — truncated, monospace
            Text(
                text = displayCmd.take(60),
                style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.weight(1f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )

            // "Awaiting input" indicator — command is blocked waiting for stdin.
            // Only shown while the command is still running (not done).
            if (call.needsInput && !call.done) {
                Icon(
                    Icons.Default.Keyboard,
                    contentDescription = "Awaiting input",
                    tint = aurora.warn,
                    modifier = Modifier.size(13.dp),
                )
                Text(
                    "input",
                    style = MaterialTheme.typography.labelSmall,
                    color = aurora.warn,
                )
            }

            // Status icon (done/failed only)
            if (call.done) {
                Icon(
                    if (call.failed) Icons.Default.Error else Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = dotColor,
                    modifier = Modifier.size(13.dp),
                )
            }
            Icon(
                if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                contentDescription = if (expanded) "Collapse" else "Expand",
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(14.dp),
            )
        }

        // Expanded terminal output
        AnimatedVisibility(
            visible = expanded,
            enter = expandVertically(),
            exit = shrinkVertically(),
        ) {
            val output = call.out.sanitizeForDisplay()
            if (output.isNotBlank()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(terminalBackground)
                        .padding(horizontal = 10.dp, vertical = 8.dp),
                ) {
                    Text(
                        text = "$ $displayCmd\n$output",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.sp,
                            lineHeight = 16.sp,
                        ),
                        color = terminalText,
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(terminalBackground)
                        .padding(horizontal = 10.dp, vertical = 8.dp),
                ) {
                    Text(
                        "$ $displayCmd",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.sp,
                        ),
                        color = terminalMutedText,
                    )
                }
            }
        }
    }
}

@Composable
fun McpToolCallRows(calls: ImmutableList<McpToolCallItem>, modifier: Modifier = Modifier) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(2.dp)) {
        calls.forEach { call -> McpToolCallRow(call) }
    }
}

@Composable
private fun McpToolCallRow(call: McpToolCallItem) {
    val aurora = LocalAuroraColors.current
    var expanded by remember(call.id) { mutableStateOf(false) }
    val dotColor = when (call.status) {
        "done" -> aurora.success
        "failed" -> aurora.error
        else -> aurora.accentViolet
    }
    val server = call.server.sanitizeForDisplay()
    val tool = call.tool.sanitizeForDisplay()
    val arguments = call.arguments.sanitizeForDisplay()
    val output = call.output.sanitizeForDisplay()
    val error = call.error?.sanitizeForDisplay()
    val statusDescription = when (call.status) {
        "done" -> "completed"
        "failed" -> "failed"
        else -> "running"
    }
    val terminalBackground = MaterialTheme.colorScheme.surface.copy(alpha = 0.96f)
    val terminalText = MaterialTheme.colorScheme.onSurface
    val terminalMutedText = MaterialTheme.colorScheme.onSurfaceVariant

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(6.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .semantics {
                    contentDescription = "MCP tool $server $tool"
                    stateDescription = if (expanded) "$statusDescription, expanded" else "$statusDescription, collapsed"
                }
                .clickable(role = Role.Button) { expanded = !expanded }
                .padding(horizontal = 10.dp, vertical = 7.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Box(modifier = Modifier.size(7.dp).background(dotColor, CircleShape))
            Icon(
                Icons.Default.Extension,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(13.dp),
            )
            Text(
                text = "$server: $tool",
                style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                modifier = Modifier.weight(1f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            when (call.status) {
                "done" -> Icon(Icons.Default.CheckCircle, null,
                    tint = aurora.success, modifier = Modifier.size(13.dp))
                "failed" -> Icon(Icons.Default.Error, null,
                    tint = aurora.error, modifier = Modifier.size(13.dp))
                else -> CircularProgressIndicator(
                    modifier = Modifier.size(12.dp), strokeWidth = 1.dp, color = aurora.accentViolet)
            }
            Icon(
                if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                contentDescription = if (expanded) "Collapse" else "Expand",
                modifier = Modifier.size(14.dp),
            )
        }

        AnimatedVisibility(visible = expanded, enter = expandVertically(), exit = shrinkVertically()) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(terminalBackground)
                    .padding(horizontal = 10.dp, vertical = 8.dp),
            ) {
                if (arguments.isNotBlank()) {
                    Text(
                        "args: ${arguments.take(300)}",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontFamily = FontFamily.Monospace, fontSize = 11.sp),
                        color = terminalMutedText,
                    )
                }
                if (output.isNotBlank()) {
                    Text(
                        output.take(500),
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontFamily = FontFamily.Monospace, fontSize = 11.sp, lineHeight = 16.sp),
                        color = terminalText,
                    )
                }
                error?.let {
                    Text(it, style = MaterialTheme.typography.labelSmall, color = aurora.error)
                }
            }
        }
    }
}
