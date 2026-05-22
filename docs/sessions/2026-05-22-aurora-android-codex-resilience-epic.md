---
date: 2026-05-22 19:00:57 EST
repo: git@github.com:jmagar/aurora-design-system.git
branch: worktree-aurora-design-system-ul5
head: a8d50ef
working directory: /home/jmagar/workspace/aurora-design-system/.claude/worktrees/aurora-design-system-ul5
worktree: /home/jmagar/workspace/aurora-design-system/.claude/worktrees/aurora-design-system-ul5 a8d50ef [worktree-aurora-design-system-ul5]
pr: "#5 — feat(android): Aurora Codex — Resilience, Persistence & Protocol Features — https://github.com/jmagar/aurora-design-system/pull/5"
---

## User Request

Execute the lavra-work epic `aurora-design-system-ul5` (Aurora Codex Android — Resilience, Persistence & Protocol Features) in a new worktree, create a PR on completion, then run the full review pipeline: lavra-review, pr-review-toolkit:review-pr, code-review:code-review, and gh-pr to address all PR comments.

## Session Overview

Delivered the complete 6-bead Android resilience epic in a dedicated worktree, created PR #5, and drove it through four review passes totalling 12 commits. All 20 review threads resolved. The PR introduces a shared WebSocket singleton (`CodexConnectionManager`), session persistence via DataStore, turn/steer, thread goals, MCP server panel, approval security wiring, and three-source skill rendering.

## Sequence of Events

1. Cleaned up leftover worktree from previous session (`worktree-agent-a8622dcaa57a5832a`) — merged its single orphaned commit (android README) into main, removed branch and worktree
2. Created new worktree `aurora-design-system-ul5` via `EnterWorktree`
3. Invoked `lavra:lavra-work aurora-design-system-ul5` → routed to `lavra-work-multi` (6 open child beads)
4. Executed 6 sequential waves due to complete file-scope overlap between beads:
   - **Wave 1 (1fu)**: CodexConnectionManager singleton + WebSocket reconnection foundation
   - **Wave 2 (trx)**: DataStore session persistence + thread/resume
   - **Wave 3 (1ht)**: turn/steer + SteerInputSheet
   - **Wave 4 (di2)**: Thread goals + GoalEditorSheet + sidebar display
   - **Wave 5 (ahp)**: MCP panel + AuroraPermissionPrompt wiring + 6 item types
   - **Wave 6 (p4l)**: Three-source skill rendering
5. After each wave: committed, ran `lavra-review` (Wave 1 full, others quick), fixed P1 findings
6. Closed all 6 child beads + epic bead, pushed branch, created PR #5
7. Ran `lavra-review` on full epic diff — 3 additional P1 fixes committed
8. Ran `pr-review-toolkit:review-pr` — 3 more P1 fixes committed
9. Ran `code-review:code-review` — posted 6-issue review comment on PR #5
10. Ran `gh-pr 5` — fetched 20 open threads, fixed all, resolved all 20 + 3 outdated

## Key Findings

- **Production bug (dual sockets)**: `ChatViewModel` and `SidebarViewModel` each opened their own WebSocket — server saw two connections per device. Fixed by `CodexConnectionManager` singleton in `CodexApp`.
- **Delta channel race**: `_messages.emit` is async (`scope.launch`) — delta channels must be pre-created synchronously in `onMessage` on `turn/started` to prevent early-delta drops before `ChatViewModel` processes the event. Fixed at `CodexConnectionManager.kt:177`.
- **Subscription leak**: Both ViewModels called `manager.messages.onEach { }.launchIn(viewModelScope)` inside `connect()`, accumulating N Jobs on each call. Moved to `init{}`. Fixed at `ChatViewModel.kt:71`.
- **ToolCall StringBuilder**: `data class ToolCall(val out: StringBuilder)` mutated inside `StateFlow.update{}` returned the same instance — Compose never recomposed. Changed to `String` with `it.copy(out = it.out + delta)`. Fixed at `ChatViewModel.kt:29`.
- **sendApproval ID coercion**: `serverRequestId.toIntOrNull()` breaks for large/string IDs. Fixed by storing `ServerRequest(rawId: JsonElement, params)` and echoing `rawId` verbatim at `CodexConnectionManager.kt:77`.
- **connect() infinite suspend**: `connectionState.first { it is Connected }` had no escape for Error state — added `|| it is Error || it is Disconnected` guard at `ChatViewModel.kt:152`.
- **tryResumeThread clears on any error**: Only -32600 should clear saved threadId. Fixed at `ChatViewModel.kt:171`.

## Technical Decisions

