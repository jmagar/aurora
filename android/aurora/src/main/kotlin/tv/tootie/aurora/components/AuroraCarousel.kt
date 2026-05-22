package tv.tootie.aurora.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.PagerState
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Horizontal swipe carousel with page indicator dots and accessible prev/next controls.
 * Maps to web `carousel`.
 *
 * @param pageCount total number of pages
 * @param modifier applied to the root [Column]
 * @param state hoisted [PagerState]; defaults to an internally-remembered state so callers that
 *   do not need external observation can omit it
 * @param showIndicator whether to show the page indicator dots row
 * @param content page content slot; receives the 0-based page index
 */
@Composable
public fun AuroraCarousel(
    pageCount: Int,
    modifier: Modifier = Modifier,
    state: PagerState = rememberPagerState { pageCount },
    showIndicator: Boolean = true,
    content: @Composable (page: Int) -> Unit,
) {
    val aurora = LocalAuroraColors.current
    val scope = rememberCoroutineScope()

    Column(modifier = modifier) {
        // Navigation controls + pager in an overlapping Box so arrows sit on the pager edges.
        // weight(1f) is applied to Box — a ColumnScope child — so it fills remaining Column height.
        Box(modifier = Modifier.weight(1f)) {
            HorizontalPager(
                state = state,
            ) { page ->
                content(page)
            }

            // Previous page button — visible and focusable by TalkBack
            if (state.canScrollBackward) {
                FilledTonalIconButton(
                    onClick = {
                        scope.launch { state.animateScrollToPage(state.currentPage - 1) }
                    },
                    modifier = Modifier
                        .align(Alignment.CenterStart)
                        .padding(start = 8.dp),
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowLeft,
                        contentDescription = "Previous page",
                    )
                }
            }

            // Next page button — visible and focusable by TalkBack
            if (state.canScrollForward) {
                FilledTonalIconButton(
                    onClick = {
                        scope.launch { state.animateScrollToPage(state.currentPage + 1) }
                    },
                    modifier = Modifier
                        .align(Alignment.CenterEnd)
                        .padding(end = 8.dp),
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                        contentDescription = "Next page",
                    )
                }
            }
        }

        if (showIndicator && pageCount > 1) {
            // The Row announces position changes to TalkBack via liveRegion; individual dots
            // are decorative and suppressed from the accessibility tree.
            val currentPageLabel = "Page ${state.currentPage + 1} of $pageCount"
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .semantics {
                        contentDescription = currentPageLabel
                        liveRegion = LiveRegionMode.Polite
                    },
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                repeat(pageCount) { index ->
                    val isSelected = state.currentPage == index
                    Box(
                        modifier = Modifier
                            .padding(horizontal = 3.dp)
                            .size(if (isSelected) 8.dp else 6.dp)
                            .background(
                                color = if (isSelected) MaterialTheme.colorScheme.primary
                                        else aurora.borderStrong,
                                shape = CircleShape,
                            )
                            // Dots are decorative; the Row above announces position.
                            .clearAndSetSemantics {},
                    )
                }
            }
        }
    }
}
