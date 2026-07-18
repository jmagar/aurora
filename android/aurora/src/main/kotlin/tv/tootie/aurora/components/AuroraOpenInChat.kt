package tv.tootie.aurora.components

import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.filled.OpenInFull
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Icon button to open artifact/result in full chat view.
 * Maps to web AI `open-in-chat` element.
 */
@Composable
public fun AuroraOpenInChat(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    IconButton(onClick = onClick, modifier = modifier) {
        Icon(
            imageVector = Icons.Default.OpenInFull,
            contentDescription = "Open in chat",
            tint = aurora.accentViolet,
        )
    }
}
