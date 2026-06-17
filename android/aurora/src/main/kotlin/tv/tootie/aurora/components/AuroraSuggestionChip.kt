package tv.tootie.aurora.components

import androidx.compose.material3.SuggestionChip
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics

/**
 * Suggestion/assist chip for AI-suggested actions.
 * Maps to web AI `suggestion` element.
 */
@Composable
public fun AuroraSuggestionChip(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    selected: Boolean = false,
    icon: (@Composable () -> Unit)? = null,
) {
    SuggestionChip(
        onClick = onClick,
        label = { Text(label) },
        modifier = modifier.semantics { this.selected = selected },
        enabled = enabled,
        icon = icon,
    )
}
