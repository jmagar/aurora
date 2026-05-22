package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/** Compose equivalent of Aurora's Button shadcn component */
public sealed class AuroraButtonVariant {
    public data object Filled : AuroraButtonVariant()
    public data object Outlined : AuroraButtonVariant()
    public data object Ghost : AuroraButtonVariant()
    public data object Destructive : AuroraButtonVariant()
}

@Composable
public fun AuroraButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: AuroraButtonVariant = AuroraButtonVariant.Filled,
    enabled: Boolean = true,
    loading: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val effectiveEnabled = enabled && !loading

    val resolvedContent: @Composable () -> Unit = {
        if (loading) {
            AuroraSpinner(contentDescription = "Loading", size = 18.dp)
        } else {
            if (leadingIcon != null) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    leadingIcon()
                    Spacer(Modifier.width(8.dp))
                    content()
                }
            } else {
                content()
            }
        }
    }

    when (variant) {
        is AuroraButtonVariant.Destructive -> {
            Button(
                onClick = onClick,
                modifier = modifier,
                enabled = effectiveEnabled,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error,
                    contentColor = MaterialTheme.colorScheme.onError,
                ),
                content = { resolvedContent() },
            )
        }
        is AuroraButtonVariant.Filled -> Button(
            onClick = onClick,
            modifier = modifier,
            enabled = effectiveEnabled,
            content = { resolvedContent() },
        )
        is AuroraButtonVariant.Outlined -> OutlinedButton(
            onClick = onClick,
            modifier = modifier,
            enabled = effectiveEnabled,
            content = { resolvedContent() },
        )
        is AuroraButtonVariant.Ghost -> TextButton(
            onClick = onClick,
            modifier = modifier,
            enabled = effectiveEnabled,
            content = { resolvedContent() },
        )
    }
}
