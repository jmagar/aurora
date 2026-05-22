package tv.tootie.aurora.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraSandboxStatus { Ready, Running, Stopped, Error }

/**
 * Sandbox environment info card with runtime/status.
 * Maps to web AI `sandbox` element.
 */
@Composable
public fun AuroraSandbox(
    runtime: String,
    status: AuroraSandboxStatus,
    modifier: Modifier = Modifier,
    envVarCount: Int = 0,
    content: (@Composable () -> Unit)? = null,
) {
    val aurora = LocalAuroraColors.current
    val statusTone = when (status) {
        AuroraSandboxStatus.Ready   -> AuroraStatusTone.Online
        AuroraSandboxStatus.Running -> AuroraStatusTone.Syncing
        AuroraSandboxStatus.Stopped -> AuroraStatusTone.Offline
        AuroraSandboxStatus.Error   -> AuroraStatusTone.Error
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                AuroraStatusIndicator(tone = statusTone, label = status.name)
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    AuroraSnippet(runtime)
                    if (envVarCount > 0) AuroraSnippet("$envVarCount env")
                }
            }
            content?.invoke()
        }
    }
}
