---
date: 2026-05-22 17:12:54 EST
repo: https://github.com/jmagar/aurora-design-system
branch: main
head: ee5672b
session id: b5278da2-8eba-4d0e-873e-9fd44b773220
working directory: /home/jmagar/workspace/aurora-design-system/android
---

## User Request

Build a full coding agent Android app using the Aurora Design System Kotlin component library, connected to the Codex app-server via WebSocket, then systematically review all web components, build the full Kotlin component library, and design a resilience/protocol feature plan for the app.

## Session Overview

Massive session covering four major workstreams: (1) comprehensive web component review and enhancement of all 128 Aurora React/shadcn components, (2) complete build of the Aurora Kotlin/Compose Android library (107 components across 3 phases), (3) construction of a working Codex coding agent Android app connected to the Codex app-server via WebSocket JSON-RPC 2.0, and (4) full lavra-design pipeline for a resilience/protocol epic with 6 child beads.

## Sequence of Events

1. **Web component review** — Dispatched 6 parallel agents to audit all 128 Aurora web components for token compliance, accessibility, design quality, and code correctness. Found and fixed: `data-[highlighted]` bug in Select/DropdownMenu/ContextMenu (keyboard nav was broken), SelectViewport height clamp (dropdown collapsed to 36px), `focus:` → `data-[highlighted]:` in all Radix menus.

2. **Web component enhancements** — Added `loading` prop + `violet` variant + `active:scale-[0.97]` to Button; `state` prop (error/warn/success) + `size` prop + `clearable` to Input; `interactive`/`accent`/`elevated` variants + `as` prop to Card; `pulse`/`interactive`/`size`/`shape` to Badge; `size` prop + type tokens to Dialog; `action` support + status icons + `position` variants to Toast; `data-[highlighted]:` fix to DropdownMenu.

3. **Component-Kotlin mapping** — Created `docs/component-kotlin-map.md` mapping all 128 Aurora web components to their Jetpack Compose/Material 3 equivalents.

4. **Kotlin Phase 1 (M3 wrappers, 23 components)** — Built AuroraAlertDialog, AuroraAvatar, AuroraButtonGroup, AuroraCalendar, AuroraCollapsible, AuroraCombobox, AuroraContextMenu, AuroraDropdownMenu, AuroraHoverCard/Popover, AuroraInputGroup, AuroraItem, AuroraNavigationBar/Rail, AuroraPermissionPrompt, AuroraProgress, AuroraRadioGroup, AuroraSheet, AuroraSidebar, AuroraSlider, AuroraSuggestionChip, AuroraToggle, AuroraTooltip, shareText(), AuroraWebView. Fixed pre-Phase 1 `explicitApi()` violations, added Coil3/webkit/material-icons-extended deps.

5. **Kotlin Phase 2 (custom composables, 31 components)** — Built all display, form/input, data, layout/navigation, workspace/files, and screen-level composables including AuroraToolbar, AuroraTimeline, AuroraDataTable, AuroraStatusIndicator, AuroraTerminal, AuroraCommandPalette, AuroraLoginScreen, AuroraMenubar, etc.

6. **Kotlin Phase 3 (AI agent blocks, 41 components)** — Built all AI identity (AuroraAgentRow, AuroraAiPanel, AuroraPromptInput, AuroraModelSelector), conversation (AuroraConversation, AuroraMessage, AuroraInlineCitation), reasoning (AuroraThinking, AuroraChainOfThought, AuroraArtifact), workflow (AuroraTaskItem, AuroraPlanList, AuroraCheckpoint, AuroraTestResults, AuroraStackTrace), and visual/utility AI blocks.

7. **Android :app module scaffold** — Created `:app` module with CodexClient (OkHttp WebSocket), ChatViewModel, NavHost, settings screen, thread list screen, chat screen. Connected to Codex app-server running at `ws://127.0.0.1:4500`.

8. **Build debugging** — Fixed: missing `public` modifiers (explicitApi), wrong token `accentCyanBase` in AuroraSpinner, missing `android.useAndroidX=true`, APK signed and installed on emulator.

