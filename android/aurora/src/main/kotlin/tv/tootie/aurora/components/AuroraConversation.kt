package tv.tootie.aurora.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.collections.immutable.ImmutableList

/**
 * Scrollable conversation message list.
 *
 * Renders messages in a [LazyColumn] with `reverseLayout = true` so the most recent
 * message appears at the bottom — the standard chat-app UX. Each message is keyed by
 * [AuroraMessageData.id] for stable, efficient recomposition.
 *
 * The column is annotated as a live region ([LiveRegionMode.Polite]) so TalkBack
 * announces new messages as they arrive without interrupting ongoing speech.
 *
 * **Stability:** [messages] is typed as [ImmutableList] so Compose can skip
 * recomposition of this composable when the list reference is stable. Wrap caller
 * data with `persistentListOf()` or `toPersistentList()` from
 * `kotlinx-collections-immutable`.
 *
 * @param messages       Messages to display, ordered oldest-first.
 * @param modifier       Caller-supplied modifier applied to the [LazyColumn].
 * @param autoScroll     When `true`, scrolls to the newest message whenever
 *                       [messages] grows. Defaults to `true`.
 * @param contentPadding Padding applied inside the scroll container.
 */
@Composable
public fun AuroraConversation(
    messages: ImmutableList<AuroraMessageData>,
    modifier: Modifier = Modifier,
    autoScroll: Boolean = true,
    contentPadding: PaddingValues = PaddingValues(12.dp),
) {
    val listState = rememberLazyListState()

    if (autoScroll) {
        LaunchedEffect(messages.size) {
            // With reverseLayout = true, index 0 is the visual bottom (newest message).
            if (messages.isNotEmpty()) listState.animateScrollToItem(0)
        }
    }

    LazyColumn(
        state = listState,
        reverseLayout = true,
        modifier = modifier.semantics {
            contentDescription = "Conversation"
            liveRegion = LiveRegionMode.Polite
        },
        contentPadding = contentPadding,
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        items(messages, key = { it.id }) { msg ->
            AuroraMessage(data = msg)
        }
    }
}
