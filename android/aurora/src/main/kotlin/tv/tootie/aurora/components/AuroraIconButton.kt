package tv.tootie.aurora.components

import androidx.compose.foundation.layout.size
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedIconButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

public enum class AuroraIconButtonVariant { Standard, Filled, Tonal, Outlined }

public enum class AuroraIconButtonSize(public val containerSize: Dp, public val iconSize: Dp) {
    Compact(36.dp, 18.dp),
    Default(40.dp, 20.dp),
    Large(48.dp, 24.dp),
}

/**
 * Icon-only action button with Aurora's shared size model.
 *
 * The visual container can be compact, but [minimumInteractiveComponentSize] preserves
 * Material's 48 dp minimum touch target. Put the label on [contentDescription]; the
 * rendered [Icon] is decorative inside the button-level semantics node.
 */
@Composable
public fun AuroraIconButton(
    onClick: () -> Unit,
    imageVector: ImageVector,
    contentDescription: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    variant: AuroraIconButtonVariant = AuroraIconButtonVariant.Standard,
    size: AuroraIconButtonSize = AuroraIconButtonSize.Default,
) {
    AuroraIconButton(
        onClick = onClick,
        contentDescription = contentDescription,
        modifier = modifier,
        enabled = enabled,
        variant = variant,
        size = size,
    ) {
        Icon(
            imageVector = imageVector,
            contentDescription = null,
            modifier = Modifier.size(size.iconSize),
        )
    }
}

@Composable
public fun AuroraIconButton(
    onClick: () -> Unit,
    contentDescription: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    variant: AuroraIconButtonVariant = AuroraIconButtonVariant.Standard,
    size: AuroraIconButtonSize = AuroraIconButtonSize.Default,
    content: @Composable () -> Unit,
) {
    val buttonModifier = modifier
        .minimumInteractiveComponentSize()
        .size(size.containerSize)
        .semantics { this.contentDescription = contentDescription }

    when (variant) {
        AuroraIconButtonVariant.Standard -> IconButton(
            onClick = onClick,
            modifier = buttonModifier,
            enabled = enabled,
            content = content,
        )

        AuroraIconButtonVariant.Filled -> FilledIconButton(
            onClick = onClick,
            modifier = buttonModifier,
            enabled = enabled,
            content = content,
        )

        AuroraIconButtonVariant.Tonal -> FilledTonalIconButton(
            onClick = onClick,
            modifier = buttonModifier,
            enabled = enabled,
            content = content,
        )

        AuroraIconButtonVariant.Outlined -> OutlinedIconButton(
            onClick = onClick,
            modifier = buttonModifier,
            enabled = enabled,
            content = content,
        )
    }
}
