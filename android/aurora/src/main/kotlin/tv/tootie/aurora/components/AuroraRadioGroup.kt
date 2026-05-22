package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp

public data class AuroraRadioOption(
    val label: String,
    val value: String,
    val description: String? = null,
)

/**
 * Vertical list of labeled radio buttons. Maps to web `radio-group`.
 */
@Composable
public fun AuroraRadioGroup(
    options: List<AuroraRadioOption>,
    selected: String?,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(modifier = modifier) {
        options.forEach { option ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(role = Role.RadioButton) { onSelect(option.value) },
                verticalAlignment = Alignment.CenterVertically,
            ) {
                RadioButton(
                    selected = option.value == selected,
                    onClick = { onSelect(option.value) },
                )
                Spacer(Modifier.width(8.dp))
                Column {
                    Text(option.label)
                    option.description?.let { Text(it) }
                }
            }
        }
    }
}
