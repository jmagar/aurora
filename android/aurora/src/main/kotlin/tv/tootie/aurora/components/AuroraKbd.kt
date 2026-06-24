package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Keyboard shortcut chip in monospace font. Maps to web `kbd`.
 *
 * @param key The visible glyph(s) to render (e.g. `"⌘"`, `"⇧K"`).
 * @param contentDescription Accessible label announced by TalkBack
 *   (e.g. `"Command"`, `"Shift K"`). Required because symbolic glyphs are
 *   not meaningful when read aloud verbatim.
 */
@Composable
public fun AuroraKbd(
    key: String,
    contentDescription: String,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .border(1.dp, aurora.borderStrong, RoundedCornerShape(4.dp))
            .semantics { this.contentDescription = contentDescription },
        shape = RoundedCornerShape(4.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
        shadowElevation = 1.dp,
    ) {
        Text(
            text = key,
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
            ),
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            // Suppress the raw glyph from TalkBack — the Surface semantics node
            // already carries the human-readable contentDescription.
            modifier = Modifier
                .clearAndSetSemantics {}
                .padding(horizontal = 6.dp, vertical = 2.dp),
        )
    }
}
