package tv.tootie.aurora.components

import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput

/**
 * Long-press context menu. Maps to web `context-menu`.
 * Triggers [AuroraDropdownMenu] on long press over [content].
 */
@Composable
public fun AuroraContextMenu(
    menuEntries: List<AuroraMenuEntry>,
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
) {
    var showMenu by remember { mutableStateOf(false) }

    AuroraDropdownMenu(
        entries = menuEntries,
        expanded = showMenu,
        onDismissRequest = { showMenu = false },
        anchor = content,
        modifier = modifier.pointerInput(Unit) {
            detectTapGestures(onLongPress = { showMenu = true })
        },
    )
}
