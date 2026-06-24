package tv.tootie.aurora.app.ui.threads

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import tv.tootie.aurora.app.ui.sidebar.SidebarViewModel
import tv.tootie.aurora.app.ui.sidebar.relativeTime
import tv.tootie.aurora.components.AuroraEmptyState
import tv.tootie.aurora.components.AuroraStatusIndicator
import tv.tootie.aurora.components.AuroraStatusTone

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ThreadListScreen(
    onNewThread: () -> Unit,
    onSettings: () -> Unit,
    onThreadClick: (String) -> Unit = {},
    vm: SidebarViewModel = viewModel(),
) {
    val s by vm.state.collectAsStateWithLifecycle()

    // Trigger connect + thread/list on first composition. SidebarViewModel.connect() is
    // idempotent — CodexRepository serializes concurrent connect calls under a Mutex so
    // calling it again from this screen never opens a second WebSocket.
    LaunchedEffect(Unit) { vm.connect() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Codex", style = MaterialTheme.typography.titleLarge) },
                actions = { IconButton(onSettings) { Icon(Icons.Default.Settings, "Settings") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface),
            )
        },
        floatingActionButton = {
            FloatingActionButton(onNewThread) { Icon(Icons.Default.Add, "New") }
        },
    ) { pad ->
        when {
            s.isLoading -> {
                // Connection in progress — show a centered spinner
                Column(
                    modifier = Modifier.fillMaxSize().padding(pad),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    CircularProgressIndicator()
                }
            }
            s.projects.isEmpty() -> {
                AuroraEmptyState(
                    title = "No conversations yet",
                    description = "Tap + to start a new coding session with Codex.",
                    modifier = Modifier.fillMaxSize().padding(pad).padding(32.dp),
                )
            }
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(pad),
                ) {
                    s.projects.forEach { group ->
                        // Project / cwd group header
                        item(key = "header-${group.cwd}") {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                            ) {
                                Text(
                                    group.displayName,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                )
                            }
                            HorizontalDivider()
                        }

                        // Session rows within this group
                        items(group.sessions, key = { it.id }) { session ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable(role = Role.Button) {
                                        vm.setActiveSession(session.id)
                                        vm.setCurrentThread(session.id)
                                        onThreadClick(session.id)
                                    }
                                    .padding(horizontal = 16.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                            ) {
                                if (session.isLive) {
                                    AuroraStatusIndicator(tone = AuroraStatusTone.Success)
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        session.title,
                                        style = MaterialTheme.typography.bodyMedium,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis,
                                    )
                                    if (session.updatedAt > 0L) {
                                        Text(
                                            relativeTime(session.updatedAt),
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        )
                                    }
                                }
                            }
                            HorizontalDivider(modifier = Modifier.padding(start = 16.dp))
                        }
                    }
                }
            }
        }
    }
}
