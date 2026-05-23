package tv.tootie.aurora.app.ui.sidebar

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
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
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

@Composable
fun McpServerPanel(servers: List<McpServerInfo>, modifier: Modifier = Modifier) {
    if (servers.isEmpty()) return
    var expanded by remember { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxWidth().padding(horizontal = 12.dp)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = !expanded }
                .padding(vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                "MCP Servers",
                style = MaterialTheme.typography.labelMedium,
                modifier = Modifier.weight(1f),
            )
            Text("${servers.size}", style = MaterialTheme.typography.labelSmall)
            Spacer(modifier = Modifier.width(4.dp))
            Icon(
                if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
            )
        }

        AnimatedVisibility(visible = expanded) {
            Column {
                servers.forEach { server ->
                    McpServerRow(server = server)
                }
            }
        }
    }
}

@Composable
private fun McpServerRow(server: McpServerInfo) {
    val aurora = LocalAuroraColors.current
    var expanded by remember(server.name) { mutableStateOf(false) }
    val dotColor = when (server.status) {
        "running" -> aurora.success
        "error", "failed" -> aurora.error
        else -> MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { expanded = !expanded }
            .padding(vertical = 4.dp, horizontal = 8.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(6.dp).background(dotColor, CircleShape))
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                server.name,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.weight(1f),
                maxLines = 1,
            )
            if (server.toolCount > 0) {
                Text("${server.toolCount} tools", style = MaterialTheme.typography.labelSmall)
            }
        }
        // AnimatedVisibility — no outer if() guard to allow exit animation
        AnimatedVisibility(
            visible = expanded && server.tools.isNotEmpty(),
            enter = expandVertically(),
            exit = shrinkVertically(),
        ) {
            Column(modifier = Modifier.padding(start = 14.dp, top = 4.dp)) {
                server.tools.take(10).forEach { tool ->
                    Text(
                        "• ${tool.name}",
                        style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.padding(vertical = 1.dp),
                    )
                }
                if (server.tools.size > 10) {
                    Text(
                        "…and ${server.tools.size - 10} more",
                        style = MaterialTheme.typography.labelSmall,
                    )
                }
            }
        }
    }
}
