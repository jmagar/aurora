package tv.tootie.aurora.app.ui.chat

import android.content.ClipData
import android.content.ClipboardManager
import android.provider.OpenableColumns
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import tv.tootie.aurora.app.codex.MentionItem
import tv.tootie.aurora.app.codex.MentionKind
import tv.tootie.aurora.app.codex.PendingAttachment
import tv.tootie.aurora.app.codex.SelectedItem
import tv.tootie.aurora.components.AuroraAttachment
import androidx.compose.material.icons.Icons
import tv.tootie.aurora.icons.filled.Assistant
import tv.tootie.aurora.icons.filled.AttachFile
import tv.tootie.aurora.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Person
import tv.tootie.aurora.icons.filled.Security
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.background
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import tv.tootie.aurora.theme.LocalAuroraColors
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
import tv.tootie.aurora.components.AuroraEmptyState
import tv.tootie.aurora.components.AuroraMessage
import tv.tootie.aurora.components.AuroraMessageData
import tv.tootie.aurora.components.AuroraMessageRole
import tv.tootie.aurora.components.AuroraPromptInput
import tv.tootie.aurora.components.AuroraThinking
import tv.tootie.aurora.icons.filled.FolderOpen
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun ChatScreen(
    threadId: String,
    onBack: () -> Unit,
    onOpenSidebar: () -> Unit = {},
    /**
     * When `false` the ViewModel will not attempt to auto-resume the last saved thread even
     * if threadId == "new". Pass `false` when the user explicitly requested a new session
     * (e.g. via the sidebar "New session" action) so they reliably get an empty thread rather
     * than having the previous thread reopened underneath them.
     */
    allowResume: Boolean = true,
    vm: ChatViewModel = viewModel(),
) {
    val s by vm.state.collectAsStateWithLifecycle()
    var input by remember { mutableStateOf("") }
    var selectedItems by remember { mutableStateOf<List<SelectedItem>>(emptyList()) }
    var pendingSkillInvocation by remember { mutableStateOf<Pair<String, String>?>(null) }
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()

    // Image picker launcher — PickVisualMedia requires no READ_MEDIA_IMAGES on API 33+
    val imageLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.PickVisualMedia()
    ) { uri ->
        uri ?: return@rememberLauncherForActivityResult
        val cr = ctx.contentResolver
        val mimeType = cr.getType(uri) ?: "image/jpeg"
        // Unique ID per pick so selecting the same image twice creates distinct chips.
        val attachmentId = "${uri}_${System.nanoTime()}"
        // Move content-provider query and stream read off the main thread.
        scope.launch(Dispatchers.IO) {
            val displayName = cr.query(
                uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null
            )?.use { c -> if (c.moveToFirst()) c.getString(0) else null } ?: "Photo"
            val bytes = cr.openInputStream(uri)?.use { it.readBytes() } ?: return@launch
            if (bytes.isEmpty()) return@launch  // Empty file would encode to "" and produce an invalid attachment.
            val base64 = android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP)
            withContext(Dispatchers.Main) {
                vm.addImageAttachment(
                    PendingAttachment(
                        id = attachmentId,
                        displayName = displayName,
                        mimeType = mimeType,
                        base64Data = base64,
                    )
                )
            }
        }
    }

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
                path = skill.path,
            )
        }
        commands + skills
    }

    LaunchedEffect(threadId) { vm.connect(threadId, allowResume = allowResume) }

    // Feature 2: Pre-fill input when entering edit mode; clear prior selections
    LaunchedEffect(s.editingMessage) {
        val editing = s.editingMessage
        if (editing != null) {
            input = editing.content
            selectedItems = emptyList()  // stale @mentions / /commands from a previous message must not carry over
        }
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

    var approvalsSheetOpen by remember { mutableStateOf(false) }
    val approvalsSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val auroraColors = LocalAuroraColors.current
    val haptics = LocalHapticFeedback.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    // Bead nev6: primary title = threadName ?? "New chat", subtitle = cwd basename
                    val threadName = s.threadName?.takeIf { it.isNotBlank() } ?: "New chat"
                    val cwdSubtitle = s.cwd?.let { cwdBasename(it) }
                    Column {
                        Text(
                            threadName,
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurface,
                            maxLines = 1,
                        )
                        if (cwdSubtitle != null) {
                            Text(
                                cwdSubtitle,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 1,
                            )
                        }
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onOpenSidebar) {
                        Icon(Icons.Default.Menu, contentDescription = "Open sidebar")
                    }
                },
                actions = {
                    // Bead nev6: connection/thinking status as a small dot indicator
                    val statusColor = when {
                        s.thinking -> auroraColors.accentViolet
                        s.connected -> auroraColors.success
                        else -> auroraColors.error
                    }
                    val statusLabel = when {
                        s.thinking -> "Thinking"
                        s.connected -> "Connected"
                        else -> "Disconnected"
                    }
                    Box(
                        modifier = Modifier
                            .padding(horizontal = 4.dp)
                            .size(8.dp)
                            .background(statusColor, CircleShape)
                            .semantics { contentDescription = "Status: $statusLabel" },
                    )
                    // Bead ilkm: shield icon opens approvals bottom sheet
                    IconButton(onClick = { approvalsSheetOpen = true }) {
                        Icon(
                            Icons.Default.Security,
                            contentDescription = "Approval settings",
                            tint = auroraColors.accentViolet,
                        )
                    }
                    IconButton(onClick = vm::fetchRemoteDiff, enabled = s.threadId != null) {
                        Icon(Icons.Default.FolderOpen, contentDescription = "Changes vs remote")
                    }
                    if (s.thinking && s.activeTurnId != null) {
                        IconButton(onClick = { vm.showSteer() }) {
                            Icon(Icons.Default.Assistant, contentDescription = "Steer agent")
                        }
                    }
                    AuroraControls(onStop = if (s.thinking) vm::interrupt else null)
                },
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

            // Bead ilkm: ApprovalPolicyBar moved into ModalBottomSheet (opened via shield icon)

            // Replace AuroraConversation with a LazyColumn supporting long-press gestures
            val listState = rememberLazyListState()
            LaunchedEffect(s.msgs.size) {
                if (s.msgs.isNotEmpty()) listState.animateScrollToItem(s.msgs.lastIndex)
            }
            // Welcome / empty state for a fresh chat — shown when there are no messages
            // and the agent isn't already thinking on the user's behalf. The prompt input
            // bar below still renders so the user can immediately start typing.
            val showWelcome = s.msgs.isEmpty() && !s.thinking &&
                s.skillInvocations.isEmpty() && s.toolCalls.isEmpty() &&
                s.mcpToolCalls.isEmpty() && s.reasoning.isEmpty() &&
                s.webSearches.isEmpty() && s.planItems.isEmpty()
            if (showWelcome) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.TopCenter,
                ) {
                    ChatWelcome(
                        onSuggestion = { suggestion -> input = suggestion },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 24.dp),
                    )
                }
            } else LazyColumn(
                state = listState,
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
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
                            modifier = Modifier.combinedClickable(
                                onLongClick = { vm.showActions(msg) },
                                onLongClickLabel = "Message actions",
                                onClick = {},
                            ),
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

                // Skill invocations from hook events — inline after messages
                if (s.skillInvocations.isNotEmpty()) {
                    item(key = "skills") {
                        SkillInvocationList(s.skillInvocations)
                    }
                }

                // Tool calls as compact timeline — inline, not an overlay
                if (s.toolCalls.isNotEmpty()) {
                    item(key = "toolcalls") {
                        ToolCallTimeline(
                            calls = s.toolCalls,
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp),
                        )
                    }
                }

                // MCP tool calls (violet identity dots)
                if (s.mcpToolCalls.isNotEmpty()) {
                    item(key = "mcptoolcalls") {
                        McpToolCallRows(
                            calls = s.mcpToolCalls,
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp),
                        )
                    }
                }

                // Web searches inline
                s.webSearches.forEachIndexed { i, query ->
                    item(key = "ws_$i") {
                        Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp)) {
                            Text("🔍 $query", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }

                // Plan items inline
                s.planItems.forEachIndexed { i, plan ->
                    item(key = "plan_$i") {
                        Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp)) {
                            Text("📋 $plan", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }

                // Reasoning block
                if (s.reasoning.isNotEmpty()) {
                    item(key = "reasoning") {
                        AuroraChainOfThought(
                            steps = s.reasoning.toPersistentList(),
                            title = "Reasoning",
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp),
                        )
                    }
                }

                // Remote diff card — shown when remoteDiff has been fetched
                s.remoteDiff?.let { remoteDiff ->
                    item(key = "remotediff") {
                        RemoteDiffCard(
                            diff = remoteDiff,
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp),
                        )
                    }
                }

                // Thinking indicator at bottom
                if (s.thinking) {
                    item(key = "thinking") {
                        AuroraThinking(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp))
                    }
                }

                // Guardian auto-approval review banner
                val review = s.autoApprovalReview
                if (review != null) {
                    item(key = "auto-approval-review") {
                        AutoApprovalReviewBanner(
                            review = review,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                        )
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
                    TextButton(onClick = { vm.cancelEdit(); input = ""; selectedItems = emptyList() }) { Text("Cancel") }
                }
            }

            // Feature 3: @mention / slash command suggestions above input
            if (showMentions) {
                MentionSuggestionList(
                    items = filteredMentions,
                    query = mentionQuery,
                    onSelect = { item, structured ->
                        if (item.kind == MentionKind.Skill) {
                            val skillName = item.trigger.removePrefix("@")
                            // Fall back to skill name as path when no canonical path is provided
                            // so the server can still locate the skill via its name identifier
                            pendingSkillInvocation = Pair(
                                skillName,
                                item.path ?: skillName,
                            )
                            val lastAt = input.lastIndexOf('@')
                            input = if (lastAt >= 0) input.take(lastAt) else ""
                            showMentions = false
                        } else {
                            val lastTrigger = maxOf(input.lastIndexOf('@'), input.lastIndexOf('/'))
                            input = if (lastTrigger >= 0) input.take(lastTrigger) + item.trigger + " "
                                    else input + item.trigger + " "
                            selectedItems = selectedItems + structured
                            showMentions = false
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp)
                        .padding(bottom = 4.dp),
                )
            }

            // Pending skill indicator — shown when user selected a skill via @mention
            pendingSkillInvocation?.let { (skillName, _) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        "Skill: @$skillName",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.tertiary,
                    )
                    TextButton(onClick = { pendingSkillInvocation = null }) { Text("Clear") }
                }
            }

            // Working directory override — shown for new threads (no threadId yet) or when
            // a selectedCwd is already set. User can type a path; blank clears the override.
            if (s.threadId == null || s.selectedCwd != null) {
                OutlinedTextField(
                    value = s.selectedCwd ?: "",
                    onValueChange = { vm.setSelectedCwd(it) },
                    label = { Text("Working directory (optional)") },
                    placeholder = { Text("e.g. /home/user/project", style = MaterialTheme.typography.bodySmall) },
                    singleLine = true,
                    textStyle = MaterialTheme.typography.bodySmall,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 4.dp),
                )
            }

            AuroraPromptInput(
                value = input,
                onValueChange = { newInput ->
                    input = newInput
                    // Drop any structured item whose trigger token is no longer in the
                    // input text — prevents stale @mentions / /commands from being sent
                    // after the user edits or clears the inserted token.
                    selectedItems = selectedItems.filter { item ->
                        val trigger = when (item) {
                            is SelectedItem.Command -> "/${item.name}"
                            is SelectedItem.Mention -> "@${item.name}"
                            is SelectedItem.Skill   -> "@${item.name}"
                        }
                        newInput.contains(trigger)
                    }
                },
                onSend = {
                    val pending = pendingSkillInvocation
                    if (s.editingMessage != null) {
                        if (input.isNotBlank()) {
                            vm.sendEdit(input, selectedItems)
                            pendingSkillInvocation = null
                            input = ""
                            selectedItems = emptyList()
                        }
                    } else if (pending != null && input.isNotBlank()) {
                        vm.sendWithSkill(input, pending.first, pending.second)
                        pendingSkillInvocation = null
                        input = ""
                        selectedItems = emptyList()
                    } else {
                        val hasText = input.isNotBlank()
                        val hasAttachments = s.pendingAttachments.isNotEmpty() || selectedItems.isNotEmpty()
                        if (hasText || hasAttachments) {
                            vm.send(input, selectedItems)
                            input = ""
                            selectedItems = emptyList()
                        }
                    }
                },
                loading = s.thinking,
                enabled = s.connected,
                hasSendableContent = input.isNotBlank() ||
                    s.pendingAttachments.isNotEmpty() ||
                    selectedItems.isNotEmpty(),
                modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp),
                leadingContent = {
                    // Image attachment chips — scrollable row so multiple images stay accessible
                    val imageAttachments = s.pendingAttachments
                    if (imageAttachments.isNotEmpty()) {
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 6.dp),
                        ) {
                            items(imageAttachments, key = { it.id }) { att ->
                                AuroraAttachment(
                                    fileName = att.displayName,
                                    fileTypeDescription = "Image attachment",
                                    onRemove = { vm.removeAttachment(att.id) },
                                )
                            }
                        }
                    }
                    // Attach button — opens Photo Picker (no runtime permission on API 33+)
                    IconButton(
                        onClick = {
                            // Bead 01xq: haptic on attach tap
                            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                            imageLauncher.launch(
                                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                            )
                        },
                        modifier = Modifier.size(32.dp),
                    ) {
                        Icon(
                            Icons.Default.AttachFile,
                            contentDescription = "Attach image",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(18.dp),
                        )
                    }
                    // File picker button — opens fuzzy file search overlay (Ctrl+P style)
                    IconButton(
                        onClick = { vm.startFuzzySearch("") },
                        modifier = Modifier.size(32.dp),
                    ) {
                        Icon(
                            Icons.Default.FolderOpen,
                            contentDescription = "Pick file",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(18.dp),
                        )
                    }
                },
            )
        }
    }

    // Approval intercept overlay — shown as a non-dismissible dialog, FIFO queue
    s.pendingApprovals.firstOrNull()?.let { approval ->
        val decisions = classifyApprovalDecisions(
            approval.availableDecisions,
            elicitation = approval is ToolApproval.Elicitation,
        )
        val (title, fallback) = when (approval) {
            is ToolApproval.Command     -> "Allow command?" to "A command is requesting approval."
            is ToolApproval.FileChange  -> "Allow file changes?" to "File changes are requesting approval."
            is ToolApproval.Permissions -> "Allow additional permissions?" to "The agent is requesting expanded sandbox permissions."
            is ToolApproval.Elicitation -> "Input needed" to "An MCP tool needs additional information to continue."
        }
        val descParts = when (approval) {
            is ToolApproval.Command     -> listOfNotNull(approval.reason, approval.command)
            is ToolApproval.FileChange  -> listOfNotNull(approval.reason)
            is ToolApproval.Permissions -> listOfNotNull(approval.reason)
            is ToolApproval.Elicitation -> listOfNotNull(approval.reason)
        }
        val description = descParts.joinToString("\n\n").ifBlank { fallback }
        ApprovalDecisionDialog(
            title = title,
            description = description,
            decisions = decisions,
            onDecision = { vm.approveToolCall(approval, it.wireValue) },
        )
    }

    // Fuzzy file picker overlay — shown when a fuzzyFileSearch session is active
    s.fuzzySearch?.let { fuzzyState ->
        FuzzyFilePickerOverlay(
            state = fuzzyState,
            onSelect = { path ->
                val name = path.substringAfterLast('/')
                selectedItems = selectedItems + SelectedItem.Mention(name = name, path = path)
                vm.dismissFuzzySearch()
            },
            onQueryChange = { q -> vm.startFuzzySearch(q) },
            onDismiss = vm::dismissFuzzySearch,
        )
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

    if (s.showSteerSheet) {
        SteerInputSheet(
            onSteer = { vm.steer(it) },
            onDismiss = { vm.hideSteer() },
        )
    }

    // Bead ilkm: ModalBottomSheet hosting the ApprovalPolicyBar (opened via shield icon)
    if (approvalsSheetOpen) {
        ModalBottomSheet(
            onDismissRequest = { approvalsSheetOpen = false },
            sheetState = approvalsSheetState,
        ) {
            Column(modifier = Modifier.padding(bottom = 16.dp)) {
                Text(
                    "Approvals",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                )
                ApprovalPolicyBar(
                    selectedPolicy = s.selectedApprovalPolicy,
                    granularPolicy = s.granularPolicy,
                    selectedReviewer = s.selectedReviewer,
                    selectedSandboxPolicy = s.selectedSandboxPolicy,
                    onPolicySelect = vm::selectApprovalPolicy,
                    onGranularUpdate = vm::updateGranularPolicy,
                    onReviewerSelect = vm::selectReviewer,
                    onSandboxPolicySelect = vm::selectSandboxPolicy,
                )
            }
        }
    }

}

