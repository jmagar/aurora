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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
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
    }
}
