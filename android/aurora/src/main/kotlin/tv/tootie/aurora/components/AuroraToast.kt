package tv.tootie.aurora.components

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Snackbar
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarVisuals
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import tv.tootie.aurora.theme.LocalAuroraColors

/** Visual variant for AuroraToast — maps to Aurora status-family token colors */
public enum class AuroraToastVariant { Default, Success, Error, Warn, Info }

/**
 * Custom [SnackbarVisuals] that carries an [AuroraToastVariant] alongside the
 * standard Snackbar fields.
 *
 * Callers may construct this directly when they need finer control, e.g. to
 * pre-build visuals outside a composable scope. The typical path is via
 * [AuroraToastState.showToast].
 */
public class AuroraSnackbarVisuals(
    override val message: String,
    public val variant: AuroraToastVariant = AuroraToastVariant.Default,
    override val actionLabel: String? = null,
    override val withDismissAction: Boolean = false,
    override val duration: SnackbarDuration = SnackbarDuration.Short,
) : SnackbarVisuals

/**
 * State for AuroraToast. Always construct via [rememberAuroraToastState].
 *
 * WARNING: Do NOT construct [AuroraToastState] directly outside `remember {}`.
 * The pending toast queue is backed by [SnackbarHostState] which will be lost
 * on parent recomposition if not wrapped in `remember {}`.
 */
public class AuroraToastState(internal val snackbarHostState: SnackbarHostState = SnackbarHostState()) {
    public suspend fun showToast(
        message: String,
        variant: AuroraToastVariant = AuroraToastVariant.Default,
        actionLabel: String? = null,
        duration: SnackbarDuration = SnackbarDuration.Short,
    ) {
        snackbarHostState.showSnackbar(
            AuroraSnackbarVisuals(
                message = message,
                variant = variant,
                actionLabel = actionLabel,
                duration = duration,
            )
        )
    }
}

@Composable
public fun rememberAuroraToastState(): AuroraToastState {
    return remember { AuroraToastState() }
}

/**
 * Place inside Scaffold's snackbarHost slot:
 * ```
 * Scaffold(snackbarHost = { AuroraToastHost(toastState) }) { ... }
 * ```
 */
@Composable
public fun AuroraToastHost(toastState: AuroraToastState) {
    val auroraColors = LocalAuroraColors.current

    SnackbarHost(hostState = toastState.snackbarHostState) { data ->
        val variant = (data.visuals as? AuroraSnackbarVisuals)?.variant
            ?: AuroraToastVariant.Default
        val userLabel = data.visuals.actionLabel

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
