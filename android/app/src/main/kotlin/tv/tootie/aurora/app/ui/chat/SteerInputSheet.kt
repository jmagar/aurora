package tv.tootie.aurora.app.ui.chat

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
fun SteerInputSheet(
    onSteer: (String) -> Unit,
    onDismiss: () -> Unit,
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var text by remember { mutableStateOf("") }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        dragHandle = { BottomSheetDefaults.DragHandle() },
    ) {
        Column(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .padding(bottom = 32.dp),
        ) {
            Text("Steer the agent", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(12.dp))
            AuroraTextField(
                value = text,
                onValueChange = { text = it },
                placeholder = "Guide the agent in a new direction...",
                modifier = Modifier.fillMaxWidth(),
                singleLine = false,
            )
            Spacer(modifier = Modifier.height(12.dp))
            AuroraButton(
                onClick = {
                    val t = text.trim()
                    if (t.isNotEmpty()) onSteer(t)
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Send steer")
            }
            Spacer(modifier = Modifier.height(8.dp))
            AuroraButton(
                onClick = onDismiss,
                variant = AuroraButtonVariant.Ghost,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Cancel")
            }
        }
    }
}
