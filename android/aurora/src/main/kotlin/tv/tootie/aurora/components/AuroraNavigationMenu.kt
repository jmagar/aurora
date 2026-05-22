package tv.tootie.aurora.components

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector

public data class AuroraNavItem(
    val label: String,
    val icon: ImageVector,
    val value: String,
)

/**
 * Bottom navigation bar. Maps to web `navigation-menu` mobile layout.
 * Use [AuroraNavigationRail] for tablet/landscape.
 */
@Composable
public fun AuroraNavigationBar(
    items: List<AuroraNavItem>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    NavigationBar(modifier = modifier) {
        items.forEach { item ->
            NavigationBarItem(
                selected = item.value == selected,
                onClick = { onSelect(item.value) },
                icon = { Icon(item.icon, contentDescription = item.label) },
                label = { Text(item.label) },
            )
        }
    }
}

/**
 * Side navigation rail. Maps to web `navigation-menu` tablet/desktop layout.
 */
@Composable
public fun AuroraNavigationRail(
    items: List<AuroraNavItem>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    header: (@Composable ColumnScope.() -> Unit)? = null,
) {
    NavigationRail(modifier = modifier, header = header) {
        items.forEach { item ->
            NavigationRailItem(
                selected = item.value == selected,
                onClick = { onSelect(item.value) },
                icon = { Icon(item.icon, contentDescription = item.label) },
                label = { Text(item.label) },
            )
        }
    }
}
