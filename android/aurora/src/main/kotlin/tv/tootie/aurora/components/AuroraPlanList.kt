package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.key
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * List of plan steps with status tracking.
 *
 * Maps to web AI `plan` element.
 *
 * Uses [ImmutableList] so the Compose compiler can skip this composable when
 * the list reference is stable. Each [AuroraTaskItem] is wrapped in a [key]
 * block keyed on [AuroraTaskData.id] to prevent spurious recomposition and
 * ensure correct identity tracking when items are added, removed, or reordered.
 *
 * A plain [Column] is used rather than [LazyColumn] because this component is
 * embedded inside a [Surface] whose own scroll context is bounded. A nested
 * [LazyColumn] with unconstrained height inside a [Column] causes a crash
 * ("Vertically scrollable component was measured with an infinity maximum height
 * constraints"). For long lists rendered outside a bounded container, prefer
 * lifting items into a [LazyColumn] at the call site.
 *
 * Note: per-item completion-state `contentDescription` on [AuroraTaskItem] is
 * tracked as a follow-up accessibility pass (AuroraTaskItem is out of scope
 * for this batch).
 *
 * @param tasks    Task entries as [ImmutableList] for Compose stability.
 * @param modifier Modifier applied to the outer [Surface].
 * @param title    Section heading displayed above the task list.
 * @param onToggle Called when the user toggles a task's completion state.
 */
@Composable
public fun AuroraPlanList(
    tasks: ImmutableList<AuroraTaskData>,
    modifier: Modifier = Modifier,
    title: String = "Plan",
    onToggle: ((AuroraTaskData) -> Unit)? = null,
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
            tasks.forEach { task ->
                key(task.id) {
                    AuroraTaskItem(task = task, onToggle = onToggle)
                }
            }
        }
    }
}
