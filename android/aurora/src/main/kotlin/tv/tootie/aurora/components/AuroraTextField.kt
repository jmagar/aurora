package tv.tootie.aurora.components

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.VisualTransformation

/**
 * Compose equivalent of Aurora's Input shadcn component.
 *
 * Wraps [OutlinedTextField] with Aurora token styling. Error text is surfaced via
 * [OutlinedTextField]'s own `supportingText` slot so Material 3 can apply the correct
 * TalkBack error semantics (`semantics { error(errorMessage) }`) automatically.
 *
 * @param value Current text field value.
 * @param onValueChange Called whenever the text changes.
 * @param modifier Applied directly to [OutlinedTextField].
 * @param label Optional label rendered inside the field border.
 * @param placeholder Optional placeholder shown when the field is empty.
 * @param isError Whether the field is in an error state.
 * @param errorMessage Error text shown below the field when [isError] is true.
 * @param enabled Whether the field is interactive.
 * @param readOnly When true the field is non-editable but still focusable.
 * @param singleLine Constrains the field to a single line.
 * @param keyboardOptions Software keyboard configuration.
 * @param keyboardActions Callbacks for IME actions.
 * @param visualTransformation Transform applied to the input text (e.g. password masking).
 * @param leadingIcon Optional icon composable at the start of the field.
 * @param trailingIcon Optional icon composable at the end of the field.
 */
@Composable
public fun AuroraTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String? = null,
    isError: Boolean = false,
    errorMessage: String? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    singleLine: Boolean = true,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
) {
    // Explicit remember prevents focus ring flicker on parent recompose
    val interactionSource = remember { MutableInteractionSource() }

    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        label = label?.let { { Text(it) } },
        placeholder = placeholder?.let { { Text(it) } },
        isError = isError,
        supportingText = if (isError && errorMessage != null) {
            { Text(text = errorMessage, color = MaterialTheme.colorScheme.error) }
        } else null,
        enabled = enabled,
        readOnly = readOnly,
        singleLine = singleLine,
        keyboardOptions = keyboardOptions,
        keyboardActions = keyboardActions,
        visualTransformation = visualTransformation,
        leadingIcon = leadingIcon,
        trailingIcon = trailingIcon,
        interactionSource = interactionSource,
    )
}
