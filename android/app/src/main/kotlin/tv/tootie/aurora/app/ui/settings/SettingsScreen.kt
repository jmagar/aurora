package tv.tootie.aurora.app.ui.settings

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.launch
import tv.tootie.aurora.app.CodexApp
import tv.tootie.aurora.app.data.AppSettings
import tv.tootie.aurora.components.AuroraButton
import tv.tootie.aurora.components.AuroraButtonVariant
import tv.tootie.aurora.components.AuroraField
import tv.tootie.aurora.components.AuroraTextField

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onBack: () -> Unit,
    onLogout: () -> Unit,
) {
    val ctx = LocalContext.current
    val settings = remember { AppSettings(ctx) }
    val scope = rememberCoroutineScope()
    var url by remember { mutableStateOf("ws://10.0.2.2:4500") }
    var token by remember { mutableStateOf("") }
    var model by remember { mutableStateOf("gpt-5.5") }

    val vm: SettingsViewModel = viewModel()
    val state by vm.state.collectAsStateWithLifecycle()

    // Navigate away when logout completes
    LaunchedEffect(state.pendingEvent) {
        if (state.pendingEvent is SettingsUiEvent.LoggedOut) {
            vm.consumeEvent()
            onLogout()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings") },
                navigationIcon = {
                    IconButton(onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                ),
            )
        },
    ) { pad ->
        Column(
            Modifier
                .padding(pad)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text("Connection", style = MaterialTheme.typography.titleMedium)

            AuroraField(
                label = "Server URL",
                description = "WebSocket URL of your Codex app-server",
            ) {
                AuroraTextField(
                    value = url,
                    onValueChange = { url = it },
                    placeholder = "ws://host:port",
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            AuroraField(
                label = "Auth Token",
                description = "Bearer token (leave blank if not required)",
            ) {
                AuroraTextField(
                    value = token,
                    onValueChange = { token = it },
                    placeholder = "optional",
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            AuroraField(label = "Model") {
                AuroraTextField(
                    value = model,
                    onValueChange = { model = it },
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            AuroraButton(
                onClick = {
                    scope.launch {
                        settings.setServerUrl(url)
                        settings.setModel(model)
                        val app = ctx.applicationContext as CodexApp
                        app.repository.reconnect(url, token.takeIf { it.isNotBlank() })
                        onBack()
                    }
                },
                variant = AuroraButtonVariant.Filled,
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Save") }

            Spacer(Modifier.height(8.dp))

            Text("Account", style = MaterialTheme.typography.titleMedium)

            if (state.logoutError != null) {
                Text(
                    text = "Error: ${state.logoutError}",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                )
            }

            AuroraButton(
                onClick = { vm.logout() },
                variant = AuroraButtonVariant.Outlined,
                loading = state.isLoggingOut,
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Log out") }
        }
    }
}
