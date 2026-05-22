---
date: 2026-05-22 18:34:29 EST
repo: git@github.com:jmagar/aurora-design-system.git
branch: feat/shared-codex-client-singleton
head: 8f73a04
plan: docs/superpowers/plans/2026-05-22-shared-codex-client-singleton.md
agent: Claude
session id: 2534fec4-fdfc-4bfe-b509-773bb950deee
transcript: /home/jmagar/.claude/projects/-home-jmagar-workspace-aurora-design-system/2534fec4-fdfc-4bfe-b509-773bb950deee.jsonl
working directory: /home/jmagar/workspace/aurora-design-system
worktree: /home/jmagar/workspace/aurora-design-system/.worktrees/shared-codex-client-singleton
pr: "#10 — feat(android): shared CodexRepository singleton — eliminate dual WebSocket connections — https://github.com/jmagar/aurora-design-system/pull/10"
---

## User Request

Execute the plan at `docs/superpowers/plans/2026-05-22-shared-codex-client-singleton.md` via `work-it`, creating an application-scoped `CodexRepository` singleton to replace the dual `CodexClient` WebSocket connections previously owned by `SidebarViewModel` and `ChatViewModel`.

## Session Overview

Implemented a shared `CodexRepository` that owns a single `CodexClient` WebSocket connection and fans messages into five typed `SharedFlow`s. Refactored `SidebarViewModel` and `ChatViewModel` to subscribe to repository flows. Added reconnect support on settings change. Opened PR #10, ran `lavra-review`, applied review fixes including thread-safety (Mutex), `pendingKinds.clear()` on reconnect, `emit()` instead of `tryEmit()` for critical events, failure recovery (client reset on WebSocket error), and extracted `startClientLocked()` to reduce duplication.

## Sequence of Events

1. Created worktree `feat/shared-codex-client-singleton` at `.worktrees/shared-codex-client-singleton`
2. Copied untracked plan files into worktree
3. Resolved build failure — aurora module token generation needed `AURORA_TOKENS_OUT` env var pointed at worktree's build directory
4. Found and fixed Kotlin comment-nesting bug — `/*` inside KDoc block opened a nested comment; replaced with plain text
5. Implemented Task 1: `CodexRepository.kt` — typed flows, `RequestKind` enum, `demux()` routing
6. Implemented Task 2: `CodexApp.kt` — lazy repository + `onTerminate()` disconnect
7. Implemented Task 3: `SidebarViewModel.kt` — removed own `CodexClient`, subscribes to `threadsFlow`
8. Implemented Task 4: `ChatViewModel.kt` — removed own `CodexClient`, subscribes to typed repo flows
9. Implemented Task 5: `SettingsScreen.kt` — reconnect on settings save via `ctx.applicationContext as CodexApp`
10. Full `assembleDebug` build successful
11. Created PR #10
12. Ran `lavra-review` — found 5 issues (1 P1, 2 P2, 2 P3)
13. Applied review fixes: Mutex for thread-safe connect/reconnect, `pendingKinds.clear()`, `tryEmit` → `emit()`, `startClientLocked()` refactor
14. Fixed client reset on WebSocket failure (Copilot review comment)
15. Pushed all fix commits to PR branch

## Key Findings

- `/*` inside a `/** ... */` KDoc block in Kotlin opens a nested comment block (Kotlin supports nested block comments). The original plan code had `item/*, hook/*` in a KDoc which caused "Syntax error: Missing `}'`" + "Unclosed comment" at compile time. Fixed by replacing with plain text descriptions.
- The aurora module generates `AuroraColors.kt` via `pnpm run tokens:generate` — the worktree's build directory starts empty so `generateAuroraTokens` task must be forced-rerun with the `AURORA_TOKENS_OUT` env var pointing at the worktree path.
- `Application.onTerminate()` is never called on real Android devices (only emulators) — documented in `disconnect()` KDoc.
- `tryEmit()` on a `SharedFlow` silently drops events when the buffer is full — `turn/completed` dropped this way leaves the UI stuck in thinking state forever.

## Technical Decisions

