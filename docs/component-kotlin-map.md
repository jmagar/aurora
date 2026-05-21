# Aurora Component → Kotlin/Compose Map

Cross-reference of every Aurora (shadcn/React) component and its nearest Jetpack Compose / Material 3 equivalent.

**Conventions used:**
- `M3` = `androidx.compose.material3.*`
- `Foundation` = `androidx.compose.foundation.*`
- `CMP` = Compose Multiplatform (Desktop/iOS — not Android-only)
- `Custom` = must be built as a custom Composable (no direct M3 primitive)
- `Third-party` = common library recommendation when M3 has no equivalent

---

## UI Primitives

| Aurora Component | Kotlin / Compose Equivalent | Package / Notes |
|---|---|---|
| `accordion` | `AnimatedVisibility` + custom trigger | Foundation — M3 has no Accordion; wrap in `Surface + Column` |
| `alert-dialog` | `AlertDialog` | `M3.AlertDialog` |
| `aspect-ratio` | `Modifier.aspectRatio(ratio)` | Foundation modifier |
| `avatar` | Custom `Box` + `AsyncImage` (Coil) | No M3 Avatar; `Box(shape = CircleShape)` + `Image` or initials `Text` |
| `badge` | `Badge`, `BadgedBox` | `M3.Badge` / `M3.BadgedBox` |
| `banner` | Custom `Surface` + `Row` | No M3 Banner (removed from M3); custom status strip |
| `breadcrumb` | Custom `Row` + `Text` + separators | No M3 Breadcrumb; `FlowRow` (M3) works for wrapping |
| `button-group` | `SingleChoiceSegmentedButtonRow` / `MultiChoiceSegmentedButtonRow` | `M3.SegmentedButton` |
| `button` | `Button`, `OutlinedButton`, `FilledTonalButton`, `TextButton`, `ElevatedButton` | `M3.*Button` — aurora "ghost" → `TextButton`, "neutral" → `OutlinedButton` |
| `calendar` | `DatePicker`, `DatePickerDialog` | `M3.DatePicker` — full calendar picker |
| `callout` | Custom `Surface` + `Row` (icon + text) | No M3 Callout; use `Card` with tonal color + leading icon |
| `card` | `Card`, `ElevatedCard`, `OutlinedCard`, `FilledCard` | `M3.*Card` — aurora `elevated` prop → `ElevatedCard`, `accent` → `OutlinedCard` with tint |
| `carousel` | `HorizontalPager` + `PagerState` | `Foundation.pager.HorizontalPager` (accompanist or foundation 1.4+) |
| `chart` | Third-party: **Vico** (`com.patrykandpatrick.vico`) | No M3 chart primitives |
| `checkbox` | `Checkbox`, `TriStateCheckbox` | `M3.Checkbox` |
| `collapsible` | `AnimatedVisibility` | Foundation — wrap trigger in `Row`, content in `AnimatedVisibility` |
| `combobox` | `ExposedDropdownMenuBox` + `ExposedDropdownMenu` | `M3.ExposedDropdownMenuBox` |
| `context-menu` | `DropdownMenu` on `Modifier.pointerInput(longPress)` | `M3.DropdownMenu` — no dedicated context menu; use long-press gesture |
| `data-table` | `LazyColumn` with custom header `Row` | Foundation — no M3 Table; use sticky headers via `stickyHeader {}` |
| `date-picker` | `DatePicker`, `DatePickerDialog`, `DateRangePicker` | `M3.DatePicker` |
| `description-list` | Custom `Column` of `Row(label, value)` items | No M3 equivalent; use `ListItem` loosely |
| `dialog` | `Dialog`, `AlertDialog` | `M3.AlertDialog` for confirmations; `M3.Dialog` for custom content |
| `direction` | `CompositionLocalProvider(LocalLayoutDirection provides ...)` | Foundation — `LayoutDirection.Rtl` / `LayoutDirection.Ltr` |
| `dropdown-menu` | `DropdownMenu`, `DropdownMenuItem` | `M3.DropdownMenu` + `M3.DropdownMenuItem` |
| `empty-state` | Custom `Column` (icon + title + description + action) | No M3 equivalent |
| `field` | Custom wrapper around `OutlinedTextField` + `Text` (label/error) | `M3.OutlinedTextField` has built-in `label`, `supportingText`, `isError` |
| `filter-bar` | `FlowRow` + `FilterChip` / `InputChip` | `M3.FilterChip`, `M3.InputChip`, `M3.FlowRow` (M3 1.2+) |
| `hover-card` | `TooltipBox` / `RichTooltip` (CMP Desktop) | `M3.TooltipBox` on Android; CMP `Popup` on Desktop |
| `input-group` | `OutlinedTextField` with `leadingIcon` / `trailingIcon` | `M3.OutlinedTextField` |
| `input-otp` | Custom: series of `BasicTextField` + focus forwarding | No M3 OTP input; build with `BasicTextField` array + `KeyboardOptions(imeAction)` |
| `input` | `TextField`, `OutlinedTextField`, `BasicTextField` | `M3.OutlinedTextField` for aurora's control-surface style; `state` prop → `isError`, `colors` |
| `item` | `ListItem` | `M3.ListItem` — `headlineContent`, `leadingContent`, `trailingContent` |
| `kbd` | Custom `Surface(shape = RoundedCornerShape) + Text(fontFamily = Mono)` | No M3 equivalent |
| `label` | `Text` with `MaterialTheme.typography.labelMedium` | Foundation — or `M3.Text` with body-small / label styles |
| `listbox` | `LazyColumn` + custom `SelectionContainer` | Foundation — `LazyColumn` with selection state |
| `menubar` | `TopAppBar` menu; CMP: `MenuBar` | `M3.TopAppBar` + `DropdownMenu` for desktop-style menubar; CMP `MenuBar` for true menubar |
| `native-select` | `ExposedDropdownMenuBox` | `M3.ExposedDropdownMenuBox` — replaces native `<select>` |
| `navigation-menu` | `NavigationBar`, `NavigationRail`, `NavigationDrawer` | `M3.NavigationBar` (bottom), `M3.NavigationRail` (side), `M3.NavigationDrawer` |
| `number-input` | Custom: `OutlinedTextField(keyboardType = Number)` + `IconButton` ×2 | No M3 spinner input; build with `Row(decrement, TextField, increment)` |
| `pagination` | Custom `Row` of page buttons / `LazyPagingItems` (Paging 3) | `androidx.paging.compose.collectAsLazyPagingItems` for data; UI is custom |
| `popover` | `Popup` + `Surface` | Foundation `Popup` — positioned relative to anchor |
| `progress` | `LinearProgressIndicator`, `CircularProgressIndicator` | `M3.LinearProgressIndicator` (determinate + indeterminate) |
| `radio-group` | `RadioButton` + `Column` | `M3.RadioButton` — pair each with a `Text` in a `Row` |
| `resizable-panels` | Custom drag-based `Box` with `Modifier.draggable` | No M3 equivalent; use `SplitPane` in CMP |
| `scroll-area` | `LazyColumn`, `LazyRow`, `Modifier.verticalScroll` | Foundation — `VerticalScrollbar` available in CMP Desktop |
| `search-results` | `LazyColumn` with custom items | Foundation — re-export of `listbox` pattern |
| `select` | `ExposedDropdownMenuBox` + `ExposedDropdownMenu` | `M3.ExposedDropdownMenuBox` |
| `separator` | `HorizontalDivider`, `VerticalDivider` | `M3.HorizontalDivider` / `M3.VerticalDivider` (M3 1.1+) |
| `sheet` | `ModalBottomSheet`, `BottomSheetScaffold` | `M3.ModalBottomSheet` — aurora "sheet" slides from right → use `ModalDrawer` / `M3.ModalNavigationDrawer` |
| `skeleton` | Custom shimmer `Box` + `InfiniteTransition` | No M3 equivalent; Third-party: **Shimmer** (`com.valentinilk.shimmer`) |
| `slider` | `Slider`, `RangeSlider` | `M3.Slider` — `onValueChange` / `valueRange` / `steps` |
| `spinner` | `CircularProgressIndicator` | `M3.CircularProgressIndicator` — aurora size/tone maps to `modifier.size()` + `color` param |
| `stat-card` | Custom `Card` + `Column(label, value, trend)` | No M3 equivalent; build on `ElevatedCard` |
| `status-indicator` | Custom `Box(shape=CircleShape)` + `Text` | `M3.Badge` works for dot-only; add label with `Row` |
| `switch` | `Switch` | `M3.Switch` — `thumbContent` slot for icon |
| `table` | `LazyColumn` with header `Row` + `stickyHeader` | Foundation — CMP Desktop has `BasicTable` (experimental) |
| `tabs` | `TabRow`, `ScrollableTabRow`, `Tab`, `LeadingIconTab` | `M3.TabRow` / `M3.ScrollableTabRow` — aurora `PillGroup` → `SingleChoiceSegmentedButtonRow` |
| `textarea` | `OutlinedTextField(singleLine = false, minLines = 3)` | `M3.OutlinedTextField` with `minLines` / `maxLines` |
| `timeline` | Custom `LazyColumn` with connecting line overlay | No M3 equivalent; `Canvas` + `LazyColumn` |
| `toast` | `Snackbar`, `SnackbarHost`, `SnackbarHostState` | `M3.Snackbar` — `SnackbarResult.ActionPerformed` for aurora's `action` prop |
| `toggle-group` | `SingleChoiceSegmentedButtonRow`, `MultiChoiceSegmentedButtonRow` | `M3.SegmentedButton` |
| `toggle` | `IconToggleButton`, `FilledIconToggleButton`, `FilledTonalIconToggleButton` | `M3.*IconToggleButton` |
| `toolbar` | `TopAppBar`, `CenterAlignedTopAppBar`, `MediumTopAppBar`, `LargeTopAppBar` | `M3.TopAppBar` — aurora's toolbar is inline (not top); use `Row` + custom styling |
| `tooltip` | `TooltipBox`, `PlainTooltip`, `RichTooltip` | `M3.TooltipBox` (M3 1.1+) |

