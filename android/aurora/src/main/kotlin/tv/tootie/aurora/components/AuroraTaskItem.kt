package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Checkbox
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/** Execution state of a task. */
public enum class AuroraTaskStatus { Pending, InProgress, Done, Blocked }

/**
 * Data model for a single task entry.
 *
 * @property id          Stable unique key.
 * @property title       Primary label shown in the row.
 * @property status      Current lifecycle state.
 * @property description Optional secondary text displayed beneath the title.
 * @property subTasks    Optional nested sub-tasks; each is announced with an indent depth prefix.
 */
@Immutable
public data class AuroraTaskData(
    val id: String,
    val title: String,
    val status: AuroraTaskStatus = AuroraTaskStatus.Pending,
    val description: String? = null,
    val subTasks: List<AuroraTaskData> = emptyList(),
)

/**
 * Single task row with status checkbox, badge, and optional sub-tasks.
 * Maps to web AI `task` element.
 *
 * Accessibility:
 * - The checkbox is exposed with [Role.Checkbox] + [toggleable] so TalkBack announces
 *   checked state correctly.
 * - The status badge is decorative (its text is already part of the merged
 *   [contentDescription] on the row).
 * - Sub-tasks are announced with "sub-task, level N" prefix in their descriptions.
 *
 * @param task     Task data to render.
 * @param onToggle Called when the user taps the checkbox to toggle completion. `null` disables interaction.
 * @param modifier Modifier applied to the outermost [Row].
 * @param depth    Nesting depth for sub-task indentation (internal use).
 */
@Composable
public fun AuroraTaskItem(
    task: AuroraTaskData,
    onToggle: ((AuroraTaskData) -> Unit)? = null,
    modifier: Modifier = Modifier,
    depth: Int = 0,
) {
    val aurora = LocalAuroraColors.current
    val isDone = task.status == AuroraTaskStatus.Done

    val (bgColor, fgColor, statusLabel) = when (task.status) {
        AuroraTaskStatus.Pending    -> Triple(aurora.neutralSurface, aurora.neutral, "Pending")
        AuroraTaskStatus.InProgress -> Triple(aurora.infoSurface, aurora.info, "Running")
        AuroraTaskStatus.Done       -> Triple(aurora.successSurface, aurora.success, "Done")
        AuroraTaskStatus.Blocked    -> Triple(aurora.errorSurface, aurora.error, "Blocked")
    }

    // Build an accessible description that includes task title + status.
    // Sub-tasks include depth prefix so TalkBack communicates hierarchy.
    val rowDescription = buildString {
        if (depth > 0) append("sub-task, level $depth, ")
        append(task.title)
        append(", $statusLabel")
        task.description?.let { append(", $it") }
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(start = (depth * 16).dp),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                // toggleable replaces plain clickable so Role.Checkbox is honoured by TalkBack
                .then(
                    if (onToggle != null) {
                        Modifier.toggleable(
                            value = isDone,
                            role = Role.Checkbox,
                            onValueChange = { onToggle(task) },
                        )
                    } else {
                        Modifier
                    }
                )
                .semantics(mergeDescendants = true) { contentDescription = rowDescription }
                .padding(vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            // Checkbox is decorative here — its role is carried by the parent toggleable.
            Checkbox(
                checked = isDone,
                onCheckedChange = null, // handled by parent toggleable
                enabled = onToggle != null,
            )
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (isDone) MaterialTheme.colorScheme.onSurfaceVariant
                            else MaterialTheme.colorScheme.onSurface,
                )
                task.description?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            // Badge is decorative — status is already in the row's contentDescription.
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .background(bgColor)
                    .padding(horizontal = 6.dp, vertical = 2.dp)
                    .semantics { contentDescription = "" },
            ) {
                Text(
                    text = statusLabel,
                    style = MaterialTheme.typography.labelSmall,
                    color = fgColor,
                )
            }
        }

        // Render sub-tasks with incremented depth for indent + a11y prefix.
        task.subTasks.forEach { sub ->
            AuroraTaskItem(
                task = sub,
                onToggle = onToggle,
                depth = depth + 1,
            )
        }
    }
}
