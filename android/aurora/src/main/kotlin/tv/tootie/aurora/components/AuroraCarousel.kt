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
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * Horizontal swipe carousel with page indicator dots.
 * Maps to web `carousel`.
 */
@Composable
public fun AuroraCarousel(
    pageCount: Int,
    modifier: Modifier = Modifier,
    showIndicator: Boolean = true,
    content: @Composable (page: Int) -> Unit,
) {
    val aurora = LocalAuroraColors.current
    val pagerState = rememberPagerState { pageCount }

    Column(modifier = modifier) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.weight(1f),
        ) { page ->
            content(page)
        }

        if (showIndicator && pageCount > 1) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                repeat(pageCount) { index ->
                    val isSelected = pagerState.currentPage == index
                    Box(
                        modifier = Modifier
                            .padding(horizontal = 3.dp)
                            .size(if (isSelected) 8.dp else 6.dp)
                            .background(
                                color = if (isSelected) MaterialTheme.colorScheme.primary
                                        else aurora.borderStrong,
                                shape = CircleShape,
                            ),
                    )
                }
            }
        }
    }
}
