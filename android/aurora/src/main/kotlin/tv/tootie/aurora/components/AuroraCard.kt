package tv.tootie.aurora.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.material3.Card
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.OutlinedCard
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Compose equivalent of Aurora's Card shadcn component.
 *
 * WARNING: Changing variant at runtime causes full child subtree remount.
 * Card, ElevatedCard, and OutlinedCard are distinct composable types — any
 * state held by children (scroll positions, focused inputs) is lost on switch.
 * Use a stable variant that doesn't change after first composition.
 */
sealed class AuroraCardVariant {
    object Filled : AuroraCardVariant()
    object Elevated : AuroraCardVariant()
    object Outlined : AuroraCardVariant()
}

@Composable
fun AuroraCard(
    modifier: Modifier = Modifier,
    variant: AuroraCardVariant = AuroraCardVariant.Elevated,
    onClick: (() -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val auroraColors = LocalAuroraColors.current

    when (variant) {
        is AuroraCardVariant.Elevated -> {
            if (onClick != null) {
                ElevatedCard(onClick = onClick, modifier = modifier) { content() }
            } else {
                ElevatedCard(modifier = modifier) { content() }
            }
        }
        is AuroraCardVariant.Filled -> {
            if (onClick != null) {
                Card(onClick = onClick, modifier = modifier) { content() }
            } else {
                Card(modifier = modifier) { content() }
            }
        }
        is AuroraCardVariant.Outlined -> {
            if (onClick != null) {
                OutlinedCard(
                    onClick = onClick,
                    modifier = modifier,
                    border = BorderStroke(1.dp, auroraColors.borderDefault),
                ) { content() }
            } else {
                OutlinedCard(
                    modifier = modifier,
                    border = BorderStroke(1.dp, auroraColors.borderDefault),
                ) { content() }
            }
        }
    }
}
