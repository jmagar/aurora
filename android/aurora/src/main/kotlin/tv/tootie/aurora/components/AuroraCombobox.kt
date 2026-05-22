package tv.tootie.aurora.components

import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.MenuAnchorType
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier

public data class AuroraComboboxOption(
    val label: String,
    val value: String,
)

/**
 * Searchable/filterable dropdown. Maps to web `combobox` and `native-select`.
 * For a non-searchable dropdown use [AuroraSelect].
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun AuroraCombobox(
    options: List<AuroraComboboxOption>,
    selected: String?,
    onSelect: (AuroraComboboxOption) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "",
    placeholder: String = "Select…",
) {
    var expanded by remember { mutableStateOf(false) }
    var query by remember { mutableStateOf("") }

    val filtered = remember(query, options) {
        if (query.isBlank()) options
        else options.filter { it.label.contains(query, ignoreCase = true) }
    }

    val displayText = options.find { it.value == selected }?.label ?: ""

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it },
        modifier = modifier,
    ) {
        OutlinedTextField(
            value = if (expanded) query else displayText,
            onValueChange = { query = it },
            label = label.ifBlank { null }?.let { { Text(it) } },
            placeholder = { Text(placeholder) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(),
            modifier = Modifier.menuAnchor(MenuAnchorType.PrimaryEditable),
            singleLine = true,
        )
        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false; query = "" },
        ) {
            filtered.forEach { option ->
                DropdownMenuItem(
                    text = { Text(option.label) },
                    onClick = {
                        onSelect(option)
                        expanded = false
                        query = ""
                    },
                )
            }
        }
    }
}
