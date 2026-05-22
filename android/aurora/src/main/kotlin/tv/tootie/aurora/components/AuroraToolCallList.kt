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
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/** Execution state of a single tool invocation. */
public enum class AuroraToolCallStatus { Running, Done, Error }

/** Data model for one tool call in an agent trace. */
@Immutable
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
 * Each row shows an [AuroraStatusIndicator] dot, an inline [AuroraSnippet] with
 * the tool name, and a chevron. Tapping expands an [AuroraCodeBlock] for input
 * and output when available.
 *
 * **Accessibility:** each row's `contentDescription` is the tool name so TalkBack
 * focuses on identity. The `stateDescription` carries the execution status
 * ("Running", "Done", or "Error") per the spec — expansion state is conveyed by
 * `Role.Button` and the chevron icon.
 *
 * **Stability:** [calls] is typed as [ImmutableList] so Compose can skip
 * recomposition when the list reference is unchanged. Callers should wrap with
 * `toPersistentList()` from `kotlinx-collections-immutable`.
 *
 * @param calls Ordered list of tool call records to display.
 * @param modifier Modifier applied to the outer [Column].
 */
@Composable
public fun AuroraToolCallList(
    calls: ImmutableList<AuroraToolCall>,
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
            val statusLabel = when (call.status) {
                AuroraToolCallStatus.Running -> "Running"
                AuroraToolCallStatus.Done    -> "Done"
                AuroraToolCallStatus.Error   -> "Error"
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
                            .semantics {
                                contentDescription = call.name
                                stateDescription = statusLabel
                            }
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        // Merged into the row's semantics node above — dot is decorative
                        AuroraStatusIndicator(
                            tone = statusTone,
                            dotSize = 8.dp,
                        )
                        AuroraSnippet(
                            code = call.name,
                            modifier = Modifier.weight(1f),
                        )
                        Icon(
                            imageVector = if (expanded) Icons.Default.KeyboardArrowUp
                                          else Icons.Default.KeyboardArrowDown,
                            contentDescription = null, // announced via row stateDescription
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
