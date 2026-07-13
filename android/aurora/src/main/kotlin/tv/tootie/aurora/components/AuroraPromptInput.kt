package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Main agent prompt input with send button. Maps to web AI `prompt-input`.
 * Dark operator-console aesthetic: deep surface, Axon-orange active indicator.
 *
 * Accessibility:
 * - The text field carries `contentDescription = "Message input"` so TalkBack
 *   announces it correctly when the placeholder is not visible.
 * - The send button announces its disabled state explicitly.
 * - IME send action triggers [onSend] so users can submit without touching the button.
 *
 * @param value              Current input text.
 * @param onValueChange      Called on every keystroke.
 * @param onSend             Called when the user presses the send button or the IME send action.
 * @param modifier           Applied to the root [Surface].
 * @param placeholder        Hint text shown when [value] is empty.
 * @param enabled            When false the field and button are both non-interactive.
 * @param loading            When true a spinner replaces the send icon and submission is blocked.
 * @param hasSendableContent True when the current composer state can be submitted.
 * @param primaryActionEnabled Whether the trailing primary action can run. Defaults to normal send gating,
 *                             but callers may keep it enabled for stop/cancel actions while the input is disabled.
 * @param primaryActionContent Optional content for the trailing primary action. Receives [loading].
 * @param leadingContent     Optional composable rendered above the input row (e.g. attachment chips).
 * @param inlineLeadingContent Optional composable rendered inline before the text field.
 * @param actionLeft         Optional composable rendered inline between the text field and the
 *                           send button — use for a secondary action that sits "to the left of
 *                           Send" (e.g. a mode-options cog, attachment picker, voice trigger).
 * @param trailingContent    Optional composable rendered after the send button.
 * @param compact            Reduces padding and send button visuals while preserving 48 dp target.
 * @param minLines           Minimum visible composer lines.
 * @param maxLines           Maximum visible composer lines.
 */
@Composable
public fun AuroraPromptInput(
    value: String,
    onValueChange: (String) -> Unit,
    onSend: () -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Message…",
    enabled: Boolean = true,
    loading: Boolean = false,
    hasSendableContent: Boolean = value.isNotBlank(),
    primaryActionEnabled: Boolean = hasSendableContent && enabled && !loading,
    primaryActionContent: (@Composable (Boolean) -> Unit)? = null,
    leadingContent: (@Composable () -> Unit)? = null,
    inlineLeadingContent: (@Composable () -> Unit)? = null,
    actionLeft: (@Composable () -> Unit)? = null,
    trailingContent: (@Composable () -> Unit)? = null,
    compact: Boolean = false,
    minLines: Int = 1,
    maxLines: Int = 6,
    textFieldContentDescription: String = "Message input",
    sendContentDescription: String = "Send message",
) {
    val aurora = LocalAuroraColors.current
    val haptics = LocalHapticFeedback.current
    val sendButtonDescription = if (primaryActionEnabled) sendContentDescription else "$sendContentDescription, disabled"
    val inputPadding = if (compact) 8.dp else 12.dp
    val sendButtonSize = if (compact) AuroraIconButtonSize.Compact else AuroraIconButtonSize.Default

    // Bead 01xq: HapticFeedbackType.Reject was added in androidx.compose.ui 1.7 /
    // platform API 34. Resolve via reflection so we degrade gracefully on
    // older Compose runtimes without a compile-time dependency on the constant.
    fun rejectOrLongPress(): HapticFeedbackType = try {
        val f = HapticFeedbackType::class.java.getField("Reject")
        f.get(null) as HapticFeedbackType
    } catch (_: Throwable) {
        HapticFeedbackType.LongPress
    }

    fun triggerSend() {
        if (primaryActionEnabled) {
            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
            onSend()
        } else if (loading) {
            // Send-while-thinking: rejection feedback.
            haptics.performHapticFeedback(rejectOrLongPress())
        }
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(
                1.dp,
                if (value.isNotBlank()) aurora.accentPinkBorder else aurora.borderDefault,
                RoundedCornerShape(12.dp),
            ),
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surface,
    ) {
        Column(modifier = Modifier.padding(inputPadding)) {
            leadingContent?.invoke()
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                inlineLeadingContent?.invoke()
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    enabled = enabled,
                    modifier = Modifier
                        .weight(1f)
                        .semantics { contentDescription = textFieldContentDescription },
                    textStyle = MaterialTheme.typography.bodyMedium.copy(
                        color = MaterialTheme.colorScheme.onSurface,
                    ),
                    cursorBrush = SolidColor(aurora.accentPink),
                    minLines = minLines,
                    maxLines = maxLines,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = { triggerSend() }),
                    decorationBox = { inner ->
                        Box {
                            if (value.isEmpty()) {
                                Text(
                                    placeholder,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    style = MaterialTheme.typography.bodyMedium,
                                )
                            }
                            inner()
                        }
                    },
                )
                actionLeft?.invoke()
                AuroraIconButton(
                    // Keep loading taps available for reject haptics unless the caller
                    // explicitly turns the primary action into a stop/cancel button.
                    onClick = { triggerSend() },
                    enabled = primaryActionEnabled || loading,
                    contentDescription = sendButtonDescription,
                    variant = AuroraIconButtonVariant.Filled,
                    size = sendButtonSize,
                ) {
                    if (primaryActionContent != null) {
                        primaryActionContent(loading)
                    } else if (loading) {
                        AuroraSpinner(contentDescription = "Sending", size = 18.dp)
                    } else {
                        Icon(
                            Icons.AutoMirrored.Filled.Send,
                            // Null here — the button-level semantics above own the description.
                            contentDescription = null,
                        )
                    }
                }
                trailingContent?.invoke()
            }
        }
    }
}
