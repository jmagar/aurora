package tv.tootie.aurora.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Inline superscript citation link. Maps to web AI `inline-citation` element.
 */
@Composable
public fun AuroraInlineCitation(
    number: Int,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier.clickable(role = Role.Link, onClick = onClick),
        shape = RoundedCornerShape(4.dp),
        color = aurora.accentVioletSurface,
    ) {
        Text(
            text = "[$number]",
            style = MaterialTheme.typography.labelSmall,
            color = aurora.accentViolet,
            modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp),
        )
    }
}