---

## AI Blocks

These are Aurora-specific composites. All are `Custom` Composables — no direct M3 equivalent. The table shows the **Compose primitive(s) to build on**.

| Aurora Block | Build With | Notes |
|---|---|---|
| `artifact` | `Surface` + `AnimatedContent` + `IconButton` toolbar | Full artifact viewer; `WebView` for HTML artifacts |
| `ask-user-question` | `AlertDialog` or `Card` + `RadioButton` / `Checkbox` + `Button` | Option list with single/multi select |
| `agent` | `Row` + `Icon` + `AnimatedContent` + `StatusIndicator` | Agent header row with live status |
| `audio-player` | `Slider` + `IconButton` (play/pause/seek) + `MediaPlayer` | Use `MediaPlayer` or `ExoPlayer` (`media3`) under the hood |
| `canvas` | `Canvas` (Compose) + `Graph` node layout | Topology/flow canvas; consider **Zoomable** library |
| `chain-of-thought` | `AnimatedVisibility` + `LazyColumn` of step rows | Collapsible reasoning trace |
| `checkpoint` | `Row` + status dot + `Text` + `AnimatedVisibility` | Step/checkpoint with expandable detail |
| `commit` | `Row` + `Icon` + `Text` (hash, message, timestamp) | Git commit row item |
| `confirmation` | `AlertDialog` | Maps directly to M3 AlertDialog with confirm/cancel actions |
| `connection` | `Canvas` + node positions | Graph edge between two agent nodes |
| `context` | `Card` + `Column` + context item rows | Context window visualization |
| `controls` | `Row` + `IconButton` ×n | Toolbar of icon buttons for agent controls |
| `conversation` | `LazyColumn` + message composables | `LazyColumn` with `reverseLayout = false`; set `role = "log"` semantics |
| `message` | `Row` (user) / `Column` (assistant) + `Text` + avatar | Differentiate by sender; assistant = violet surface |
| `inline-citation` | `ClickableText` / custom `AnnotatedString` link | Inline superscript citation link |
| `mic-selector` | `ExposedDropdownMenuBox` + `Icon` (mic) | Audio input device picker |
| `model-selector` | `ExposedDropdownMenuBox` + `Icon` (Sparkles) | AI model picker; violet accent |
| `open-in-chat` | `IconButton` | Single action button to open artifact in chat |
| `package-info` | `Card` + `Row` (name, version, description) | Package/dependency info card |
| `panel` | `Surface` + `Column` with header | Generic titled panel |
| `persona` | `Row` + `Avatar` + `Text` (name, role) | Persona/profile display row |
| `plan` | `LazyColumn` of `Checkbox` + `Text` steps | Step list with completion state |
| `queue` | `LazyColumn` of queued item rows | Task queue visualization |
| `reasoning` | `AnimatedVisibility` + `Text` (pre-formatted) | Collapsible reasoning block |
| `sandbox` | `Card` + `Badge` (runtime/status) | Sandbox environment info card |
| `schema-display` | `LazyColumn` + custom property rows | JSON schema tree viewer |
| `shimmer` | Custom `InfiniteTransition` + gradient `Box` | Loading placeholder shimmer |
| `snippet` | `SelectionContainer` + `Text(fontFamily = Mono)` | Inline code snippet |
| `sources` | `LazyRow` of source pills | Source/citation chip list |
| `speech-input` | `IconButton` + `MicRecorder` state | Microphone input button with recording state |
| `stack-trace` | `SelectionContainer` + `LazyColumn` + `Text(fontFamily = Mono)` | Scrollable error stack trace |
| `suggestion` | `SuggestionChip` / `AssistChip` | `M3.SuggestionChip` |
| `task` | `Row` + `Checkbox` + `Text` + `Badge` | Task item with status badge |
| `test-results` | `LazyColumn` + pass/fail rows with `StatusIndicator` | Test result list |
| `tool` | Re-export of `ToolCalls` | — |
| `thinking` | `AnimatedVisibility` + pulsing `CircularProgressIndicator` | AI thinking state indicator |
| `tool-calls` | `LazyColumn` of tool call rows + `AnimatedVisibility` | Expandable tool call trace |
| `transcription` | `Text` + word-level highlight animation | Live transcription display |
| `voice-selector` | `ExposedDropdownMenuBox` + `Icon` (Sparkles) | TTS voice picker; violet accent |
| `prompt-input` | `OutlinedTextField(singleLine = false)` + send `IconButton` | Main chat input; `BasicTextField` for full styling control |

