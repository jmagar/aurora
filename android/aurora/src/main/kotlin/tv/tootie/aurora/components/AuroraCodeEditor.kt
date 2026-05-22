package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Editable code editor with monospace font and dark surface.
 * Maps to web `code-editor`. No syntax highlighting (requires a third-party library).
 *
 * The field announces itself as "Code editor" to TalkBack via semantics.
 *
 * @param value Current text content.
 * @param onValueChange Called whenever the text changes.
 * @param modifier Caller-supplied modifier applied to the root `BasicTextField`.
 * @param enabled Whether the editor accepts input.
 * @param minLines Minimum visible line count.
 * @param editorDescription Accessibility label announced by TalkBack (default: "Code editor").
 */
@Composable
public fun AuroraCodeEditor(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    minLines: Int = 5,
    editorDescription: String = "Code editor",
) {
    val aurora = LocalAuroraColors.current

    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp))
            .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(8.dp))
            .padding(12.dp)
            .semantics { contentDescription = editorDescription },
        textStyle = TextStyle(
            fontFamily = FontFamily.Monospace,
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = MaterialTheme.typography.bodySmall.fontSize,
            lineHeight = MaterialTheme.typography.bodySmall.lineHeight,
        ),
        // Aurora focusRing color for the text cursor so it matches the focus token
        cursorBrush = SolidColor(aurora.focusRing),
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Ascii,
            capitalization = KeyboardCapitalization.None,
            autoCorrectEnabled = false,
        ),
        minLines = minLines,
    )
}
