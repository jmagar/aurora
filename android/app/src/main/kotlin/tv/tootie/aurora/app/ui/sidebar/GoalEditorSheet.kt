package tv.tootie.aurora.app.ui.sidebar

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.BottomSheetDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.components.AuroraButton
import tv.tootie.aurora.components.AuroraButtonVariant
import tv.tootie.aurora.components.AuroraTextField

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GoalEditorSheet(
    currentGoal: ThreadGoal?,
    onSetGoal: (String) -> Unit,
    onClearGoal: () -> Unit,
    onDismiss: () -> Unit,
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var text by remember(currentGoal) { mutableStateOf(currentGoal?.objective ?: "") }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        dragHandle = { BottomSheetDefaults.DragHandle() },
    ) {
        Column(modifier = Modifier.padding(horizontal = 16.dp).padding(bottom = 32.dp)) {
            Text("Set session goal", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "Goals guide the agent across turns. Max 4000 characters.",
                style = MaterialTheme.typography.bodySmall,
            )
            Spacer(modifier = Modifier.height(12.dp))
            AuroraTextField(
                value = text,
                onValueChange = { if (it.length <= 4000) text = it },
                placeholder = "e.g. Refactor the auth module to use JWT tokens",
                modifier = Modifier.fillMaxWidth().heightIn(min = 80.dp),
                singleLine = false,
            )
            Text(
                "${text.length}/4000",
                style = MaterialTheme.typography.labelSmall,
            )
            Spacer(modifier = Modifier.height(12.dp))
            AuroraButton(
                onClick = {
                    val t = text.trim()
                    if (t.isNotEmpty()) onSetGoal(t)
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Set goal")
            }
            if (currentGoal != null) {
                Spacer(modifier = Modifier.height(8.dp))
                AuroraButton(
                    onClick = { onClearGoal(); onDismiss() },
                    modifier = Modifier.fillMaxWidth(),
                    variant = AuroraButtonVariant.Destructive,
                ) {
                    Text("Clear goal")
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            AuroraButton(
                onClick = onDismiss,
                modifier = Modifier.fillMaxWidth(),
                variant = AuroraButtonVariant.Ghost,
            ) {
                Text("Cancel")
            }
        }
    }
}
