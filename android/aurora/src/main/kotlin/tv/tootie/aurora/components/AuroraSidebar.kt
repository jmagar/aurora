package tv.tootie.aurora.components

import androidx.compose.material3.DrawerState
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector

public data class AuroraSidebarItem(
    val label: String,
    val icon: ImageVector,
    val value: String,
)

/**
 * Modal navigation drawer (sidebar). Maps to web `sidebar`.
 * Swipe from left edge or call [drawerState].open() to reveal.
 */
@Composable
public fun AuroraSidebar(
    items: List<AuroraSidebarItem>,
    selected: String,
    onSelect: (String) -> Unit,
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    drawerState: DrawerState = rememberDrawerState(DrawerValue.Closed),
    header: (@Composable () -> Unit)? = null,
) {
    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                header?.invoke()
                items.forEach { item ->
                    NavigationDrawerItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = item.value == selected,
                        onClick = { onSelect(item.value) },
                    )
                }
            }
        },
        modifier = modifier,
        content = content,
    )
}
