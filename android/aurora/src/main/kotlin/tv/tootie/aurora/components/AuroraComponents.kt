/**
 * Aurora Kotlin Component Library — All 3 Phases Complete (107 files)
 *
 * All components live in package [tv.tootie.aurora.components].
 *
 * ── Existing (pre-Phase 1) ──────────────────────────────────────────────────
 *
 * AuroraBadge          — BadgedBox wrapper with 99+ count cap
 * AuroraButton         — Filled / Outlined / Ghost / Destructive variants
 * AuroraIconButton     — Icon-only action button with compact/default/large visuals
 * AuroraCard           — Filled / Elevated / Outlined card variants
 * AuroraCheckbox       — Labeled checkbox
 * AuroraDialog         — Titled modal dialog with confirm / dismiss
 * AuroraSelect         — Non-searchable ExposedDropdownMenuBox
 * AuroraSeparator      — Horizontal / Vertical divider
 * AuroraSpinner        — CircularProgressIndicator with Aurora primary color
 * AuroraSwitch         — Animated toggle switch
 * AuroraSwitchRow      — Labeled settings row with trailing switch
 * AuroraTabs           — Line tabs + ScrollableTabs
 * AuroraTextField      — OutlinedTextField with label / error / icons / compact / sensitive reveal
 * AuroraToast          — SnackbarHost with status variants (Success/Error/Warn/Info)
 *
 * ── Phase 1: M3 Wrapper Components ─────────────────────────────────────────
 *
 * AuroraAlertDialog       — Confirm/dismiss dialog with destructive variant
 * AuroraAvatar            — Circular avatar (Coil image or initials fallback)
 * AuroraButtonGroup       — SingleChoiceSegmentedButtonRow wrapper
 * AuroraMultiButtonGroup  — MultiChoiceSegmentedButtonRow wrapper
 * AuroraCalendar          — Inline DatePicker
 * AuroraDatePickerDialog  — Modal DatePickerDialog
 * AuroraCollapsible       — AnimatedVisibility expand/collapse with chevron
 * AuroraCombobox          — Searchable ExposedDropdownMenuBox
 * AuroraContextMenu       — Long-press DropdownMenu
 * AuroraDropdownMenu      — Sectioned DropdownMenu with danger items
 * AuroraHoverCard         — Click-triggered Popup surface
 * AuroraInputGroup        — OutlinedTextField with all adornment slots
 * AuroraItem              — M3 ListItem wrapper
 * AuroraNavigationBar     — Bottom NavigationBar
 * AuroraNavigationRail    — Side NavigationRail with optional header
 * AuroraNavigationRailRow — Generic rail row with optional custom slots
 * AuroraPermissionPrompt  — Permission / confirmation AlertDialog
 * AuroraPopover           — Foundation Popup + Surface
 * AuroraProgress          — LinearProgressIndicator with status variants and size presets
 * AuroraRadioGroup        — Labeled RadioButton column
 * AuroraRangeSlider       — Dual-thumb RangeSlider
 * AuroraRichTooltip       — Rich TooltipBox with title + optional action
 * shareText()             — Android native share sheet (Intent.ACTION_SEND)
 * AuroraSheet             — ModalBottomSheet
 * AuroraSidebar           — ModalNavigationDrawer
 * AuroraSidebarRow        — Generic sidebar row with optional supporting text and badge
 * AuroraSlider            — Single-thumb Slider
 * AuroraSuggestionChip    — SuggestionChip (AI suggestions)
 * AuroraToggle            — Icon(Filled)ToggleButton
 * AuroraTooltip           — Plain TooltipBox
 * AuroraWebView           — AndroidView { WebView } with JS-disabled default
 *
 * ── Phase 2: Custom Composables ─────────────────────────────────────────────
 *
 * Display:
 * AuroraBanner         — Full-width status strip with icon + dismiss slots
 * AuroraBreadcrumb     — Horizontal breadcrumb trail with separator
 * AuroraCallout        — Tinted status block with icon + title + message
 * AuroraDescriptionList — Labeled key-value list with optional dividers
 * AuroraEmptyState     — Icon + title + description + action placeholder
 * AuroraKbd            — Keyboard shortcut chip (monospace)
 * AuroraStatCard       — Metric display: label + value + trend
 * AuroraStatusIndicator — Status dot with optional opt-in pulse animation
 * AuroraTimeline       — Vertical timeline with connecting line + status dots
 *
 * Form / Input:
 * AuroraField          — Form field wrapper: label + control + description + error
 * AuroraFilterBar      — FlowRow chip filter bar with clear-all
 * AuroraInputOtp       — One-time passcode digit-box row
 * AuroraListbox        — Scrollable selection list
 * AuroraNumberInput    — Numeric spinner: decrement / field / increment
 *
 * Data:
 * AuroraTable          — LazyColumn table with sticky header (positional rows, read-only)
 * AuroraDataTable      — Sortable data table with column headers (keyed-map rows, interactive sort)
 *
 * Layout / Navigation:
 * AuroraCarousel       — HorizontalPager swipe carousel with dot indicators
 * AuroraPagination     — Page number row with prev/next controls
 * AuroraResizablePanels — Drag-to-resize horizontal split panels
 * AuroraToolbar        — Inline horizontal toolbar with separator support
 * AuroraToolbarSeparator — Thin vertical divider for AuroraToolbar
 * AuroraMenubar        — Desktop-style horizontal menu bar
 *
 * Workspace / Files:
 * AuroraAttachment     — File attachment chip with size + remove slot
 * AuroraCodeBlock      — Read-only code block with copy button
 * AuroraCodeEditor     — Editable monospace code editor (BasicTextField)
 * AuroraFilePicker     — Single-file system picker button
 * AuroraMultiFilePicker — Multi-file system picker button
 * AuroraFileTree       — Recursive expand/collapse file tree
 * AuroraCommandPalette — Searchable command palette (ModalBottomSheet)
 * AuroraMarketplace    — LazyVerticalGrid of installable item cards
 * AuroraTerminal       — Dark log viewer with auto-scroll, titlebar (title/status/actions), role="log" semantics
 *
 * Screens:
 * AuroraErrorPage      — Full-screen error state with retry action
 * AuroraLoginScreen    — Email + password login form with show/hide toggle + validation-gated submit
 *
 * ── Phase 3 Batch D: AI Workflow Blocks ────────────────────────────────────
 *
 * AuroraTaskItem       — Single task row: checkbox + status pill (Pending/InProgress/Done/Blocked)
 * AuroraPlanList       — Bordered plan container wrapping a list of AuroraTaskItems
 * AuroraQueueList      — Vertical queue of items with running/queued status indicators
 * AuroraCheckpoint     — Step/milestone row with completion status icon (Pending/Done/Failed)
 * AuroraCommitRow      — Git commit row: hash snippet + message + optional author + timestamp
 * AuroraTestResults    — Test suite results list with pass/fail counts and per-test icons
 * AuroraStackTrace     — Scrollable monospace error stack trace with optional error message header
 *
 * ── Phase 3 Batch A: AI Identity ──────────────────────────────────────────
 *
 * AuroraAgentRow       — Agent status row with pulsing violet dot (Idle/Running/Waiting/Error/Done)
 * AuroraAiPanel        — Titled panel with violet border + surface for AI-context content
 * AuroraPersona        — Avatar + name + role row (role in violet)
 * AuroraModelSelector  — Violet-accented AI model picker dropdown
 * AuroraVoiceSelector  — TTS voice picker with RecordVoiceOver icon
 * AuroraMicSelector    — Microphone input device selector
 * AuroraPromptInput    — Multi-line prompt field with violet cursor + send button
 *
 * ── Phase 3 Batch B: Conversation ─────────────────────────────────────────
 *
 * AuroraConversation   — LazyColumn message list with auto-scroll + screen-reader semantics
 * AuroraMessage        — Chat bubble: user=cyan right, assistant=violet left
 * AuroraInlineCitation — Superscript citation link in violet surface
 * AuroraSnippet        — Inline monospace code chip
 * AuroraSources        — Horizontal scrollable source/citation pill row
 * AuroraOpenInChat     — Icon button to open artifact in full chat view
 *
 * ── Phase 3 Batch C: Reasoning / Output ───────────────────────────────────
 *
 * AuroraThinking       — Animated pulsing-dots thinking indicator (violet)
 * AuroraChainOfThought — Expandable step-by-step reasoning trace (violet surface)
 * AuroraReasoning      — Thin wrapper over AuroraChainOfThought
 * AuroraArtifact       — Artifact panel with toolbar (copy, expand, language label)
 * AuroraAskUserQuestion — Multiple-choice agent question prompt with radio + submit
 * AuroraControls       — Agent control buttons (stop/pause/retry)
 *
 * ── Phase 3 Batch D: Workflow ──────────────────────────────────────────────
 *
 * AuroraTaskItem       — Single task row: checkbox + status pill (Pending/InProgress/Done/Blocked)
 * AuroraPlanList       — Bordered plan container wrapping AuroraTaskItems
 * AuroraQueueList      — Vertical queue with Syncing/Queued status indicators
 * AuroraCheckpoint     — Step/milestone row with Pending/Done/Failed icon
 * AuroraCommitRow      — Git commit: hash snippet + message + author + timestamp
 * AuroraTestResults    — Test suite results with pass/fail count + per-test icons
 * AuroraStackTrace     — Scrollable monospace error stack trace
 *
 * ── Phase 3 Batch E: AI Elements ──────────────────────────────────────────
 *
 * AuroraAudioPlayer    — Play/pause + scrubber + time display
 * AuroraTranscription  — Live transcription display with confidence bar
 * AuroraSpeechInput    — Mic toggle button with pulse animation when recording
 * AuroraSchemaDisplay  — JSON schema property table (name / type / description)
 * AuroraPackageInfo    — Package name + version + description + license
 * AuroraSandbox        — Sandbox runtime/env-var info with status indicator
 * AuroraContextPanel   — Token usage progress bar with warn/error thresholds
 *
 * ── Phase 3 Batch F: Visual / Utility ─────────────────────────────────────
 *
 * AuroraAiShimmer          — Animated violet shimmer placeholder (AI loading state)
 * AuroraToolCallList       — Expandable tool call trace with status + code block details
 * AuroraAiImage            — AI-generated image with Aurora border + optional caption
 * AuroraCanvasView         — Topology canvas: nodes (circles) + edges (lines) with labels
 * AuroraConnection         — Two-node connection label (from → to) with active/idle tint
 * AuroraEnvironmentVariables — Key-value env var list with optional value masking
 * AuroraAiEdge             — Edge label chip for topology views (violet when active)
 */
package tv.tootie.aurora.components
