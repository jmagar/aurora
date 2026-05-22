package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

/**
 * Numeric spinner: decrement button — text field — increment button.
 * Maps to web `number-input`.
 *
 * Accessibility notes:
 * - Increment and decrement [IconButton]s carry `contentDescription` values that include the
 *   current [step] amount so TalkBack announces "Decrease by 1" rather than just "Decrease".
 * - When [label] is null a fallback `contentDescription` is applied to the text field so it is
 *   never unlabelled for assistive technology.
 * - Error state is surfaced via [OutlinedTextField]'s `supportingText` slot so M3 applies the
 *   correct TalkBack error semantics (`semantics { error(message) }`) automatically.
 *
 * @param value Current numeric value.
 * @param onValueChange Called with the clamped new value on every change.
 * @param modifier Applied to the root [Row].
 * @param min Minimum allowed value.
 * @param max Maximum allowed value.
 * @param step Amount added/subtracted by the increment/decrement buttons.
 * @param enabled When false the entire control is non-interactive.
 * @param label Optional visible label rendered inside the text field.
 * @param isError Whether the text field is in an error state.
 * @param errorMessage Error text shown via `supportingText` when [isError] is true.
 * @param keyboardOptions Software keyboard configuration.
 * @param keyboardActions Callbacks for IME actions.
 */
@Composable
public fun AuroraNumberInput(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    min: Float = Float.NEGATIVE_INFINITY,
    max: Float = Float.POSITIVE_INFINITY,
    step: Float = 1f,
    enabled: Boolean = true,
    label: String? = null,
    isError: Boolean = false,
    errorMessage: String? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions(
        keyboardType = KeyboardType.Decimal,
        imeAction = ImeAction.Done,
    ),
    keyboardActions: KeyboardActions = KeyboardActions.Default,
) {
    fun clamp(v: Float) = v.coerceIn(min, max)

    val displayValue = if (value == value.toLong().toFloat()) {
        value.toLong().toString()
    } else {
        value.toString()
    }

    val stepLabel = if (step == step.toLong().toFloat()) {
        step.toLong().toString()
    } else {
        step.toString()
    }

    Row(modifier = modifier, verticalAlignment = Alignment.CenterVertically) {
        IconButton(
            onClick = { onValueChange(clamp(value - step)) },
            enabled = enabled && value > min,
        ) {
            Icon(Icons.Default.Remove, contentDescription = "Decrease by $stepLabel")
        }
        OutlinedTextField(
            value = displayValue,
            onValueChange = { raw -> raw.toFloatOrNull()?.let { v -> onValueChange(clamp(v)) } },
            modifier = Modifier
                .width(80.dp)
                .then(
                    if (label == null) {
                        Modifier.semantics { contentDescription = "Numeric value" }
                    } else {
                        Modifier
                    }
                ),
            singleLine = true,
            enabled = enabled,
            label = label?.let { { Text(it) } },
            isError = isError,
            supportingText = if (isError && errorMessage != null) {
                { Text(errorMessage) }
            } else null,
            keyboardOptions = keyboardOptions,
            keyboardActions = keyboardActions,
        )
        IconButton(
            onClick = { onValueChange(clamp(value + step)) },
            enabled = enabled && value < max,
        ) {
            Icon(Icons.Default.Add, contentDescription = "Increase by $stepLabel")
        }
    }
}