---

## Auth Blocks

| Aurora Block | Kotlin / Compose Equivalent | Notes |
|---|---|---|
| `login` | Custom full-screen `Scaffold` + `Column` (email, password fields + button) | `OutlinedTextField` + `Button`; password field uses `PasswordVisualTransformation` |
| `oauth` | Custom OAuth flow screen + `CustomTabsIntent` (Chrome Custom Tabs) | Use `androidx.browser.customtabs` or `AppAuth` library |
| `permission-prompt` | `AlertDialog` or `ModalBottomSheet` | Maps to `M3.AlertDialog` with permission description + allow/deny buttons |
| `permissions-dropdown` | `ModalBottomSheet` + `LazyColumn` of `ToggleRow` items | Granular permission toggles; `Switch` per permission row |

---

## Files Blocks

| Aurora Block | Kotlin / Compose Equivalent | Notes |
|---|---|---|
| `attachment` | `Card` grid tile or `ListItem` row | Thumbnail via `AsyncImage` (Coil); video badge overlay = `Box` |
| `code-editor` | Third-party: **CodeView** (`io.github.kbiakov.codeview`) or `BasicTextField` | No M3 code editor; `BasicTextField` + syntax highlighting library |
| `file-picker` | `rememberLauncherForActivityResult(GetContent())` | `ActivityResultContracts.GetContent` / `OpenDocument` / `GetMultipleContents` |
| `file-tree` | `LazyColumn` with recursive indented `TreeItem` composables | Custom recursion; `Modifier.padding(start = depth * 16.dp)` per level |

