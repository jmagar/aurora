package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Main agent prompt input with send button. Maps to web AI `prompt-input`.
 * Dark operator-console aesthetic: deep surface, violet active indicator.
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
 * @param leadingContent     Optional composable rendered above the input row (e.g. attachment chips).
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
    leadingContent: (@Composable () -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current
    val canSend = hasSendableContent && enabled && !loading
    val sendButtonDescription = if (canSend) "Send message" else "Send message, disabled"

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
        Column(modifier = Modifier.padding(12.dp)) {
            leadingContent?.invoke()
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    enabled = enabled,
                    modifier = Modifier
                        .weight(1f)
                        .semantics { contentDescription = "Message input" },
                    textStyle = MaterialTheme.typography.bodyMedium.copy(
                        color = MaterialTheme.colorScheme.onSurface,
                    ),
                    cursorBrush = SolidColor(aurora.accentPink),
                    minLines = 1,
                    maxLines = 6,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = { if (canSend) onSend() }),
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
                FilledIconButton(
                    onClick = { if (canSend) onSend() },
                    enabled = canSend,
                    modifier = Modifier
                        .size(36.dp)
                        .semantics { contentDescription = sendButtonDescription },
                    colors = IconButtonDefaults.filledIconButtonColors(
                        containerColor = aurora.accentPinkButton,
                        contentColor = MaterialTheme.colorScheme.surface,
                        disabledContainerColor = aurora.borderStrong,
                    ),
                ) {
                    if (loading) AuroraSpinner(contentDescription = "Sending", size = 18.dp)
                    else Icon(
                        Icons.AutoMirrored.Filled.Send,
                        // Null here — the button-level semantics above own the description.
                        contentDescription = null,
                    )
                }
            }
        }
    }
}