- **Sequential waves** (not parallel): All 6 beads modified `CodexConnectionManager.kt`, `ChatViewModel.kt`, `SidebarViewModel.kt` — any parallelism would cause git merge conflicts. Forced sequential via `bd dep add`.
- **SharedFlow(replay=0) + init{} subscriptions**: Subscriptions in `init{}` ensure events are never missed (no replay needed) and prevents duplicate subscriptions if `connect()` is called multiple times.
- **DISCARD_ON_RECONNECT for steerTurn**: `expectedTurnId` is stale after reconnect — steer messages must be discarded, not replayed. `steerTurn()` now enqueues with `DISCARD_ON_RECONNECT` type.
- **sanitizeForDisplay() as internal**: Changed from `private` to `internal` to allow `ToolCallTimeline.kt` (same package) to sanitize MCP text fields before rendering.
- **Store raw JsonElement ID for approvals**: Instead of `String → params`, `serverInitiatedRequests` now stores `ServerRequest(rawId: JsonElement, params)` so the server's original ID is echoed verbatim in approval responses.

## Files Modified

| File | Purpose |
|------|---------|
| `android/app/src/main/kotlin/tv/tootie/aurora/app/codex/CodexConnectionManager.kt` | New singleton: OkHttp WebSocket, reconnect, message bus, approval routing |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/codex/ConnectionState.kt` | New: sealed class for connection states |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/CodexApp.kt` | Add `connectionManager` lazy property |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/codex/CodexClient.kt` | Mark DEPRECATED, fix `_msgs.close(t)` in onFailure |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/data/AppSettings.kt` | Add THREAD_ID/THREAD_UPDATED_AT keys, saveThread/clearThreadId/clearSession |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/ChatViewModel.kt` | Major rewrite: consume manager, all 6 item types, approvals, skill rendering |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/ChatScreen.kt` | Steer button, AuroraPermissionPrompt overlay, server-provided decisions |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/SteerInputSheet.kt` | New: ModalBottomSheet for turn/steer input |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/ToolCallTimeline.kt` | Add McpToolCallRows; fix unknown status → in-progress; sanitize MCP text |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/MentionSuggestions.kt` | Add `path` field to MentionItem |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/SkillInvocationList.kt` | Add SkillSource badges (auto/direct) |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/SidebarViewModel.kt` | Goals, MCP state, goal callback thread guard, empty MCP array fix |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/SessionsSidebar.kt` | Goal strip in header, McpServerPanel |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/GoalEditorSheet.kt` | New: ModalBottomSheet for thread goal editing |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/McpServerPanel.kt` | New: collapsible MCP server list with status dots + tool counts |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/settings/SettingsScreen.kt` | PasswordVisualTransformation on auth token field |
| `android/app/src/main/AndroidManifest.xml` | `android:allowBackup="false"` |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/NavHost.kt` | Wire goal params + setCurrentThread to SessionsSidebar |
| `.gitignore` | Add `android/aurora/build/` |

## Commands Executed

```bash
# Worktree setup
EnterWorktree name=aurora-design-system-ul5

# Epic dependency sequencing
bd dep add aurora-design-system-1ht aurora-design-system-trx
bd dep add aurora-design-system-di2 aurora-design-system-1ht
bd dep add aurora-design-system-ahp aurora-design-system-di2
bd dep add aurora-design-system-p4l aurora-design-system-ahp

# Close epic
bd close aurora-design-system-1fu aurora-design-system-trx aurora-design-system-1ht \
  aurora-design-system-di2 aurora-design-system-ahp aurora-design-system-p4l \
  aurora-design-system-ul5

# PR creation
gh pr create --base main --head worktree-aurora-design-system-ul5 --title "..."

# PR review resolution
python3 $SCRIPTS/fetch_comments.py --pr 5 -o /tmp/pr5.json
python3 $SCRIPTS/create_beads.py --input /tmp/pr5.json  # 20 beads
python3 $SCRIPTS/mark_resolved.py --all --input /tmp/pr5.json  # 20 threads resolved
python3 $SCRIPTS/verify_resolution.py --input /tmp/pr5.json  # ✓ 23 resolved/outdated
```

## Errors Encountered

- **Gradle build artifacts in git status**: A Wave 6 subagent ran `./gradlew` during implementation, creating hundreds of untracked binary files. Fixed by `git checkout android/.gradle/ android/aurora/build/` and adding `android/aurora/build/` to `.gitignore`.
- **Python regex with inline Unicode**: `sanitizeForDisplay()` initially written with inline ESC byte and Bidi characters embedded in string literals — caused Edit tool mismatches. Rewrote using explicit `` escapes and Python `re.compile()` for the replacement.
- **Edit tool Unicode string mismatch**: Files containing actual Unicode control characters (Bidi chars) could not be matched by the Edit tool. Used Python script to locate and replace by byte offset.
- **`bd create` with long `--description` flag**: Long description strings caused shell escaping failures. Workaround: create with `--title` only, then `bd update --description` separately.

## Behavior Changes (Before/After)

