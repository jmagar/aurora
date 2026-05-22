package tv.tootie.aurora.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role

/**
 * Expand/collapse container. Maps to web `collapsible` and `accordion` components.
 *
 * No `material-icons-extended` dependency is present in this library, so the
 * chevron indicator is rendered as a plain text character ("▲"/"▼") rather than
 * an icon drawable. Callers that need a custom indicator can compose their own
 * header inside [trigger].
 *
 * @param trigger Always-visible header composable; receives the current [expanded] state
 *   so callers can adapt their own affordance visually.
 * @param content Shown/hidden based on [expanded] state with a vertical slide animation.
 * @param modifier Modifier applied to the outer [Column].
 * @param initiallyExpanded Whether the content is visible on first composition.
 */
@Composable
public fun AuroraCollapsible(
    trigger: @Composable (expanded: Boolean) -> Unit,
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    initiallyExpanded: Boolean = false,
) {
    var expanded by rememberSaveable { mutableStateOf(initiallyExpanded) }

    Column(modifier = modifier) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable(role = Role.Button) { expanded = !expanded },
            verticalAlignment = Alignment.CenterVertically,
        ) {
            trigger(expanded)
            // Text chevron — avoids a material-icons-extended dependency.
            Text(text = if (expanded) "▲" else "▼")
        }
        AnimatedVisibility(
            visible = expanded,
            enter = expandVertically(),
            exit = shrinkVertically(),
        ) {
            content()
        }
    }
}
