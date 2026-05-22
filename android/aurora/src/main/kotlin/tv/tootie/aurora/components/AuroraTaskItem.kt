package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Checkbox
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraTaskStatus { Pending, InProgress, Done, Blocked }

public data class AuroraTaskData(
    val id: String,
    val title: String,
    val status: AuroraTaskStatus = AuroraTaskStatus.Pending,
    val description: String? = null,
)

/**
 * Single task row with status checkbox and badge. Maps to web AI `task` element.
 */
@Composable
public fun AuroraTaskItem(
    task: AuroraTaskData,
    onToggle: ((AuroraTaskData) -> Unit)? = null,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val isDone = task.status == AuroraTaskStatus.Done

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Checkbox(
            checked = isDone,
            onCheckedChange = { onToggle?.invoke(task) },
            enabled = onToggle != null,
        )
        Column(modifier = Modifier.weight(1f)) {
            Text(
                task.title,
                style = MaterialTheme.typography.bodyMedium,
                color = if (isDone) MaterialTheme.colorScheme.onSurfaceVariant
                        else MaterialTheme.colorScheme.onSurface,
            )
            task.description?.let {
                Text(
                    it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        val (bgColor, fgColor, label) = when (task.status) {
            AuroraTaskStatus.Pending    -> Triple(aurora.neutralSurface, aurora.neutral, "Pending")
            AuroraTaskStatus.InProgress -> Triple(aurora.infoSurface, aurora.info, "Running")
            AuroraTaskStatus.Done       -> Triple(aurora.successSurface, aurora.success, "Done")
            AuroraTaskStatus.Blocked    -> Triple(aurora.errorSurface, aurora.error, "Blocked")
        }
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(4.dp))
                .background(bgColor)
                .padding(horizontal = 6.dp, vertical = 2.dp),
        ) {
            Text(label, style = MaterialTheme.typography.labelSmall, color = fgColor)
        }
    }
}
