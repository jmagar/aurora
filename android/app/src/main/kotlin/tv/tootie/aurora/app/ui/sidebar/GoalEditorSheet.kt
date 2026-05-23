package tv.tootie.aurora.app.ui.sidebar

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GoalEditorSheet(
    currentGoal: ThreadGoal?,
    onSetGoal: (String) -> Unit,
    onClearGoal: () -> Unit,
    onDismiss: () -> Unit,
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    // remember(Unit) — text does NOT reset when server pushes a goal update while editing
    var text by remember(Unit) { mutableStateOf(currentGoal?.objective ?: "") }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
    ) {
        Column(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .padding(bottom = 32.dp),
        ) {
            Text("Set session goal", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "Goals guide the agent across turns. Max 4000 characters.",
                style = MaterialTheme.typography.bodySmall,
            )
            Spacer(modifier = Modifier.height(12.dp))
            OutlinedTextField(
                value = text,
                onValueChange = { if (it.length <= 4000) text = it },
                placeholder = { Text("e.g. Refactor the auth module to use JWT") },
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 80.dp),
                minLines = 3,
            )
            Text(
                "${text.length}/4000",
                style = MaterialTheme.typography.labelSmall,
            )
            Spacer(modifier = Modifier.height(12.dp))
            val trimmed = text.trim()
            Button(
                onClick = { if (trimmed.isNotEmpty()) onSetGoal(trimmed) },
                enabled = trimmed.isNotEmpty(),
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Set goal") }
            if (currentGoal != null) {
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = { onClearGoal(); onDismiss() },
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("Clear goal") }
            }
            Spacer(modifier = Modifier.height(8.dp))
            TextButton(onClick = onDismiss, modifier = Modifier.fillMaxWidth()) {
                Text("Cancel")
            }
        }
    }
}