- **Mutex over AtomicBoolean**: Replaced `AtomicBoolean connected` with `kotlinx.coroutines.sync.Mutex` to serialize `connect()`/`reconnect()`/`disconnect()`. The original `AtomicBoolean` guard only protects `connect()` — `reconnect()` resets the flag then calls `connect()`, creating a non-atomic check-then-act race.
- **`emit()` instead of `tryEmit()` for `turnEventsFlow`**: Turn lifecycle events (`turn/completed`) must not be silently dropped. Using `suspend emit()` applies backpressure rather than dropping.
- **`pendingKinds.clear()` on reconnect**: The new `CodexClient` resets its `AtomicInteger` ID counter per instance, so old pending IDs collide with new requests unless cleared.
- **Failure recovery via `client = null` in `demux()`**: When `onFailure` fires, reset `client` inside `connectionMutex` so subsequent `connect()` calls can establish a new connection rather than no-oping on the stale reference.
- **`startClientLocked()` private helper**: Extracted shared client-start logic from `connect()` and `reconnect()` to eliminate copy-paste.

## Files Modified

| File | Action | Purpose |
|------|--------|---------|
| `android/app/src/main/kotlin/tv/tootie/aurora/app/codex/CodexRepository.kt` | Created | Application-scoped singleton; typed flows; thread-safe connect/reconnect via Mutex |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/CodexApp.kt` | Modified | Exposes `repository: CodexRepository by lazy {}` |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/sidebar/SidebarViewModel.kt` | Modified | Removed own `CodexClient`; subscribes to `threadsFlow` |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/chat/ChatViewModel.kt` | Modified | Removed own `CodexClient`; subscribes to `modelsFlow`, `skillsFlow`, `turnEventsFlow`, `errorsFlow` |
| `android/app/src/main/kotlin/tv/tootie/aurora/app/ui/settings/SettingsScreen.kt` | Modified | Calls `repository.reconnect()` after saving settings |

## Commands Executed

```bash
# Token generation for worktree (key discovery)
AURORA_TOKENS_OUT=".worktrees/shared-codex-client-singleton/android/aurora/build/generated/aurora-tokens/kotlin/tv/tootie/aurora/tokens" pnpm run tokens:generate

# Build verification (each task)
./gradlew :app:compileDebugKotlin  # → BUILD SUCCESSFUL

# Full APK build
./gradlew :app:assembleDebug  # → BUILD SUCCESSFUL in 4s, 55 tasks

