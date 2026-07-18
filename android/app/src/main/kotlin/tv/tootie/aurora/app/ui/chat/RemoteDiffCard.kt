package tv.tootie.aurora.app.ui.chat

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.filled.ExpandLess
import tv.tootie.aurora.icons.filled.ExpandMore
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Collapsible card showing the unified diff from `gitDiffToRemote`.
 *
 * - Empty [diff] string → shows "No local changes vs remote" message.
 * - Non-empty [diff] → shows line count badge and collapsible diff body with
 *   added lines tinted success-green and removed lines tinted error-rose.
 */
@Composable
fun RemoteDiffCard(diff: String, modifier: Modifier = Modifier) {
    val aurora = LocalAuroraColors.current
    var expanded by remember { mutableStateOf(false) }
    val lines = diff.lines()
    val addedCount = lines.count { it.startsWith("+") && !it.startsWith("+++") }
    val removedCount = lines.count { it.startsWith("-") && !it.startsWith("---") }

    Surface(
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
        modifier = modifier.fillMaxWidth(),
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Header row — always visible
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { if (diff.isNotEmpty()) expanded = !expanded }
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    "Changes vs remote",
                    style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier.weight(1f),
                )
                if (diff.isEmpty()) {
                    Text(
                        "up to date",
                        style = MaterialTheme.typography.labelSmall,
                        color = aurora.success,
                    )
                } else {
                    if (addedCount > 0) {
                        Text(
                            "+$addedCount",
                            style = MaterialTheme.typography.labelSmall,
                            color = aurora.success,
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                    }
                    if (removedCount > 0) {
                        Text(
                            "-$removedCount",
                            style = MaterialTheme.typography.labelSmall,
                            color = aurora.error,
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                    }
                    Icon(
                        if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                        contentDescription = if (expanded) "Collapse diff" else "Expand diff",
                        modifier = Modifier.size(16.dp),
                    )
                }
            }

            // Diff body — collapsible, horizontally scrollable for long lines
            AnimatedVisibility(
                visible = expanded && diff.isNotEmpty(),
                enter = expandVertically(),
                exit = shrinkVertically(),
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                        .padding(bottom = 8.dp),
                ) {
                    lines.forEach { line ->
                        val bgColor = when {
                            line.startsWith("+") && !line.startsWith("+++") ->
                                aurora.success.copy(alpha = 0.10f)
                            line.startsWith("-") && !line.startsWith("---") ->
                                aurora.error.copy(alpha = 0.10f)
                            line.startsWith("@@") -> aurora.accentViolet.copy(alpha = 0.08f)
                            else -> Color.Transparent
                        }
                        val textColor = when {
                            line.startsWith("+") && !line.startsWith("+++") -> aurora.success
                            line.startsWith("-") && !line.startsWith("---") -> aurora.error
                            line.startsWith("@@") -> aurora.accentViolet
                            else -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                        }
                        Text(
                            text = line,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.sp,
                            lineHeight = 16.sp,
                            color = textColor,
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(bgColor)
                                .padding(horizontal = 12.dp, vertical = 1.dp),
                        )
                    }
                }
            }
        }
    }
}
