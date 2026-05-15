package tv.tootie.aurora.components

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Compose equivalent of Aurora's Dialog shadcn component.
 * Caller controls visibility: `if (showDialog) AuroraDialog(...)`
 *
 * Note: AlertDialog creates a new composition subtree (Popup). LocalAuroraColors
 * is re-provided inside so child composables can access Aurora extra tokens.
 */
@Composable
fun AuroraDialog(
    onDismiss: () -> Unit,
    title: String,
    body: String,
    confirmLabel: String = "Confirm",
    dismissLabel: String = "Cancel",
    onConfirm: () -> Unit,
    isDestructive: Boolean = false,
    modifier: Modifier = Modifier,
) {
    val auroraColors = LocalAuroraColors.current

    AlertDialog(
        onDismissRequest = onDismiss,
        modifier = modifier,
        title = { Text(title) },
        text = {
            // Re-provide LocalAuroraColors inside Popup subtree
            CompositionLocalProvider(LocalAuroraColors provides auroraColors) {
                Text(body)
            }
        },
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
