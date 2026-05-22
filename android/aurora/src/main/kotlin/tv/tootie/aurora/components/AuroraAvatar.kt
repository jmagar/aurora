package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
 * Circular avatar. Shows [imageUrl] via Coil when provided;
 * falls back to initials derived from [name].
 */
@Composable
public fun AuroraAvatar(
    name: String,
    modifier: Modifier = Modifier,
    imageUrl: String? = null,
    size: AuroraAvatarSize = AuroraAvatarSize.Default,
) {
    val aurora = LocalAuroraColors.current
    val initials = name
        .split(" ")
        .filter { it.isNotBlank() }
        .take(2)
        .joinToString("") { it.first().uppercaseChar().toString() }

    Box(
        modifier = modifier
            .size(size.dp)
            .clip(CircleShape)
            .background(aurora.selectedBg),
        contentAlignment = Alignment.Center,
    ) {
        if (imageUrl != null) {
            AsyncImage(
                model = imageUrl,
                contentDescription = name,
                modifier = Modifier.size(size.dp).clip(CircleShape),
            )
        } else {
            Text(
                text = initials,
                color = MaterialTheme.colorScheme.primary,
                fontSize = (size.dp.value * 0.36f).sp,
                fontWeight = FontWeight.SemiBold,
            )
        }
    }
}