9. **First Codex response** — Debugged: wrong event names (`agentMessageDelta` → `item/agentMessage/delta`, `turnCompleted` → `turn/completed`), wrong thread ID path (`result.thread.id` not `result.threadId`), model `codex-mini-latest` not supported with ChatGPT auth → switched to `gpt-5.5`.

10. **Feature additions** — Added model/reasoning bar, message reactions (long-press → emoji sheet), edit messages, @mention system for skills and slash commands (184 skills from `skills/list`).

11. **Sidebar** — Added `ModalNavigationDrawer` sidebar with project/session history loaded from `thread/list`, sessions grouped by CWD, relative timestamps, live dot for active threads.

12. **Color rebalance** — Pink for CTAs (send button, active border, model bar), blue-tinted surface for assistant bubbles, violet reserved for tool calls and skill/tool rendering only.

13. **APK distributed** — `rclone copyto` uploaded debug APK to `gdrive:aurora-codex/aurora-codex-debug.apk`.

14. **Chat screen layout fix** — Tool calls moved from overlay Box into LazyColumn (inline, not floating over messages). Compact timeline-style tool call cards (collapsed by default, dark terminal on expand). Skill invocation rendering added. Attach button added to PromptInput. Message input vertically centered.

15. **Lavra research** — 4 parallel research agents gathered protocol facts, OkHttp reconnect patterns, architecture recommendations, security audit. Key finding: approval events use `item/commandExecution/requestApproval`; MCP tool calls use `type='mcpToolCall'` (currently silently dropped); CodexRepository singleton recommended.

16. **Axon scrape** — Scraped full official Codex app-server docs at `https://developers.openai.com/codex/app-server` and indexed in Axon RAG.

17. **Lavra design pipeline** — Full design pipeline run on epic `aurora-design-system-ul5`: Phase 3 (research already complete), Phase 4 (revised all 6 child bead descriptions with full implementation detail), Phase 5 (4-agent engineering review), Phase 6 (plan locked). All decisions logged to beads and Dolt-synced.

## Key Findings

- **Production bug**: ChatViewModel and SidebarViewModel each open a separate WebSocket — two sockets, two handshakes. Must consolidate into CodexConnectionManager singleton. (`ChatViewModel.kt:60`, `SidebarViewModel.kt:41`)
- **Production bug**: `_msgs` Channel not closed in `onFailure()` — Flow stalls silently after network drop. (`CodexClient.kt:59`)
- **Protocol bug**: `agentMessageDelta` is wrong — actual event is `item/agentMessage/delta`. (`ChatViewModel.kt:172`)
- **Protocol bug**: MCP tool calls use `type='mcpToolCall'` not `'commandExecution'` — currently silently dropped.
- **Security gap**: `AuroraPermissionPrompt` exists but never wired to approval events. All tool execution unintercepted.
- **Approval event shape**: `item/commandExecution/requestApproval` with `{itemId, threadId, turnId, reason, command, availableDecisions}`. Client replies with `accept`/`acceptForSession`/`decline`/`cancel`.
- **turn/steer**: Requires `expectedTurnId` field matching the active turn ID — not just `threadId`.
- **Delta streaming**: 256-slot SharedFlow can overflow during long streaming completions (300+ deltas). Decision: partition into SharedFlow(control) + Channel per-turn(deltas).
- **DataStore**: `preferencesDataStore` delegate MUST be at top level of Kotlin file, never inside class.
- **Bidi security**: Server-controlled command string in permission prompt needs ANSI + Bidi override stripping before display.

## Technical Decisions

