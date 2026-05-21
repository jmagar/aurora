package tv.tootie.aurora.components

import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics

/**
 * Compose equivalent of Aurora's Spinner shadcn component.
 * Wraps CircularProgressIndicator with accessibility semantics.
 */
@Composable
fun AuroraSpinner(
    modifier: Modifier = Modifier,
    contentDescription: String = "Loading",
) {
    CircularProgressIndicator(
        modifier = modifier.semantics { this.contentDescription = contentDescription },
    )
}
