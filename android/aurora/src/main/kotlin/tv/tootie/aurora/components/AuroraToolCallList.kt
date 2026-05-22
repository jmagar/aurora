package tv.tootie.aurora.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/** Execution state of a single tool invocation. */
public enum class AuroraToolCallStatus { Running, Done, Error }

/** Data model for one tool call in an agent trace. */
public data class AuroraToolCall(
    val id: String,
    val name: String,
    val status: AuroraToolCallStatus,
    val input: String? = null,
    val output: String? = null,
)

/**
 * Expandable tool call trace list. Maps to web AI `tool-calls` block.
 *
 * Each row shows a [AuroraStatusIndicator] dot, an inline [AuroraSnippet] with
 * the tool name, and a chevron. Tapping expands an [AuroraCodeBlock] for input
 * and output when available.
 *
 * @param calls Ordered list of tool call records to display.
 * @param modifier Modifier applied to the outer [Column].
 */
@Composable
public fun AuroraToolCallList(
    calls: List<AuroraToolCall>,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        calls.forEach { call ->
            var expanded by remember(call.id) { mutableStateOf(false) }
            val statusTone = when (call.status) {
                AuroraToolCallStatus.Running -> AuroraStatusTone.Syncing
                AuroraToolCallStatus.Done    -> AuroraStatusTone.Online
                AuroraToolCallStatus.Error   -> AuroraStatusTone.Error
            }

            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.surfaceVariant,
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable(role = Role.Button) { expanded = !expanded }
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        AuroraStatusIndicator(tone = statusTone, dotSize = 8.dp)
                        AuroraSnippet(
                            code = call.name,
                            modifier = Modifier.weight(1f),
                        )
                        Icon(
                            imageVector = if (expanded) Icons.Default.KeyboardArrowUp
                                          else Icons.Default.KeyboardArrowDown,
                            contentDescription = if (expanded) "Collapse" else "Expand",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }

                    AnimatedVisibility(
                        visible = expanded,
                        enter = expandVertically(),
                        exit = shrinkVertically(),
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                        ) {
                            call.input?.let { input ->
                                Text(
                                    text = "Input",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                                AuroraCodeBlock(code = input, language = "json")
                            }
                            call.output?.let { output ->
                                Text(
                                    text = "Output",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                                AuroraCodeBlock(code = output, language = "json")
                            }
                        }
                    }
                }
            }
        }
    }
}
