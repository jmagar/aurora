package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.DrawerState
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
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

public data class AuroraSidebarRowItem(
    val label: String,
    val value: String,
    val supportingText: String? = null,
    val icon: ImageVector? = null,
    val badge: String? = null,
    val enabled: Boolean = true,
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

@Composable
public fun AuroraSidebarRow(
    item: AuroraSidebarRowItem,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    leadingContent: (@Composable () -> Unit)? = null,
    trailingContent: (@Composable () -> Unit)? = null,
) {
    val resolvedLeadingContent = leadingContent ?: item.icon?.let { icon ->
        { Icon(imageVector = icon, contentDescription = item.label) }
    }
    val resolvedTrailingContent = trailingContent ?: item.badge?.let { badge ->
        { Text(text = badge) }
    }

    NavigationDrawerItem(
        selected = selected,
        onClick = { if (item.enabled) onClick() },
        modifier = modifier,
        icon = resolvedLeadingContent,
        label = {
            if (item.supportingText == null) {
                Text(item.label)
            } else {
                Column {
                    Text(item.label)
                    Text(
                        text = item.supportingText,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        },
        badge = resolvedTrailingContent,
    )
}
