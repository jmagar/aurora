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
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public data class AuroraMenu(
    val label: String,
    val entries: List<AuroraMenuEntry>,
)

/**
 * Horizontal desktop-style menu bar. Maps to web `menubar`.
 *
 * On mobile, prefer [AuroraNavigationBar] or a drawer instead.
 * Each menu label opens an [AuroraDropdownMenu] on click.
 *
 * References from the same package:
 * - [AuroraDropdownMenu] for the per-menu popover
 * - [AuroraMenuEntry] as the entry model (defined alongside [AuroraDropdownMenu])
 */
@Composable
public fun AuroraMenubar(
    menus: List<AuroraMenu>,
    modifier: Modifier = Modifier,
) {
    @Suppress("UNUSED_VARIABLE")
    val aurora = LocalAuroraColors.current
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
                        TextButton(onClick = {
                            openMenuIndex = if (openMenuIndex == index) null else index
                        }) {
                            Text(menu.label, style = MaterialTheme.typography.bodySmall)
                        }
                    },
                )
            }
        }
    }
}
