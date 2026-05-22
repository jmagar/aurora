package tv.tootie.aurora.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.toImmutableList

/**
 * Reasoning block — wraps [AuroraChainOfThought] with reasoning-specific defaults.
 *
 * Maps to web AI `reasoning` element. Accepts a raw [content] string whose
 * non-blank lines become the chain-of-thought steps. For callers that already
 * hold a split list, use [AuroraChainOfThought] directly.
 */
@Composable
public fun AuroraReasoning(
    content: String,
    modifier: Modifier = Modifier,
    title: String = "Reasoning",
    initiallyExpanded: Boolean = false,
) {
    val steps: ImmutableList<String> = content
        .lines()
        .filter { it.isNotBlank() }
        .toImmutableList()

    AuroraChainOfThought(
        steps = steps,
        modifier = modifier,
        title = title,
        initiallyExpanded = initiallyExpanded,
    )
}
