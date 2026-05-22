package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Inline code snippet chip (not a full code block). Maps to web AI `snippet` element.
 *
 * Text is wrapped in [SelectionContainer] so users can long-press to copy the snippet.
 *
 * The [language] parameter is purely decorative — it is not rendered and is not
 * announced by TalkBack. Its presence serves as documentation-only metadata for
 * callers (e.g. `AuroraToolCallList` passes a tool name, not a language). If
 * screen-reader announcement of the language is desired, incorporate it into the
 * [contentDescription] string.
 *
 * Aurora token [tv.tootie.aurora.theme.AuroraExtraColors.codeFunction] is used for
 * the snippet text color, matching the inline code token from the web system.
 *
 * @param code               The code string to display.
 * @param modifier           Modifier applied to the outer clip container.
 * @param language           Optional language hint — decorative only, not rendered.
 * @param contentDescription Optional accessibility description. When `null` the raw
 *   [code] text is announced by the default [Text] semantics.
 */
@Composable
public fun AuroraSnippet(
    code: String,
    modifier: Modifier = Modifier,
    language: String? = null,
    contentDescription: String? = null,
) {
    val aurora = LocalAuroraColors.current

    SelectionContainer(
        modifier = modifier
            .clip(RoundedCornerShape(4.dp))
            .background(aurora.subtleBg)
            .then(
                if (contentDescription != null) {
                    Modifier.semantics { this.contentDescription = contentDescription }
                } else Modifier,
            ),
    ) {
        Text(
            text = code,
            style = MaterialTheme.typography.bodySmall.copy(
                fontFamily = FontFamily.Monospace,
            ),
            color = aurora.codeFunction,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
        )
    }
}
