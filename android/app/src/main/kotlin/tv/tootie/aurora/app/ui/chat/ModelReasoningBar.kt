package tv.tootie.aurora.app.ui.chat

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Speed
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.components.AuroraDropdownMenu
import tv.tootie.aurora.components.AuroraMenuEntry
import tv.tootie.aurora.theme.LocalAuroraColors

data class ModelOption(
    val id: String,
    val displayName: String,
    val reasoningEfforts: List<ReasoningEffortOption> = emptyList(),
    val defaultEffort: String = "medium",
)

data class ReasoningEffortOption(val value: String, val description: String)

@Composable
fun ModelReasoningBar(
    selectedModel: String,
    selectedEffort: String,
    models: List<ModelOption>,
    onModelSelect: (String) -> Unit,
    onEffortSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    var modelMenuOpen by remember { mutableStateOf(false) }
    var effortMenuOpen by remember { mutableStateOf(false) }

    val currentModel = models.find { it.id == selectedModel }
    val availableEfforts = currentModel?.reasoningEfforts ?: emptyList()

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        // Model selector
        AuroraDropdownMenu(
            entries = models.map { m ->
                AuroraMenuEntry.Item(
                    label = m.displayName,
                    onClick = { onModelSelect(m.id) },
                )
            },
            expanded = modelMenuOpen,
            onDismissRequest = { modelMenuOpen = false },
            anchor = {
                Row(
                    modifier = Modifier
                        .clickable(role = Role.Button) { modelMenuOpen = true }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Icon(
                        Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = aurora.accentViolet,
                        modifier = Modifier.size(14.dp),
                    )
                    Text(
                        currentModel?.displayName ?: selectedModel,
                        style = MaterialTheme.typography.labelSmall,
                        color = aurora.accentViolet,
                    )
                    Icon(
                        Icons.Default.ExpandMore,
                        contentDescription = null,
                        tint = aurora.accentViolet,
                        modifier = Modifier.size(12.dp),
                    )
                }
            },
        )

        // Reasoning effort selector (only when model supports it)
        if (availableEfforts.isNotEmpty()) {
            AuroraDropdownMenu(
                entries = availableEfforts.map { e ->
                    AuroraMenuEntry.Item(
                        label = e.value.replaceFirstChar { it.uppercase() },
                        onClick = { onEffortSelect(e.value) },
                        trailingText = if (e.value == selectedEffort) "✓" else null,
                    )
                },
                expanded = effortMenuOpen,
                onDismissRequest = { effortMenuOpen = false },
                anchor = {
                    Row(
                        modifier = Modifier
                            .clickable(role = Role.Button) { effortMenuOpen = true }
                            .padding(horizontal = 8.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                    ) {
                        Icon(
                            Icons.Default.Speed,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(14.dp),
                        )
                        Text(
                            selectedEffort.replaceFirstChar { it.uppercase() },
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Icon(
                            Icons.Default.ExpandMore,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(12.dp),
                        )
                    }
                },
            )
        }
    }
}
