package tv.tootie.aurora.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

// Aurora radius scale from --aurora-radius-1/2/3 (14dp, 18dp, 22dp)
// Folded directly here instead of a generated AuroraDimens object
private val radius1 = 14.dp
private val radius2 = 18.dp
private val radius3 = 22.dp

internal val AuroraShapes = Shapes(
    extraSmall = RoundedCornerShape(radius1),
    small      = RoundedCornerShape(radius1),
    medium     = RoundedCornerShape(radius2),
    large      = RoundedCornerShape(radius2),
    extraLarge = RoundedCornerShape(radius3),
)
