package tv.tootie.aurora.components

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Scrollable error stack trace in monospace. Maps to web AI `stack-trace` element.
 *
 * The trace text is wrapped in [SelectionContainer] so users can long-press to
 * copy individual lines. A dedicated copy button in the header copies the entire
 * trace to the clipboard. The root surface carries `contentDescription = "Stack trace"`
 * so TalkBack announces the widget role on focus.
 *
 * @param trace Full stack trace string to display.
 * @param modifier Modifier applied to the root [Surface].
 * @param errorMessage Optional short error message shown above the trace.
 */
@Composable
public fun AuroraStackTrace(
    trace: String,
    modifier: Modifier = Modifier,
    errorMessage: String? = null,
) {
    val aurora = LocalAuroraColors.current
    val context = LocalContext.current
    var copied by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .semantics { contentDescription = "Stack trace" },
        shape = RoundedCornerShape(8.dp),
        color = aurora.errorSurface,
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Header row: optional error message + copy button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                if (errorMessage != null) {
                    Text(
                        text = errorMessage,
                        style = MaterialTheme.typography.labelMedium,
                        color = aurora.error,
                        modifier = Modifier
                            .weight(1f)
                            .padding(end = 8.dp),
                    )
                } else {
                    // Spacer so the copy button stays right-aligned
                    Text(
                        text = "Stack trace",
                        style = MaterialTheme.typography.labelMedium,
                        color = aurora.error,
                        modifier = Modifier.weight(1f),
                    )
                }
                IconButton(
                    onClick = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        clipboard.setPrimaryClip(ClipData.newPlainText("stack trace", trace))
                        copied = true
                    },
                    modifier = Modifier.semantics {
                        contentDescription = if (copied) "Copied to clipboard" else "Copy stack trace"
                    },
                ) {
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = null, // described by parent IconButton semantics
                        tint = if (copied) aurora.success else aurora.error,
                    )
                }
            }

            // Trace body — SelectionContainer enables long-press text selection
            SelectionContainer {
                Text(
                    text = trace,
                    style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier
                        .horizontalScroll(rememberScrollState())
                        .padding(top = 8.dp),
                )
            }
        }
    }
}
