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
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Inline superscript citation link.
 *
 * Renders a violet-tinted badge showing `[N]` that acts as a link to a source.
 * Maps to the web AI `inline-citation` element.
 *
 * Accessibility: TalkBack announces "Citation [number]" via an explicit
 * [contentDescription] so the bare numeral `[1]` is not read in isolation.
 * The [Role.Link] semantic signals to assistive services that activation
 * navigates to a related document.
 *
 * @param number    1-based citation index displayed inside the badge.
 * @param onClick   Called when the citation is tapped.
 * @param modifier  Caller-supplied modifier applied to the root [Surface].
 */
@Composable
public fun AuroraInlineCitation(
    number: Int,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current

    Surface(
        modifier = modifier
            .semantics {
                contentDescription = "Citation $number"
            }
            .clickable(role = Role.Button, onClick = onClick),
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
