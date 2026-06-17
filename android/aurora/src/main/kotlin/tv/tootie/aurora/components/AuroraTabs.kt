package tv.tootie.aurora.components

import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import kotlinx.collections.immutable.ImmutableList

/**
 * Compose equivalent of Aurora's Tabs shadcn component.
 *
 * Use scrollable = true for tab bars that may overflow (e.g. more than ~5 tabs).
 * Do NOT auto-switch between TabRow and ScrollableTabRow based on tab count —
 * switching composable types at runtime causes full subtree remount, resetting
 * the tab indicator animation and any child composable state.
 *
 * @param tabs Use ImmutableList for Compose stability — prevents composable skipping with mutable List
 */
@Composable
public fun AuroraTabs(
    tabs: ImmutableList<String>,
    selectedIndex: Int,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    scrollable: Boolean = false,
    compact: Boolean = false,
) {
    if (scrollable) {
        ScrollableTabRow(
            selectedTabIndex = selectedIndex,
            modifier = modifier,
        ) {
            AuroraTabItems(tabs, selectedIndex, onTabSelected, compact)
        }
    } else {
        TabRow(
            selectedTabIndex = selectedIndex,
            modifier = modifier,
        ) {
            AuroraTabItems(tabs, selectedIndex, onTabSelected, compact)
        }
    }
}

@Composable
private fun AuroraTabItems(
    tabs: ImmutableList<String>,
    selectedIndex: Int,
    onTabSelected: (Int) -> Unit,
    compact: Boolean,
) {
    tabs.forEachIndexed { index, title ->
        Tab(
            selected = selectedIndex == index,
            onClick = { onTabSelected(index) },
            text = {
                Text(
                    text = title,
                    maxLines = if (compact) 1 else Int.MAX_VALUE,
                )
            },
        )
    }
}
