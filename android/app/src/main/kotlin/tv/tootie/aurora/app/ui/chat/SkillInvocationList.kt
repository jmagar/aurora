package tv.tootie.aurora.app.ui.chat

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import tv.tootie.aurora.theme.LocalAuroraColors

@Composable
public fun SkillInvocationList(
    invocations: List<SkillInvocation>,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier.padding(horizontal = 12.dp, vertical = 4.dp),
        verticalArrangement = Arrangement.spacedBy(3.dp),
    ) {
        invocations.filter { it.skillName.isNotBlank() }.forEach { inv ->
            SkillInvocationRow(inv)
        }
    }
}

@Composable
private fun SkillInvocationRow(inv: SkillInvocation) {
    val aurora = LocalAuroraColors.current
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        modifier = Modifier.padding(vertical = 1.dp),
    ) {
        Icon(
            if (inv.done) Icons.Default.CheckCircle else Icons.Default.AutoAwesome,
            contentDescription = null,
            tint = if (inv.done) aurora.success else aurora.accentViolet,
            modifier = Modifier.size(12.dp),
        )
        Text(
            text = "Using `${inv.skillName}`",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        // Source badge — only shown for non-HOOK sources
        when (inv.source) {
            SkillSource.TEXT_PARSE -> SkillSourceBadge(label = "auto", color = MaterialTheme.colorScheme.outline)
            SkillSource.EXPLICIT -> SkillSourceBadge(label = "direct", color = aurora.accentViolet)
            SkillSource.HOOK -> Unit
        }
    }
}

@Composable
private fun SkillSourceBadge(label: String, color: androidx.compose.ui.graphics.Color) {
    Surface(
        shape = MaterialTheme.shapes.extraSmall,
        color = color.copy(alpha = 0.15f),
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            fontSize = 9.sp,
            modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp),
        )
    }
}