- **Pink as primary CTA** (send button, input border): distinguishes user action elements from AI identity (violet) and informational (cyan).
- **Violet reserved for AI tool/skill rendering**: agent identity, tool call cards, skill mentions only.
- **`type='mcpToolCall'` item routing**: completely separate from `commandExecution` — needs explicit handler with `server` and `tool` fields.
- **Delta partition**: SharedFlow(256) for lifecycle/control; per-turn `Channel<String>(UNLIMITED)` for `agentMessage/delta`. Fixes both buffer overflow and O(n) list scan on every delta.
- **Request-ID correlation map**: replace shape-guessing null-branch (`containsKey("skills")` heuristics) with `ConcurrentHashMap<String, (RpcMessage)->Unit>` keyed `"c-N"` for client, `"s-N"` for server.
- **Handshake sequencing**: must `initialize` → await id=0 response → `initialized` → drain queue → `thread/resume`. Current code sends both back-to-back (race condition).
- **Outbound queue policy**: KEEP. `turn/steer` messages: DISCARD on reconnect (expectedTurnId stale). `turn/start`, `goal/set`: safe to replay.
- **All 6 item types** implemented now (mcpToolCall, webSearch, plan, fileChange, imageView, dynamicToolCall).
- **Three-source skill rendering**: hooks + agentMessage text parse (`Using \`skill-name\``) + explicit `{type:"skill"}` input item on @mention selection.

## Files Modified

### Aurora Web Registry (registry/aurora/)
- `ui/button.tsx` — loading, violet variant, active state, VARIANT_CONFIG consolidation
- `ui/input.tsx` — state prop, size prop, clearable, endAdornment pointer-events
- `ui/card.tsx` — interactive, accent, elevated variants; CardTitle as prop
- `ui/badge.tsx` — pulse, interactive, size, shape props
- `ui/dialog.tsx` — size prop, type tokens, close button hover, DialogBody max-height
- `ui/toast.tsx` — action support, status icons, position variants
- `ui/select.tsx` — `data-[highlighted]:` fix, SelectViewport height fix
- `ui/dropdown-menu.tsx` — `data-[highlighted]:` fix
- `ui/context-menu.tsx` — `data-[highlighted]:` fix
- `ui/timeline.tsx` — `last:hidden` connector bug fix
- `ui/filter-bar.tsx` — JS hover → CSS, focus rings, type="text" for FilterSearch
- `ui/number-input.tsx` — hide native spin buttons
- `ui/progress.tsx` — shimmerColor rgba → color-mix tokens
- `ui/empty-state.tsx` — type tokens, `as` prop for heading level
- `ui/toolbar.tsx` — aria-orientation, highlight-medium token
- `blocks/ai/elements/core.tsx` — violet for Agent/ModelSelector/VoiceSelector/Panel, raw rgba → tokens
- `blocks/ai/ask-user-question/ask-user-question.tsx` — `stroke="white"` → `accentForeground`
- `blocks/ai/artifact/artifact.tsx` — aria-label on toolbar buttons, raw rgba shadows

### Android Aurora Library (android/aurora/src/.../components/)
- 107 Kotlin component files created across 3 phases — full Aurora component library
- `AuroraSpinner.kt` — fixed `accentCyanBase` → `MaterialTheme.colorScheme.primary`
- `AuroraPromptInput.kt` — pink CTA colors, `Alignment.CenterVertically`
- `AuroraMessage.kt` — assistant bubble: `accentVioletSurface` → `infoSurface`

### Android App (android/app/src/.../app/)
- `CodexApp.kt` — Application class
- `MainActivity.kt` — edge-to-edge, AuroraTheme entry
- `NavHost.kt` — ModalNavigationDrawer, ChatScreen as root
- `codex/CodexClient.kt` — OkHttp WebSocket, initialize handshake, all RPC methods
- `codex/CodexProtocol.kt` — RpcMessage, RpcError
- `data/AppSettings.kt` — DataStore for serverUrl, authToken, model
- `ui/chat/ChatViewModel.kt` — full event handler, model/reasoning state, reactions, edit, skills
- `ui/chat/ChatScreen.kt` — LazyColumn conversation, inline tool calls, mention system, attach
- `ui/chat/ToolCallTimeline.kt` — compact collapsible timeline with dark terminal
- `ui/chat/SkillInvocationList.kt` — skill invocation display
- `ui/chat/ModelReasoningBar.kt` — model/reasoning selectors
- `ui/chat/MessageActions.kt` — long-press reactions sheet
- `ui/chat/MentionSuggestions.kt` — @skills (violet) + /commands (pink) grouped popup
- `ui/chat/SteerInputSheet.kt` — turn/steer mini input
- `ui/sidebar/SessionsSidebar.kt` — project/session drawer
- `ui/sidebar/SidebarViewModel.kt` — thread/list loading
- `ui/settings/SettingsScreen.kt` — server URL, token, model
- `ui/threads/ThreadListScreen.kt` — replaced by sidebar
- `android/gradle/libs.versions.toml` — Coil3, webkit, coroutines, navigation, lifecycle, datastore, activity-compose, material-icons-extended
- `android/aurora/build.gradle.kts` — new dependencies
- `android/gradle.properties` — `android.useAndroidX=true`
- `android/settings.gradle.kts` — include(":app")
- `android/app/src/main/AndroidManifest.xml` — INTERNET permission, network security config
- `android/app/src/main/res/xml/network_security_config.xml` — cleartext for 10.0.2.2/127.0.0.1

