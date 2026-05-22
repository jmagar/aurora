package tv.tootie.aurora.components

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ButtonDefaults
import androidx.compose.ui.window.DialogProperties
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Compose equivalent of Aurora's Dialog shadcn component.
 * Caller controls visibility: `if (showDialog) AuroraDialog(...)`
 *
 * @param onDismiss Called when the dialog is dismissed (back press, outside click when allowed).
 * @param onConfirm Called when the confirm button is pressed, before onDismiss.
 * @param title Dialog heading text.
 * @param body Dialog body text.
 * @param modifier Modifier applied to the [AlertDialog].
 * @param confirmLabel Label for the confirm button. Defaults to "Confirm".
 * @param dismissLabel Label for the dismiss button. Defaults to "Cancel".
 * @param isDestructive When true, the confirm button is rendered in [MaterialTheme.colorScheme.error].
 * @param properties [DialogProperties] forwarded to [AlertDialog]. Use [DialogProperties.dismissOnClickOutside]
 *   set to `false` for destructive confirmation flows.
 */
@Composable
public fun AuroraDialog(
    onDismiss: () -> Unit,
    onConfirm: () -> Unit,
    title: String,
    body: String,
    modifier: Modifier = Modifier,
    confirmLabel: String = "Confirm",
    dismissLabel: String = "Cancel",
    isDestructive: Boolean = false,
    properties: DialogProperties = DialogProperties(),
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        modifier = modifier,
        properties = properties,
        title = { Text(title) },
        text = { Text(body) },
        confirmButton = {
            if (isDestructive) {
                TextButton(
                    onClick = { onConfirm(); onDismiss() },
                    colors = ButtonDefaults.textButtonColors(
                        contentColor = MaterialTheme.colorScheme.error,
                    ),
                ) { Text(confirmLabel) }
            } else {
                TextButton(onClick = { onConfirm(); onDismiss() }) { Text(confirmLabel) }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text(dismissLabel) }
        },
    )
}
