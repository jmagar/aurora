package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraAvatarSize(public val dp: Dp) {
    Sm(24.dp), Default(36.dp), Lg(48.dp), Xl(64.dp)
}

/**
 * Circular avatar. Shows [imageUrl] via Coil when provided; falls back to
 * an [icon] glyph (preferred) or initials derived from [name].
 *
 * Bead xe0i: Conversation rendering passes the well-known names "You" and
 * "Assistant" / "System". To keep AuroraMessage callers untouched, those
 * labels auto-resolve to Material icons in their accent color rather than
 * single-letter initials. Callers can still pass an explicit [icon] +
 * [accentColor] / [backgroundColor] to override.
 */
@Composable
public fun AuroraAvatar(
    name: String,
    modifier: Modifier = Modifier,
    imageUrl: String? = null,
    size: AuroraAvatarSize = AuroraAvatarSize.Default,
    icon: ImageVector? = null,
    accentColor: Color? = null,
    backgroundColor: Color? = null,
) {
    val aurora = LocalAuroraColors.current

    // Bead xe0i: auto-resolve well-known conversation roles to proper glyphs.
    val resolvedIcon = icon ?: when (name) {
        "You", "User"       -> Icons.Default.Person
        "Assistant", "Bot"  -> Icons.Default.AutoAwesome
        "System"            -> Icons.Default.AutoAwesome
        else                -> null
    }
    val resolvedAccent = accentColor ?: when (name) {
        "You", "User"       -> MaterialTheme.colorScheme.primary           // cyan
        "Assistant", "Bot",
        "System"            -> aurora.accentViolet                         // AI/automation accent
        else                -> MaterialTheme.colorScheme.primary
    }
    val resolvedBg = backgroundColor ?: aurora.selectedBg

    val initials = name
        .split(" ")
        .filter { it.isNotBlank() }
        .take(2)
        .joinToString("") { it.first().uppercaseChar().toString() }

    Box(
        modifier = modifier
            .size(size.dp)
            .clip(CircleShape)
            .background(resolvedBg),
        contentAlignment = Alignment.Center,
    ) {
        when {
            imageUrl != null -> AsyncImage(
                model = imageUrl,
                contentDescription = name,
                modifier = Modifier.size(size.dp).clip(CircleShape),
            )
            resolvedIcon != null -> Icon(
                imageVector = resolvedIcon,
                contentDescription = null,
                tint = resolvedAccent,
                modifier = Modifier.size((size.dp.value * 0.55f).dp),
            )
            else -> Text(
                text = initials,
                color = resolvedAccent,
                fontSize = (size.dp.value * 0.36f).sp,
                fontWeight = FontWeight.SemiBold,
            )
        }
    }
}
