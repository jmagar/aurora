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
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
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
 * @param value current OTP string (length 0..[length])
 * @param onValueChange called with the new full OTP string on each keystroke
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

    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        repeat(length) { index ->
            val char = value.getOrNull(index)?.toString() ?: ""
            val isFocused = value.length == index

            BasicTextField(
                value = TextFieldValue(char, selection = TextRange(char.length)),
                onValueChange = { newVal ->
                    val digit = newVal.text.filter { it.isDigit() }.take(1)
                    val newOtp = value.take(index) + digit + value.drop(index + 1)
                    onValueChange(newOtp.take(length))
                    if (digit.isNotEmpty() && index < length - 1) {
                        focusRequesters.getOrNull(index + 1)?.requestFocus()
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
                    .focusRequester(focusRequesters.getOrElse(index) { FocusRequester() }),
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