---

## Navigation / Workspace Blocks

| Aurora Block | Kotlin / Compose Equivalent | Notes |
|---|---|---|
| `terminal` | `SelectionContainer` + `LazyColumn` + `Text(fontFamily = Mono)` | Scroll-to-bottom with `LazyListState.animateScrollToItem(lastIndex)` |
| `code-block` | `SelectionContainer` + `Surface` + `Text(fontFamily = Mono)` | Copy button = `IconButton` + `ClipboardManager` |
| `command-palette` | `ModalBottomSheet` or `Dialog` + `TextField` (search) + `LazyColumn` | Full-screen search palette; `SearchBar` (M3 1.2+) is closest primitive |
| `marketplace` | `LazyVerticalGrid` or `LazyColumn` of `Card` items | `Foundation.LazyVerticalGrid` with `GridCells.Adaptive(minSize)` |
| `share-dialog` | `ShareSheet` via `Intent.ACTION_SEND` | Android native share sheet; `Intent(Intent.ACTION_SEND).apply { type = "text/plain" }` |
| `sidebar` | `ModalNavigationDrawer`, `PermanentNavigationDrawer`, `NavigationRail` | `M3.ModalNavigationDrawer` for mobile; `M3.PermanentNavigationDrawer` for large screens |
| `web-preview` | `AndroidView { WebView(context) }` | Embed Android `WebView` via `AndroidView` composable wrapper |