@OptIn(ExperimentalLayoutApi::class)
@Composable
internal fun ApprovalDecisionDialog(
    title: String,
    description: String,
    decisions: List<ClassifiedApprovalDecision>,
    onDecision: (ClassifiedApprovalDecision) -> Unit,
) {
    Dialog(
        onDismissRequest = {},
        properties = DialogProperties(dismissOnBackPress = false, dismissOnClickOutside = false),
    ) {
        Surface(
            shape = MaterialTheme.shapes.extraLarge,
            tonalElevation = 6.dp,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Text(title, style = MaterialTheme.typography.headlineSmall)
                Text(description, style = MaterialTheme.typography.bodyMedium)
                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.End),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    decisions.forEach { decision ->
                        TextButton(
                            onClick = { onDecision(decision) },
                            modifier = Modifier.semantics {
                                contentDescription = "${decision.semantics.name} approval: ${decision.label}"
                            },
                        ) {
                            Text(decision.label)
                        }
                    }
                }
            }
        }
    }
}

/**
 * Bead nev6: derive a short subtitle from a cwd path — last 2 path segments
 * joined by "/", e.g. "/home/user/project/src/main" -> "src/main".
 */
private fun cwdBasename(cwd: String): String? {
    val parts = cwd.split('/').filter { it.isNotBlank() }
    if (parts.isEmpty()) return null
    val tail = parts.takeLast(2).joinToString("/")
    return if (tail.length > 40) "…" + tail.takeLast(39) else tail
}

