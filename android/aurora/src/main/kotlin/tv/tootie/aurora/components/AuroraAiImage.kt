package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import tv.tootie.aurora.theme.LocalAuroraColors

/**
 * AI-generated image display with Aurora border. Maps to web AI `image` element.
 *
 * Wraps [AsyncImage] from Coil 3 with a rounded clip and optional caption below.
 *
 * @param url Remote or local image URL passed directly to Coil.
 * @param contentDescription Accessibility description for the image.
 * @param modifier Modifier applied to the outer [Column].
 * @param aspectRatio Width-to-height ratio of the image. Defaults to 16:9.
 * @param caption Optional caption rendered below the image.
 */
@Composable
public fun AuroraAiImage(
    url: String,
    contentDescription: String,
    modifier: Modifier = Modifier,
    aspectRatio: Float = 16f / 9f,
    caption: String? = null,
) {
    val aurora = LocalAuroraColors.current

    Column(modifier = modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
        ) {
            AsyncImage(
                model = url,
                contentDescription = contentDescription,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(aspectRatio),
            )
        }

        if (caption != null) {
            Text(
                text = caption,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 4.dp),
            )
        }
    }
}
