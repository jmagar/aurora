package tv.tootie.aurora.app.ui.chat

import android.content.ClipData
import android.content.ClipboardManager
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.collections.immutable.toPersistentList
import tv.tootie.aurora.components.AuroraChainOfThought
import tv.tootie.aurora.components.AuroraControls
import tv.tootie.aurora.components.AuroraMessage
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
    onOpenSidebar: () -> Unit = {},
    vm: ChatViewModel = viewModel(),
) {
    val s by vm.state.collectAsStateWithLifecycle()
    var input by remember { mutableStateOf("") }
    val ctx = LocalContext.current

    // Feature 3: @mention / slash command detection
    var mentionQuery by remember { mutableStateOf("") }
    var showMentions by remember { mutableStateOf(false) }

    val mentionItems = remember(s.availableCommands, s.availableSkills) {
        val commands = s.availableCommands.map { cmd ->
            MentionItem(
                trigger = cmd,
                label = cmd.removePrefix("/").replaceFirstChar { it.uppercase() },
                kind = MentionKind.Command,
            )
        }
        val skills = s.availableSkills.map { skill ->
            MentionItem(
                trigger = "@${skill.name}",
                label = skill.name.replace("-", " ").replaceFirstChar { it.uppercase() },
                description = skill.description.take(80),
                kind = MentionKind.Skill,
            )
        }
        commands + skills
    }

    LaunchedEffect(threadId) { vm.connect(threadId) }

    // Feature 2: Pre-fill input when entering edit mode
    LaunchedEffect(s.editingMessage) {
        val editing = s.editingMessage
        if (editing != null) input = editing.content
    }

    // Feature 3: Monitor input for @ and / triggers
    LaunchedEffect(input) {
        val lastAt = input.lastIndexOf('@')
        val lastSlash = input.lastIndexOf('/')
        val triggerIdx = maxOf(lastAt, lastSlash)
        if (triggerIdx >= 0) {
            val afterTrigger = input.substring(triggerIdx + 1)
            if (!afterTrigger.contains(' ')) {
                mentionQuery = afterTrigger
                showMentions = true
            } else {
                showMentions = false
            }
        } else {
            showMentions = false
        }
    }

    val filteredMentions = remember(mentionItems, mentionQuery, input) {
        val lastAt = input.lastIndexOf('@')
        val lastSlash = input.lastIndexOf('/')
        when {
            lastAt > lastSlash -> mentionItems.filter { it.kind == MentionKind.Skill }
            lastSlash > lastAt -> mentionItems.filter { it.kind == MentionKind.Command }
            else -> mentionItems
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    AuroraStatusIndicator(
                        tone = if (s.thinking) AuroraStatusTone.Syncing else if (s.connected) AuroraStatusTone.Online else AuroraStatusTone.Offline,
                        label = if (s.thinking) "Thinking..." else if (s.connected) "Connected" else "Disconnected",
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onOpenSidebar) {
                        Icon(Icons.Default.Menu, contentDescription = "Open sidebar")
                    }
                },
                actions = { AuroraControls(onStop = if (s.thinking) vm::interrupt else null) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface),
            )
        },
    ) { pad ->
        Column(Modifier.fillMaxSize().padding(pad).imePadding().navigationBarsPadding()) {
            // Feature 1: Model + Reasoning selector bar
            ModelReasoningBar(
                selectedModel = s.selectedModel,
                selectedEffort = s.selectedEffort,
                models = s.models,
                onModelSelect = vm::selectModel,
                onEffortSelect = vm::selectEffort,
            )

            Box(Modifier.weight(1f)) {
                // Replace AuroraConversation with a LazyColumn supporting long-press gestures
                val listState = rememberLazyListState()
                LaunchedEffect(s.msgs.size) {
                    if (s.msgs.isNotEmpty()) listState.animateScrollToItem(s.msgs.lastIndex)
                }
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .fillMaxSize()
                        .semantics { contentDescription = "Conversation" },
                    contentPadding = PaddingValues(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    items(s.msgs, key = { it.id }) { msg ->
                        Column {
                            AuroraMessage(
                                data = AuroraMessageData(
                                    id = msg.id,
                                    role = if (msg.role == MsgRole.User) AuroraMessageRole.User else AuroraMessageRole.Assistant,
                                    content = msg.content,
                                ),
                                modifier = Modifier.pointerInput(msg.id) {
                                    detectTapGestures(onLongPress = { vm.showActions(msg) })
                                },
                            )
                            // Show reactions below message
                            val msgReactions = s.reactions[msg.id]
                            if (!msgReactions.isNullOrEmpty()) {
                                Row(
                                    modifier = Modifier.padding(
                                        start = if (msg.role == MsgRole.User) 0.dp else 48.dp,
                                        end = if (msg.role == MsgRole.User) 48.dp else 0.dp,
                                        top = 4.dp,
                                    ),
                                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                                ) {
                                    msgReactions.forEach { emoji ->
                                        Surface(
                                            shape = MaterialTheme.shapes.small,
                                            color = MaterialTheme.colorScheme.primaryContainer,
                                            modifier = Modifier.clickable { vm.toggleReaction(msg.id, emoji) },
                                        ) {
                                            Text(emoji, modifier = Modifier.padding(4.dp), fontSize = 14.sp)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

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

            // Feature 2: Editing indicator
            if (s.editingMessage != null) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        "Editing message",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.primary,
                    )
                    TextButton(onClick = { vm.cancelEdit(); input = "" }) { Text("Cancel") }
                }
            }

            // Feature 3: @mention / slash command suggestions above input
            if (showMentions) {
                MentionSuggestionList(
                    items = filteredMentions,
                    query = mentionQuery,
                    onSelect = { item ->
                        val lastTrigger = maxOf(input.lastIndexOf('@'), input.lastIndexOf('/'))
                        input = if (lastTrigger >= 0) input.take(lastTrigger) + item.trigger + " "
                                else input + item.trigger + " "
                        showMentions = false
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp)
                        .padding(bottom = 4.dp),
                )
            }

            AuroraPromptInput(
                value = input,
                onValueChange = { input = it },
                onSend = {
                    if (input.isNotBlank()) {
                        if (s.editingMessage != null) vm.sendEdit(input)
                        else vm.send(input)
                        input = ""
                    }
                },
                loading = s.thinking,
                enabled = s.connected,
                modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp),
            )
        }
    }

    // Feature 2: Message actions bottom sheet
    s.actionsTarget?.let { target ->
        MessageActionsSheet(
            message = target,
            existingReactions = s.reactions[target.id] ?: emptySet(),
            onReact = { vm.toggleReaction(target.id, it) },
            onEdit = if (target.role == MsgRole.User) ({ vm.startEdit(target) }) else null,
            onCopy = {
                val cm = ctx.getSystemService(ClipboardManager::class.java)
                cm?.setPrimaryClip(ClipData.newPlainText("message", target.content))
            },
            onDismiss = vm::dismissActions,
        )
    }
}
