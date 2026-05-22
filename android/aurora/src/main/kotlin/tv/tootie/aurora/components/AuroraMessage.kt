package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraMessageRole { User, Assistant, System }

public data class AuroraMessageData(
    val id: String,
    val role: AuroraMessageRole,
    val content: String,
    val timestamp: String? = null,
)

/**
 * Single conversation message bubble.
 * User: right-aligned cyan bubble. Assistant: left-aligned violet surface.
 * Maps to web AI `message` element.
 */
@Composable
public fun AuroraMessage(
    data: AuroraMessageData,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val isUser = data.role == AuroraMessageRole.User

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start,
        verticalAlignment = Alignment.Bottom,
    ) {
        if (!isUser) {
            AuroraAvatar(
                name = if (data.role == AuroraMessageRole.System) "S" else "A",
                size = AuroraAvatarSize.Sm,
            )
        }

        Column(
            modifier = Modifier
                .widthIn(max = 300.dp)
                .padding(horizontal = 6.dp),
            horizontalAlignment = if (isUser) Alignment.End else Alignment.Start,
        ) {
            Text(
                text = data.content,
                modifier = Modifier
                    .clip(
                        RoundedCornerShape(
                            topStart = 12.dp, topEnd = 12.dp,
                            bottomStart = if (isUser) 12.dp else 2.dp,
                            bottomEnd = if (isUser) 2.dp else 12.dp,
                        )
                    )
                    .background(
                        if (isUser) MaterialTheme.colorScheme.primary
                        else aurora.accentVioletSurface
                    )
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                color = if (isUser) MaterialTheme.colorScheme.onPrimary
                        else MaterialTheme.colorScheme.onSurface,
                style = MaterialTheme.typography.bodyMedium,
            )
            data.timestamp?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
        }

        if (isUser) {
            AuroraAvatar(name = "U", size = AuroraAvatarSize.Sm)
        }
    }
}
