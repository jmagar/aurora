package tv.tootie.aurora.components

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Permission request / confirmation dialog.
 * Maps to web `permission-prompt` and `confirmation` blocks.
 * Use [destructive] = true for delete/revoke confirmations.
 */
@Composable
public fun AuroraPermissionPrompt(
    onDismissRequest: () -> Unit,
    title: String,
    description: String,
    onAllow: () -> Unit,
    modifier: Modifier = Modifier,
    allowLabel: String = "Allow",
    denyLabel: String = "Deny",
    onDeny: () -> Unit = onDismissRequest,
    destructive: Boolean = false,
    icon: (@Composable () -> Unit)? = null,
) {
    AlertDialog(
        onDismissRequest = onDismissRequest,
        icon = icon,
        title = { Text(title) },
        text = { Text(description) },
        confirmButton = {
            TextButton(onClick = { onAllow(); onDismissRequest() }) {
                Text(allowLabel)
            }
        },
        dismissButton = {
            TextButton(onClick = { onDeny(); onDismissRequest() }) {
                Text(denyLabel)
            }
        },
        modifier = modifier,
    )
}
