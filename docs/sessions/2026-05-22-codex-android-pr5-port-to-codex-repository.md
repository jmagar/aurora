---
date: 2026-05-22 22:01:16 EST
repo: git@github.com:jmagar/aurora-design-system.git
branch: feat/codex-android-pr5-port
head: 1f83b82
plan: docs/superpowers/plans/2026-05-23-codex-android-pr5-port.md
working directory: /home/jmagar/workspace/aurora-design-system/.worktrees/codex-android-pr5-port
worktree: /home/jmagar/workspace/aurora-design-system/.worktrees/codex-android-pr5-port 1f83b82 [feat/codex-android-pr5-port]
pr: "#16 — feat(android): port PR#5 features onto CodexRepository — https://github.com/jmagar/aurora-design-system/pull/16"
---

## User Request

Port the 8 Android features from the closed PR #5 (aurora-design-system-ul5, which used CodexConnectionManager) onto the current main architecture that uses CodexRepository. The user also requested the full pipeline: lavra-plan → lavra-research → lavra-eng-review → apply all findings → writing-plans → work-it.

## Session Overview

Complete end-to-end delivery of 9 Android features ported from the closed PR #5 onto CodexRepository. Created a comprehensive implementation plan, ran research and engineering review phases that identified 23 issues (all applied), implemented 9 tasks via subagent-driven development in an isolated worktree, ran lavra-review + 3 simplifier passes + pr-review-toolkit sweep, addressed all PR comments, and pushed PR #16.

## Sequence of Events

1. Closed PR #5 (CodexConnectionManager approach diverged from main) and removed the worktree
2. Analyzed current main architecture — found CodexRepository with Mutex-serialized connection, typed SharedFlows, pendingKinds routing
3. Ran `/lavra-plan` to produce 9 child beads (aurora-design-system-wquo.1–9) across 6 waves
4. Ran `/lavra-research` — 3 domain-matched agents surfaced key findings (backpressure, regex crash, allowBackup absent, ID coercion)
5. Ran `/lavra-eng-review` — 4 agents identified 23 recommendations including architecture changes and security fixes
6. Applied all 23 eng-review recommendations to bead descriptions (pendingKinds String keys, originKind on TurnEvent, dedicated sidebarNotificationsFlow, etc.)
7. Wrote comprehensive implementation plan via `/writing-plans`
8. Created worktree `.worktrees/codex-android-pr5-port` and implemented 9 tasks via subagent-driven development
9. Ran `lavra-review` on full diff — fixed 6 issues (compile error, unsanitized fields, demux ordering, approveToolCall race, SidebarViewModel sessionInvalidated)
10. Ran 3 code simplifier passes — 14 improvements committed
11. Ran PR review toolkit (code-reviewer + silent-failure-hunter) — fixed 4 critical issues (serverRequest/resolved queue wipe, stuck approval modal, steerText leak, skill path fallback)
12. Addressed all PR #16 review threads (1 external comment from chatgpt-codex-connector)
13. Saved session and final push

## Key Findings

- **SidebarViewModel backpressure**: Subscribing SidebarViewModel to `turnEventsFlow` (which uses `suspend emit()`) causes demux to stall when both ViewModels drain slowly. Fixed via dedicated `_sidebarNotificationsFlow`
- **skillTextRegex crash**: Original Bead 6 plan had no capture group in regex — would crash handle() with IndexOutOfBoundsException on any assistant message containing "Using ". Dropped TEXT_PARSE entirely, used HOOK + EXPLICIT only
- **contentOrNull missing import**: ChatViewModel.kt used `jsonPrimitive?.contentOrNull` at 14 call sites without importing `kotlinx.serialization.json.contentOrNull` — compile failure caught by lavra-review
- **scope.launch in demux**: `scope.launch { _turnEventsFlow.emit() }` breaks FIFO ordering; replaced with direct suspend emit
- **serverRequest/resolved wipes queue**: Was doing `pendingApprovals = emptyList()` — changed to identity filter by rawServerId
- **Stuck approval modal**: When `sendApproval()` returns false, modal was undismissable and `sessionInvalidated` didn't clear approvals — fixed both

## Technical Decisions

- **TEXT_PARSE dropped entirely**: Regex had no capture group (crash), TEXT_PARSE only matters when hook events are absent (server-side bug), and HOOK already provides real-time signal. EXPLICIT via SelectedItem.Skill is cleaner.
- **pendingKinds: ConcurrentHashMap<String, RequestKind>**: Prevents silent approval drop when server uses string IDs (toIntOrNull() would return null → JSON-RPC notification instead of response)
- **ImmutableList deferred**: plan suggested ImmutableList<T> for ChatState lists but project didn't have it configured; kept as List<T> for now
- **sendWithSkill uses SelectedItem.Skill**: No new RPC method needed — the existing `startTurn(attachments = listOf(SelectedItem.Skill(name, path)))` handles explicit skill invocation
- **GoalEditorSheet remember(Unit)**: Prevents text field from resetting when server pushes thread/goal/updated notification while user is editing

## Files Modified

