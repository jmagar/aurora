# Codex Android PR#5 Follow-up Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 7 follow-up bugs filed after PR #16 landed: goal-panel empty after resume, silent GoalSet errors, -1 silent failure on null client, GoalGet thread race, unsanitized skill/thread strings, and missing ConnectionError on clean WebSocket close.

**Architecture:** All fixes are on branch `feat/codex-android-pr5-port` (PR #16 still open). `CodexRepository` is the app-scoped singleton; `ChatViewModel` and `SidebarViewModel` subscribe to its typed flows. `CodexClient` owns the OkHttp WebSocket. All changes are confined to the 4 files listed below.

**Tech Stack:** Kotlin, Android, Jetpack Compose, kotlinx.coroutines, OkHttp WebSocket, CodexRepository pattern

---

## Bead Map

| Bead | Priority | File | Fix |
|------|----------|------|-----|
| aurora-design-system-redj | P2 | SidebarViewModel.kt | GoalGet thread race — capture expectedId before getGoal() call |
| aurora-design-system-l0r0 | P2 | SidebarViewModel.kt | GoalSet errors silently dropped — handle in turnEventsFlow |
| aurora-design-system-442f | P2 | ChatViewModel.kt + NavHost.kt | Goal panel empty after resume — notify SidebarViewModel |
| aurora-design-system-uf4w | P2 | ChatViewModel.kt | tryResumeThread/steer -1 silent failure — surface to user |
| aurora-design-system-hkey | P3 | ChatViewModel.kt | Sanitize skill name/desc from skills/list |
| aurora-design-system-lym7 | P3 | SidebarViewModel.kt | Sanitize thread title/preview/cwd from thread/list |
| aurora-design-system-dtr5 | P3 | CodexClient.kt | onClosed must emit ConnectionError for unexpected closes |

## File Map

| File | What changes |
|------|-------------|
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/SidebarViewModel.kt` | GoalGet race fix, GoalSet error handler, sanitize thread fields |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/ChatViewModel.kt` | Resume→sidebar notify, -1 feedback, sanitize skill fields |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/NavHost.kt` | Wire chatState.threadId → sidebarVm.setCurrentThread on thread resume |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/codex/CodexClient.kt` | onClosed emits ConnectionError for unexpected closes |

**Package base:** `android/app/src/main/kotlin/tv/tootie/aurora/app`

---

## Task 1: Fix GoalGet thread race in SidebarViewModel (aurora-design-system-redj)

**Problem:** `setCurrentThread()` calls `repo.getGoal(threadId)` then the async response checks `_state.value.currentThreadId` at response-arrival time. If the user switches threads before the response arrives, `currentThreadId` has changed and the guard `s.currentThreadId == expectedId` compares the NEW thread against itself — always passes — applying the OLD thread's goal to the CURRENT thread.

**Fix:** Capture `expectedId` from the method parameter (not from state) and close over it into the callback.

**Files:**
- Modify: `...ui/sidebar/SidebarViewModel.kt` (setCurrentThread function + turnEventsFlow handler)

- [ ] **Step 1.1: Read the current setCurrentThread and turnEventsFlow handler**

Open `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/SidebarViewModel.kt`. Find `fun setCurrentThread(threadId: String?)` and the `turnEventsFlow.onEach` block in `init{}`.

Current (buggy) code in init{}:
```kotlin
repo.turnEventsFlow.onEach { event ->
    if (event.originKind == RequestKind.GoalGet && event.msg.error == null) {
        val goalObj = event.msg.result?.jsonObject ?: return@onEach
        val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return@onEach
        val expectedId = _state.value.currentThreadId ?: return@onEach  // BUG: reads state at response time
        ...
        if (s.currentThreadId == expectedId) { ... }   // BUG: always true for the current thread
    }
}.launchIn(viewModelScope)
```

- [ ] **Step 1.2: Replace the turnEventsFlow block with a correct approach**

The fix is to store the pending goal request's thread ID alongside issuing the request, so the callback checks that specific ID:

Add a field to the class body (alongside other private fields):
```kotlin
private var pendingGoalThreadId: String? = null
```

Update `setCurrentThread()`:
```kotlin
fun setCurrentThread(threadId: String?) {
    _state.update { it.copy(currentThreadId = threadId, currentGoal = null) }
    pendingGoalThreadId = threadId   // capture NOW, before any async operation
    if (threadId != null) {
        repo.getGoal(threadId)
    }
}
```

Update the `turnEventsFlow.onEach` block in `init{}`:
```kotlin
repo.turnEventsFlow.onEach { event ->
    if (event.originKind == RequestKind.GoalGet && event.msg.error == null) {
        val goalObj = event.msg.result?.jsonObject ?: return@onEach
        val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return@onEach
        val expected = pendingGoalThreadId ?: return@onEach   // FIXED: captured at call time
        val status = goalObj["status"]?.jsonPrimitive?.contentOrNull ?: "active"
        val tokenBudget = goalObj["tokenBudget"]?.jsonPrimitive?.intOrNull
        val tokensUsed = goalObj["tokensUsed"]?.jsonPrimitive?.intOrNull ?: 0
        _state.update { s ->
            if (s.currentThreadId == expected) {
                s.copy(currentGoal = ThreadGoal(objective, status, tokenBudget, tokensUsed))
            } else s
        }
    }
}.launchIn(viewModelScope)
```

- [ ] **Step 1.3: Commit**
```bash
git add android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/SidebarViewModel.kt
git commit -m "fix(aurora-design-system-redj): GoalGet thread race — capture expectedId at call time not response time"
```

---

## Task 2: Handle GoalSet errors in SidebarViewModel (aurora-design-system-l0r0)

**Problem:** `setGoal()` calls `repo.setGoal()` and closes the editor sheet immediately. When the server rejects the goal (e.g., empty string, too long, network error), the `GoalSet` response routes to `turnEventsFlow`, arrives in `ChatViewModel.handle()` as a null-method event, and is silently discarded because ChatViewModel has no `GoalSet` handler. The user's editor is gone with no feedback.

**Fix:** Subscribe to `GoalSet` responses in `SidebarViewModel`'s `turnEventsFlow` handler.

**Files:**
- Modify: `...ui/sidebar/SidebarViewModel.kt`

- [ ] **Step 2.1: Extend the turnEventsFlow onEach block to handle GoalSet**

In `SidebarViewModel.init{}`, extend the existing `turnEventsFlow.onEach` block. The current block only handles `GoalGet`. Extend the `when` to also handle `GoalSet`:

```kotlin
repo.turnEventsFlow.onEach { event ->
    when (event.originKind) {
        RequestKind.GoalGet -> {
            if (event.msg.error == null) {
                val goalObj = event.msg.result?.jsonObject ?: return@onEach
                val objective = goalObj["objective"]?.jsonPrimitive?.contentOrNull?.sanitizeForDisplay() ?: return@onEach
                val expected = pendingGoalThreadId ?: return@onEach
                val status = goalObj["status"]?.jsonPrimitive?.contentOrNull ?: "active"
                val tokenBudget = goalObj["tokenBudget"]?.jsonPrimitive?.intOrNull
                val tokensUsed = goalObj["tokensUsed"]?.jsonPrimitive?.intOrNull ?: 0
                _state.update { s ->
                    if (s.currentThreadId == expected) {
                        s.copy(currentGoal = ThreadGoal(objective, status, tokenBudget, tokensUsed))
                    } else s
                }
            }
        }
        RequestKind.GoalSet -> {
            if (event.msg.error != null) {
                // Goal was rejected by the server — re-open the editor so user can fix input
                _state.update { it.copy(showGoalEditor = true) }
                android.util.Log.w("SidebarViewModel", "setGoal failed: ${event.msg.error.message}")
            }
            // On success: thread/goal/updated notification will update state via handleSidebarNotification
        }
        else -> { /* other kinds handled elsewhere */ }
    }
}.launchIn(viewModelScope)
```

Note: This replaces the existing `if (event.originKind == RequestKind.GoalGet && ...)` block — rewrite it as the `when` expression above.

- [ ] **Step 2.2: Commit**
```bash
git add android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/SidebarViewModel.kt
git commit -m "fix(aurora-design-system-l0r0): handle GoalSet errors in SidebarViewModel — re-open editor on server rejection"
```

---

## Task 3: Notify SidebarViewModel after thread resume (aurora-design-system-442f)

**Problem:** On cold launch, `ChatViewModel.tryResumeThread()` resumes a saved session. `ChatState.threadId` is set to the resumed thread. But `SidebarViewModel.setCurrentThread()` is only called from `NavHost` when the user **taps** a session. After resume, `SidebarState.currentThreadId` stays `null`, `getGoal()` is never called, and the sidebar goal strip is empty even though there may be an active goal.

**Fix:** After a successful ThreadResume response in `ChatViewModel.handle()`, emit the new threadId through a shared flow or expose it via the repository so `SidebarViewModel` can react. The simplest approach: add a `activeThreadId: SharedFlow<String>` to `CodexRepository` that `ChatViewModel` emits to on resume, and `SidebarViewModel` subscribes to.

Actually even simpler: `NavHost` already observes `chatState.threadId` indirectly (it reads the VM state). Wire a `LaunchedEffect` in `NavHost` that calls `sidebarVm.setCurrentThread(tid)` whenever `chatState.threadId` changes from `null` to non-null.

**Files:**
- Modify: `...NavHost.kt`

- [ ] **Step 3.1: Add LaunchedEffect in NavHost to sync threadId to SidebarViewModel**

Open `android/app/src/main/kotlin/tv/tootie/aurora/app/NavHost.kt`. Find where `chatVm` and `sidebarVm` are both in scope (they are typically created at the top of the `CodexNavHost()` composable).

Find where `chatState` is collected:
```kotlin
val chatState by chatVm.state.collectAsStateWithLifecycle()
```

After this line, add a `LaunchedEffect` that calls `sidebarVm.setCurrentThread()` whenever the chat thread changes:
```kotlin
// Sync active thread to sidebar when ChatViewModel resumes/creates a thread
// This covers the thread-resume path where NavHost never navigates explicitly
val chatThreadId = chatState.threadId
LaunchedEffect(chatThreadId) {
    if (chatThreadId != null) {
        sidebarVm.setCurrentThread(chatThreadId)
    }
}
```

Place this after the `chatState` collection and before the `Scaffold` or navigation setup.

NOTE: This may cause `setCurrentThread` to be called twice when the user taps a session (once from the tap handler, once from this LaunchedEffect). That is safe — `setCurrentThread` is idempotent when called with the same `threadId` (it sets `currentGoal = null` and re-fetches, but the second call with the same ID is harmless since `pendingGoalThreadId` will be overwritten with the same value).

- [ ] **Step 3.2: Commit**
```bash
git add android/app/src/main/kotlin/tv/tootie/aurora/app/NavHost.kt
git commit -m "fix(aurora-design-system-442f): sync threadId to SidebarViewModel after resume via LaunchedEffect in NavHost"
```

---

## Task 4: Surface -1 silent failure for tryResumeThread and steer (aurora-design-system-uf4w)

**Problem:** `CodexRepository.resumeThread()` and `steerTurn()` return `"-1"` when the client is null (not connected yet). The callers (`ChatViewModel.tryResumeThread()` and `ChatViewModel.steer()`) ignore the return value — no error, no retry, no user feedback. The user's action silently disappears.

**Fix:** Check the return value at each call site and either surface an error or log a warning.

**Files:**
- Modify: `...ui/chat/ChatViewModel.kt`

- [ ] **Step 4.1: Find tryResumeThread and steer in ChatViewModel.kt**

Open `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/ChatViewModel.kt`.

Find `private fun tryResumeThread(threadId: String)` — it currently calls `repo.resumeThread(threadId)` and discards the result.

Find `fun steer(text: String)` — it calls `repo.steerTurn(...)` and discards the result.

- [ ] **Step 4.2: Update tryResumeThread to check return value**

```kotlin
private fun tryResumeThread(threadId: String) {
    val key = repo.resumeThread(threadId)
    if (key == "-1") {
        // Client not connected yet — try again when connection establishes
        // The connect() coroutine will re-attempt via tryResumeThread after isReady gates
        android.util.Log.w("ChatViewModel", "tryResumeThread called before client connected for thread $threadId")
        // Don't surface error to user — connection is in progress, this is expected on cold start
    }
    // On success: response arrives as TurnEvent with originKind=ThreadResume, handled in handle()
}
```

- [ ] **Step 4.3: Update steer() to check return value**

```kotlin
fun steer(text: String) {
    val turnId = _state.value.activeTurnId ?: return
    val threadId = _state.value.threadId ?: return
    steerText.set(text)
    _state.update { it.copy(showSteerSheet = false) }
    val key = repo.steerTurn(threadId, text, turnId)
    if (key == "-1") {
        // Client disconnected before steer was sent — steerText was set but will be
        // cleared by the errorsFlow handler (which appends "[steer not sent]" to msgs)
        android.util.Log.w("ChatViewModel", "steerTurn: not connected, steer will be lost on reconnect")
        // The errorsFlow handler already covers this case if a ConnectionError fires
        // but if the socket is just slow, log so devs can investigate
    }
}
```

- [ ] **Step 4.4: Commit**
```bash
git add android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/ChatViewModel.kt
git commit -m "fix(aurora-design-system-uf4w): log warning when tryResumeThread/steer return -1 (client not connected)"
```

---

## Task 5: Sanitize skill name and description from skills/list (aurora-design-system-hkey)

**Problem:** `handleSkills()` in `ChatViewModel` stores `name` and `desc` from the server's `skills/list` response directly into `SkillItem` without calling `sanitizeForDisplay()`. These strings are then rendered in the `@mention` popup and in `SkillInvocationList` as `"Using \`$skillName\`"`.

**Files:**
- Modify: `...ui/chat/ChatViewModel.kt`

- [ ] **Step 5.1: Find handleSkills in ChatViewModel**

Search for `handleSkills` or `fun handleSkills` in ChatViewModel.kt. It processes `CodexEvent.SkillList` and maps each `JsonObject` to a `SkillItem`.

Current code looks like:
```kotlin
private fun handleSkills(event: CodexEvent.SkillList) {
    val items = event.skills.mapNotNull { obj ->
        val name = obj["name"]?.jsonPrimitive?.content ?: return@mapNotNull null
        val desc = obj["description"]?.jsonPrimitive?.content ?: ""
        val path = obj["path"]?.jsonPrimitive?.contentOrNull
        SkillItem(name, desc, path)
    }
    if (items.isNotEmpty()) {
        _state.update { it.copy(availableSkills = items.sortedBy { it.name }) }
    }
}
```

- [ ] **Step 5.2: Apply sanitizeForDisplay() to name and desc**

```kotlin
private fun handleSkills(event: CodexEvent.SkillList) {
    val items = event.skills.mapNotNull { obj ->
        val name = obj["name"]?.jsonPrimitive?.content?.sanitizeForDisplay() ?: return@mapNotNull null
        val desc = obj["description"]?.jsonPrimitive?.content?.sanitizeForDisplay() ?: ""
        val path = obj["path"]?.jsonPrimitive?.contentOrNull
        SkillItem(name, desc, path)
    }
    if (items.isNotEmpty()) {
        _state.update { it.copy(availableSkills = items.sortedBy { it.name }) }
    }
}
```

Two one-word changes: add `.sanitizeForDisplay()` after `?.content` on name and desc lines.

- [ ] **Step 5.3: Commit**
```bash
git add android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/ChatViewModel.kt
git commit -m "fix(aurora-design-system-hkey): sanitize skill name and description from skills/list response"
```

---

## Task 6: Sanitize thread title/preview/cwd in handleThreadList (aurora-design-system-lym7)

**Problem:** `handleThreadList()` in `SidebarViewModel` stores `cwd`, `name`, and `preview` from the server's `thread/list` response directly into `SessionItem` without calling `sanitizeForDisplay()`. These are rendered in the sessions list in `SessionsSidebar`.

**Files:**
- Modify: `...ui/sidebar/SidebarViewModel.kt`

- [ ] **Step 6.1: Find handleThreadList in SidebarViewModel**

Search for `fun handleThreadList` or `private fun handleThreadList`. It receives a `CodexEvent.ThreadList` and maps `JsonObject` entries to `SessionItem`.

Current code looks like:
```kotlin
private fun handleThreadList(event: CodexEvent.ThreadList) {
    val threads = event.threads
    ...
    val sessions = threads.mapNotNull { obj ->
        val id = obj["id"]?.jsonPrimitive?.content ?: return@mapNotNull null
        val cwd = obj["cwd"]?.jsonPrimitive?.content ?: ""
        val name = obj["name"]?.jsonPrimitive?.content?.takeIf { it != "null" && it.isNotBlank() }
        val preview = obj["preview"]?.jsonPrimitive?.content?.takeIf { it != "null" && it.isNotBlank() } ?: "New session"
        val title = name ?: preview.take(60)
        ...
        SessionItem(id = id, title = title, cwd = cwd, ...)
    }
```

- [ ] **Step 6.2: Apply sanitizeForDisplay() to cwd, name, and preview**

```kotlin
val cwd = obj["cwd"]?.jsonPrimitive?.content?.sanitizeForDisplay() ?: ""
val name = obj["name"]?.jsonPrimitive?.content
    ?.sanitizeForDisplay()
    ?.takeIf { it != "null" && it.isNotBlank() }
val preview = obj["preview"]?.jsonPrimitive?.content
    ?.sanitizeForDisplay()
    ?.takeIf { it != "null" && it.isNotBlank() } ?: "New session"
val title = name ?: preview.take(60)
```

The `id` field does not need sanitization — it is used as a key, not rendered as text.

- [ ] **Step 6.3: Commit**
```bash
git add android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/SidebarViewModel.kt
git commit -m "fix(aurora-design-system-lym7): sanitize thread cwd/name/preview from thread/list response"
```

---

## Task 7: Emit ConnectionError on unexpected onClosed (aurora-design-system-dtr5)

**Problem:** `CodexClient.onClosed` (called on a clean WebSocket close) only sets `_isInitialized.value = false` and calls `_msgs.close()`. It does NOT emit an error. If an agent turn was in progress, the `demux` coroutine terminates quietly, `turnEventsFlow` emits no completion, and `ChatViewModel._state.thinking` stays `true` forever — the user sees a permanent spinner.

`onFailure` handles network failures correctly (it sends a synthetic `RpcMessage(error=...)` before closing). `onClosed` needs the same treatment for unexpected closes.

**Files:**
- Modify: `...codex/CodexClient.kt`

- [ ] **Step 7.1: Find onClosed in CodexClient**

Open `android/app/src/main/kotlin/tv/tootie/aurora/app/codex/CodexClient.kt`. Find `override fun onClosed(ws: WebSocket, code: Int, reason: String)`.

Current code:
```kotlin
override fun onClosed(ws: WebSocket, code: Int, reason: String) {
    _isInitialized.value = false
    _msgs.close()
}
```

- [ ] **Step 7.2: Emit synthetic error for non-normal closes**

WebSocket close code 1000 = normal closure (user-initiated `disconnect()`). Any other code means the server closed unexpectedly. For those cases, emit a synthetic error before closing the channel so `demux` gets a termination signal and the `errorsFlow` fires:

```kotlin
override fun onClosed(ws: WebSocket, code: Int, reason: String) {
    val wasInitialized = _isInitialized.value
    _isInitialized.value = false
    // Emit synthetic error for unexpected server-side closes so ChatViewModel
    // can clear thinking=true and surface feedback to the user.
    // Code 1000 = normal close (user-initiated), no error needed.
    if (wasInitialized && code != 1000) {
        _msgs.trySendBlocking(
            RpcMessage(error = RpcError(code, reason.ifBlank { "server closed connection (code $code)" }))
        )
    }
    _msgs.close()
}
```

Import needed: `RpcMessage` and `RpcError` are already imported in the file (used in `onFailure`). `trySendBlocking` is already used in `onFailure` as well.

- [ ] **Step 7.3: Verify no duplicate error on normal disconnect**

When the user calls `disconnect()` on `CodexConnectionManager`, the code calls `ws.close(1000, "bye")`. OkHttp will call `onClosing` then `onClosed(code=1000)`. The guard `code != 1000` ensures no synthetic error is emitted for normal closes. Verify this is the only explicit close call by searching for `ws?.close` in the codebase — there should be exactly one, in the `disconnect()` function.

- [ ] **Step 7.4: Commit**
```bash
git add android/app/src/main/kotlin/tv/tootie/aurora/app/codex/CodexClient.kt
git commit -m "fix(aurora-design-system-dtr5): emit ConnectionError on unexpected onClosed — clears thinking spinner on clean server shutdown"
```

---

## Task 8: Close all 7 beads and push

- [ ] **Step 8.1: Close beads**
```bash
bd close aurora-design-system-redj aurora-design-system-l0r0 aurora-design-system-442f aurora-design-system-uf4w aurora-design-system-hkey aurora-design-system-lym7 aurora-design-system-dtr5
bd dolt push
```

- [ ] **Step 8.2: Push branch**
```bash
git push origin feat/codex-android-pr5-port
```

- [ ] **Step 8.3: Verify PR #16 is still open and all commits are present**
```bash
gh pr view 16 --json state,commits | head -20
```
Expected: state = OPEN, 14+ commits listed.

---

## Self-Review Checklist

| Requirement | Task |
|-------------|------|
| GoalGet captures expectedId at call time (not response time) | Task 1.2 |
| GoalSet errors re-open the goal editor sheet | Task 2.1 |
| NavHost LaunchedEffect syncs threadId to SidebarViewModel after resume | Task 3.1 |
| tryResumeThread logs warning on -1 (no silent drop) | Task 4.2 |
| steer() logs warning on -1 | Task 4.3 |
| handleSkills sanitizes name and description | Task 5.2 |
| handleThreadList sanitizes cwd, name, preview | Task 6.2 |
| onClosed emits error for code != 1000 | Task 7.2 |
| Normal disconnect (code 1000) does NOT emit error | Task 7.3 |
| All 7 beads closed | Task 8.1 |