# PR creation
gh pr create --title "feat(android): shared CodexRepository singleton — eliminate dual WebSocket connections"
# → PR #10 https://github.com/jmagar/aurora-design-system/pull/10
```

## Errors Encountered

- **Kotlin nested comment parsing**: `/*` in KDoc comment body (from plan's `item/*, hook/*`) caused compiler "Missing `}'`" + "Unclosed comment". Root cause: Kotlin block comments nest. Fixed by replacing wildcards with plain text.
- **Worktree build cache empty**: Aurora token generation task reported `UP-TO-DATE` but output dir was empty — the worktree has its own `build/` dir starting empty. Fixed by running `pnpm run tokens:generate` with `AURORA_TOKENS_OUT` pointing at worktree path, then Gradle cache took over.
- **`rtk git push` alias conflict**: `rtk` aliasing caused git to interpret `git push` as `git rtk push`. Fixed by removing `rtk` prefix from git commands.
- **GitHub HTTPS DNS failure**: `github.com` DNS not resolving for HTTPS. Fixed by switching remote to SSH (`git@github.com:...`).

## Behavior Changes (Before/After)

| Aspect | Before | After |
|--------|--------|-------|
| WebSocket connections | 2 (one per ViewModel) | 1 (repository singleton) |
| Message routing | Each VM receives all messages, filters manually | Repository demuxes by request kind to typed flows |
| Skills/models routing | `ChatViewModel` inspects `null`-method response shape | Repository routes to `skillsFlow`/`modelsFlow` by request ID |
| Reconnect on settings change | No reconnect (each VM creates new client on next navigation) | `SettingsScreen.reconnect()` immediately reconnects the shared client |
| Connection lifecycle | ViewModels disconnect in `onCleared()` | Repository owns lifetime; ViewModels do not disconnect |
| Failure recovery | Each VM creates new client on next `connect()` | Repository resets `client = null` on WebSocket failure |

## Verification Evidence

| Command | Expected | Actual | Status |
|---------|----------|--------|--------|
| `./gradlew :app:compileDebugKotlin` (Task 1) | BUILD SUCCESSFUL | BUILD SUCCESSFUL | PASS |
| `./gradlew :app:compileDebugKotlin` (Task 2) | BUILD SUCCESSFUL | BUILD SUCCESSFUL | PASS |
| `./gradlew :app:compileDebugKotlin` (Task 3) | BUILD SUCCESSFUL | BUILD SUCCESSFUL | PASS |
| `./gradlew :app:compileDebugKotlin` (Task 4) | BUILD SUCCESSFUL | BUILD SUCCESSFUL | PASS |
| `./gradlew :app:compileDebugKotlin` (Task 5) | BUILD SUCCESSFUL | BUILD SUCCESSFUL | PASS |
| `./gradlew :app:assembleDebug` | BUILD SUCCESSFUL + APK | BUILD SUCCESSFUL in 4s | PASS |
| `./gradlew :app:compileDebugKotlin` (post-review fixes) | BUILD SUCCESSFUL | BUILD SUCCESSFUL | PASS |

## Risks and Rollback

- **`emit()` backpressure**: Using `suspend emit()` instead of `tryEmit()` for `turnEventsFlow` means that if `ChatViewModel` processes events slowly, `demux()` will suspend. With `Dispatchers.IO` scope this is fine, but it's a behavior change from non-blocking.
- **Mutex deadlock risk**: `demux()` acquires `connectionMutex` on failure recovery. If `demux()` is called from within a `connectionMutex.withLock` block (it isn't — it's called from `onEach` on `scope`), deadlock would occur. Current design is safe.
- **Rollback**: Revert the 5 modified files to their state before this branch (`git revert` the 8 commits on `feat/shared-codex-client-singleton`, or simply not merging PR #10).

## Decisions Not Taken

- **Hilt DI**: Plan specifies no Hilt — dependency resolution is via `(app as CodexApp).repository`. An unsafe cast, but consistent with the codebase's non-Hilt stance.
- **`StateFlow` instead of `SharedFlow`**: `StateFlow` requires an initial value and merges state. `SharedFlow` with `replay = 1` gives replayed values without requiring initial state, which matches the data-arrives-async model here.
- **`ProcessLifecycleOwner` for disconnect**: Noted as a better alternative to `onTerminate()` for production lifecycle cleanup. Not implemented — filed as P3 bead `aurora-design-system-eq95`.

## Open Questions

- Does `SidebarViewModel.connect()` calling `repo.listThreads()` immediately after `repo.connect()` race the WebSocket `onOpen`/initialize handshake? The new async `connect()` means the handshake is not complete before `listThreads()` fires. Filed as P3 bead (`aurora-design-system-i1zy`) and Copilot P2 comment — not fixed in this session.
- `Application.onTerminate()` never called on real devices — the WebSocket stays open until OkHttp GC. Acceptable for now; a `ProcessLifecycleOwner` observer would be cleaner.

## Next Steps

**Started but not completed:**
- None — all plan tasks fully implemented and verified

**Follow-on (from review findings):**
- `aurora-design-system-nbg9` (P1, blocks `9on`): Thread-safety of `reconnect()` — already fixed in this session via Mutex; bead should be closed
- `aurora-design-system-dcem` (P2): `pendingKinds` not cleared on reconnect — already fixed in this session; bead should be closed
- `aurora-design-system-jazl` (P2): `tryEmit` silent drops — already fixed in this session; bead should be closed
- `aurora-design-system-eq95` (P3): `onTerminate()` unreliability — document or use `ProcessLifecycleOwner`
- `aurora-design-system-y0lc` (P3): Unsafe `(app as CodexApp)` cast — consider factory pattern for testability
- `aurora-design-system-i1zy` (P3): Hardcoded `delay(500)` races handshake — wait for initialize acknowledgment

**Plan 2 to execute:**
- `docs/superpowers/plans/2026-05-22-fix-initialize-capabilities.md` (bead `aurora-design-system-hwg`) — add `capabilities.experimentalApi=true` to `initialize` request in `CodexClient.kt`

## References

- Plan: `docs/superpowers/plans/2026-05-22-shared-codex-client-singleton.md`
- PR #10: https://github.com/jmagar/aurora-design-system/pull/10
- Bead: `aurora-design-system-9on` (the bug this fixes)
- Kotlin block comment nesting: https://kotlinlang.org/docs/basic-syntax.html#comments
