/**
 * Aurora Kotlin Component Library — Phase 1 complete, Phase 2 Batch B in progress
 *
 * This file documents the full public API surface of the aurora module.
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
 * AuroraSwitch         — Radix-style animated toggle switch
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
 * ── Phase 2: Custom Composables (Batch B — Form/Input) ─────────────────────
 *
 * AuroraField          — Form field wrapper: label + control + description + error
 * AuroraFilterBar      — FlowRow chip filter bar with clear-all action
 * AuroraFilterChip     — Data class for AuroraFilterBar chip items
 * AuroraInputOtp       — One-time passcode digit-box row
 * AuroraListbox        — Scrollable selection list with optional descriptions
 * AuroraListboxItem    — Data class for AuroraListbox items
 * AuroraNumberInput    — Numeric spinner: decrement / text field / increment
 *
 * ── Pending (Phase 2 — Custom Composables) ──────────────────────────────────
 * banner, breadcrumb, callout, carousel, data-table, description-list,
 * empty-state, kbd, pagination, resizable-panels, stat-card, status-indicator,
 * table, timeline, toolbar, code-block, code-editor, file-tree, attachment,
 * file-picker, terminal, command-palette, marketplace, error-page, login, oauth
 *
 * ── Pending (Phase 3 — AI Agent Blocks) ─────────────────────────────────────
 * agent, artifact, ask-user-question, audio-player, canvas, chain-of-thought,
 * checkpoint, commit, connection, context, controls, conversation, message,
 * inline-citation, mic-selector, model-selector, open-in-chat, package-info,
 * panel, persona, plan, queue, reasoning, sandbox, schema-display, shimmer,
 * snippet, sources, speech-input, stack-trace, task, test-results, thinking,
 * tool-calls, transcription, voice-selector, prompt-input
 */
package tv.tootie.aurora.components
