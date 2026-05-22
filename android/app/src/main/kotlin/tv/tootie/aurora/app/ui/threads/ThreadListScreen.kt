package tv.tootie.aurora.app.ui.threads

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import tv.tootie.aurora.components.AuroraEmptyState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ThreadListScreen(
    onNewThread: () -> Unit,
    onSettings: () -> Unit,
) {
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
        AuroraEmptyState(
            title = "No conversations yet",
            description = "Tap + to start a new coding session with Codex.",
            modifier = Modifier.fillMaxSize().padding(pad).padding(32.dp),
        )
    }
}
