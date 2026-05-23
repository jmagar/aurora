package tv.tootie.aurora.app.ui.chat

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import tv.tootie.aurora.theme.LocalAuroraColors

/** Structured item produced when the user confirms a @mention or /command selection. */
sealed class SelectedItem {
    /** A skill invocation — maps to UserInput {type:"skill", name, path} */
    data class Skill(val name: String, val path: String) : SelectedItem()
    /** A @mention — maps to UserInput {type:"mention", name, path} */
    data class Mention(val name: String, val path: String) : SelectedItem()
    /** A /slash-command — maps to UserInput {type:"command", name, path} */
    data class Command(val name: String, val path: String) : SelectedItem()
}

enum class MentionKind { Skill, Command }

data class MentionItem(
    val trigger: String,
    val label: String,
    val description: String? = null,
    val kind: MentionKind = MentionKind.Command,
    val path: String? = null,
)

private val kindIcon: Map<MentionKind, ImageVector> = mapOf(
    MentionKind.Skill to Icons.Default.AutoAwesome,
    MentionKind.Command to Icons.Default.Terminal,
)

@Composable
private fun kindColor(kind: MentionKind): Color {
    val aurora = LocalAuroraColors.current
    return when (kind) {
        MentionKind.Skill -> aurora.accentViolet  // skills/tools stay violet
        MentionKind.Command -> aurora.accentPink  // slash commands use pink accent
    }
}

@Composable
fun MentionSuggestionList(
    items: List<MentionItem>,
    query: String,
    onSelect: (MentionItem, SelectedItem) -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    val filtered = items
        .filter { query.isEmpty() || it.trigger.contains(query, ignoreCase = true) || it.label.contains(query, ignoreCase = true) }
        .take(8)

    if (filtered.isEmpty()) return

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, MaterialTheme.shapes.medium),
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surfaceVariant,
        shadowElevation = 6.dp,
    ) {
        LazyColumn(modifier = Modifier.heightIn(max = 280.dp)) {
            val byKind = filtered.groupBy { it.kind }
            byKind.forEach { (kind, kindItems) ->
                if (byKind.size > 1) {
                    item(key = "hdr_$kind") {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 10.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                        ) {
                            kindIcon[kind]?.let { icon ->
                                Icon(
                                    icon,
                                    contentDescription = null,
                                    tint = kindColor(kind),
                                    modifier = Modifier.size(12.dp),
                                )
                            }
                            Text(
                                kind.name.lowercase().replaceFirstChar { it.uppercase() } + "s",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
                items(kindItems, key = { it.trigger }) { item ->
                    MentionRow(item = item, onSelect = onSelect)
                    if (kindItems.last() != item || byKind.entries.last().key != kind) {
                        HorizontalDivider(thickness = 0.5.dp, color = aurora.borderDefault)
                    }
                }
            }
        }
    }
}

@Composable
private fun MentionRow(item: MentionItem, onSelect: (MentionItem, SelectedItem) -> Unit) {
    val haptics = LocalHapticFeedback.current
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(role = Role.Button) {
                // Bead 01xq: light haptic on mention/command selection
                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                val structured: SelectedItem = when (item.kind) {
                    MentionKind.Skill -> SelectedItem.Skill(
                        name = item.trigger.removePrefix("@"),
                        path = item.path ?: item.trigger.removePrefix("@"),
                    )
                    MentionKind.Command -> SelectedItem.Command(
                        name = item.trigger.removePrefix("/"),
                        path = item.trigger.removePrefix("/"),
                    )
                }
                onSelect(item, structured)
            }
            .padding(horizontal = 12.dp, vertical = 9.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        val icon = kindIcon[item.kind]
        if (icon != null) {
            Icon(
                icon,
                contentDescription = null,
                tint = kindColor(item.kind),
                modifier = Modifier.size(15.dp),
            )
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(
                item.trigger,
                style = MaterialTheme.typography.labelMedium.copy(fontFamily = FontFamily.Monospace),
                color = kindColor(item.kind),
                fontSize = 12.sp,
            )
            item.description?.let {
                Text(
                    it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    fontSize = 11.sp,
                )
            }
        }
    }
}
