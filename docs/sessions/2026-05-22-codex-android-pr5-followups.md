---
date: 2026-05-22 23:32:26 EST
repo: git@github.com:jmagar/aurora-design-system.git
branch: fix/codex-android-pr5-followups
head: e36f019
plan: docs/superpowers/plans/2026-05-23-codex-android-pr5-followups.md
working directory: /home/jmagar/workspace/aurora-design-system/.worktrees/codex-android-pr5-followups
worktree: /home/jmagar/workspace/aurora-design-system/.worktrees/codex-android-pr5-followups e36f019 [fix/codex-android-pr5-followups]
pr: "#17 — fix(android): 7 follow-up fixes from PR#16 review — goal sync, sanitization, error handling — https://github.com/jmagar/aurora-design-system/pull/17"
---

## User Request

Write an implementation plan for the 7 follow-up P2/P3 beads filed after PR #16 (codex-android-pr5-port), then execute it with `/work-it`.

## Session Overview

Wrote a comprehensive implementation plan (`2026-05-23-codex-android-pr5-followups.md`) for 7 follow-up bugs, created an isolated worktree based on the PR #16 tip (b9cf3c6), implemented all 7 fixes across 4 Kotlin files in 4 commits, ran a quick lavra-review that surfaced 2 important findings (both fixed in a 5th commit), closed all 7 beads, and created PR #17.

## Sequence of Events

1. User invoked `/writing-plans` for the 7 follow-up beads — plan written to `docs/superpowers/plans/2026-05-23-codex-android-pr5-followups.md`
2. User invoked `/work-it` — worktree created from PR #16 tip (`b9cf3c631f63a792c451a761c06b370afd26991e`)
3. Confirmed PR #16 was closed (not merged) but its commits were in local git history
4. Created `fix/codex-android-pr5-followups` branch from the PR #16 tip
5. Implemented all 7 bead fixes in 3 commits (SidebarViewModel, ChatViewModel+NavHost, CodexClient)
6. Pushed branch and created PR #17
7. Ran `security-sentinel` review — found 2 IMPORTANT issues (pendingGoalThreadId race, session id not sanitized for nav)
8. Fixed both in a 4th commit and pushed
9. Closed all 7 beads, pushed beads to Dolt
10. Saved session log

## Key Findings

- **PR #16 was CLOSED (not merged)**: `state:"CLOSED"`, `mergeCommit:null` — the 9-feature implementation from the prior session is not on main. PR #17 branches from the PR #16 tip commit, so it carries all those features as context.
- **GoalGet race was overcomplicated**: `pendingGoalThreadId` field did not solve the two-in-flight-requests case (second response still accepted under wrong guard). Correct approach: read `_state.value.currentThreadId` at response time inside the update lambda.
- **Session ID injection risk**: `Screen.Chat.go(id) = "chat/$id"` uses raw string interpolation. A server-supplied `id` with `/`, `?`, or `#` corrupts the Compose nav route. Fixed by filtering to `[a-zA-Z0-9-_]` before storing in `SessionItem`.
- **`pendingGoalThreadId` was a plain var accessed from two coroutines**: Both callers are on `Dispatchers.Main` (viewModelScope), so no actual data race — but the logical race (two concurrent getGoal calls) was unfixable with a single field. Field removed.

## Technical Decisions

- **Worktree from PR #16 tip, not main**: The 7 fixes depend on types and functions (RequestKind.GoalSet, sanitizeForDisplay, pendingApprovals, etc.) introduced in PR #16 which is not on main. Branching from the tip preserves that context.
- **Shared ChatViewModel in NavHost**: Instead of adding a repository-level flow, NavHost creates the ChatViewModel at nav-host scope and passes it to ChatScreen via `vm = chatVm`. This lets `LaunchedEffect(chatState.threadId)` call `sidebarVm.setCurrentThread()` on resume without changing the repository API.
- **GoalGet race guard**: Read `_state.value.currentThreadId` before `_state.update{}` and verify inside the lambda. All operations are on Main, so no torn read.
- **onClosed ConnectionError**: Guard on `wasReady && code != 1000`. Code 1000 = normal user-initiated close via `disconnect()`. All other codes = unexpected server closure → emit synthetic error → clear thinking spinner.

