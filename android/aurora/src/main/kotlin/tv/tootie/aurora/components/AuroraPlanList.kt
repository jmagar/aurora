package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * List of plan steps with status tracking. Maps to web AI `plan` element.
 *
 * @param tasks    Task entries. Use [ImmutableList] for Compose stability.
 * @param onToggle Called when the user toggles a task's completion state.
 * @param modifier Modifier applied to the outer [Surface].
 * @param title    Section heading displayed above the task list.
 */
@Composable
public fun AuroraPlanList(
    tasks: ImmutableList<AuroraTaskData>,
    onToggle: ((AuroraTaskData) -> Unit)? = null,
    modifier: Modifier = Modifier,
    title: String = "Plan",
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surface,
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 8.dp),
            )
            LazyColumn {
                items(tasks, key = { it.id }) { task ->
                    AuroraTaskItem(task = task, onToggle = onToggle)
                }
            }
        }
    }
}
