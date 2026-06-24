package tv.tootie.aurora.app.ui.sidebar

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import tv.tootie.aurora.app.data.AppSettings
import tv.tootie.aurora.components.AuroraButton
import tv.tootie.aurora.components.AuroraButtonVariant
import tv.tootie.aurora.components.AuroraStatusIndicator
import tv.tootie.aurora.components.AuroraStatusTone
import tv.tootie.aurora.theme.LocalAuroraColors
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit

data class SessionItem(
    val id: String,
    val title: String,
    val cwd: String,
    val updatedAt: Long,
    val isLive: Boolean = false,
    /**
     * Server-reported thread run status. One of "active", "paused", "idle", or "closed".
     * Drives the sidebar status indicator tone:
     *   active → Online (cyan pulsing dot)
     *   paused → Away (amber)
     *   idle   → no indicator (thread loaded but not running)
     *   closed → no indicator (thread unloaded from server memory)
     */
    val threadStatus: String = "idle",
)

data class ProjectGroup(
    val cwd: String,
    val displayName: String,
    val sessions: List<SessionItem>,
)

fun relativeTime(epochSeconds: Long): String {
    val now = Instant.now()
    val then = Instant.ofEpochSecond(epochSeconds)
    val minutes = ChronoUnit.MINUTES.between(then, now)
    return when {
        minutes < 1 -> "just now"
        minutes < 60 -> "${minutes}m ago"
        minutes < 1440 -> "${minutes / 60}h ago"
        minutes < 10080 -> "${minutes / 1440}d ago"
        else -> {
            val date = then.atZone(ZoneId.systemDefault()).toLocalDate()
            "${date.monthValue}/${date.dayOfMonth}"
        }
    }
}

@Composable
fun SessionsSidebar(
    projects: List<ProjectGroup>,
    activeSessionId: String?,
    isLoading: Boolean,
    onSessionClick: (String) -> Unit,
    onNewSession: () -> Unit,
    onSettings: () -> Unit,
    modifier: Modifier = Modifier,
    currentGoal: ThreadGoal? = null,
    showGoalEditor: Boolean = false,
    onShowGoalEditor: () -> Unit = {},
    onSetGoal: (String) -> Unit = {},
    onClearGoal: () -> Unit = {},
    onHideGoalEditor: () -> Unit = {},
    mcpServers: List<McpServerInfo> = emptyList(),
) {
    val aurora = LocalAuroraColors.current

    ModalDrawerSheet(
        modifier = modifier,
        drawerContainerColor = MaterialTheme.colorScheme.surface,
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .background(aurora.selectedBg, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        "⬡",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
                Text("Codex", style = MaterialTheme.typography.titleMedium)
            }
            IconButton(onClick = onNewSession) {
                Icon(Icons.Default.Add, contentDescription = "New session")
            }
        }

        HorizontalDivider(color = aurora.borderDefault)

        // Goal strip
        if (currentGoal != null) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = currentGoal.objective,
                    style = MaterialTheme.typography.labelMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f),
                )
                IconButton(onClick = onShowGoalEditor, modifier = Modifier.size(20.dp)) {
                    Icon(Icons.Default.Edit, contentDescription = "Edit goal", modifier = Modifier.size(14.dp))
                }
            }
        } else {
            TextButton(onClick = onShowGoalEditor, modifier = Modifier.padding(horizontal = 8.dp)) {
                Text("+ Set goal", style = MaterialTheme.typography.labelMedium)
            }
        }

        if (showGoalEditor) {
            GoalEditorSheet(
                currentGoal = currentGoal,
                onSetGoal = onSetGoal,
                onClearGoal = onClearGoal,
                onDismiss = onHideGoalEditor,
            )
        }

        // Session list — wrapped in a Box(weight 1f) so the footer below always pins to bottom
        // regardless of loading / empty / populated state.
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
        ) {
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                }
            } else if (projects.isEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(
                        "No sessions yet",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    AuroraButton(
                        onClick = onNewSession,
                        variant = AuroraButtonVariant.Filled,
                    ) { Text("Start one") }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    contentPadding = PaddingValues(vertical = 4.dp),
                ) {
                    projects.forEach { project ->
                        item(key = "hdr_${project.cwd}") {
                            ProjectHeader(project = project)
                        }
                        items(project.sessions, key = { it.id }) { session ->
                            SessionRow(
                                session = session,
                                isActive = session.id == activeSessionId,
                                onClick = { onSessionClick(session.id) },
                            )
                        }
                    }
                }
            }
        }

        McpServerPanel(servers = mcpServers)

        // Footer — always anchored at bottom of drawer.
        HorizontalDivider(color = aurora.borderDefault)
        val ctx = LocalContext.current
        val settings = remember(ctx) { AppSettings(ctx) }
        val authMethod by settings.authMethod.collectAsStateWithLifecycle(initialValue = null)
        val authLabel = when (authMethod) {
            "apiKey" -> "API Key"
            "chatgpt" -> "ChatGPT"
            "chatgptDeviceCode" -> "ChatGPT (device)"
            "chatgptAuthTokens" -> "ChatGPT (tokens)"
            null -> "Not signed in"
            else -> authMethod ?: "Not signed in"
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                text = authLabel,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f),
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(0.dp),
            ) {
                IconButton(onClick = onSettings) {
                    Icon(
                        Icons.Default.Settings,
                        contentDescription = "Settings",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                // TODO(aurora-design-system-vyjr): Wire a real logout callback through
                // SessionsSidebar's signature (and NavHost) instead of routing to Settings.
                // Kept minimal here to avoid expanding the component API in this change.
                IconButton(onClick = onSettings) {
                    Icon(
                        Icons.AutoMirrored.Filled.Logout,
                        contentDescription = "Log out",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}

@Composable
private fun ProjectHeader(project: ProjectGroup) {
    var expanded by remember { mutableStateOf(true) }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(role = Role.Button) { expanded = !expanded }
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Icon(
            Icons.Default.Folder,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(16.dp),
        )
        Text(
            project.displayName,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.weight(1f),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        Icon(
            if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(14.dp),
        )
    }
}

@Composable
private fun SessionRow(
    session: SessionItem,
    isActive: Boolean,
    onClick: () -> Unit,
) {
    val aurora = LocalAuroraColors.current
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(if (isActive) aurora.selectedBg else Color.Transparent)
            .clickable(role = Role.Button, onClick = onClick)
            .padding(start = 32.dp, end = 12.dp, top = 8.dp, bottom = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        when (session.threadStatus) {
            "active" -> AuroraStatusIndicator(tone = AuroraStatusTone.Online, dotSize = 6.dp)
            "paused" -> AuroraStatusIndicator(tone = AuroraStatusTone.Syncing, dotSize = 6.dp)
            else     -> Spacer(Modifier.size(6.dp))
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(
                session.title,
                style = MaterialTheme.typography.bodySmall,
                color = if (isActive) MaterialTheme.colorScheme.primary
                else MaterialTheme.colorScheme.onSurface,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        Text(
            relativeTime(session.updatedAt),
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
