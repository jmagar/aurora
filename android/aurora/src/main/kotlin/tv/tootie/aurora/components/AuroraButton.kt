package tv.tootie.aurora.components

import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/** Compose equivalent of Aurora's Button shadcn component */
sealed class AuroraButtonVariant {
    object Filled : AuroraButtonVariant()
    object Outlined : AuroraButtonVariant()
    object Ghost : AuroraButtonVariant()
    object Destructive : AuroraButtonVariant()
}

@Composable
fun AuroraButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: AuroraButtonVariant = AuroraButtonVariant.Filled,
    enabled: Boolean = true,
    content: @Composable () -> Unit,
) {
    when (variant) {
        is AuroraButtonVariant.Destructive -> {
            Button(
                onClick = onClick,
                modifier = modifier,
                enabled = enabled,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error,
                    contentColor = MaterialTheme.colorScheme.onError,
                ),
                content = content,
            )
        }
        is AuroraButtonVariant.Filled -> Button(
            onClick = onClick,
            modifier = modifier,
            enabled = enabled,
            content = content,
        )
        is AuroraButtonVariant.Outlined -> OutlinedButton(
            onClick = onClick,
            modifier = modifier,
            enabled = enabled,
            content = content,
        )
        is AuroraButtonVariant.Ghost -> TextButton(
            onClick = onClick,
            modifier = modifier,
            enabled = enabled,
            content = content,
        )
    }
}
