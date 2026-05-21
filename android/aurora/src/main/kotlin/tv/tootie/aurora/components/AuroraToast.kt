package tv.tootie.aurora.components

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Snackbar
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import tv.tootie.aurora.theme.LocalAuroraColors

/** Visual variant for AuroraToast — maps to Aurora status-family token colors */
enum class AuroraToastVariant { Default, Success, Error, Warn, Info }

/**
 * State for AuroraToast. Always construct via rememberAuroraToastState().
 *
 * WARNING: Do NOT construct AuroraToastState() directly outside remember{}.
 * The pending toast queue is backed by SnackbarHostState which will be lost
 * on parent recomposition if not wrapped in remember{}.
 */
class AuroraToastState(internal val snackbarHostState: SnackbarHostState = SnackbarHostState()) {
    suspend fun showToast(
        message: String,
        variant: AuroraToastVariant = AuroraToastVariant.Default,
        actionLabel: String? = null,
        duration: SnackbarDuration = SnackbarDuration.Short,
    ) {
        // Store variant in actionLabel prefix to pass through SnackbarHostState.
        // AuroraToastHost renders snackbar content manually so the encoded variant
        // never appears as an action label.
        val labelWithVariant = actionLabel?.let { "${variant.name}:$it" } ?: variant.name
        snackbarHostState.showSnackbar(
            message = message,
            actionLabel = labelWithVariant,
            duration = duration,
        )
    }
}

@Composable
fun rememberAuroraToastState(): AuroraToastState {
    return remember { AuroraToastState() }
}

/**
 * Place inside Scaffold's snackbarHost slot:
 * ```
 * Scaffold(snackbarHost = { AuroraToastHost(toastState) }) { ... }
 * ```
 */
@Composable
fun AuroraToastHost(toastState: AuroraToastState) {
    val auroraColors = LocalAuroraColors.current

    SnackbarHost(hostState = toastState.snackbarHostState) { data ->
        val rawLabel = data.visuals.actionLabel ?: AuroraToastVariant.Default.name
        val variant = runCatching {
            AuroraToastVariant.valueOf(rawLabel.substringBefore(':'))
        }.getOrDefault(AuroraToastVariant.Default)
        val userLabel = rawLabel.substringAfter(':', "").ifEmpty { null }

        val containerColor: Color = when (variant) {
            AuroraToastVariant.Success -> auroraColors.successSurface
            AuroraToastVariant.Error   -> auroraColors.errorSurface
            AuroraToastVariant.Warn    -> auroraColors.warnSurface
            AuroraToastVariant.Info    -> auroraColors.infoSurface
            AuroraToastVariant.Default -> MaterialTheme.colorScheme.surfaceVariant
        }
        val contentColor: Color = when (variant) {
            AuroraToastVariant.Success -> auroraColors.successForeground
            AuroraToastVariant.Error   -> auroraColors.errorForeground
            AuroraToastVariant.Warn    -> auroraColors.warnForeground
            AuroraToastVariant.Info    -> auroraColors.infoForeground
            AuroraToastVariant.Default -> MaterialTheme.colorScheme.onSurfaceVariant
        }
        val actionContent: (@Composable () -> Unit)? = userLabel?.let { label ->
            {
                TextButton(onClick = { data.performAction() }) {
                    Text(label)
                }
            }
        }

        Snackbar(
            containerColor = containerColor,
            contentColor = contentColor,
            actionContentColor = contentColor,
            action = actionContent,
        ) {
            Text(data.visuals.message)
        }
    }
}