### Documentation
- `docs/component-kotlin-map.md` — web→Kotlin mapping for all 128 components
- `docs/superpowers/plans/2026-05-21-aurora-kotlin-phase1-m3-wrappers.md` — Phase 1 plan
- `docs/superpowers/plans/2026-05-22-aurora-kotlin-phase2-custom-composables.md` — Phase 2 plan
- `docs/superpowers/plans/2026-05-22-aurora-kotlin-phase3-ai-blocks.md` — Phase 3 plan

## Commands Executed

```bash
# Build APK
./gradlew :app:assembleDebug --no-daemon

# Install on emulator
adb -s emulator-5554 install -r app-debug.apk

# Launch app
adb -s emulator-5554 shell am start -n tv.tootie.aurora.app/.MainActivity

# Start Codex app-server
codex app-server --listen ws://127.0.0.1:4500 > /tmp/codex-appserver.log 2>&1 &

# ADB port forward (emulator → host)
adb -s emulator-5554 forward tcp:4501 tcp:4500

# Scrape official docs
axon scrape https://developers.openai.com/codex/app-server

# Upload APK to GDrive
rclone copyto .../app-debug.apk gdrive:aurora-codex/aurora-codex-debug.apk

# Sync beads
bd dolt push
```

## Errors Encountered

- **`explicitApi()` violations** — All pre-Phase 1 Kotlin components missing `public` modifiers. Fixed by agent across 13 files.
- **`accentCyanBase` token** — `AuroraSpinner.kt:29` referenced non-existent field. Fixed to `MaterialTheme.colorScheme.primary`.
- **`android.useAndroidX=true` missing** — Build failed with AAR metadata error. Fixed by creating `gradle.properties`.
- **AGP plugin version conflict** — Root `build.gradle.kts` needed `apply false` for both `android-application` and `kotlinx-serialization` plugins.
- **Wrong event names** — App connected but showed "Thinking..." forever. Root cause: `agentMessageDelta` (wrong) vs `item/agentMessage/delta` (correct). Fixed in `ChatViewModel.handle()`.
- **`codex-mini-latest` model unsupported** — ChatGPT auth users must use `gpt-5.5` or `gpt-5.4`. Switched default model.
- **CLEARTEXT WebSocket blocked** — Android 9+ blocks `ws://` by default. Fixed with `network_security_config.xml`.
- **ADB port 4500 already in use** — Used `forward tcp:4501 tcp:4500` instead, updated default URL to `ws://10.0.2.2:4500`.

## Behavior Changes (Before/After)

