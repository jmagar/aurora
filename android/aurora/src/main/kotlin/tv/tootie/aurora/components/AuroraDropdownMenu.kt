package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Box
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import tv.tootie.aurora.theme.LocalAuroraColors

public sealed class AuroraMenuEntry {
    public data class Item(
        val label: String,
        val onClick: () -> Unit,
        val danger: Boolean = false,
        val leadingIcon: (@Composable () -> Unit)? = null,
        val trailingText: String? = null,
        val enabled: Boolean = true,
    ) : AuroraMenuEntry()
    public data object Separator : AuroraMenuEntry()
    public data class Group(
        val heading: String,
        val items: List<Item>,
    ) : AuroraMenuEntry()
}

/**
 * Aurora-themed dropdown menu with sections and danger items.
 * Maps to web `dropdown-menu`.
 *
 * @param anchor composable that the menu anchors to (usually the trigger button).
 */
@Composable
public fun AuroraDropdownMenu(
    entries: List<AuroraMenuEntry>,
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    anchor: @Composable () -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    Box(modifier = modifier) {
        anchor()
        DropdownMenu(expanded = expanded, onDismissRequest = onDismissRequest) {
            entries.forEach { entry ->
                when (entry) {
                    is AuroraMenuEntry.Separator ->
                        HorizontalDivider(color = aurora.borderDefault)

                    is AuroraMenuEntry.Item ->
                        DropdownMenuItem(
                            text = {
                                Text(
                                    entry.label,
                                    color = if (entry.danger) aurora.error
                                            else MaterialTheme.colorScheme.onSurface,
                                )
                            },
                            onClick = { entry.onClick(); onDismissRequest() },
                            leadingIcon = entry.leadingIcon,
                            trailingIcon = entry.trailingText?.let { t ->
                                { Text(t, style = MaterialTheme.typography.labelSmall, color = aurora.borderStrong) }
                            },
                            enabled = entry.enabled,
                        )

                    is AuroraMenuEntry.Group -> {
                        Text(
                            text = entry.heading,
                            style = MaterialTheme.typography.labelSmall,
                            color = aurora.borderStrong,
                        )
                        entry.items.forEach { item ->
                            DropdownMenuItem(
                                text = { Text(item.label) },
                                onClick = { item.onClick(); onDismissRequest() },
                                enabled = item.enabled,
                            )
                        }
                    }
                }
            }
        }
    }
}
