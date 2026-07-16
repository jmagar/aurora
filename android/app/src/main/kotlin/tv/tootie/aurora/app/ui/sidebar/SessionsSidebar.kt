package tv.tootie.aurora.app.ui.sidebar

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.automirrored.filled.CallSplit
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Archive
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DriveFileRenameOutline
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Unarchive
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.Tab
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import tv.tootie.aurora.app.data.AppSettings
import tv.tootie.aurora.components.AuroraButton
import tv.tootie.aurora.components.AuroraButtonVariant
import tv.tootie.aurora.components.AuroraStatusIndicator
import tv.tootie.aurora.components.AuroraStatusTone
import tv.tootie.aurora.theme.LocalAuroraColors
import java.util.Calendar

data class SessionItem(
    val id: String,
    val title: String,
    val cwd: String,
    val updatedAt: Long,
    val isLive: Boolean = false,
    val isArchived: Boolean = false,
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
    val thenMillis = epochSeconds * 1000L
    val minutes = ((System.currentTimeMillis() - thenMillis) / 60_000L).coerceAtLeast(0L)
    return when {
        minutes < 1 -> "just now"
        minutes < 60 -> "${minutes}m ago"
        minutes < 1440 -> "${minutes / 60}h ago"
        minutes < 10080 -> "${minutes / 1440}d ago"
        else -> {
            val calendar = Calendar.getInstance().apply { timeInMillis = thenMillis }
            "${calendar.get(Calendar.MONTH) + 1}/${calendar.get(Calendar.DAY_OF_MONTH)}"
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
    goalError: String? = null,
    onClearGoalError: () -> Unit = {},
    onTerminal: () -> Unit = {},
    onLogout: () -> Unit = {},
    threadFilter: ThreadFilter = ThreadFilter.Active,
    onThreadFilterChange: (ThreadFilter) -> Unit = {},
    renamingThreadId: String? = null,
    renameText: String = "",
    onRenameTextChange: (String) -> Unit = {},
    onStartRename: (String, String) -> Unit = { _, _ -> },
    onCommitRename: () -> Unit = {},
    onCancelRename: () -> Unit = {},
    onArchiveThread: (String) -> Unit = {},
    onUnarchiveThread: (String) -> Unit = {},
    onForkThread: (String) -> Unit = {},
    isForkingThread: Boolean = false,
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
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (isForkingThread) {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                    Spacer(Modifier.width(4.dp))
                }
                IconButton(onClick = onNewSession) {
                    Icon(Icons.Default.Add, contentDescription = "New session")
                }
            }
        }

        HorizontalDivider(color = aurora.borderDefault)

        PrimaryTabRow(selectedTabIndex = threadFilter.ordinal) {
            Tab(
                selected = threadFilter == ThreadFilter.Active,
                onClick = { onThreadFilterChange(ThreadFilter.Active) },
                text = { Text("Active", style = MaterialTheme.typography.labelSmall) },
            )
            Tab(
                selected = threadFilter == ThreadFilter.Archived,
                onClick = { onThreadFilterChange(ThreadFilter.Archived) },
                text = { Text("Archived", style = MaterialTheme.typography.labelSmall) },
            )
        }

        // Goal strip
        if (threadFilter == ThreadFilter.Active) {
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
        }

        if (goalError != null) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 4.dp)
                    .background(
                        MaterialTheme.colorScheme.errorContainer,
                        shape = MaterialTheme.shapes.small,
                    )
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text(
                    goalError,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    modifier = Modifier.weight(1f),
                )
                IconButton(onClick = onClearGoalError, modifier = Modifier.size(20.dp)) {
                    Icon(
                        Icons.Default.Close,
                        contentDescription = "Dismiss error",
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.onErrorContainer,
                    )
                }
            }
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
            } else {
                val filteredProjects = projects.map { group ->
                    group.copy(sessions = group.sessions.filter { session ->
                        if (threadFilter == ThreadFilter.Archived) session.isArchived else !session.isArchived
                    })
                }.filter { it.sessions.isNotEmpty() }

                if (filteredProjects.isEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        Text(
                            if (threadFilter == ThreadFilter.Archived) "No archived sessions" else "No sessions yet",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        if (threadFilter == ThreadFilter.Active) {
                            AuroraButton(
                                onClick = onNewSession,
                                variant = AuroraButtonVariant.Filled,
                            ) { Text("Start one") }
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxWidth(),
                        contentPadding = PaddingValues(vertical = 4.dp),
                    ) {
                        filteredProjects.forEach { project ->
                            item(key = "hdr_${project.cwd}") {
                                ProjectHeader(project = project)
                            }
                            items(project.sessions, key = { it.id }) { session ->
                                SessionRow(
                                    session = session,
                                    isActive = session.id == activeSessionId,
                                    isRenaming = session.id == renamingThreadId,
                                    renameText = if (session.id == renamingThreadId) renameText else "",
                                    onClick = { onSessionClick(session.id) },
                                    onStartRename = { onStartRename(session.id, session.title) },
                                    onRenameTextChange = onRenameTextChange,
                                    onCommitRename = onCommitRename,
                                    onCancelRename = onCancelRename,
                                    onArchive = { onArchiveThread(session.id) },
                                    onUnarchive = { onUnarchiveThread(session.id) },
                                    onFork = { onForkThread(session.id) },
                                )
                            }
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
                IconButton(onClick = onTerminal) {
                    Icon(
                        Icons.Default.Code,
                        contentDescription = "Terminal",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                IconButton(onClick = onSettings) {
                    Icon(
                        Icons.Default.Settings,
                        contentDescription = "Settings",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                IconButton(onClick = onLogout) {
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

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun SessionRow(
    session: SessionItem,
    isActive: Boolean,
    isRenaming: Boolean,
    renameText: String,
    onClick: () -> Unit,
    onStartRename: () -> Unit,
    onRenameTextChange: (String) -> Unit,
    onCommitRename: () -> Unit,
    onCancelRename: () -> Unit,
    onArchive: () -> Unit,
    onUnarchive: () -> Unit,
    onFork: () -> Unit,
) {
    val aurora = LocalAuroraColors.current
    var contextMenuOpen by remember { mutableStateOf(false) }
    val focusRequester = remember { FocusRequester() }

    Box {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(if (isActive) aurora.selectedBg else Color.Transparent)
                .combinedClickable(
                    role = Role.Button,
                    onClick = { if (!isRenaming) onClick() },
                    onLongClick = { if (!isRenaming) contextMenuOpen = true },
                )
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
                if (isRenaming) {
                    BasicTextField(
                        value = renameText,
                        onValueChange = onRenameTextChange,
                        textStyle = MaterialTheme.typography.bodySmall.copy(
                            color = MaterialTheme.colorScheme.primary,
                        ),
                        cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = { onCommitRename() }),
                        modifier = Modifier
                            .fillMaxWidth()
                            .focusRequester(focusRequester),
                    )
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        focusRequester.requestFocus()
                    }
                } else {
                    Text(
                        session.title,
                        style = MaterialTheme.typography.bodySmall,
                        color = if (isActive) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
            if (!isRenaming) {
                Text(
                    relativeTime(session.updatedAt),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        DropdownMenu(
            expanded = contextMenuOpen,
            onDismissRequest = { contextMenuOpen = false },
        ) {
            DropdownMenuItem(
                leadingIcon = {
                    Icon(
                        Icons.Default.DriveFileRenameOutline,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp),
                    )
                },
                text = { Text("Rename", style = MaterialTheme.typography.bodyMedium) },
                onClick = {
                    contextMenuOpen = false
                    onStartRename()
                },
            )
            HorizontalDivider()
            if (session.isArchived) {
                DropdownMenuItem(
                    leadingIcon = {
                        Icon(
                            Icons.Default.Unarchive,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp),
                        )
                    },
                    text = { Text("Unarchive", style = MaterialTheme.typography.bodyMedium) },
                    onClick = {
                        contextMenuOpen = false
                        onUnarchive()
                    },
                )
            } else {
                DropdownMenuItem(
                    leadingIcon = {
                        Icon(
                            Icons.Default.Archive,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp),
                        )
                    },
                    text = { Text("Archive", style = MaterialTheme.typography.bodyMedium) },
                    onClick = {
                        contextMenuOpen = false
                        onArchive()
                    },
                )
            }
            HorizontalDivider()
            DropdownMenuItem(
                leadingIcon = {
                    Icon(
                        Icons.AutoMirrored.Filled.CallSplit,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp),
                    )
                },
                text = { Text("Fork thread", style = MaterialTheme.typography.bodyMedium) },
                onClick = {
                    contextMenuOpen = false
                    onFork()
                },
            )
        }
    }
}
