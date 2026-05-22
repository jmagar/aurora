/**
 * Aurora Kotlin Component Library — Phase 1 + Phase 2 complete
 *
 * All components live in package [tv.tootie.aurora.components].
 *
 * ── Existing (pre-Phase 1) ──────────────────────────────────────────────────
 *
 * AuroraBadge          — BadgedBox wrapper with 99+ count cap
 * AuroraButton         — Filled / Outlined / Ghost / Destructive variants
 * AuroraCard           — Filled / Elevated / Outlined card variants
 * AuroraCheckbox       — Labeled checkbox
 * AuroraDialog         — Titled modal dialog with confirm / dismiss
 * AuroraSelect         — Non-searchable ExposedDropdownMenuBox
 * AuroraSeparator      — Horizontal / Vertical divider
 * AuroraSpinner        — CircularProgressIndicator with Aurora primary color
 * AuroraSwitch         — Animated toggle switch
 * AuroraTabs           — Line tabs + ScrollableTabs
 * AuroraTextField      — OutlinedTextField with label / error / icons
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
 * AuroraPermissionPrompt  — Permission / confirmation AlertDialog
 * AuroraPopover           — Foundation Popup + Surface
 * AuroraProgress          — LinearProgressIndicator with status variants
 * AuroraRadioGroup        — Labeled RadioButton column
 * AuroraRangeSlider       — Dual-thumb RangeSlider
 * AuroraRichTooltip       — Rich TooltipBox with title + optional action
 * shareText()             — Android native share sheet (Intent.ACTION_SEND)
 * AuroraSheet             — ModalBottomSheet
 * AuroraSidebar           — ModalNavigationDrawer
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
 * AuroraStatusIndicator — Status dot with optional pulse animation
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
 * AuroraTerminal       — Dark log viewer with auto-scroll
 *
 * Screens:
 * AuroraErrorPage      — Full-screen error state with retry action
 * AuroraLoginScreen    — Email + password login form
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
 * ── Pending (Phase 3 — AI Agent Blocks) ─────────────────────────────────────
 * agent, artifact, ask-user-question, audio-player, canvas, chain-of-thought,
 * connection, context, controls, conversation, message,
 * inline-citation, mic-selector, model-selector, open-in-chat, package-info,
 * panel, persona, reasoning, sandbox, schema-display, shimmer,
 * snippet, sources, speech-input, thinking,
 * tool-calls, transcription, voice-selector, prompt-input
 */
package tv.tootie.aurora.components
