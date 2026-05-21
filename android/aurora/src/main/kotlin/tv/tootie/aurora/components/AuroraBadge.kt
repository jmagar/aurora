package tv.tootie.aurora.components

import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Compose equivalent of Aurora's Badge shadcn component.
 * count = null renders a dot-only indicator.
 */
@Composable
fun AuroraBadge(
    modifier: Modifier = Modifier,
    count: Int? = null,
    content: @Composable () -> Unit,
) {
    BadgedBox(
        modifier = modifier,
        badge = {
            if (count != null) {
                Badge { Text(count.toString()) }
            } else {
                Badge()
            }
        },
    ) {
        content()
    }
}
