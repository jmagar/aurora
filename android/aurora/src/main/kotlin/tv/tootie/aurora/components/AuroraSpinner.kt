package tv.tootie.aurora.components

import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Compose equivalent of Aurora's Spinner shadcn component.
 *
 * [contentDescription] is required with no default — callers must supply a
 * localized string so screen-readers announce the loading state correctly in
 * every supported locale.
 *
 * [size] controls both width and height of the indicator, allowing inline
 * (small) and full-screen (large) usage without wrapper boilerplate.
 */
@Composable
fun AuroraSpinner(
    contentDescription: String,
    modifier: Modifier = Modifier,
    size: Dp = 40.dp,
    color: Color = LocalAuroraColors.current.accentCyanBase,
) {
    CircularProgressIndicator(
        modifier = modifier
            .size(size)
            .semantics { this.contentDescription = contentDescription },
        color = color,
    )
}
