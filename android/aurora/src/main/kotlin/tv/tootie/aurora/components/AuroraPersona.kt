package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Agent persona row: avatar + name + role.
 *
 * Maps to the web AI `persona` element. The avatar is marked decorative because the
 * [name] text conveys the same identity to screen readers. The row merges descendants
 * and announces itself as "Persona: [name]" or "Persona: [name], [role]".
 *
 * @param name      Agent display name.
 * @param modifier  Caller-supplied modifier applied to the root [Row].
 * @param role      Optional role label shown in violet beneath the name.
 * @param avatarUrl Optional remote image URL passed to [AuroraAvatar].
 */
@Composable
public fun AuroraPersona(
    name: String,
    modifier: Modifier = Modifier,
    role: String? = null,
    avatarUrl: String? = null,
) {
    val aurora = LocalAuroraColors.current

    val rowDescription = if (role != null) "Persona: $name, $role" else "Persona: $name"

    Row(
        modifier = modifier.semantics(mergeDescendants = true) {
            contentDescription = rowDescription
        },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        // Avatar is decorative: the name text already identifies this persona to TalkBack.
        AuroraAvatar(
            name = name,
            imageUrl = avatarUrl,
            size = AuroraAvatarSize.Default,
            modifier = Modifier.semantics { contentDescription = "" },
        )

        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text(
                text = name,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurface,
            )
            if (role != null) {
                Text(
                    text = role,
                    style = MaterialTheme.typography.bodySmall,
                    color = aurora.accentViolet,
                )
            }
        }
    }
}
