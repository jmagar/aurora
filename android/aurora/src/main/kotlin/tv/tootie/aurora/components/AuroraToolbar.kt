package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.VerticalDivider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Horizontal inline toolbar — NOT a TopAppBar.
 * Maps to web `toolbar` (the aurora toolbar is inline, not a page header).
 * Compose dividers between groups using [AuroraToolbarSeparator].
 */
@Composable
public fun AuroraToolbar(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
        shadowElevation = 1.dp,
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(2.dp),
            content = content,
        )
    }
}

/** Thin vertical separator between toolbar groups. */
@Composable
public fun AuroraToolbarSeparator(modifier: Modifier = Modifier) {
    val aurora = LocalAuroraColors.current
    VerticalDivider(
        modifier = modifier
            .height(18.dp)
            .padding(horizontal = 4.dp),
        color = aurora.borderDefault,
        thickness = 1.dp,
    )
}