/**
 * Welcome / empty-state shown in a fresh ChatScreen before the user sends anything.
 * Renders the AuroraEmptyState shell plus a FlowRow of tappable starter prompts; each
 * tap calls [onSuggestion] with the suggestion text, which the parent uses to populate
 * the prompt input. A 200dp bottom spacer keeps content above the input bar / IME.
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ChatWelcome(
    onSuggestion: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val suggestions = listOf(
        "Explain this repo's architecture",
        "Find a bug in src/",
        "Generate unit tests",
        "Review my latest commit",
        "Refactor to use coroutines",
    )
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        AuroraEmptyState(
            title = "Start a conversation with Codex",
            description = "Ask anything — coding help, code review, or a one-shot command. " +
                "Use @ to mention skills and / for slash commands.",
            icon = {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(28.dp),
                )
            },
            action = {
                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    suggestions.forEach { suggestion ->
                        AssistChip(
                            onClick = { onSuggestion(suggestion) },
                            label = { Text(suggestion) },
                            colors = AssistChipDefaults.assistChipColors(
                                labelColor = MaterialTheme.colorScheme.primary,
                            ),
                            border = AssistChipDefaults.assistChipBorder(
                                enabled = true,
                                borderColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f),
                            ),
                        )
                    }
                }
            },
        )
        // Keep welcome content clear of the input bar / IME so suggestions remain tappable.
        Spacer(modifier = Modifier.height(200.dp))
    }
}

/**
 * Shows an "Auto-reviewing…" indicator while the guardian subagent is evaluating
 * a pending action, then shows the decision (approved / denied) with its reasoning
 * once [item/autoApprovalReview/completed] arrives.
 *
 * Placed in the message list just below the thinking indicator so the review state
 * is visible without needing to scroll.
 */