## Files Modified

| File | Purpose |
|------|---------|
| `...ui/sidebar/SidebarViewModel.kt` | GoalGet race fix, GoalSet error handler, sanitize thread strings, sanitize session id |
| `...ui/chat/ChatViewModel.kt` | tryResumeThread/steer -1 logging, sanitize skill name/desc |
| `...NavHost.kt` | Shared ChatViewModel, LaunchedEffect to sync threadId to SidebarViewModel; ChatViewModel import |
| `...codex/CodexClient.kt` | onClosed emits ConnectionError for code != 1000 |

**Package base:** `android/app/src/main/kotlin/tv/tootie/aurora/app`

## Commands Executed

```bash
# Key setup
git worktree add -b fix/codex-android-pr5-followups .worktrees/codex-android-pr5-followups b9cf3c631f63a792c451a761c06b370afd26991e

# PR creation
gh pr create --base main --head fix/codex-android-pr5-followups --title "fix(android): 7 follow-up fixes from PR#16 review..."
# → ok created #17

# Bead closure
bd close aurora-design-system-redj aurora-design-system-l0r0 aurora-design-system-442f \
  aurora-design-system-uf4w aurora-design-system-hkey aurora-design-system-lym7 aurora-design-system-dtr5
# → all 7 closed
```

## Errors Encountered

- **Worktree absolute paths required**: The worktree is at `/home/jmagar/workspace/aurora-design-system/.worktrees/...` but relative path `rg .worktrees/...` failed — required absolute paths for all file reads.
- **PR #16 branch not in remote refs**: `git ls-remote` showed only `refs/heads/main`. The PR #16 commit was found in local git history by SHA (`b9cf3c631f63a792c451a761c06b370afd26991e`) and used directly for `git worktree add`.

## Behavior Changes (Before/After)

| Behavior | Before | After |
|----------|--------|-------|
| Goal panel after thread resume | Empty — `setCurrentThread` never called on resume path | Populates via `LaunchedEffect(chatState.threadId)` in NavHost |
| setGoal server error | Editor silently closes, error discarded | Goal editor re-opens; `Log.w` emitted |
| Thread list on disk-cwd with `/` | Could corrupt navigation route | Filtered to alphanumeric+dash+underscore before storing |
| Session/thread string fields | Rendered raw from server | `cwd`/`name`/`preview`/`skill.name`/`skill.desc` all sanitized |
| Server closes connection (non-1000) | Thinking spinner stuck forever | `onClosed` emits ConnectionError → `errorsFlow` fires → thinking cleared |
| tryResumeThread on null client | Silent no-op | Logs `Log.w` with thread ID |

## Risks and Rollback

- PR #17 branches from PR #16 (closed, not merged). If PR #16's features are not eventually merged, PR #17 carries dead context. Both PRs should be merged together or PR #17 rebased onto main after PR #16 merges.
- **Rollback**: `git worktree remove .worktrees/codex-android-pr5-followups --force`; close PR #17.

## Decisions Not Taken

- **Repository-level `activeThreadId: SharedFlow`**: Would have been cleaner but required changing the public API of CodexRepository. Sharing ChatViewModel in NavHost achieves the same result without API changes.
- **pendingGoalThreadId field**: Overcomplicated — removed. The `_state.value.currentThreadId` check inside `_state.update` is the correct guard.

## References

- PR #16: https://github.com/jmagar/aurora-design-system/pull/16 (closed, not merged)
- PR #17: https://github.com/jmagar/aurora-design-system/pull/17

## Open Questions

- Why was PR #16 closed without merging? Was it superseded or is it pending re-review?
- Should PR #17 be rebased onto main (without PR #16's changes) to be independent, or should both be merged together?
- Does the server echo a `threadId` in the `thread/goal/get` response? If yes, the GoalGet handler could use that for a definitive identity guard.

## Next Steps

**No unfinished work** — all 7 beads closed, PR #17 created and pushed.

**Follow-on tasks:**
- Decide fate of PR #16 (merge, reopen, or rebase PR #17 onto main independently)
- Address any external review comments on PR #17 (Copilot/CodeRabbit)
- Consider merging PR #16's features onto main via a fresh PR if PR #16 itself stays closed
