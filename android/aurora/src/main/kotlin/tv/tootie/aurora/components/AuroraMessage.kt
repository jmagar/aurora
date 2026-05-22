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
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraMessageRole { User, Assistant, System }

/**
 * Immutable value type representing a single message in a conversation.
 *
 * Annotated [@Immutable] so Compose can skip recomposition of [AuroraMessage] when
 * the instance is referentially stable — critical for smooth list scrolling.
 *
 * @param id        Stable, unique identifier used as the [LazyColumn] item key.
 * @param role      Sender role; drives alignment, bubble color, and TalkBack prefix.
 * @param content   Text body of the message.
 * @param timestamp Optional human-readable timestamp shown below the bubble.
 */
@Immutable
public data class AuroraMessageData(
    val id: String,
    val role: AuroraMessageRole,
    val content: String,
    val timestamp: String? = null,
)

/**
 * Single conversation message bubble.
 *
 * Layout:
 * - User messages: right-aligned, cyan ([MaterialTheme.colorScheme.primary]) bubble.
 * - Assistant messages: left-aligned, violet surface bubble with avatar.
 * - System messages: left-aligned, violet surface bubble with "S" avatar.
 *
 * Accessibility: the row merges descendants and announces as "You: [content]",
 * "Assistant: [content]", or "System: [content]" for TalkBack.
 *
 * @param data      Message data to display.
 * @param modifier  Caller-supplied modifier applied to the root [Row].
 */
@Composable
public fun AuroraMessage(
    data: AuroraMessageData,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val isUser = data.role == AuroraMessageRole.User

    val rolePrefix = when (data.role) {
        AuroraMessageRole.User      -> "You"
        AuroraMessageRole.Assistant -> "Assistant"
        AuroraMessageRole.System    -> "System"
    }
    val avatarLabel = when (data.role) {
        AuroraMessageRole.Assistant -> "Assistant"
        AuroraMessageRole.System    -> "System"
        AuroraMessageRole.User      -> "You"
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .semantics(mergeDescendants = true) {
                contentDescription = "$rolePrefix: ${data.content}"
            },
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start,
        verticalAlignment = Alignment.Bottom,
    ) {
        if (!isUser) {
            AuroraAvatar(
                name = avatarLabel,
                size = AuroraAvatarSize.Sm,
                // Avatar label is redundant with the merged row contentDescription —
                // suppress so TalkBack does not double-announce the sender name.
                modifier = Modifier.semantics { contentDescription = "" },
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
                        else aurora.infoSurface,
                    )
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                color = if (isUser) MaterialTheme.colorScheme.onPrimary
                        else MaterialTheme.colorScheme.onSurface,
                style = MaterialTheme.typography.bodyMedium,
            )
            if (data.timestamp != null) {
                Text(
                    text = data.timestamp,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
        }

        if (isUser) {
            AuroraAvatar(
                name = "You",
                size = AuroraAvatarSize.Sm,
                modifier = Modifier.semantics { contentDescription = "" },
            )
        }
    }
}