@Composable
private fun AutoApprovalReviewBanner(
    review: AutoApprovalReview,
    modifier: Modifier = Modifier,
) {
    val aurora = LocalAuroraColors.current
    val inProgress = review.decision == null

    androidx.compose.material3.Card(
        modifier = modifier.fillMaxWidth(),
        colors = androidx.compose.material3.CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
        ),
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                if (inProgress) {
                    androidx.compose.material3.CircularProgressIndicator(
                        modifier = Modifier.size(14.dp),
                        strokeWidth = 1.5.dp,
                        color = aurora.accentViolet,
                    )
                } else {
                    val decisionColor = when (review.decision) {
                        "approved" -> aurora.success
                        "denied"   -> aurora.error
                        else       -> MaterialTheme.colorScheme.onSurfaceVariant
                    }
                    Icon(
                        imageVector = Icons.Default.Security,
                        contentDescription = null,
                        tint = decisionColor,
                        modifier = Modifier.size(14.dp),
                    )
                }
                Text(
                    text = if (inProgress) "Auto-reviewing…" else "Guardian: ${review.decision ?: "unknown"}",
                    style = MaterialTheme.typography.labelSmall,
                    color = if (inProgress) aurora.accentViolet
                            else when (review.decision) {
                                "approved" -> aurora.success
                                "denied"   -> aurora.error
                                else       -> MaterialTheme.colorScheme.onSurfaceVariant
                            },
                )
            }
            if (review.actionDescription.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = review.actionDescription,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
                )
            }
            if (!review.reasoning.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = review.reasoning,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                )
            }
        }
    }
}


