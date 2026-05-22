package tv.tootie.aurora.components

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.window.DialogProperties

/**
 * Aurora-themed AlertDialog.
 *
 * [destructive] tints the confirm button with the error color for
 * delete/irreversible-action confirmations.
 */
@Composable
public fun AuroraAlertDialog(
    onDismissRequest: () -> Unit,
    title: String,
    confirmLabel: String = "Confirm",
    dismissLabel: String = "Cancel",
    onConfirm: () -> Unit,
    modifier: Modifier = Modifier,
    description: String? = null,
    onDismiss: () -> Unit = onDismissRequest,
    destructive: Boolean = false,
    properties: DialogProperties = DialogProperties(),
) {
    AlertDialog(
        onDismissRequest = onDismissRequest,
        title = { Text(title) },
        text = description?.let { { Text(it) } },
        confirmButton = {
            TextButton(onClick = { onConfirm(); onDismissRequest() }) {
                Text(
                    confirmLabel,
                    color = if (destructive) MaterialTheme.colorScheme.error
                            else MaterialTheme.colorScheme.primary,
                )
            }
        },
        dismissButton = {
            TextButton(onClick = { onDismiss(); onDismissRequest() }) {
                Text(dismissLabel)
            }
        },
        modifier = modifier,
        properties = properties,
    )
}
