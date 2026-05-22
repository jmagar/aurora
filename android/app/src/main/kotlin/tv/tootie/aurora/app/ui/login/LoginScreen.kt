package tv.tootie.aurora.app.ui.login

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import tv.tootie.aurora.components.AuroraButton
import tv.tootie.aurora.components.AuroraButtonVariant
import tv.tootie.aurora.components.AuroraField
import tv.tootie.aurora.components.AuroraTextField

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    onBack: (() -> Unit)? = null,
    vm: LoginViewModel = viewModel(),
) {
    val s by vm.state.collectAsStateWithLifecycle()
    val ctx = LocalContext.current

    LaunchedEffect(Unit) { vm.connect() }

    LaunchedEffect(s.step) {
        if (s.step == LoginStep.Success) onLoginSuccess()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Sign in") },
                navigationIcon = {
                    if (s.step != LoginStep.SelectMethod && s.step != LoginStep.LoggingIn) {
                        IconButton(onClick = vm::back) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                        }
                    } else if (onBack != null) {
                        IconButton(onClick = onBack) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface),
            )
        },
    ) { pad ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(pad)
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            when (s.step) {
                LoginStep.SelectMethod -> MethodSelector(vm)
                LoginStep.ApiKeyForm -> ApiKeyForm(vm)
                LoginStep.TokensForm -> TokensForm(vm)
                LoginStep.DeviceCodeWait -> DeviceCodeView(
                    verificationUrl = s.verificationUrl ?: "",
                    userCode = s.userCode ?: "",
                    expiresIn = s.deviceCodeExpiresIn,
                )
                LoginStep.BrowserOAuth -> {
                    // Immediately trigger OAuth; the server resolves via WebSocket
                    LaunchedEffect(Unit) { vm.startChatGptOAuth(ctx) }
                    Text(
                        "Opening browser for sign-in…",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                LoginStep.LoggingIn -> Text(
                    "Signing in…",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                LoginStep.Error -> {
                    Text(
                        "Sign-in failed: ${s.errorMessage}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.error,
                    )
                    AuroraButton(
                        onClick = vm::back,
                        variant = AuroraButtonVariant.Outlined,
                        modifier = Modifier.fillMaxWidth(),
                    ) { Text("Try again") }
                }
                LoginStep.Success -> { /* navigator takes over via LaunchedEffect above */ }
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Sub-views
// ---------------------------------------------------------------------------

@Composable
private fun MethodSelector(vm: LoginViewModel) {
    Text("Choose a sign-in method", style = MaterialTheme.typography.titleMedium)

    AuroraButton(
        onClick = vm::selectApiKey,
        variant = AuroraButtonVariant.Outlined,
        modifier = Modifier.fillMaxWidth(),
    ) { Text("API Key") }

    AuroraButton(
        onClick = vm::selectChatGpt,
        variant = AuroraButtonVariant.Outlined,
        modifier = Modifier.fillMaxWidth(),
    ) { Text("Sign in with ChatGPT (browser)") }

    AuroraButton(
        onClick = vm::selectDeviceCode,
        variant = AuroraButtonVariant.Outlined,
        modifier = Modifier.fillMaxWidth(),
    ) { Text("Device code (headless / TV)") }

    AuroraButton(
        onClick = vm::selectTokens,
        variant = AuroraButtonVariant.Outlined,
        modifier = Modifier.fillMaxWidth(),
    ) { Text("Inject tokens (advanced)") }
}

@Composable
private fun ApiKeyForm(vm: LoginViewModel) {
    var key by remember { mutableStateOf("") }

    Text("Enter your Codex API key", style = MaterialTheme.typography.titleMedium)

    AuroraField(label = "API Key", description = "Paste your sk-… key from the Codex dashboard") {
        AuroraTextField(
            value = key,
            onValueChange = { key = it },
            placeholder = "sk-…",
            modifier = Modifier.fillMaxWidth(),
        )
    }

    AuroraButton(
        onClick = { vm.submitApiKey(key) },
        variant = AuroraButtonVariant.Filled,
        modifier = Modifier.fillMaxWidth(),
    ) { Text("Sign in") }
}

@Composable
private fun TokensForm(vm: LoginViewModel) {
    var accessToken by remember { mutableStateOf("") }
    var accountId by remember { mutableStateOf("") }

    Text("Inject ChatGPT tokens", style = MaterialTheme.typography.titleMedium)

    AuroraField(label = "Access Token") {
        AuroraTextField(
            value = accessToken,
            onValueChange = { accessToken = it },
            placeholder = "ey…",
            modifier = Modifier.fillMaxWidth(),
        )
    }

    AuroraField(label = "ChatGPT Account ID") {
        AuroraTextField(
            value = accountId,
            onValueChange = { accountId = it },
            placeholder = "user-…",
            modifier = Modifier.fillMaxWidth(),
        )
    }

    AuroraButton(
        onClick = { vm.submitTokens(accessToken, accountId) },
        variant = AuroraButtonVariant.Filled,
        modifier = Modifier.fillMaxWidth(),
    ) { Text("Sign in") }
}

@Composable
private fun DeviceCodeView(verificationUrl: String, userCode: String, expiresIn: Int) {
    Text("Activate your device", style = MaterialTheme.typography.titleMedium)
    Text(
        "On another device, open:",
        style = MaterialTheme.typography.bodyMedium,
    )
    Text(
        verificationUrl,
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.primary,
    )
    Text("Then enter the code:", style = MaterialTheme.typography.bodyMedium)
    Text(
        userCode,
        style = MaterialTheme.typography.displaySmall,
        color = MaterialTheme.colorScheme.primary,
    )
    Text(
        "Code expires in ${expiresIn / 60} min ${expiresIn % 60} sec",
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
    )
}