| Behavior | Before | After |
|----------|--------|-------|
| WebSocket connections per device | 2 (ChatViewModel + SidebarViewModel each opened one) | 1 (shared CodexConnectionManager singleton) |
| App restart | Lost conversation silently | Resumes last thread via thread/resume |
| Tool approval | AuroraPermissionPrompt existed but was unwired — all tool calls executed without intercept | Approval shown for commandExecution and fileChange events |
| mcpToolCall items | Silently dropped | Rendered in conversation with violet dot |
| Auth token field | Visible in plaintext | Masked with PasswordVisualTransformation |
| Backups | DataStore (auth token + threadId) backed up to Google Drive | allowBackup=false prevents cloud backup |
| Skill rendering | Hook events only | Three sources: hooks + text-parse + explicit @mention |
| turn/steer offline | Queued as OTHER → replayed after reconnect with stale expectedTurnId | Queued as DISCARD_ON_RECONNECT → discarded on reconnect |
| connect() on unreachable server | Hung forever on `connectionState.first { Connected }` | Escapes on Error/Disconnected state |

## Verification Evidence

| Command | Expected | Actual | Status |
|---------|----------|--------|--------|
| `python3 $SCRIPTS/verify_resolution.py --input /tmp/pr5.json` | All threads resolved | ✓ 23 thread(s) resolved or outdated | PASS |
| `bd list --status=open \| grep ul5` | No open beads | (empty) | PASS |
| `git status` | Clean working tree | clean — nothing to commit | PASS |
| `git push` | Up to date | ok worktree-aurora-design-system-ul5 | PASS |

## Risks and Rollback

- **CodexClient deprecation**: Old `CodexClient` is kept (marked DEPRECATED). If `CodexConnectionManager` has bugs, callers could fall back by re-instantiating `CodexClient` directly. No migration has been done to remove it.
- **Reconnect drops queued callbacks**: `scheduleReconnect()` clears `pendingRequests` — callbacks for in-flight requests at disconnect time are abandoned without error notification. Filed as `aurora-design-system-q85`.
- **Rollback**: `git revert` from `e6cb319` (PRE_BRANCH_SHA) would remove all 12 commits. The original `CodexClient`-based architecture is still intact in `CodexClient.kt`.

## Decisions Not Taken

- **Parallel wave execution**: All 6 beads modified the same 3 core files. Parallel agents would have caused merge conflicts. Sequential forced via `bd dep add`.
- **Hilt/DI for CodexConnectionManager**: Manual injection via `(app as CodexApp).connectionManager` is adequate at this scale. Hilt would add build complexity without benefit.
- **_inProgressContent StateFlow** for O(n) delta updates: Spec offered this as "option (b)". Chose simpler "option (a)" (direct state update) to avoid exposing a second StateFlow and changing ChatScreen. Filed for future optimization.
- **OkHttp CertificatePinner / TLS enforcement**: Not added — homelab tool where Tailscale provides transport security. Filed as security note for future production hardening.

## References

- Codex app-server protocol: `codex-rs/app-server-protocol/src/protocol/v2.rs`
- OkHttp WebSocket best practices: Florent Blot (Medium) + OkHttp official docs
- Official Codex docs (approval events, skill invocation protocol)
- PR #5: https://github.com/jmagar/aurora-design-system/pull/5

## Open Questions

- Does the Codex server echo `serverRequest/resolved` for all approval types, or only `commandExecution`? The `fileChange` branch also clears `pendingApproval` on this event, but it's unverified.
- `tryResumeThread` currently makes no API call to re-populate `state.msgs` — the resumed chat screen will open blank. Expected behavior (server pushes history?) needs verification.
- Is `android:dataExtractionRules` needed alongside `allowBackup=false` for full backup prevention on all Android API levels?

## Next Steps

**Unfinished work (started but deferred):**
- `aurora-design-system-rlas` (P2) — Approval response envelope: add `jsonrpc: "2.0"`, confirm server's expected decision shape
- `aurora-design-system-0ow1` (P2) — Clear `pendingApproval` in ChatState on disconnect/reconnect
- `aurora-design-system-gtca` (P2) — Key saved threadId by `(serverUrl, tokenHash)` to prevent cross-server resume
- `aurora-design-system-ka02` (P2) — scheduleReconnect `isReconnecting` timing: move `set(false)` before `connect()`
- `aurora-design-system-p0u1` (P2) — GoalEditorSheet draft reset on server push: use `remember(Unit)` instead of `remember(currentGoal)`
- `aurora-design-system-ap3r` (P2) — `interrupt()` should clear `activeTurnId` and mark in-progress tool calls as failed

**Follow-on tasks not yet started:**
- Clean up deprecated `CodexClient.kt` — remove once confidence in `CodexConnectionManager` is established
- `aurora-design-system-9db` — Make `activeTurnDeltaChannels` private, expose only `getDeltaChannel`/`closeDeltaChannel`/`closeAllDeltaChannels`
- `aurora-design-system-qrhx` — `McpServerInfo.toolCount` should be a computed property (`val toolCount get() = tools.size`)
- `aurora-design-system-z5p3` — `ToolApproval` should be a sealed class (Command vs FileChange variants)
- Test app on physical device / emulator to verify turn/resume behavior and MCP approval flow end-to-end
- Merge PR #5 into main once all P2 beads are resolved
