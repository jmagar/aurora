package tv.tootie.aurora.app.ui.chat

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.collections.immutable.toPersistentList
import tv.tootie.aurora.components.AuroraChainOfThought
import tv.tootie.aurora.components.AuroraControls
import tv.tootie.aurora.components.AuroraConversation
import tv.tootie.aurora.components.AuroraMessageData
import tv.tootie.aurora.components.AuroraMessageRole
import tv.tootie.aurora.components.AuroraPromptInput
import tv.tootie.aurora.components.AuroraStatusIndicator
import tv.tootie.aurora.components.AuroraStatusTone
import tv.tootie.aurora.components.AuroraThinking
import tv.tootie.aurora.components.AuroraToolCall
import tv.tootie.aurora.components.AuroraToolCallList
import tv.tootie.aurora.components.AuroraToolCallStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    threadId: String,
    onBack: () -> Unit,
    vm: ChatViewModel = viewModel(),
) {
    val s by vm.state.collectAsStateWithLifecycle()
    var input by remember { mutableStateOf("") }

    LaunchedEffect(threadId) { vm.connect(threadId) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    AuroraStatusIndicator(
                        tone = if (s.thinking) AuroraStatusTone.Syncing else if (s.connected) AuroraStatusTone.Online else AuroraStatusTone.Offline,
                        label = if (s.thinking) "Thinking..." else if (s.connected) "Connected" else "Disconnected",
                    )
                },
                navigationIcon = { IconButton(onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") } },
                actions = { AuroraControls(onStop = if (s.thinking) vm::interrupt else null) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface),
            )
        },
    ) { pad ->
        Column(Modifier.fillMaxSize().padding(pad).imePadding().navigationBarsPadding()) {
            Box(Modifier.weight(1f)) {
                AuroraConversation(
                    messages = s.msgs.map {
                        AuroraMessageData(
                            id = it.id,
                            role = if (it.role == MsgRole.User) AuroraMessageRole.User else AuroraMessageRole.Assistant,
                            content = it.content,
                        )
                    }.toPersistentList(),
                    modifier = Modifier.fillMaxSize(),
                )
                if (s.thinking || s.toolCalls.isNotEmpty() || s.reasoning.isNotEmpty()) {
                    Column(
                        Modifier.align(Alignment.BottomStart).fillMaxWidth().padding(12.dp),
                    ) {
                        if (s.reasoning.isNotEmpty()) {
                            AuroraChainOfThought(
                                steps = s.reasoning.toPersistentList(),
                                title = "Reasoning",
                                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                            )
                        }
                        if (s.toolCalls.isNotEmpty()) {
                            AuroraToolCallList(
                                calls = s.toolCalls.map { tc ->
                                    AuroraToolCall(
                                        id = tc.id, name = tc.cmd,
                                        status = when {
                                            tc.failed -> AuroraToolCallStatus.Error
                                            tc.done -> AuroraToolCallStatus.Done
                                            else -> AuroraToolCallStatus.Running
                                        },
                                        output = tc.out.toString().takeIf { it.isNotBlank() },
                                    )
                                }.toPersistentList(),
                                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                            )
                        }
                        if (s.thinking) AuroraThinking()
                    }
                }
            }
            AuroraPromptInput(
                value = input,
                onValueChange = { input = it },
                onSend = { if (input.isNotBlank()) { vm.send(input); input = "" } },
                loading = s.thinking,
                enabled = s.connected,
                modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp),
            )
        }
    }
}
