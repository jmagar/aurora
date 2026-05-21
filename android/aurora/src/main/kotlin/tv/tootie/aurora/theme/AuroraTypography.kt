package tv.tootie.aurora.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Font families — bundled as res/font/ assets (no downloadable fonts)
// Note: actual TTF files are not yet included; define families for wiring.
// Replace FontFamily.Default references once font files are added to res/font/.
private val ManropeFamily = FontFamily.Default   // placeholder until Manrope TTF is bundled
private val InterFamily   = FontFamily.Default   // placeholder until Inter TTF is bundled
private val MonoFamily    = FontFamily.Monospace // placeholder until JetBrains Mono TTF is bundled

// Aurora type scale mapped to M3 TextStyle slots
// Values from --aurora-type-* and --aurora-weight-* CSS tokens
internal val AuroraTypography = Typography(
    displayLarge  = TextStyle(fontFamily = ManropeFamily, fontWeight = FontWeight(760), fontSize = 28.sp, lineHeight = 34.sp),
    displayMedium = TextStyle(fontFamily = ManropeFamily, fontWeight = FontWeight(760), fontSize = 22.sp, lineHeight = 28.sp),
    displaySmall  = TextStyle(fontFamily = ManropeFamily, fontWeight = FontWeight(760), fontSize = 18.sp, lineHeight = 24.sp),
    headlineLarge  = TextStyle(fontFamily = ManropeFamily, fontWeight = FontWeight(650), fontSize = 16.sp, lineHeight = 22.sp),
    headlineMedium = TextStyle(fontFamily = ManropeFamily, fontWeight = FontWeight(650), fontSize = 15.sp, lineHeight = 21.sp),
    headlineSmall  = TextStyle(fontFamily = ManropeFamily, fontWeight = FontWeight(650), fontSize = 14.sp, lineHeight = 20.sp),
    titleLarge   = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(650), fontSize = 14.sp, lineHeight = 20.sp),
    titleMedium  = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(560), fontSize = 14.sp, lineHeight = 20.sp, letterSpacing = 0.07.sp),  // 0.005em × 14.sp
    titleSmall   = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(560), fontSize = 13.sp, lineHeight = 18.sp, letterSpacing = 0.07.sp),  // 0.005em × 13.sp
    bodyLarge   = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(480), fontSize = 14.sp, lineHeight = 22.sp),
    bodyMedium  = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(480), fontSize = 13.sp, lineHeight = 20.sp),
    bodySmall   = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(480), fontSize = 12.sp, lineHeight = 18.sp),
    labelLarge  = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(650), fontSize = 13.sp, lineHeight = 18.sp, letterSpacing = 0.16.sp),  // 0.012em × 13.sp
    labelMedium = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(650), fontSize = 12.sp, lineHeight = 16.sp, letterSpacing = 0.14.sp),  // 0.012em × 12.sp
    labelSmall  = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight(650), fontSize = 10.5.sp, lineHeight = 14.sp, letterSpacing = 0.19.sp),  // 0.018em × 10.5.sp
)
