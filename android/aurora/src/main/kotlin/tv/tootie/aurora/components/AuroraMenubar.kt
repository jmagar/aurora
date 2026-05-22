package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList

/**
 * Top-level menu descriptor for [AuroraMenubar].
 *
 * @param label             Display text for the menu trigger button.
 * @param entries           Items rendered inside the dropdown.
 * @param contentDescription Optional override for TalkBack — e.g. "File menu".
 *                          When null TalkBack reads [label] directly from the
 *                          [TextButton] content, which is usually sufficient.
 */
public data class AuroraMenu(
    val label: String,
    val entries: List<AuroraMenuEntry>,
    val contentDescription: String? = null,
)

/**
 * Horizontal desktop-style menu bar. Maps to web `menubar`.
 *
 * On mobile, prefer [AuroraNavigationBar] or a drawer instead.
 * Each menu label opens an [AuroraDropdownMenu] on click.
 *
 * **Accessibility:** Each top-level [TextButton] reads [AuroraMenu.label] via
 * its own content. Set [AuroraMenu.contentDescription] to override the TalkBack
 * announcement (e.g. "File menu", "Edit menu").
 *
 * **Keyboard navigation between top-level menus** is not implemented — Compose
 * `TextButton` does not expose a horizontal arrow-key focus traversal hook
 * equivalent to the `menubar` ARIA role without a custom `FocusManager` wrapper.
 * Track this in a follow-up issue if physical-keyboard support is needed.
 *
 * @param menus    Menu descriptors. Use [ImmutableList] for Compose stability.
 * @param modifier Applied to the root [Surface].
 */
@Composable
public fun AuroraMenubar(
    menus: ImmutableList<AuroraMenu>,
    modifier: Modifier = Modifier,
) {
    var openMenuIndex by remember { mutableStateOf<Int?>(null) }

    Surface(
        modifier = modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surfaceVariant,
        shadowElevation = 1.dp,
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start,
        ) {
            menus.forEachIndexed { index, menu ->
                AuroraDropdownMenu(
                    entries = menu.entries,
                    expanded = openMenuIndex == index,
                    onDismissRequest = { openMenuIndex = null },
                    anchor = {
                        val buttonModifier = if (menu.contentDescription != null) {
                            Modifier.semantics { contentDescription = menu.contentDescription }
                        } else {
                            Modifier
                        }
                        TextButton(
                            onClick = {
                                openMenuIndex = if (openMenuIndex == index) null else index
                            },
                            modifier = buttonModifier,
                        ) {
                            Text(menu.label, style = MaterialTheme.typography.bodySmall)
                        }
                    },
                )
            }
        }
    }
}
