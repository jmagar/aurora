package tv.tootie.aurora.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Reasoning block — delegates to [AuroraChainOfThought] with reasoning-specific defaults.
 * Maps to web AI `reasoning` element.
 */
@Composable
public fun AuroraReasoning(
    content: String,
    modifier: Modifier = Modifier,
    title: String = "Reasoning",
    initiallyExpanded: Boolean = false,
) {
    AuroraChainOfThought(
        steps = content.lines().filter { it.isNotBlank() },
        modifier = modifier,
        title = title,
        initiallyExpanded = initiallyExpanded,
    )
}
