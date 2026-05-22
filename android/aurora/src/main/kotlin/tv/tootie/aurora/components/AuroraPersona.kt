package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Agent persona row: avatar + name + role.
 * Maps to web AI `persona` element.
 */
@Composable
public fun AuroraPersona(
    name: String,
    modifier: Modifier = Modifier,
    role: String? = null,
    avatarUrl: String? = null,
) {
    val aurora = LocalAuroraColors.current

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        AuroraAvatar(name = name, imageUrl = avatarUrl, size = AuroraAvatarSize.Default)
        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text(name, style = MaterialTheme.typography.labelLarge)
            role?.let {
                Text(it, style = MaterialTheme.typography.bodySmall, color = aurora.accentViolet)
            }
        }
    }
}
