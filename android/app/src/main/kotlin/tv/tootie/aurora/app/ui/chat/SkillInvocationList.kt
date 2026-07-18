package tv.tootie.aurora.app.ui.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
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
        SkillSourceBadge(source = inv.source)
    }
}

@Composable
private fun SkillSourceBadge(source: SkillSource) {
    if (source == SkillSource.EXPLICIT) {
        val aurora = LocalAuroraColors.current
        Box(
            modifier = Modifier
                .background(aurora.accentViolet.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                .padding(horizontal = 4.dp, vertical = 1.dp),
        ) {
            Text(
                "direct",
                style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp),
                color = aurora.accentViolet,
            )
        }
    }
}