| Area | Before | After |
|---|---|---|
| Select keyboard nav | Focus styles never applied (`:focus` doesn't fire in Radix) | `data-[highlighted]:` correctly styles keyboard navigation |
| SelectViewport height | Dropdown collapsed to 36px (trigger height) | Full dropdown height respecting available space |
| Button | No loading, no violet, no press animation | `loading` prop, `violet` variant, `active:scale-[0.97]` |
| Android app | Didn't exist | Full Codex client with chat, sidebar, model selector, reactions, @mentions |
| Tool calls | Overlay on top of messages (overlap bug) | Inline in LazyColumn below messages |
| Skill rendering | Hook events only (misses skills without hooks) | Hooks + text parse + explicit {type:skill} invocation |
| MCP tools | `mcpToolCall` items silently dropped | Ready for handler implementation |
| Approval prompts | AuroraPermissionPrompt wired to nothing | Plan specifies approval routing from `requestApproval` events |
| Color palette | Too much violet everywhere | Pink=CTAs, blue=info/bubbles, violet=AI tools only |

## Risks and Rollback

- **No Gradle wrapper committed** — Copied from `axon-android` project. Future CI needs to ensure gradlew is present.
- **Debug APK only** — No signing config for release builds. APK on GDrive is `app-debug.apk`.
- **Codex app-server on loopback** — `ws://127.0.0.1:4500` only accessible via ADB forward on emulator or on the same machine. Not suitable for remote/Tailscale use without `--ws-auth`.
- **Rollback**: All changes are on `main`. Prior HEAD was pre-Android-app. `git revert` or `git reset --hard <sha>` recoverable.

## Decisions Not Taken

- **Hilt/DI framework** — Rejected in favor of manual injection via `(application as CodexApp).connectionManager`. Avoids KSP build complexity at this codebase scale.
- **Room for offline queue** — Deferred. In-memory Channel sufficient for brief reconnects; Room only needed for process-death scenarios.
- **Text-only skill rendering** — Rejected. Two-source (hooks + text parse) + explicit invocation all kept per user decision.
- **Defer webSearch/fileChange/imageView** — Rejected. User chose to implement all 6 item types now.
- **Drop outbound message queue** — Simplicity reviewer suggested removing it. User kept it with typed replay policy.

## References

- Codex app-server official docs: `https://developers.openai.com/codex/app-server`
- Codex source: `/home/jmagar/workspace/codex/codex-rs/app-server/`
- ACP adapter (protocol reference): `/home/jmagar/workspace/acp-adapter/internal/codex/`
- OkHttp WebSocket reconnect: Bugfender (2025), Dani Mahardhika (April 2025)
- DataStore official docs: `https://developer.android.com/topic/libraries/architecture/datastore` (updated 2026-05-11)
- Florent Blot — WebSockets States with Kotlin StateFlow (MutableStateFlow vs callbackFlow gotcha)
- Aurora design tokens: `registry/aurora/styles/aurora.css`
- Beads epic: `aurora-design-system-ul5` (6 child beads, all locked)

## Open Questions

- Is the Codex app-server authentication model per-thread (auth gates thread access) or per-connection only? Affects threadId sensitivity in DataStore.
- Does the user's server emit `webSearch`, `fileChange`, `imageView`, `dynamicToolCall` in real sessions? (Simplicity reviewer noted no evidence; user chose to implement all anyway.)
- Should `android:allowBackup="false"` be added now (security finding), or deferred? (Marked as pre-trx-merge requirement in beads.)
- What port will the Codex app-server run on in production use (vs emulator testing on 10.0.2.2:4500)?

## Next Steps

### Unfinished (started but not completed)
- `aurora-design-system-1fu` is the only unblocked bead in the resilience epic — CodexConnectionManager singleton with request-ID correlation map, delta partition, reconnection. Implementation was designed but not started.

### Follow-on (not yet started)
- Implement epic `aurora-design-system-ul5` child beads in order: `1fu` (blocks everything) → `trx` + `1ht` + `di2` + `ahp` (after 1fu) + `p4l` (independent).
- Key security items before merging `ahp`: strip ANSI/Bidi from approval.command; populate server-request-ID map synchronously in `onMessage()`.
- Add `android:allowBackup="false"` to manifest before merging `trx`.
- Add `PasswordVisualTransformation` to auth token field in SettingsScreen before merging `trx`.
- Font files (Manrope, Inter, JetBrains Mono) not yet bundled in `:aurora` — typography uses system defaults. Needs `.ttf` files in `res/font/`.
- Light theme not implemented — `AuroraTheme` currently uses dark scheme for both `darkTheme=true` and `false`.
- No test infrastructure in `:aurora` module — no JUnit, Compose test, or Robolectric.
- No gallery/demo app module — only `@Preview` annotations for component testing.