---

## Feedback Blocks

| Aurora Block | Kotlin / Compose Equivalent | Notes |
|---|---|---|
| `error-page` | Custom full-screen `Column` (icon + title + description + retry button) | No M3 error page; build on `Scaffold` + `Column` |

---

## Theming Notes

Aurora's dark-first navy palette maps to Material 3's dynamic color system:

```kotlin
// Aurora → M3 color role mapping
val AuroraColorScheme = darkColorScheme(
    primary          = Color(0xFF29B6F6),  // --aurora-accent-primary (cyan)
    secondary        = Color(0xFFF9A8C4),  // --aurora-accent-pink (rose)
    tertiary         = Color(0xFFA78BFA),  // --aurora-accent-violet
    background       = Color(0xFF07131C),  // --aurora-page-bg
    surface          = Color(0xFF102330),  // --aurora-panel-medium
    surfaceVariant   = Color(0xFF13293A),  // --aurora-panel-strong
    outline          = Color(0xFF1D3D4E),  // --aurora-border-default
    outlineVariant   = Color(0xFF24536C),  // --aurora-border-strong
    onBackground     = Color(0xFFE6F4FB),  // --aurora-text-primary
    onSurface        = Color(0xFFE6F4FB),
    onSurfaceVariant = Color(0xFFA7BCC9),  // --aurora-text-muted
    error            = Color(0xFFC78490),  // --aurora-error
)
```

### Typography equivalents

| Aurora token | M3 Typography role |
|---|---|
| `--aurora-font-display` (Manrope) | `displayLarge`, `displayMedium`, `displaySmall` |
| `--aurora-font-sans` (Inter) | `bodyLarge`, `bodyMedium`, `bodySmall`, `labelLarge` |
| `--aurora-font-mono` (JetBrains Mono) | Custom `FontFamily` — use `FontFamily(Font(R.font.jetbrains_mono))` |
| `aurora-text-section` | `titleMedium` / `titleLarge` |
| `aurora-text-control` | `labelMedium` |
| `aurora-text-body-sm` | `bodySmall` |
| `aurora-text-caption` | `labelSmall` |

### AI accent (violet) in Compose

Aurora uses violet (`--aurora-accent-violet: #A78BFA`) exclusively for AI identity. Map this to M3's `tertiary` color role:

```kotlin
// AI-accented surfaces use tertiary container
Surface(color = MaterialTheme.colorScheme.tertiaryContainer) { ... }
Icon(tint = MaterialTheme.colorScheme.tertiary) { ... }
```
