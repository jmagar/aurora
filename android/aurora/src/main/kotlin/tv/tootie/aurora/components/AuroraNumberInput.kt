package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.width
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
import androidx.compose.ui.unit.dp

/**
 * Numeric spinner: decrement button — text field — increment button.
 * Maps to web `number-input`.
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
) {
    fun clamp(v: Float) = v.coerceIn(min, max)

    Row(modifier = modifier, verticalAlignment = Alignment.CenterVertically) {
        IconButton(
            onClick = { onValueChange(clamp(value - step)) },
            enabled = enabled && value > min,
        ) {
            Icon(Icons.Default.Remove, contentDescription = "Decrease")
        }
        OutlinedTextField(
            value = if (value == value.toLong().toFloat()) value.toLong().toString() else value.toString(),
            onValueChange = { it.toFloatOrNull()?.let { v -> onValueChange(clamp(v)) } },
            modifier = Modifier.width(80.dp),
            singleLine = true,
            enabled = enabled,
            label = label?.let { { Text(it) } },
        )
        IconButton(
            onClick = { onValueChange(clamp(value + step)) },
            enabled = enabled && value < max,
        ) {
            Icon(Icons.Default.Add, contentDescription = "Increase")
        }
    }
}
