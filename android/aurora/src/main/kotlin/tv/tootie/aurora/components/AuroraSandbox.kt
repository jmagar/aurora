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
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.theme.LocalAuroraColors

public enum class AuroraSandboxStatus { Ready, Running, Stopped, Error }

/**
 * Sandbox environment info card with runtime/status.
 * Maps to web AI `sandbox` element.
 *
 * Accessibility:
 * - [contentDescription] combines runtime, status, and env var count so screen
 *   readers convey the full picture in one announcement.
 * - A polite live region ensures TalkBack announces status changes automatically
 *   when [status] transitions (e.g. Ready → Running).
 * - [isTraversalGroup] groups the card so TalkBack navigates it as a unit.
 * - The [content] slot (e.g. run/reset buttons) is responsible for its own
 *   [contentDescription] values.
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

    val envPart = if (envVarCount > 0) ", $envVarCount environment variable${if (envVarCount != 1) "s" else ""}" else ""
    val cardDescription = "Sandbox: $runtime, ${status.name}$envPart"

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, aurora.borderDefault, RoundedCornerShape(8.dp))
            .semantics {
                isTraversalGroup = true
                contentDescription = cardDescription
                liveRegion = LiveRegionMode.Polite
            },
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
