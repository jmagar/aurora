package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * One-time passcode input: [length] single-character digit boxes.
 * Maps to web `input-otp`.
 *
 * Accessibility notes:
 * - Each cell has a `contentDescription` of "Digit N of M" so TalkBack announces position.
 * - When [isError] is true the description includes "Error" so TalkBack communicates the state
 *   even without a sibling error text node.
 * - Focus is tracked per-cell via [onFocusChanged] rather than the fragile `value.length == index`
 *   heuristic, which misled focus visuals when the user tapped an already-filled cell.
 *
 * Paste handling:
 * - If the user pastes a multi-digit string into any cell the component fills from that cell
 *   rightward, discarding non-digit characters. Excess digits are truncated to [length].
 *
 * Backspace handling:
 * - Clearing the digit in a cell automatically moves focus to the previous cell so users can
 *   step backward through the OTP without manually navigating.
 *
 * State hoisting: [value] + [onValueChange] — the caller owns the OTP string.
 *
 * @param value Current OTP string; length 0..[length]. Characters beyond [length] are ignored.
 * @param onValueChange Called with the full updated OTP string on every keystroke or paste.
 * @param modifier Applied to the root [Row].
 * @param length Number of digit cells. Defaults to 6.
 * @param isError When true cells render with an error-colour border.
 */
@Composable
public fun AuroraInputOtp(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    length: Int = 6,
    isError: Boolean = false,
) {
    val aurora = LocalAuroraColors.current
    val focusRequesters = remember(length) { List(length) { FocusRequester() } }
    // Per-cell focus tracking via onFocusChanged — avoids the value.length == index heuristic.
    val focusedIndex = remember { mutableStateOf(-1) }

    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        repeat(length) { index ->
            val char = value.getOrNull(index)?.toString() ?: ""
            val isFocused = focusedIndex.value == index

            BasicTextField(
                value = TextFieldValue(char, selection = TextRange(char.length)),
                onValueChange = { newVal ->
                    val incoming = newVal.text.filter { it.isDigit() }

                    when {
                        // Paste: more than one digit arrived — distribute rightward from this cell.
                        incoming.length > 1 -> {
                            val prefix = value.take(index)
                            val fill = incoming.take(length - index)
                            val suffix = value.drop(index + fill.length)
                            val newOtp = (prefix + fill + suffix).take(length)
                            onValueChange(newOtp)
                            // Move focus to the cell after the last filled cell, clamped to end.
                            val nextFocus = (index + fill.length).coerceAtMost(length - 1)
                            focusRequesters.getOrNull(nextFocus)?.requestFocus()
                        }

                        // Normal single digit typed.
                        incoming.length == 1 -> {
                            val newOtp = value.take(index) + incoming + value.drop(index + 1)
                            onValueChange(newOtp.take(length))
                            if (index < length - 1) {
                                focusRequesters.getOrNull(index + 1)?.requestFocus()
                            }
                        }

                        // Empty input: user deleted the digit in this cell (backspace).
                        else -> {
                            val newOtp = value.take(index) + "" + value.drop(index + 1)
                            onValueChange(newOtp.take(length))
                            if (index > 0) {
                                focusRequesters.getOrNull(index - 1)?.requestFocus()
                            }
                        }
                    }
                },
                modifier = Modifier
                    .size(44.dp)
                    .border(
                        width = if (isFocused) 2.dp else 1.dp,
                        color = when {
                            isError   -> aurora.error
                            isFocused -> MaterialTheme.colorScheme.primary
                            else      -> aurora.borderStrong
                        },
                        shape = RoundedCornerShape(8.dp),
                    )
                    .focusRequester(focusRequesters.getOrElse(index) { FocusRequester() })
                    .onFocusChanged { state ->
                        if (state.isFocused) focusedIndex.value = index
                        else if (focusedIndex.value == index) focusedIndex.value = -1
                    }
                    .semantics {
                        // Announce position and error state to TalkBack.
                        contentDescription = buildString {
                            append("Digit ${index + 1} of $length")
                            if (char.isNotEmpty()) append(", entered")
                            if (isError) append(", error")
                        }
                    },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                singleLine = true,
                decorationBox = { _ ->
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier.size(44.dp),
                    ) {
                        Text(
                            text = char,
                            style = MaterialTheme.typography.titleMedium,
                            textAlign = TextAlign.Center,
                        )
                    }
                },
            )
        }
    }
}