/**
 * Fuzzy file picker overlay — full-screen modal dialog with a query field and an
 * incrementally-populated results list. Fires [onPick] with the chosen path and
 * [onQueryChanged] whenever the query text changes so the caller can issue a new
 * fuzzyFileSearch RPC. [onDismiss] is called on back-press or outside-click.
 */
@Composable
private fun FuzzyFilePickerOverlay(
    state: FuzzyFileSearchState,
    onSelect: (String) -> Unit,
    onQueryChange: (String) -> Unit,
    onDismiss: () -> Unit,
) {
    var query by remember { mutableStateOf("") }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false),
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxSize(0.8f),
            shape = MaterialTheme.shapes.large,
            tonalElevation = 6.dp,
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                OutlinedTextField(
                    value = query,
                    onValueChange = { q ->
                        query = q
                        onQueryChange(q)
                    },
                    placeholder = { Text("Search files…") },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = null)
                    },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )

                Spacer(modifier = Modifier.height(8.dp))

                if (!state.done && state.results.isEmpty()) {
                    // Searching in progress, no results yet
                    LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
                }

                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(2.dp),
                ) {
                    items(state.results, key = { it }) { path ->
                        val name = path.substringAfterLast('/')
                        val dir = path.substringBeforeLast('/', "")
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { onSelect(path) },
                            shape = MaterialTheme.shapes.small,
                        ) {
                            Column(modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)) {
                                Text(
                                    text = name,
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    maxLines = 1,
                                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
                                )
                                if (dir.isNotBlank()) {
                                    Text(
                                        text = dir,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        maxLines = 1,
                                        overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
                                    )
                                }
                            }
                        }
                    }
                }

                if (state.done && state.results.isEmpty()) {
                    Box(modifier = Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
                        Text(
                            "No files found",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }

                TextButton(onClick = onDismiss, modifier = Modifier.align(Alignment.End)) {
                    Text("Cancel")
                }
            }
        }
    }
}
