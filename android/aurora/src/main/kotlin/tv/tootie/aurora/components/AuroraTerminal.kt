package tv.tootie.aurora.components

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraTerminalLine(
    val text: String,
    val type: AuroraTerminalLineType = AuroraTerminalLineType.Output,
)

public enum class AuroraTerminalLineType { Input, Output, Error, Info }

/**
 * Terminal output viewer with auto-scroll-to-bottom. Maps to web `terminal`.
 *
 * The surface uses `Color(0xFF070E14)` — intentionally maximum-dark, not the
 * Aurora page-bg token. Terminals conventionally use near-black regardless of
 * the surrounding theme.
 */
@Composable
public fun AuroraTerminal(
    lines: List<AuroraTerminalLine>,
    modifier: Modifier = Modifier,
    autoScroll: Boolean = true,
) {
    val aurora = LocalAuroraColors.current
    val listState = rememberLazyListState()

    if (autoScroll) {
        LaunchedEffect(lines.size) {
            if (lines.isNotEmpty()) listState.animateScrollToItem(lines.lastIndex)
        }
    }

    Surface(
        modifier = modifier,
        color = Color(0xFF070E14), // near-black terminal surface — intentional, not aurora-page-bg
    ) {
        LazyColumn(
            state = listState,
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
        ) {
            items(lines) { line ->
                val color = when (line.type) {
                    AuroraTerminalLineType.Input  -> MaterialTheme.colorScheme.primary
                    AuroraTerminalLineType.Error  -> aurora.error
                    AuroraTerminalLineType.Info   -> aurora.info
                    AuroraTerminalLineType.Output -> Color(0xFFD4D4D4)
                }
                Text(
                    text = line.text,
                    color = color,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 12.sp,
                    lineHeight = 18.sp,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}
