package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.collections.immutable.ImmutableList
import tv.tootie.aurora.theme.LocalAuroraColors

/** Line type matching the Aurora web terminal. */
public enum class AuroraTerminalLineType {
    /** Shell command — prefixed with `$` in the web version; rendered in accent color. */
    Input,

    /** Standard stdout output. */
    Output,

    /** Error output — styled with error color. */
    Error,

    /** Informational system message. */
    Info,

    /** Warning output — styled with warn color. */
    Warn,

    /** Success output — styled with success color. */
    Success,
}

public data class AuroraTerminalLine(
    val text: String,
    val type: AuroraTerminalLineType = AuroraTerminalLineType.Output,
)

/** Connection state of the terminal session. */
public enum class AuroraTerminalStatus { Connected, Idle, Error }

/**
 * Terminal output viewer with auto-scroll-to-bottom. Maps to web `terminal`.
 *
 * The surface uses `Color(0xFF070E14)` — intentionally maximum-dark, not the
 * Aurora page-bg token. Terminals conventionally use near-black regardless of
 * the surrounding theme.
 *
 * The lazy list carries `semantics { liveRegion = LiveRegionMode.Polite }` so
 * TalkBack announces new lines as they arrive, mirroring the web `role="log"`.
 *
 * @param lines         Output lines. Use [ImmutableList] for Compose stability.
 * @param modifier      Applied to the root [Surface].
 * @param title         Optional session name shown in the titlebar.
 * @param status        Connection state rendered as a colored indicator dot.
 * @param autoScroll    When true, scrolls to the last line whenever [lines] grows.
 * @param onKill        Optional callback for a "kill session" action in the titlebar.
 * @param onClear       Optional callback for a "clear output" action in the titlebar.
 * @param onRun         Optional callback for a "run" action in the titlebar.
 */
@Composable
public fun AuroraTerminal(
    lines: ImmutableList<AuroraTerminalLine>,
    modifier: Modifier = Modifier,
    title: String? = null,
    status: AuroraTerminalStatus = AuroraTerminalStatus.Connected,
    autoScroll: Boolean = true,
    onKill: (() -> Unit)? = null,
    onClear: (() -> Unit)? = null,
    onRun: (() -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current
    val listState = rememberLazyListState()

    if (autoScroll) {
        LaunchedEffect(lines.size) {
            if (lines.isNotEmpty()) listState.animateScrollToItem(lines.lastIndex)
        }
    }

    val statusColor = when (status) {
        AuroraTerminalStatus.Connected -> aurora.success
        AuroraTerminalStatus.Idle      -> aurora.warn
        AuroraTerminalStatus.Error     -> aurora.error
    }
    val statusLabel = when (status) {
        AuroraTerminalStatus.Connected -> "Connected"
        AuroraTerminalStatus.Idle      -> "Idle"
        AuroraTerminalStatus.Error     -> "Error"
    }

    Surface(
        modifier = modifier,
        color = Color(0xFF070E14), // near-black terminal surface — intentional, not aurora-page-bg
    ) {
        Column {
            // ── Titlebar ────────────────────────────────────────────────────
            Surface(
                color = Color(0xFF0D1A24),
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    // Status dot
                    Box(
                        modifier = Modifier
                            .size(7.dp)
                            .background(statusColor, CircleShape)
                            .semantics { contentDescription = statusLabel },
                    )

                    Text(
                        text = title ?: "terminal",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )

                    Spacer(Modifier.weight(1f))

                    onKill?.let {
                        IconButton(onClick = it, modifier = Modifier.size(26.dp)) {
                            Icon(
                                Icons.Default.Close,
                                contentDescription = "Kill session",
                                modifier = Modifier.size(16.dp),
                            )
                        }
                    }
                    onClear?.let {
                        IconButton(onClick = it, modifier = Modifier.size(26.dp)) {
                            Icon(
                                Icons.Default.Clear,
                                contentDescription = "Clear output",
                                modifier = Modifier.size(16.dp),
                            )
                        }
                    }
                    onRun?.let {
                        IconButton(onClick = it, modifier = Modifier.size(26.dp)) {
                            Icon(
                                Icons.Default.PlayArrow,
                                contentDescription = "Run",
                                modifier = Modifier.size(16.dp),
                            )
                        }
                    }
                }
            }
            HorizontalDivider(color = aurora.borderDefault, thickness = 1.dp)

            // ── Output body ─────────────────────────────────────────────────
            if (lines.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp),
                    contentAlignment = Alignment.TopStart,
                ) {
                    Text(
                        text = "No output",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                    )
                }
            } else {
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp)
                        .semantics {
                            // Mirrors web role="log" + aria-live="polite"
                            liveRegion = LiveRegionMode.Polite
                            contentDescription = "Terminal output"
                        },
                ) {
                    itemsIndexed(lines, key = { index, _ -> index }) { _, line ->
                        val color = when (line.type) {
                            AuroraTerminalLineType.Input   -> aurora.info          // accent cyan
                            AuroraTerminalLineType.Error   -> aurora.error
                            AuroraTerminalLineType.Info    -> aurora.infoForeground
                            AuroraTerminalLineType.Warn    -> aurora.warn
                            AuroraTerminalLineType.Success -> aurora.success
                            AuroraTerminalLineType.Output  -> Color(0xFFD4D4D4)
                        }
                        val prefix = when (line.type) {
                            AuroraTerminalLineType.Input   -> "$ "
                            AuroraTerminalLineType.Error   -> "✗ "
                            AuroraTerminalLineType.Success -> "✓ "
                            AuroraTerminalLineType.Warn    -> "⚠ "
                            else                           -> ""
                        }
                        Row(modifier = Modifier.fillMaxWidth()) {
                            if (prefix.isNotEmpty()) {
                                Text(
                                    text = prefix,
                                    color = color,
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 12.sp,
                                    lineHeight = 18.sp,
                                )
                            }
                            Text(
                                text = line.text,
                                color = color,
                                fontFamily = FontFamily.Monospace,
                                fontSize = 12.sp,
                                lineHeight = 18.sp,
                                modifier = Modifier.weight(1f),
                            )
                        }
                    }
                }
            }
        }
    }
}
