package tv.tootie.aurora.components

import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.DatePickerState
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Inline date picker. Maps to web `calendar` component.
 * Use [AuroraDatePickerDialog] for modal date selection.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun AuroraCalendar(
    modifier: Modifier = Modifier,
    state: DatePickerState = rememberDatePickerState(),
) {
    DatePicker(state = state, modifier = modifier)
}

/**
 * Modal date picker dialog. Maps to web `date-picker` component.
 *
 * @param onDateSelected called with epoch millis when confirmed; null if no date selected.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun AuroraDatePickerDialog(
    onDismissRequest: () -> Unit,
    onDateSelected: (Long?) -> Unit,
    modifier: Modifier = Modifier,
    confirmLabel: String = "OK",
    dismissLabel: String = "Cancel",
) {
    val state = rememberDatePickerState()
    DatePickerDialog(
        onDismissRequest = onDismissRequest,
        confirmButton = {
            TextButton(onClick = {
                onDateSelected(state.selectedDateMillis)
                onDismissRequest()
            }) { Text(confirmLabel) }
        },
        dismissButton = {
            TextButton(onClick = onDismissRequest) { Text(dismissLabel) }
        },
        modifier = modifier,
    ) {
        DatePicker(state = state)
    }
}