| File | Action | Purpose |
|------|--------|---------|
| `android/app/src/main/AndroidManifest.xml` | Modified | Add `android:allowBackup="false"` |
| `android/app/src/main/kotlin/.../codex/CodexClient.kt` | Modified | 7 new RPC methods, sendApproval, parse-error log fix |
| `android/app/src/main/kotlin/.../codex/CodexRepository.kt` | Modified | String pendingKinds, originKind on TurnEvent, new flows (mcpServersFlow, sidebarNotificationsFlow, sessionInvalidated), buffer 256, sessionInvalidated emit in reconnect() |
| `android/app/src/main/kotlin/.../data/AppSettings.kt` | Modified | THREAD_ID keys, saveThread/clearThreadId/clearSession |
| `android/app/src/main/kotlin/.../data/AuthRepository.kt` | Modified | clearCredentials() calls clearAuth() not just setAuthToken |
| `android/app/src/main/kotlin/.../ui/chat/ChatViewModel.kt` | Modified | sanitizeForDisplay() utility, isReady gate, session resume, item types, approval FIFO, skill EXPLICIT, steer, errorsFlow steerText cleanup |
| `android/app/src/main/kotlin/.../ui/chat/ChatScreen.kt` | Modified | Approval overlay, steer button/sheet, item type rows, skill pendingInvocation, skill path fallback |
| `android/app/src/main/kotlin/.../ui/chat/ToolCallTimeline.kt` | Modified | McpToolCallRows composable, sanitize applied, displayCmd extracted |
| `android/app/src/main/kotlin/.../ui/chat/SkillInvocationList.kt` | Modified | EXPLICIT "direct" violet badge |
| `android/app/src/main/kotlin/.../ui/chat/MentionSuggestions.kt` | Modified | path field on MentionItem |
| `android/app/src/main/kotlin/.../ui/chat/SteerInputSheet.kt` | Created | ModalBottomSheet for turn/steer |
| `android/app/src/main/kotlin/.../ui/sidebar/SidebarViewModel.kt` | Modified | ThreadGoal/McpServerInfo state, goal/mcp subscriptions, sessionInvalidated |
| `android/app/src/main/kotlin/.../ui/sidebar/SessionsSidebar.kt` | Modified | Goal strip in header, McpServerPanel |
| `android/app/src/main/kotlin/.../ui/sidebar/GoalEditorSheet.kt` | Created | ModalBottomSheet for thread goal editing |
| `android/app/src/main/kotlin/.../ui/sidebar/McpServerPanel.kt` | Created | Collapsible MCP server list with status dots |
| `android/app/src/main/kotlin/.../NavHost.kt` | Modified | Wire goal params, setCurrentThread, mcpServers |

**Package abbreviation:** `android/app/src/main/kotlin/tv/tootie/aurora/app`

## Commands Executed

```bash
# Worktree creation
git worktree add -b feat/codex-android-pr5-port .worktrees/codex-android-pr5-port HEAD

# PR creation
gh pr create --base main --head feat/codex-android-pr5-port --title "feat(android): port PR#5 features onto CodexRepository"

# Verification
python3 $SCRIPTS/verify_resolution.py --input /tmp/pr16.json
# → ✓ 2 thread(s) resolved or outdated

# Final push
git push origin feat/codex-android-pr5-port
```

## Errors Encountered

- **Content filter blocked Task 4 subagent response**: The agent completed work (11 tool uses) but its response was blocked. Worktree changes were partially present; manually completed the McpToolCallRows and ChatScreen inline rows and committed directly.
- **Gradle build artifacts in git status**: Simplifier agents triggered Gradle compilation; binary build artifacts appeared as modified files. Not committed (already in .gitignore).

## Behavior Changes (Before/After)

| Behavior | Before | After |
|----------|--------|-------|
| App restart | Lost conversation silently | Resumes via thread/resume |
| MCP tool calls | Silently dropped | Rendered with violet dot + server:tool label |
| Tool approval | AuroraPermissionPrompt existed but unwired | Shown before every sandboxed command/file change |
| Stuck approval dialog | N/A (new feature) | Cleared on sessionInvalidated + connection errors |
| Auth token in backups | Backed up to Google Drive (default allowBackup=true) | allowBackup=false prevents cloud backup |
| Logout | Only cleared AUTH_TOKEN | clearAuth() clears all 5 credential keys |
| delay(500) race | requestsin ChatViewModel.connect() could arrive before handshake | Gated on repo.isReady |
| Skill rendering | HOOK only | HOOK + EXPLICIT (@mention with SelectedItem.Skill) |
| steer on disconnect | steerText leaked, no user feedback | Cleared on errorsFlow, "[steer not sent]" appended to msgs |

## Risks and Rollback

- **Rollback**: `git checkout main` in main repo; worktree can be removed with `git worktree remove .worktrees/codex-android-pr5-port --force`
- **setCurrentThread not called after thread resume**: Goal panel stays empty after thread/resume startup. Filed as `aurora-design-system-442f`
- **GoalSet errors silently dropped**: Routed to ChatViewModel as no-ops. Filed as `aurora-design-system-l0r0`
- **onClosed doesn't emit ConnectionError**: In-progress turns spin indefinitely on clean server shutdown. Filed as `aurora-design-system-dtr5`

## Open Questions

- Does `CodexClient.onClosed` need to emit a synthetic error for clean closes (code != 1000)?
- Should `SidebarViewModel.setCurrentThread()` be called after thread/resume success in ChatViewModel to populate the goal panel?
- How does the server respond to `sendApproval` — does it send `serverRequest/resolved` with an `id` field? The identity filter assumes yes.

## Next Steps

**Unfinished (filed as beads):**
- `aurora-design-system-442f` (P2) — Goal panel empty after thread resume
- `aurora-design-system-l0r0` (P2) — setGoal errors silently dropped
- `aurora-design-system-uf4w` (P2) — tryResumeThread/steerTurn return -1 silently
- `aurora-design-system-redj` (P2) — GoalGet thread race: capture expectedId before async call
- `aurora-design-system-hkey` (P3) — Sanitize skill name/description
- `aurora-design-system-lym7` (P3) — Sanitize thread title/preview/cwd
- `aurora-design-system-dtr5` (P3) — onClosed doesn't emit ConnectionError

**Follow-on tasks:**
- Merge PR #16 after review passes
- Remove worktree after merge: `git worktree remove .worktrees/codex-android-pr5-port`
- Address P2 beads in a follow-up session
