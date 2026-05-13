"use client"

import * as React from "react"
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  Bot,
  Box,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Clock3,
  Code2,
  Command,
  Copy,
  Database,
  FileCode,
  FileText,
  Folder,
  Gauge,
  GitCommit,
  Globe2,
  Grid2X2,
  Hash,
  Home,
  Layers3,
  ListChecks,
  Loader2,
  Lock,
  MessageSquare,
  Mic,
  MoreHorizontal,
  MousePointer2,
  Navigation,
  Package,
  Palette,
  PanelLeft,
  Plus,
  Power,
  RefreshCw,
  Search,
  SendHorizontal,
  Settings2,
  ShieldCheck,
  Sparkles,
  Table2,
  Terminal,
  Upload,
  Volume2,
  X,
  Zap,
} from "lucide-react"

type ComplaintMode = "compact" | "color" | "button" | "border" | "code" | "navigation"

type Complaint = {
  text: string
  path: string
  mode?: ComplaintMode
}

type PreviewKind =
  | "activity"
  | "attachment"
  | "breadcrumb"
  | "brand"
  | "button"
  | "card"
  | "carousel"
  | "chart"
  | "code"
  | "color"
  | "command"
  | "data"
  | "direction"
  | "feedback"
  | "file-picker"
  | "file-tree"
  | "form"
  | "input-group"
  | "media"
  | "overlay"
  | "prompt"
  | "runtime"
  | "sidebar-agent"
  | "sidebar-site"
  | "spacing"
  | "toggle"
  | "type"

type ComponentAlternative = {
  title: string
  note: string
}

const ROOT = "/home/jmagar/workspace/aurora-design-system"

const OVERSIZED_SECTIONS = [
  "agent",
  "checkpoint",
  "commit",
  "environment-variables",
  "package-info",
  "sandbox",
  "snippet",
  "jsx-preview",
  "stack-trace",
  "test-results",
  "panel",
  "audio-player",
  "mic-selector",
  "transcription",
  "voice-selector",
  "item",
  "chart",
  "card",
  "inline-citation",
  "sources",
  "ask-user-question",
  "permission-prompt",
  "suggestion",
  "task",
  "queue",
  "plan",
  "chain-of-thought",
  "thinking",
  "open-in-chat",
  "persona",
  "collapsible",
  "accordion",
  "listbox",
  "search-results",
  "description-list",
  "timeline",
  "data-table",
  "command",
  "model-selector",
  "confirmation",
  "sonner",
  "calendar",
  "number-input",
  "textarea",
  "slider",
  "combobox",
  "date-picker",
  "banners",
  "label",
  "field",
  "input",
  "progress",
  "toggle",
]

const COMPLAINTS: Record<string, Complaint[]> = {
  "chain-of-thought": [
    {
      text: "Collapsed chain-of-thought should be icon-only.",
      path: `${ROOT}/registry/aurora/blocks/ai/thinking/thinking.tsx`,
      mode: "compact",
    },
  ],
  thinking: [
    {
      text: "Thinking should be icon-only when collapsed and avoid extra explanatory chrome.",
      path: `${ROOT}/registry/aurora/blocks/ai/thinking/thinking.tsx`,
      mode: "compact",
    },
  ],
  plan: [
    {
      text: "Plan should be icon-only when collapsed.",
      path: `${ROOT}/registry/aurora/blocks/ai/thinking/thinking.tsx`,
      mode: "compact",
    },
    {
      text: "Plan must not look like a full-width table or stretch across the screen.",
      path: `${ROOT}/registry/aurora/blocks/ai/thinking/thinking.tsx`,
      mode: "compact",
    },
  ],
  "tool-calls": [
    {
      text: "Tool call rows need icon-only collapsed controls with real lucide tool icons.",
      path: `${ROOT}/registry/aurora/blocks/ai/tool-calls/tool-calls.tsx`,
      mode: "compact",
    },
  ],
  tool: [
    {
      text: "Single tool invocation should collapse to icons only.",
      path: `${ROOT}/registry/aurora/blocks/ai/tool-calls/tool-calls.tsx`,
      mode: "compact",
    },
  ],
  "command-palette": [
    {
      text: "Route should load at the top instead of preserving a low scroll position.",
      path: `${ROOT}/app/gallery/layout.tsx`,
      mode: "navigation",
    },
  ],
  sidebar: [
    {
      text: "Fix the bottom avatar treatment in the agent session sidebar.",
      path: `${ROOT}/registry/aurora/blocks/workspace/sidebar/sidebar.tsx`,
      mode: "compact",
    },
    {
      text: "Add a separate site navigation sidebar pattern that is not agent-session navigation.",
      path: `${ROOT}/registry/aurora/blocks/workspace/sidebar/sidebar.tsx`,
      mode: "navigation",
    },
  ],
  sources: [
    {
      text: "Sources should condense into file-chip badges with filetype icons instead of a large panel.",
      path: `${ROOT}/registry/aurora/blocks/ai/elements/core.tsx`,
      mode: "compact",
    },
  ],
  attachment: [
    {
      text: "Attachment chips should be badge-height, show size inline, and reveal a smaller dismiss control only on hover/focus.",
      path: `${ROOT}/registry/aurora/blocks/files/attachment/attachment.tsx`,
      mode: "compact",
    },
  ],
  attachments: [
    {
      text: "AI attachment examples should align with the compact badge-height file-chip treatment.",
      path: `${ROOT}/registry/aurora/blocks/files/attachment/attachment.tsx`,
      mode: "compact",
    },
  ],
  "inline-citation": [
    {
      text: "Inline citations need a hover/focus tooltip.",
      path: `${ROOT}/registry/aurora/blocks/ai/elements/core.tsx`,
      mode: "compact",
    },
  ],
  "file-picker": [
    {
      text: "File picker should not anchor itself to the bottom-right of the page.",
      path: `${ROOT}/registry/aurora/blocks/files/file-picker/file-picker.tsx`,
      mode: "compact",
    },
  ],
  "file-tree": [
    {
      text: "Open tabs need a more polished compact chip treatment.",
      path: `${ROOT}/registry/aurora/blocks/files/file-tree/file-tree.tsx`,
      mode: "compact",
    },
    {
      text: "Selection detail card needs stronger hierarchy and less dead space.",
      path: `${ROOT}/registry/aurora/blocks/files/file-tree/file-tree.tsx`,
      mode: "compact",
    },
  ],
  "code-editor": [
    {
      text: "Code editor needs stronger colored syntax highlighting.",
      path: `${ROOT}/registry/aurora/blocks/files/code-editor/code-editor.tsx`,
      mode: "code",
    },
  ],
  "code-block": [
    {
      text: "Code block needs stronger colored syntax highlighting.",
      path: `${ROOT}/registry/aurora/blocks/workspace/code-block/code-block.tsx`,
      mode: "code",
    },
  ],
  snippet: [
    {
      text: "Snippet needs colored syntax highlighting and a more compact code surface.",
      path: `${ROOT}/registry/aurora/blocks/ai/elements/core.tsx`,
      mode: "code",
    },
  ],
  artifact: [
    {
      text: "Artifact code surfaces need colored syntax highlighting.",
      path: `${ROOT}/registry/aurora/blocks/ai/artifact/artifact.tsx`,
      mode: "code",
    },
  ],
  "resizable-panels": [
    {
      text: "Resizable and resizable-panels are duplicates; keep one stronger pattern.",
      path: `${ROOT}/app/gallery/[section]/page.tsx`,
      mode: "compact",
    },
  ],
  popover: [
    {
      text: "Popover is too basic and needs a more memorable interaction direction.",
      path: `${ROOT}/registry/aurora/ui/popover.tsx`,
      mode: "compact",
    },
  ],
  "hover-card": [
    {
      text: "Hover card is too basic and needs a more useful preview direction.",
      path: `${ROOT}/registry/aurora/ui/hover-card.tsx`,
      mode: "compact",
    },
  ],
  sheet: [
    {
      text: "Sheet is too basic and needs a richer inspector/task-flow direction.",
      path: `${ROOT}/registry/aurora/ui/sheet.tsx`,
      mode: "compact",
    },
  ],
  drawer: [
    {
      text: "Drawer is too basic and needs a more intentional mobile/task-flow direction.",
      path: `${ROOT}/app/gallery/demos/drawer-demo.tsx`,
      mode: "compact",
    },
  ],
  "data-table": [
    {
      text: "Data table route should look like a real data table, not an alert-like card.",
      path: `${ROOT}/registry/aurora/ui/data-table.tsx`,
      mode: "compact",
    },
  ],
  tables: [
    {
      text: "Rows should align status first, text second, badges in a right column, and actions with better spacing.",
      path: `${ROOT}/app/gallery/demos/tables-demo.tsx`,
      mode: "compact",
    },
  ],
  table: [
    {
      text: "The weaker table route should redirect to the stronger tables route.",
      path: `${ROOT}/app/gallery/[section]/page.tsx`,
      mode: "navigation",
    },
  ],
  command: [
    {
      text: "Command looks like an alert clone; differentiate it or delete it.",
      path: `${ROOT}/app/gallery/demos/command-demo.tsx`,
      mode: "navigation",
    },
  ],
  breadcrumb: [
    {
      text: "Breadcrumbs are too low-contrast and hard to identify.",
      path: `${ROOT}/registry/aurora/ui/breadcrumb.tsx`,
      mode: "navigation",
    },
  ],
  sonner: [
    {
      text: "Sonner looks like an alert clone; differentiate it or delete it.",
      path: `${ROOT}/app/gallery/demos/sonner-demo.tsx`,
      mode: "compact",
    },
  ],
  callout: [
    {
      text: "Callout looks like another alert clone; differentiate it or delete it.",
      path: `${ROOT}/registry/aurora/ui/callout.tsx`,
      mode: "compact",
    },
  ],
  "input-group": [
    {
      text: "Input groups need a complete restart with cleaner spacing, hierarchy, and attached affordances.",
      path: `${ROOT}/registry/aurora/ui/input-group.tsx`,
      mode: "compact",
    },
  ],
  toggle: [
    {
      text: "Toggle should visibly do something and present a clear pressed state.",
      path: `${ROOT}/registry/aurora/ui/toggle.tsx`,
      mode: "button",
    },
  ],
  buttons: [
    {
      text: "Buttons need more attractive shapes, states, and modern polish.",
      path: `${ROOT}/registry/aurora/ui/button.tsx`,
      mode: "button",
    },
    {
      text: "Button text is too thick.",
      path: `${ROOT}/registry/aurora/ui/button.tsx`,
      mode: "button",
    },
    {
      text: "Buttons need clear default, hover, focus, pressed, disabled, and loading states.",
      path: `${ROOT}/registry/aurora/ui/button.tsx`,
      mode: "button",
    },
  ],
  direction: [
    {
      text: "Direction demo needs a richer RTL/LTR example.",
      path: `${ROOT}/registry/aurora/ui/direction.tsx`,
      mode: "navigation",
    },
  ],
  brand: [
    {
      text: "Brand page should show every icon, mark, lockup, and logo asset.",
      path: `${ROOT}/app/gallery/demos/brand-demo.tsx`,
      mode: "compact",
    },
  ],
  colors: [
    {
      text: "Colors should move toward electric blue, light blue, pink, violet, and white instead of dull teal/grey.",
      path: `${ROOT}/app/gallery/demos/colors-demo.tsx`,
      mode: "color",
    },
    {
      text: "Expose all 13 core color choices with editable controls.",
      path: `${ROOT}/app/gallery/demos/colors-demo.tsx`,
      mode: "color",
    },
    {
      text: "Choose the three accent colors first, then suggest compatible semantic and interaction tokens.",
      path: `${ROOT}/app/gallery/demos/colors-demo.tsx`,
      mode: "color",
    },
  ],
  "prompt-input": [
    {
      text: "Prompt input is high-use and needs a much stronger, cleaner composer design.",
      path: `${ROOT}/registry/aurora/blocks/ai/prompt-input/prompt-input.tsx`,
      mode: "compact",
    },
  ],
  conversation: [
    {
      text: "Conversation layout is visually weak and should align with the strongest sidebar/chat surfaces.",
      path: `${ROOT}/registry/aurora/blocks/ai/elements/core.tsx`,
      mode: "compact",
    },
  ],
  spacing: [
    {
      text: "Show several alternate border and radius options.",
      path: `${ROOT}/app/gallery/demos/spacing-demo.tsx`,
      mode: "border",
    },
  ],
  type: [
    {
      text: "Typography examples need stronger scale and bigger, clearer specimens.",
      path: `${ROOT}/app/gallery/demos/type-demo.tsx`,
      mode: "compact",
    },
  ],
  card: [
    {
      text: "Card is too generic and needs a stronger reusable pattern.",
      path: `${ROOT}/registry/aurora/ui/card.tsx`,
      mode: "compact",
    },
  ],
  carousel: [
    {
      text: "Carousel does not feel like a carousel.",
      path: `${ROOT}/registry/aurora/ui/carousel.tsx`,
      mode: "compact",
    },
  ],
  chart: [
    {
      text: "Chart needs polish and a real dashboard-grade visual direction.",
      path: `${ROOT}/registry/aurora/ui/chart.tsx`,
      mode: "compact",
    },
  ],
}

const AI_DEMO_SECTIONS = new Set([
  "agent",
  "attachments",
  "audio-player",
  "canvas",
  "chain-of-thought",
  "checkpoint",
  "commit",
  "confirmation",
  "connection",
  "context",
  "controls",
  "conversation",
  "edge",
  "environment-variables",
  "image",
  "inline-citation",
  "jsx-preview",
  "message",
  "mic-selector",
  "model-selector",
  "node",
  "open-in-chat",
  "package-info",
  "panel",
  "persona",
  "plan",
  "sandbox",
  "schema-display",
  "shimmer",
  "snippet",
  "sources",
  "speech-input",
  "stack-trace",
  "suggestion",
  "task",
  "test-results",
  "tool",
  "transcription",
  "voice-selector",
])

function demoPath(section: string) {
  if (section === "tool-calls" || section === "thinking") return `${ROOT}/app/gallery/demos/${section}-demo.tsx`
  if (AI_DEMO_SECTIONS.has(section)) return `${ROOT}/app/gallery/demos/ai-${section}-demo.tsx`
  return `${ROOT}/app/gallery/demos/${section}-demo.tsx`
}

for (const section of OVERSIZED_SECTIONS) {
  COMPLAINTS[section] = [
    ...(COMPLAINTS[section] ?? []),
    {
      text: "Default presentation should not expand to fill the whole screen; offer compact, bounded alternatives.",
      path: demoPath(section),
      mode: "compact",
    },
  ]
}

const ACTIVITY_SECTIONS = new Set(["thinking", "chain-of-thought", "plan", "tool", "tool-calls"])
const ATTACHMENT_SECTIONS = new Set(["attachment", "attachments", "sources", "inline-citation"])
const CODE_SECTIONS = new Set(["code-editor", "code-block", "snippet", "artifact", "jsx-preview", "stack-trace"])
const DATA_SECTIONS = new Set(["data-table", "tables", "table", "listbox", "search-results", "description-list", "timeline", "item"])
const FORM_SECTIONS = new Set(["input", "field", "label", "textarea", "number-input", "slider", "combobox", "date-picker", "calendar", "progress"])
const FEEDBACK_SECTIONS = new Set(["ask-user-question", "permission-prompt", "suggestion", "task", "queue", "confirmation", "sonner", "callout", "banners"])
const MEDIA_SECTIONS = new Set(["audio-player", "mic-selector", "transcription", "voice-selector"])
const OVERLAY_SECTIONS = new Set(["popover", "hover-card", "sheet", "drawer", "collapsible", "accordion", "resizable-panels"])
const RUNTIME_SECTIONS = new Set([
  "agent",
  "checkpoint",
  "commit",
  "environment-variables",
  "package-info",
  "sandbox",
  "test-results",
  "panel",
  "open-in-chat",
  "persona",
  "model-selector",
])

function formatSectionTitle(section: string) {
  const overrides: Record<string, string> = {
    "chain-of-thought": "Chain of Thought",
    "code-block": "Code Block",
    "code-editor": "Code Editor",
    "command-palette": "Command Palette",
    "data-table": "Data Table",
    "date-picker": "Date Picker",
    "file-picker": "File Picker",
    "file-tree": "File Tree",
    "hover-card": "Hover Card",
    "inline-citation": "Inline Citation",
    "input-group": "Input Group",
    "jsx-preview": "JSX Preview",
    "mic-selector": "Mic Selector",
    "model-selector": "Model Selector",
    "open-in-chat": "Open in Chat",
    "package-info": "Package Info",
    "permission-prompt": "Permission Prompt",
    "prompt-input": "Prompt Input",
    "resizable-panels": "Resizable Panels",
    "search-results": "Search Results",
    "stack-trace": "Stack Trace",
    "test-results": "Test Results",
    "tool-calls": "Tool Calls",
    "voice-selector": "Voice Selector",
  }

  return overrides[section] ?? section.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

function kindFor(section: string, complaint: Complaint): PreviewKind {
  if (section === "sidebar" && /site navigation/i.test(complaint.text)) return "sidebar-site"
  if (section === "sidebar") return "sidebar-agent"
  if (ACTIVITY_SECTIONS.has(section)) return "activity"
  if (ATTACHMENT_SECTIONS.has(section)) return "attachment"
  if (CODE_SECTIONS.has(section) || complaint.mode === "code") return "code"
  if (section === "file-picker") return "file-picker"
  if (section === "file-tree") return "file-tree"
  if (section === "buttons") return "button"
  if (section === "toggle") return "toggle"
  if (section === "input-group") return "input-group"
  if (section === "prompt-input") return "prompt"
  if (section === "conversation") return "prompt"
  if (section === "breadcrumb") return "breadcrumb"
  if (section === "command" || section === "command-palette") return "command"
  if (section === "colors") return "color"
  if (section === "spacing") return "spacing"
  if (section === "type") return "type"
  if (section === "brand") return "brand"
  if (section === "direction") return "direction"
  if (section === "card") return "card"
  if (section === "carousel") return "carousel"
  if (section === "chart") return "chart"
  if (DATA_SECTIONS.has(section)) return "data"
  if (FORM_SECTIONS.has(section)) return "form"
  if (FEEDBACK_SECTIONS.has(section)) return "feedback"
  if (MEDIA_SECTIONS.has(section)) return "media"
  if (OVERLAY_SECTIONS.has(section)) return "overlay"
  if (RUNTIME_SECTIONS.has(section)) return "runtime"
  if (complaint.mode === "navigation") return "breadcrumb"
  return "runtime"
}

function alternativesFor(kind: PreviewKind, section: string): ComponentAlternative[] {
  const component = formatSectionTitle(section)
  const commonCompact = [
    { title: "Chipline", note: `${component} compressed to badges, icons, and short metadata.` },
    { title: "Dense Row", note: `${component} as a bounded operator row with status first.` },
    { title: "Inspector", note: `${component} exposes details inside a small structured panel.` },
    { title: "Rail Stack", note: `${component} becomes a narrow vertical stack for repeated states.` },
    { title: "Command Capsule", note: `${component} uses a compact capsule with action affordances.` },
  ]

  const copy: Partial<Record<PreviewKind, ComponentAlternative[]>> = {
    activity: [
      { title: "Icon-only Dock", note: "Collapsed state is only the semantic icon, with state available through hover/focus." },
      { title: "Grouped Activity Rows", note: "Repeated calls collapse into tight rows with lucide tool icons and right-aligned time." },
      { title: "Progress Capsule", note: "One readable capsule carries the percent/progress without a large panel." },
      { title: "Timeline Pips", note: "Reasoning/plan/tool work reads as compact step markers instead of prose." },
      { title: "Action Cluster", note: "Tiny icon buttons represent expand/copy/retry with no avatar initials." },
    ],
    attachment: [
      { title: "File Pills", note: "Badge-height file chips with filetype icon, name, inline count/size, and hover dismiss." },
      { title: "Source Strip", note: "Sources become a single wrapping strip of file pills, never a full-width card." },
      { title: "Inline Citation", note: "Citation sits in text as a superscript chip with a hover/focus preview." },
      { title: "Tab Chips", note: "Open files share the same compact tab grammar as attachments." },
      { title: "Icon Ledger", note: "Filetype icons and short labels replace large rows and external-link chrome." },
    ],
    breadcrumb: [
      { title: "High-contrast Trail", note: "Breadcrumb segments get clear foreground, separators, and a selected endpoint." },
      { title: "Path Capsule", note: "A compact shell-style path with filetype and status badges." },
      { title: "Workspace Rail", note: "Site navigation reads as hierarchy with icons and counts." },
      { title: "Command Locator", note: "Command routes become searchable command rows instead of alert panels." },
      { title: "Route Reset", note: "The page starts at the component title and avoids scroll carryover." },
    ],
    button: [
      { title: "Material Edge", note: "Cleaner blue action, lighter label weight, explicit hover/focus/pressed states." },
      { title: "Quiet Outline", note: "Thin keyline button with readable text and no heavy glow." },
      { title: "Icon Command", note: "Icon-led actions for tooling, with label only where it adds clarity." },
      { title: "Segment Set", note: "Grouped buttons align state and size without chunky text." },
      { title: "Async Button", note: "Loading/disabled states keep width stable and avoid label jump." },
    ],
    color: [
      { title: "Electric Material", note: "Blue/pink/violet accents drive the system while status colors stay semantic." },
      { title: "Studio Neon", note: "Higher saturation choices with restrained dark panels and white-forward text." },
      { title: "Glass Console", note: "Cool transparent surfaces with icy highlights and violet AI emphasis." },
      { title: "Signal Palette", note: "Semantic tokens stay distinct from brand tokens and retain contrast." },
      { title: "Token Mixer", note: "All 13 tokens remain editable after the three accents seed suggestions." },
    ],
    code: [
      { title: "Token Spectrum", note: "Functions, strings, numbers, comments, and types use distinct syntax colors." },
      { title: "Diff Console", note: "Colored syntax pairs with subtle add/remove rows and gutter marks." },
      { title: "Compact Snippet", note: "Short snippets shrink into copyable code pills and small panels." },
      { title: "Diagnostics Pane", note: "Errors and warnings sit beside the code without a giant frame." },
      { title: "Editor Chrome", note: "Filename, language, and copy controls are tighter and brighter." },
    ],
    data: [
      { title: "Aligned Rows", note: "Status leads, primary text aligns, badges move right, and actions breathe." },
      { title: "Metric Table", note: "Numeric columns and tags read like a real operational table." },
      { title: "Compact Cards", note: "Small-screen version keeps the same information without full-width sprawl." },
      { title: "Selectable Grid", note: "Rows have real active/hover selection, not alert-card styling." },
      { title: "Action Matrix", note: "Actions use icon buttons and consistent column rhythm." },
    ],
    "input-group": [
      { title: "Segmented Field", note: "Affixes become distinct attached controls, not cramped text boxes." },
      { title: "Labeled Stack", note: "Labels, inputs, hints, and status badges get clear hierarchy." },
      { title: "Token Builder", note: "URL/API-key style fields use readable chunks with correct alignment." },
      { title: "Inline Validation", note: "Errors and live badges sit outside the text entry path." },
      { title: "Compact Settings", note: "Dense form rows stay ergonomic without giant nested panels." },
    ],
    prompt: [
      { title: "Workbench Composer", note: "High-use prompt input gets a cleaner text area, tool rail, and send state." },
      { title: "Chat Stack", note: "Conversation messages align with the sidebar quality and tool activity stays compact." },
      { title: "Command Composer", note: "Slash, mention, model, attach, and send controls sit in one stable bar." },
      { title: "Split Context", note: "Prompt plus context/tool chips avoid the giant conversation slab." },
      { title: "Streaming State", note: "Send/loading state is visible without overpowering the composer." },
    ],
    "sidebar-agent": [
      { title: "Avatar Coin", note: "Bottom avatar becomes a clean identity coin with no broken text mark." },
      { title: "Session Ledger", note: "Agent sessions stay compact with strong active row and quiet timestamps." },
      { title: "Footer Rail", note: "Profile/settings live in a crisp footer row without crowding the tree." },
      { title: "Icon Collapse", note: "Collapsed sidebar keeps meaningful icons and active state." },
      { title: "Workspace Switcher", note: "Project groups and sessions share a consistent hierarchy." },
    ],
    "sidebar-site": [
      { title: "Site Navigation", note: "Separate component for docs/gallery/site nav, not agent session history." },
      { title: "Section Rail", note: "Icon groups and counts replace session-specific affordances." },
      { title: "Compact Tree", note: "Nested site sections use chevrons, icons, and active row states." },
      { title: "Search-first Nav", note: "Search plus category headings supports large docs navigation." },
      { title: "Mini Mode", note: "Collapsed site nav keeps routing usable through recognizable icons." },
    ],
    spacing: [
      { title: "Hairline", note: "One-pixel border, no corner glow, clean dark surface." },
      { title: "Inner Keyline", note: "Inset line gives shape without the banned wrap-around glow." },
      { title: "Split Edge", note: "Top edge is brighter; sides stay quiet and elegant." },
      { title: "Pressed Trench", note: "Pressed states use inner shadow instead of outer glow." },
      { title: "Radius Ladder", note: "Controls/cards/pills get a controlled set of alternate radii." },
    ],
  }

  return copy[kind] ?? commonCompact
}

const ACCENT_TOKENS = [
  { key: "accentPrimary", label: "Accent primary" },
  { key: "accentPink", label: "Accent pink" },
  { key: "accentViolet", label: "Accent violet" },
]

const DERIVED_TOKENS = [
  { key: "info", label: "Info" },
  { key: "success", label: "Success" },
  { key: "warn", label: "Warn" },
  { key: "error", label: "Error" },
  { key: "neutral", label: "Neutral" },
  { key: "overlay", label: "Overlay" },
  { key: "disabledSurface", label: "Disabled surface" },
  { key: "subtleBg", label: "Subtle background" },
  { key: "selectedBg", label: "Selected background" },
  { key: "pressedBg", label: "Pressed background" },
]

const INITIAL_COLORS: Record<string, string> = {
  accentPrimary: "#35c6ff",
  accentPink: "#ff9fc6",
  accentViolet: "#a78bfa",
  info: "#6fd2ff",
  success: "#78e6cb",
  warn: "#ffd166",
  error: "#ff8fab",
  neutral: "#b9d7e8",
  overlay: "#050d16",
  disabledSurface: "#193040",
  subtleBg: "#123348",
  selectedBg: "#164963",
  pressedBg: "#1b5b79",
}

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "")
  const full = clean.length === 3 ? clean.split("").map((ch) => ch + ch).join("") : clean.padEnd(6, "0").slice(0, 6)
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((part) => clamp(part).toString(16).padStart(2, "0")).join("")}`
}

function mix(a: string, b: string, weight: number) {
  const first = hexToRgb(a)
  const second = hexToRgb(b)
  return rgbToHex(
    first.r * (1 - weight) + second.r * weight,
    first.g * (1 - weight) + second.g * weight,
    first.b * (1 - weight) + second.b * weight
  )
}

function colorSuggestions(key: string, colors: Record<string, string>) {
  const base = colors.accentPrimary
  const pink = colors.accentPink
  const violet = colors.accentViolet

  const suggestions: Record<string, string[]> = {
    info: [base, mix(base, "#ffffff", 0.2), mix(base, violet, 0.18), "#6fd2ff", "#4db6ff"],
    success: ["#78e6cb", mix(base, "#58f0b7", 0.55), "#8ff5d2", "#53d8b8", "#b0ffe9"],
    warn: ["#ffd166", "#ffc857", mix(pink, "#ffd166", 0.55), "#ffe08a", "#e7b85c"],
    error: [pink, "#ff8fab", mix(pink, violet, 0.22), "#ff6f91", "#ffc0d4"],
    neutral: ["#b9d7e8", mix(base, "#dbeafe", 0.72), "#9fb8c8", "#d8eaf4", "#7894a6"],
    overlay: ["#050d16", "#08111c", mix(base, "#000000", 0.86), "#0a1622", "#02070d"],
    disabledSurface: ["#193040", mix(base, "#0a1520", 0.72), "#203747", "#162635", "#243b4d"],
    subtleBg: [mix(base, "#07131c", 0.78), "#123348", "#182d48", mix(violet, "#07131c", 0.82), "#102a3b"],
    selectedBg: [mix(base, "#07131c", 0.68), "#164963", mix(base, violet, 0.32), "#1d5572", "#123f58"],
    pressedBg: [mix(base, "#07131c", 0.58), "#1b5b79", mix(base, pink, 0.26), "#226b8d", "#164a66"],
  }

  return suggestions[key] ?? [base, pink, violet, "#ffffff", "#000000"]
}

function SectionIcon({ section, size = 16 }: { section: string; size?: number }) {
  const Icon =
    section.includes("tool") ? Code2 :
    section.includes("plan") || section.includes("task") ? ListChecks :
    section.includes("think") || section.includes("chain") ? Brain :
    section.includes("audio") || section.includes("voice") ? Volume2 :
    section.includes("mic") || section.includes("transcription") ? Mic :
    section.includes("commit") ? GitCommit :
    section.includes("package") ? Package :
    section.includes("sandbox") ? Box :
    section.includes("stack") || section.includes("terminal") ? Terminal :
    section.includes("chart") ? Gauge :
    section.includes("table") ? Table2 :
    section.includes("calendar") || section.includes("date") ? CalendarDays :
    section.includes("sidebar") ? PanelLeft :
    section.includes("source") || section.includes("attachment") || section.includes("file") ? FileText :
    section.includes("button") || section.includes("toggle") ? MousePointer2 :
    section.includes("input") || section.includes("textarea") ? Hash :
    section.includes("prompt") || section.includes("conversation") ? MessageSquare :
    section.includes("brand") ? Sparkles :
    section.includes("color") ? Palette :
    section.includes("permission") || section.includes("security") ? ShieldCheck :
    section.includes("checkpoint") ? BadgeCheck :
    section.includes("agent") ? Bot :
    Activity

  return <Icon size={size} strokeWidth={1.9} />
}

function PreviewShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`aurora-component-preview ${className}`}>{children}</div>
}

function TinyBadge({ children, tone = "cyan" }: { children: React.ReactNode; tone?: "cyan" | "pink" | "violet" | "success" | "warn" | "neutral" }) {
  return <span className={`alt-tiny-badge alt-tiny-badge--${tone}`}>{children}</span>
}

function FileChip({ name, meta, icon = "file", dismiss = true }: { name: string; meta?: string; icon?: "file" | "code" | "json"; dismiss?: boolean }) {
  const Icon = icon === "code" ? FileCode : icon === "json" ? BracedFileIcon : FileText

  return (
    <span className="alt-file-chip">
      <Icon size={13} />
      <span>{name}</span>
      {meta ? <em>{meta}</em> : null}
      {dismiss ? <X size={10} className="alt-file-chip-x" /> : null}
    </span>
  )
}

function BracedFileIcon({ size = 13 }: { size?: number }) {
  return (
    <span className="alt-braced-file" style={{ width: size, height: size }}>
      {"{}"}
    </span>
  )
}

function AttachmentPreview({ section, variant }: { section: string; variant: number }) {
  if (section === "inline-citation") {
    return (
      <PreviewShell>
        <p className="alt-inline-copy">
          Verified config drift <span className="alt-citation">2</span> against production. 
        </p>
        <div className="alt-tooltip-card">
          <FileText size={13} />
          <span>registry.json</span>
          <em>published manifest</em>
        </div>
      </PreviewShell>
    )
  }

  const files = [
    ["registry.json", "1", "json"],
    ["auth-middleware.ts", "6", "code"],
    ["gateway.toml", "2", "file"],
  ] as const

  if (variant === 1) {
    return (
      <PreviewShell className="alt-preview-center">
        <div className="alt-source-strip">
          <span>Sources</span>
          {files.map(([name, meta, icon]) => <FileChip key={name} name={name} meta={meta} icon={icon} dismiss={false} />)}
        </div>
      </PreviewShell>
    )
  }

  if (variant === 2) {
    return (
      <PreviewShell>
        <div className="alt-chat-line">
          <MessageSquare size={14} />
          <span>Review these files before applying the patch.</span>
        </div>
        <div className="alt-file-line">
          <FileChip name="gateway.toml" meta="2 KB" />
          <FileChip name="connection-pool.ts" meta="4 KB" icon="code" />
        </div>
      </PreviewShell>
    )
  }

  if (variant === 3) {
    return (
      <PreviewShell>
        <div className="alt-tab-row">
          {files.map(([name, meta, icon]) => <FileChip key={name} name={name} meta={meta} icon={icon} />)}
        </div>
      </PreviewShell>
    )
  }

  if (variant === 4) {
    return (
      <PreviewShell>
        <div className="alt-file-ledger">
          {files.map(([name, meta, icon]) => (
            <span key={name}>
              {icon === "code" ? <FileCode size={13} /> : icon === "json" ? <BracedFileIcon /> : <FileText size={13} />}
              {name}
              <TinyBadge>{meta}</TinyBadge>
            </span>
          ))}
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell className="alt-preview-center">
      <div className="alt-file-line">
        {files.map(([name, meta, icon]) => <FileChip key={name} name={name} meta={section === "sources" ? meta : `${meta} KB`} icon={icon} />)}
      </div>
    </PreviewShell>
  )
}

function ActivityPreview({ section, variant }: { section: string; variant: number }) {
  const items = section === "tool-calls" || section === "tool"
    ? [
      { icon: FileText, label: "ReadFile", meta: "400ms" },
      { icon: Terminal, label: "Bash", meta: "500ms" },
      { icon: Search, label: "Search", meta: "200ms" },
    ]
    : [
      { icon: section === "plan" ? ListChecks : Brain, label: formatSectionTitle(section), meta: "33%" },
      { icon: CheckCircle2, label: "Next step", meta: "ready" },
      { icon: Clock3, label: "Queued", meta: "2" },
    ]

  if (variant === 0) {
    return (
      <PreviewShell className="alt-preview-center">
        <div className="alt-icon-dock">
          {items.map(({ icon: Icon, label }) => (
            <button key={label} type="button" aria-label={label}>
              <Icon size={15} />
            </button>
          ))}
        </div>
      </PreviewShell>
    )
  }

  if (variant === 1) {
    return (
      <PreviewShell>
        <div className="alt-activity-rows">
          {items.map(({ icon: Icon, label, meta }, index) => (
            <div key={label} className="alt-activity-row">
              <CircleDot size={11} className={index === 1 ? "alt-success" : "alt-cyan"} />
              <Icon size={14} />
              <span>{label}</span>
              <em>{meta}</em>
            </div>
          ))}
        </div>
      </PreviewShell>
    )
  }

  if (variant === 2) {
    return (
      <PreviewShell className="alt-preview-center">
        <div className="alt-progress-capsule">
          <SectionIcon section={section} />
          <span>{formatSectionTitle(section)}</span>
          <strong>42k/128k</strong>
          <i><b style={{ width: "33%" }} /></i>
        </div>
      </PreviewShell>
    )
  }

  if (variant === 3) {
    return (
      <PreviewShell className="alt-preview-center">
        <div className="alt-step-pips">
          {items.map(({ icon: Icon, label }, index) => (
            <span key={label} className={index === 0 ? "active" : ""}>
              <Icon size={13} />
            </span>
          ))}
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell className="alt-preview-center">
      <div className="alt-mini-actions">
        <button type="button" aria-label="Expand"><ChevronDown size={14} /></button>
        <button type="button" aria-label="Copy"><Copy size={14} /></button>
        <button type="button" aria-label="Retry"><RefreshCw size={14} /></button>
      </div>
    </PreviewShell>
  )
}

function RuntimePreview({ section, variant }: { section: string; variant: number }) {
  const title = formatSectionTitle(section)

  if (variant === 1) {
    return (
      <PreviewShell>
        <div className="alt-runtime-row">
          <SectionIcon section={section} />
          <span>{title}</span>
          <TinyBadge tone="success">LIVE</TinyBadge>
          <em>12ms</em>
        </div>
        <div className="alt-runtime-row muted">
          <Circle size={9} />
          <span>registry edge</span>
          <TinyBadge>us-east-1</TinyBadge>
          <em>ok</em>
        </div>
      </PreviewShell>
    )
  }

  if (variant === 2) {
    return (
      <PreviewShell>
        <div className="alt-inspector-card">
          <SectionIcon section={section} size={18} />
          <div>
            <strong>{title}</strong>
            <span>Operational summary</span>
          </div>
          <TinyBadge tone="success">ACTIVE</TinyBadge>
        </div>
      </PreviewShell>
    )
  }

  if (variant === 3) {
    return (
      <PreviewShell>
        <div className="alt-rail-stack">
          {["current", "verified", "pending"].map((item, index) => (
            <span key={item}>
              <SectionIcon section={section} size={13} />
              {item}
              <em>{index === 0 ? "now" : index === 1 ? "2m" : "1"}</em>
            </span>
          ))}
        </div>
      </PreviewShell>
    )
  }

  if (variant === 4) {
    return (
      <PreviewShell className="alt-preview-center">
        <div className="alt-command-capsule">
          <SectionIcon section={section} />
          <span>{title}</span>
          <button type="button"><MoreHorizontal size={13} /></button>
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell className="alt-preview-center">
      <div className="alt-chip-cluster">
        <TinyBadge><SectionIcon section={section} size={12} /> {title}</TinyBadge>
        <TinyBadge tone="success">running</TinyBadge>
        <TinyBadge tone="violet">2 checks</TinyBadge>
      </div>
    </PreviewShell>
  )
}

function CodePreview({ section, variant }: { section: string; variant: number }) {
  const filename = section === "stack-trace" ? "trace.log" : section === "snippet" ? "snippet.ts" : "gateway.rs"

  if (variant === 2) {
    return (
      <PreviewShell>
        <div className="alt-code-pill">
          <Code2 size={13} />
          <code><span className="syn-key">const</span> status = <span className="syn-string">{`"live"`}</span></code>
          <button type="button"><Copy size={12} /></button>
        </div>
      </PreviewShell>
    )
  }

  if (variant === 3) {
    return (
      <PreviewShell>
        <div className="alt-code-diagnostic">
          <pre>{`12  const endpoint = registry.url\n13  await client.connect(endpoint)`}</pre>
          <span><AlertCircle size={13} /> Missing retry guard</span>
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell>
      <div className={`alt-code-frame alt-code-frame--${variant}`}>
        <div className="alt-code-title">
          <FileCode size={13} />
          <span>{filename}</span>
          <TinyBadge>{section === "stack-trace" ? "log" : "rust"}</TinyBadge>
        </div>
        <pre>
          <span className="syn-key">async fn</span> <span className="syn-fn">health_check</span>() {" {"}
          {"\n  "}<span className="syn-key">let</span> status = <span className="syn-string">{`"ok"`}</span>;
          {"\n  "}<span className="syn-type">Json</span>(status)
          {"\n}"}
        </pre>
      </div>
    </PreviewShell>
  )
}

function FilePickerPreview({ variant }: { variant: number }) {
  if (variant === 1) {
    return (
      <PreviewShell>
        <div className="alt-file-picker-centered">
          <div><Search size={14} /> <span>Search files...</span></div>
          <div className="alt-picker-grid">
            <FileChip name="README.md" icon="file" dismiss={false} />
            <FileChip name="gateway.rs" icon="code" dismiss={false} />
          </div>
        </div>
      </PreviewShell>
    )
  }

  if (variant === 2) {
    return (
      <PreviewShell>
        <div className="alt-picker-command">
          <Search size={14} />
          <span>Open file</span>
          <TinyBadge>⌘P</TinyBadge>
        </div>
        <div className="alt-picker-result"><FileText size={13} /> README.md <em>tracked file</em></div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell>
      <div className="alt-picker-panel">
        <aside>
          <strong>Files</strong>
          {["Recent", "Project", "Uploads"].map((item) => <span key={item}><Folder size={12} />{item}</span>)}
        </aside>
        <main>
          <div><Search size={13} /> Search files...</div>
          <FileChip name={variant === 3 ? "schema.json" : variant === 4 ? ".env.example" : "config.toml"} icon={variant === 4 ? "file" : "json"} dismiss={false} />
        </main>
      </div>
    </PreviewShell>
  )
}

function FileTreePreview({ variant }: { variant: number }) {
  if (variant === 1 || variant === 3) {
    return (
      <PreviewShell>
        <div className="alt-file-tabs">
          <FileChip name="README.md" icon="file" />
          <FileChip name="gateway.rs" icon="code" />
          {variant === 3 ? <FileChip name="schema.json" icon="json" /> : null}
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell>
      <div className="alt-selection-card">
        <div>
          <FileText size={16} />
          <strong>README.md</strong>
          <TinyBadge>md</TinyBadge>
        </div>
        <dl>
          <span><dt>Type</dt><dd>file</dd></span>
          <span><dt>Children</dt><dd>0</dd></span>
          <span><dt>Status</dt><dd>tracked</dd></span>
        </dl>
      </div>
    </PreviewShell>
  )
}

function ButtonPreview({ variant }: { variant: number }) {
  const labels = ["Deploy agent", "Cancel", "Send", "Delete", "Loading"]
  const icons = [Upload, X, SendHorizontal, AlertCircle, Loader2]
  const Icon = icons[variant] ?? MousePointer2

  return (
    <PreviewShell className="alt-preview-center">
      <div className={`alt-button-set alt-button-set--${variant}`}>
        <button type="button">
          <Icon size={14} className={variant === 4 ? "spin" : ""} />
          {labels[variant]}
        </button>
        <button type="button" aria-label="Icon action"><MoreHorizontal size={14} /></button>
      </div>
    </PreviewShell>
  )
}

function TogglePreview({ variant }: { variant: number }) {
  return (
    <PreviewShell className="alt-preview-center">
      <div className={`alt-toggle-sample alt-toggle-sample--${variant}`}>
        <button type="button" aria-pressed={variant % 2 === 0}>
          {variant < 2 ? <Check size={14} /> : variant === 2 ? <Zap size={14} /> : variant === 3 ? <Grid2X2 size={14} /> : <Power size={14} />}
          <span>{variant === 0 ? "Bold" : variant === 1 ? "Quiet" : variant === 2 ? "Live" : variant === 3 ? "Grid" : "Enabled"}</span>
        </button>
      </div>
    </PreviewShell>
  )
}

function InputGroupPreview({ variant }: { variant: number }) {
  if (variant === 2) {
    return (
      <PreviewShell>
        <div className="alt-url-builder">
          <span>https://</span>
          <strong>aurora.tootie.tv</strong>
          <TinyBadge tone="success">LIVE</TinyBadge>
        </div>
        <div className="alt-url-builder">
          <span>/api/v1/</span>
          <strong>registry</strong>
          <button type="button"><Check size={13} /></button>
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell>
      <label className={`alt-input-group alt-input-group--${variant}`}>
        <span>{variant === 0 ? "Site URL" : variant === 1 ? "Work email" : variant === 3 ? "API key" : "Monthly budget"}</span>
        <div>
          {variant === 3 ? <Lock size={13} /> : variant === 4 ? <span>$</span> : <Globe2 size={13} />}
          <input readOnly value={variant === 1 ? "jacob@aurora.tootie.tv" : variant === 3 ? "sk-••••••••••••••" : variant === 4 ? "49 / mo" : "aurora.tootie.tv"} />
          {variant === 4 ? <TinyBadge>cap</TinyBadge> : null}
        </div>
      </label>
    </PreviewShell>
  )
}

function FormPreview({ section, variant }: { section: string; variant: number }) {
  if (section === "progress") {
    return (
      <PreviewShell>
        <div className="alt-progress-control">
          <span>Context</span>
          <strong>{variant === 0 ? "33%" : variant === 1 ? "42k/128k" : variant === 2 ? "ready" : variant === 3 ? "syncing" : "complete"}</strong>
          <i><b style={{ width: `${[33, 48, 72, 58, 100][variant]}%` }} /></i>
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell>
      <label className="alt-form-control">
        <span>{formatSectionTitle(section)}</span>
        <div>
          <SectionIcon section={section} />
          <input readOnly value={variant === 0 ? "registry endpoint" : variant === 1 ? "production-edge" : variant === 2 ? "42" : variant === 3 ? "May 13, 2026" : "selected"} />
          <TinyBadge>{variant === 4 ? "ok" : "edit"}</TinyBadge>
        </div>
      </label>
    </PreviewShell>
  )
}

function PromptPreview({ section, variant }: { section: string; variant: number }) {
  if (section === "conversation") {
    return (
      <PreviewShell>
        <div className={`alt-conversation alt-conversation--${variant}`}>
          <span className="user">Show installed plugins and recent activity.</span>
          <span className="ai">Found 18 active plugins and 5 modified registry surfaces.</span>
          <div className="tools"><ActivityPreview section="tool-calls" variant={variant % 5} /></div>
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell>
      <div className={`alt-composer alt-composer--${variant}`}>
        <div className="alt-composer-text">Message Aurora...</div>
        <div className="alt-composer-bar">
          <button type="button"><FileText size={14} /></button>
          <button type="button"><Command size={14} /></button>
          <TinyBadge>Claude Sonnet 4.6</TinyBadge>
          <button type="button"><SendHorizontal size={14} /></button>
        </div>
      </div>
    </PreviewShell>
  )
}

function SidebarPreview({ kind, variant }: { kind: PreviewKind; variant: number }) {
  const site = kind === "sidebar-site"
  const groups = site ? ["Foundations", "Components", "AI Elements"] : ["Aurora Gateway", "Design System", "Infra / Devops"]

  return (
    <PreviewShell>
      <div className={`alt-sidebar alt-sidebar--${variant}`}>
        <header>
          {site ? <Home size={15} /> : <Bot size={15} />}
          <strong>{site ? "Gallery" : "Aurora"}</strong>
          <button type="button"><Plus size={12} /></button>
        </header>
        <div className="alt-sidebar-search"><Search size={12} /> Search...</div>
        <nav>
          {groups.map((group, index) => (
            <span key={group} className={index === 1 ? "active" : ""}>
              {site ? <Navigation size={12} /> : <Folder size={12} />}
              {group}
              <em>{index + 2}</em>
            </span>
          ))}
        </nav>
        <footer>
          <span className="alt-avatar">{site ? "A" : "JM"}</span>
          <strong>{site ? "Aurora docs" : "J. Magar"}</strong>
          <Settings2 size={12} />
        </footer>
      </div>
    </PreviewShell>
  )
}

function DataPreview({ section, variant }: { section: string; variant: number }) {
  if (variant === 2) {
    return (
      <PreviewShell>
        <div className="alt-data-cards">
          {["axon", "bitwarden"].map((name) => (
            <span key={name}>
              <CircleDot size={12} />
              <strong>{name}</strong>
              <TinyBadge tone="success">active</TinyBadge>
            </span>
          ))}
        </div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell>
      <div className={`alt-data-table alt-data-table--${variant}`}>
        <header>
          <span>{section === "tables" ? "Server" : formatSectionTitle(section)}</span>
          <span>Region</span>
          <span>Status</span>
          <span>Actions</span>
        </header>
        {["production-edge.lab.local", "staging-gw.lab.local", "dev-proxy.lab.local"].map((row, index) => (
          <div key={row}>
            <CircleDot size={11} className={index === 2 ? "alt-warn" : "alt-cyan"} />
            <strong>{row}</strong>
            <span>{index === 0 ? "us-east-1" : index === 1 ? "eu-west-1" : "us-west-2"}</span>
            <TinyBadge tone={index === 2 ? "warn" : "success"}>{index === 2 ? "DEV" : "LIVE"}</TinyBadge>
            <button type="button"><MoreHorizontal size={13} /></button>
          </div>
        ))}
      </div>
    </PreviewShell>
  )
}

function OverlayPreview({ section, variant }: { section: string; variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-overlay-scene alt-overlay-scene--${variant}`}>
        <button type="button"><SectionIcon section={section} /> {formatSectionTitle(section)}</button>
        <div className="alt-overlay-panel">
          <header>
            <SectionIcon section={section} />
            <strong>{variant === 0 ? "Quick inspect" : variant === 1 ? "Preview card" : variant === 2 ? "Task sheet" : variant === 3 ? "Mobile drawer" : "Panel stack"}</strong>
          </header>
          <p>Compact details, actions, and state without alert-card styling.</p>
          <div><TinyBadge>⌘K</TinyBadge><TinyBadge tone="success">ready</TinyBadge></div>
        </div>
      </div>
    </PreviewShell>
  )
}

function FeedbackPreview({ section, variant }: { section: string; variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-feedback alt-feedback--${variant}`}>
        <SectionIcon section={section} />
        <div>
          <strong>{formatSectionTitle(section)}</strong>
          <span>{variant === 0 ? "Compact prompt with clear actions." : variant === 1 ? "Toast-like surface, not alert clone." : variant === 2 ? "Inline task row with status." : variant === 3 ? "Decision card with icon actions." : "Command footer with next step."}</span>
        </div>
        <button type="button">{variant === 4 ? <ChevronRight size={13} /> : <Check size={13} />}</button>
      </div>
    </PreviewShell>
  )
}

function MediaPreview({ section, variant }: { section: string; variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-media alt-media--${variant}`}>
        <button type="button"><SectionIcon section={section} /></button>
        <div>
          <strong>{formatSectionTitle(section)}</strong>
          <i><b style={{ width: `${[36, 54, 72, 42, 86][variant]}%` }} /></i>
        </div>
        <TinyBadge>{variant === 2 ? "live" : "ready"}</TinyBadge>
      </div>
    </PreviewShell>
  )
}

function BreadcrumbPreview({ variant }: { variant: number }) {
  const crumbs = ["Workspace", "Registry", "Components", "Menubar"]

  return (
    <PreviewShell>
      <div className={`alt-breadcrumb alt-breadcrumb--${variant}`}>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb}>
            <span className={index === crumbs.length - 1 ? "active" : ""}>
              {index === 0 ? <Home size={12} /> : index === 1 ? <Database size={12} /> : index === 2 ? <Layers3 size={12} /> : <FileCode size={12} />}
              {crumb}
            </span>
            {index < crumbs.length - 1 ? <ChevronRight size={12} /> : null}
          </React.Fragment>
        ))}
      </div>
    </PreviewShell>
  )
}

function CommandPreview({ variant }: { variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-command alt-command--${variant}`}>
        <div className="alt-command-search"><Search size={14} /> Search commands, files, skills...</div>
        {["New conversation", "Search files", "Clear context"].map((item, index) => (
          <div key={item} className={index === variant % 3 ? "active" : ""}>
            <Command size={13} />
            <span>{item}</span>
            <TinyBadge>{index === 0 ? "N" : index === 1 ? "P" : "K"}</TinyBadge>
          </div>
        ))}
      </div>
    </PreviewShell>
  )
}

function ColorPreview({ variant }: { variant: number }) {
  const sets = [
    ["#35c6ff", "#ff9fc6", "#a78bfa", "#78e6cb"],
    ["#4db6ff", "#ff7ab6", "#8f7aff", "#ffffff"],
    ["#6fd2ff", "#ffc0d4", "#b49cff", "#102a3b"],
    ["#35c6ff", "#78e6cb", "#ffd166", "#ff8fab"],
    ["#2fb8ff", "#ff8dbf", "#9d7cff", "#d8eaf4"],
  ]

  return (
    <PreviewShell>
      <div className="alt-palette-preview">
        {sets[variant].map((color) => <span key={color} style={{ background: color }} />)}
      </div>
      <div className="alt-token-row">
        <TinyBadge>accent</TinyBadge>
        <TinyBadge tone="pink">pink</TinyBadge>
        <TinyBadge tone="violet">violet</TinyBadge>
      </div>
    </PreviewShell>
  )
}

function SpacingPreview({ variant }: { variant: number }) {
  const radius = [4, 8, 12, 999, 2][variant]

  return (
    <PreviewShell className="alt-preview-center">
      <div className={`alt-border-sample alt-border-sample--${variant}`} style={{ borderRadius: radius === 999 ? 999 : radius }}>
        <span>{variant === 0 ? "Hairline" : variant === 1 ? "Inner" : variant === 2 ? "Split" : variant === 3 ? "Pill" : "Sharp"}</span>
      </div>
    </PreviewShell>
  )
}

function TypePreview({ variant }: { variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-type-sample alt-type-sample--${variant}`}>
        <span>{variant === 0 ? "Dense" : variant === 1 ? "Display" : variant === 2 ? "Eyebrow" : variant === 3 ? "Mono" : "Label"}</span>
        <strong>{variant === 3 ? "production-edge.lab.local" : "Read-only mode requires approval"}</strong>
        <em>{variant === 1 ? "24px / 720 / 1.15" : "13px / 560 / 1.42"}</em>
      </div>
    </PreviewShell>
  )
}

function BrandPreview({ variant }: { variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-brand alt-brand--${variant}`}>
        <span><Sparkles size={18} /> Aurora</span>
        <span><Bot size={18} /> Agent</span>
        <span><Grid2X2 size={18} /> Registry</span>
      </div>
    </PreviewShell>
  )
}

function DirectionPreview({ variant }: { variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-direction alt-direction--${variant}`} dir={variant % 2 ? "rtl" : "ltr"}>
        <span>{variant % 2 ? "RTL" : "LTR"}</span>
        <strong>{variant % 2 ? "تحديث السجل" : "Registry update"}</strong>
        <button type="button"><ChevronRight size={13} /></button>
      </div>
    </PreviewShell>
  )
}

function CardPreview({ variant }: { variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-card-preview alt-card-preview--${variant}`}>
        <header>
          <SectionIcon section="card" />
          <strong>Gateway health</strong>
          <TinyBadge tone="success">LIVE</TinyBadge>
        </header>
        <p>12 services reporting within threshold.</p>
        <div><span /> <span /> <span /></div>
      </div>
    </PreviewShell>
  )
}

function CarouselPreview({ variant }: { variant: number }) {
  return (
    <PreviewShell>
      <div className={`alt-carousel alt-carousel--${variant}`}>
        <button type="button"><ChevronRight size={13} /></button>
        {["Local", "Curated", "Remote"].map((item, index) => (
          <span key={item} className={index === variant % 3 ? "active" : ""}>
            <strong>{item}</strong>
            <em>{index + 1}/3</em>
          </span>
        ))}
      </div>
    </PreviewShell>
  )
}

function ChartPreview({ variant }: { variant: number }) {
  const values = [
    [36, 58, 42, 82, 64],
    [22, 72, 48, 61, 90],
    [44, 38, 84, 56, 68],
    [68, 42, 75, 31, 88],
    [50, 80, 66, 92, 58],
  ][variant]

  return (
    <PreviewShell>
      <div className={`alt-chart alt-chart--${variant}`}>
        {values.map((value, index) => <span key={index} style={{ height: `${value}%` }} />)}
      </div>
    </PreviewShell>
  )
}

function ComponentPreview({ kind, section, variant }: { kind: PreviewKind; section: string; variant: number }) {
  switch (kind) {
    case "activity":
      return <ActivityPreview section={section} variant={variant} />
    case "attachment":
      return <AttachmentPreview section={section} variant={variant} />
    case "breadcrumb":
      return section === "command-palette" || section === "command" ? <CommandPreview variant={variant} /> : <BreadcrumbPreview variant={variant} />
    case "brand":
      return <BrandPreview variant={variant} />
    case "button":
      return <ButtonPreview variant={variant} />
    case "card":
      return <CardPreview variant={variant} />
    case "carousel":
      return <CarouselPreview variant={variant} />
    case "chart":
      return <ChartPreview variant={variant} />
    case "code":
      return <CodePreview section={section} variant={variant} />
    case "color":
      return <ColorPreview variant={variant} />
    case "command":
      return <CommandPreview variant={variant} />
    case "data":
      return <DataPreview section={section} variant={variant} />
    case "direction":
      return <DirectionPreview variant={variant} />
    case "feedback":
      return <FeedbackPreview section={section} variant={variant} />
    case "file-picker":
      return <FilePickerPreview variant={variant} />
    case "file-tree":
      return <FileTreePreview variant={variant} />
    case "form":
      return <FormPreview section={section} variant={variant} />
    case "input-group":
      return <InputGroupPreview variant={variant} />
    case "media":
      return <MediaPreview section={section} variant={variant} />
    case "overlay":
      return <OverlayPreview section={section} variant={variant} />
    case "prompt":
      return <PromptPreview section={section} variant={variant} />
    case "sidebar-agent":
    case "sidebar-site":
      return <SidebarPreview kind={kind} variant={variant} />
    case "spacing":
      return <SpacingPreview variant={variant} />
    case "toggle":
      return <TogglePreview variant={variant} />
    case "type":
      return <TypePreview variant={variant} />
    default:
      return <RuntimePreview section={section} variant={variant} />
  }
}

function ComplaintAlternatives({ section, complaint, index }: { section: string; complaint: Complaint; index: number }) {
  const kind = kindFor(section, complaint)
  const alternatives = alternativesFor(kind, section)

  return (
    <div className="aurora-alt-complaint">
      <div className="aurora-alt-complaint-head">
        <span className="aurora-alt-complaint-index">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <p>{complaint.text}</p>
          <code>{complaint.path}</code>
        </div>
      </div>
      <div className="aurora-alt-grid">
        {alternatives.map((alternative, alternativeIndex) => (
          <article key={`${alternative.title}-${alternativeIndex}`} className="aurora-alt-card">
            <div className="aurora-alt-choice-row">
              <span>Variant {alternativeIndex + 1}</span>
              <button type="button" aria-label={`Choose ${alternative.title}`}>Choose</button>
            </div>
            <ComponentPreview kind={kind} section={section} variant={alternativeIndex} />
            <div>
              <h3>{alternative.title}</h3>
              <p>{alternative.note}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function ColorTokenLab() {
  const [colors, setColors] = React.useState(INITIAL_COLORS)

  function setColor(key: string, value: string) {
    setColors((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="aurora-color-lab">
      <div>
        <h3>Interactive 13-token color picker</h3>
        <p>Pick the three accent colors first. Each semantic and interaction token gets compatible suggestions, but every token remains editable.</p>
      </div>
      <div className="aurora-color-token-grid aurora-color-token-grid--accent">
        {ACCENT_TOKENS.map((token) => (
          <label key={token.key} className="aurora-color-token">
            <span>{token.label}</span>
            <input type="color" value={colors[token.key]} onChange={(event) => setColor(token.key, event.target.value)} />
            <code>{colors[token.key]}</code>
          </label>
        ))}
      </div>
      <div className="aurora-color-token-grid">
        {DERIVED_TOKENS.map((token) => (
          <label key={token.key} className="aurora-color-token">
            <span>{token.label}</span>
            <input type="color" value={colors[token.key]} onChange={(event) => setColor(token.key, event.target.value)} />
            <code>{colors[token.key]}</code>
            <span className="aurora-color-suggestions">
              {colorSuggestions(token.key, colors).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  aria-label={`Use ${suggestion} for ${token.label}`}
                  style={{ background: suggestion }}
                  onClick={(event) => {
                    event.preventDefault()
                    setColor(token.key, suggestion)
                  }}
                />
              ))}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function GalleryAlternatives({ section, title }: { section: string; title: string }) {
  const complaints = COMPLAINTS[section]
  if (!complaints?.length) return null

  return (
    <section className="aurora-alternatives" aria-labelledby={`${section}-alternatives-heading`}>
      <style>{`
        .aurora-alternatives {
          display: grid;
          gap: 18px;
          max-width: min(1160px, 100%);
          margin-top: 8px;
        }
        .aurora-alt-head {
          display: grid;
          gap: 5px;
        }
        .aurora-alt-head p,
        .aurora-alt-head h2,
        .aurora-alt-complaint-head p,
        .aurora-alt-card h3,
        .aurora-alt-card p,
        .aurora-color-lab h3,
        .aurora-color-lab p {
          margin: 0;
        }
        .aurora-alt-head h2 {
          color: var(--aurora-text-primary);
          font-family: var(--aurora-font-display);
          font-size: 18px;
          font-weight: 720;
          letter-spacing: 0;
        }
        .aurora-alt-head p {
          color: var(--aurora-accent-strong);
          font-size: 12px;
          line-height: 1.45;
        }
        .aurora-alt-complaint {
          display: grid;
          gap: 12px;
          padding: 14px;
          border: 1px solid color-mix(in srgb, var(--aurora-border-strong) 74%, transparent);
          border-radius: 12px;
          background: color-mix(in srgb, var(--aurora-panel-medium) 70%, transparent);
        }
        .aurora-alt-complaint-head {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 10px;
          align-items: start;
        }
        .aurora-alt-complaint-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 24px;
          border-radius: 7px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 36%, transparent);
          color: var(--aurora-accent-strong);
          background: color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent);
          font: 700 10px/1 var(--aurora-font-mono);
        }
        .aurora-alt-complaint-head p {
          color: var(--aurora-text-primary);
          font-size: 13px;
          font-weight: 620;
          line-height: 1.45;
        }
        .aurora-alt-complaint-head code {
          display: block;
          margin-top: 4px;
          color: var(--aurora-accent-strong);
          font: 10.5px/1.4 var(--aurora-font-mono);
          overflow-wrap: anywhere;
        }
        .aurora-alt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
        }
        .aurora-alt-card {
          display: grid;
          align-content: start;
          gap: 10px;
          min-height: 236px;
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
          background: color-mix(in srgb, var(--aurora-control-surface) 68%, transparent);
          padding: 11px;
        }
        .aurora-alt-card h3 {
          color: var(--aurora-text-primary);
          font-size: 12px;
          font-weight: 680;
          line-height: 1.25;
        }
        .aurora-alt-card p {
          margin-top: 4px;
          color: var(--aurora-text-secondary, var(--aurora-text-muted));
          font-size: 11px;
          line-height: 1.45;
        }
        .aurora-alt-choice-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          color: var(--aurora-text-muted);
          font: 700 9.5px/1 var(--aurora-font-mono);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .aurora-alt-choice-row button {
          height: 22px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 42%, transparent);
          border-radius: 6px;
          color: var(--aurora-accent-strong);
          background: color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent);
          padding: 0 8px;
          font-size: 10px;
          font-weight: 620;
          cursor: pointer;
        }
        .aurora-component-preview {
          display: grid;
          gap: 9px;
          min-height: 126px;
          align-content: center;
          overflow: hidden;
          border-radius: 9px;
          border: 1px solid color-mix(in srgb, var(--aurora-border-strong) 58%, transparent);
          background:
            radial-gradient(circle at top left, color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent), transparent 40%),
            linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong) 94%, transparent), color-mix(in srgb, var(--aurora-control-surface) 86%, transparent));
          padding: 12px;
        }
        .alt-preview-center {
          place-items: center;
        }
        .alt-tiny-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          min-height: 19px;
          border: 1px solid color-mix(in srgb, var(--badge-color, var(--aurora-accent-primary)) 38%, transparent);
          border-radius: 6px;
          color: var(--badge-color, var(--aurora-accent-strong));
          background: color-mix(in srgb, var(--badge-color, var(--aurora-accent-primary)) 9%, transparent);
          padding: 0 6px;
          font-size: 10px;
          font-weight: 690;
          line-height: 1;
        }
        .alt-tiny-badge--pink { --badge-color: var(--aurora-accent-pink); }
        .alt-tiny-badge--violet { --badge-color: var(--aurora-accent-violet); }
        .alt-tiny-badge--success { --badge-color: var(--aurora-success); }
        .alt-tiny-badge--warn { --badge-color: var(--aurora-warn); }
        .alt-tiny-badge--neutral { --badge-color: var(--aurora-neutral); }
        .alt-file-line,
        .alt-tab-row,
        .alt-chip-cluster {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          align-items: center;
        }
        .alt-file-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 25px;
          max-width: 100%;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent);
          border-radius: 7px;
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-control-surface) 78%, transparent);
          padding: 0 7px;
          font-size: 11px;
          font-weight: 650;
          line-height: 1;
        }
        .alt-file-chip svg,
        .alt-braced-file {
          color: var(--aurora-accent-pink);
          flex: none;
        }
        .alt-braced-file {
          display: inline-grid;
          place-items: center;
          font: 700 8px/1 var(--aurora-font-mono);
        }
        .alt-file-chip em {
          color: var(--aurora-accent-strong);
          font: 10px/1 var(--aurora-font-mono);
          font-style: normal;
        }
        .alt-file-chip-x {
          width: 12px;
          height: 12px;
          padding: 2px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 88%, transparent);
          color: var(--aurora-text-muted);
        }
        .alt-source-strip {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
        }
        .alt-source-strip > span:first-child,
        .alt-chat-line,
        .alt-runtime-row,
        .alt-picker-result {
          color: var(--aurora-text-muted);
          font-size: 11px;
          font-weight: 660;
        }
        .alt-inline-copy {
          margin: 0;
          color: var(--aurora-text-primary);
          font-size: 12px;
          line-height: 1.5;
        }
        .alt-citation {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 16px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 48%, transparent);
          border-radius: 5px;
          color: var(--aurora-accent-strong);
          background: color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent);
          font: 700 10px/1 var(--aurora-font-mono);
          vertical-align: 0.08em;
        }
        .alt-tooltip-card {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 7px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent);
          border-radius: 8px;
          background: var(--aurora-panel-strong);
          padding: 7px 9px;
          color: var(--aurora-text-primary);
          font-size: 11px;
        }
        .alt-tooltip-card em {
          color: var(--aurora-text-muted);
          font-style: normal;
        }
        .alt-icon-dock,
        .alt-mini-actions,
        .alt-step-pips {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .alt-icon-dock button,
        .alt-mini-actions button,
        .alt-step-pips span,
        .alt-media button,
        .alt-button-set button,
        .alt-toggle-sample button,
        .alt-command-capsule button,
        .alt-feedback button,
        .alt-picker-panel button,
        .alt-input-group button,
        .alt-direction button,
        .alt-carousel button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 38%, transparent);
          border-radius: 8px;
          color: var(--aurora-accent-strong);
          background: color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent);
        }
        .alt-icon-dock button,
        .alt-mini-actions button,
        .alt-step-pips span,
        .alt-media button,
        .alt-command-capsule button {
          width: 31px;
          height: 31px;
          padding: 0;
        }
        .alt-step-pips span.active {
          border-color: var(--aurora-accent-pink);
          color: var(--aurora-accent-pink);
          background: color-mix(in srgb, var(--aurora-accent-pink) 13%, transparent);
        }
        .alt-activity-rows {
          display: grid;
          gap: 6px;
        }
        .alt-activity-row,
        .alt-runtime-row {
          display: grid;
          grid-template-columns: auto auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 7px;
          min-height: 26px;
        }
        .alt-runtime-row {
          grid-template-columns: auto minmax(0, 1fr) auto auto;
        }
        .alt-activity-row span,
        .alt-runtime-row span {
          color: var(--aurora-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 650;
        }
        .alt-activity-row em,
        .alt-runtime-row em {
          color: var(--aurora-accent-strong);
          font: 10px/1 var(--aurora-font-mono);
          font-style: normal;
        }
        .alt-cyan { color: var(--aurora-accent-primary); }
        .alt-success { color: var(--aurora-success); }
        .alt-warn { color: var(--aurora-warn); }
        .alt-progress-capsule {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 8px;
          min-width: 210px;
          max-width: 100%;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent);
          border-radius: 999px;
          padding: 6px 8px;
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-control-surface) 78%, transparent);
        }
        .alt-progress-capsule span,
        .alt-progress-capsule strong {
          font-size: 11px;
          white-space: nowrap;
        }
        .alt-progress-capsule strong {
          font-family: var(--aurora-font-mono);
          color: var(--aurora-text-primary);
        }
        .alt-progress-capsule i,
        .alt-progress-control i,
        .alt-media i {
          grid-column: 1 / -1;
          display: block;
          height: 6px;
          overflow: hidden;
          border-radius: 999px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 80%, transparent);
        }
        .alt-progress-capsule b,
        .alt-progress-control b,
        .alt-media b {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--aurora-accent-primary), var(--aurora-accent-pink));
        }
        .alt-inspector-card {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
          padding: 10px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 72%, transparent);
        }
        .alt-inspector-card strong,
        .alt-selection-card strong,
        .alt-card-preview strong,
        .alt-feedback strong,
        .alt-media strong {
          color: var(--aurora-text-primary);
          font-size: 12px;
        }
        .alt-inspector-card span,
        .alt-selection-card dt,
        .alt-selection-card dd,
        .alt-feedback span,
        .alt-media span {
          color: var(--aurora-text-muted);
          font-size: 10.5px;
        }
        .alt-rail-stack {
          display: grid;
          gap: 6px;
        }
        .alt-rail-stack span {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 7px;
          min-height: 26px;
          border-left: 2px solid var(--aurora-accent-primary);
          border-radius: 7px;
          background: color-mix(in srgb, var(--aurora-accent-primary) 6%, transparent);
          padding: 0 8px;
          color: var(--aurora-text-primary);
          font-size: 11px;
          font-weight: 620;
        }
        .alt-rail-stack em {
          color: var(--aurora-accent-strong);
          font: 10px/1 var(--aurora-font-mono);
          font-style: normal;
        }
        .alt-command-capsule,
        .alt-code-pill,
        .alt-picker-command,
        .alt-url-builder {
          display: flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          max-width: 100%;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--aurora-control-surface) 78%, transparent);
          padding: 7px 8px;
          color: var(--aurora-text-primary);
          font-size: 11px;
          font-weight: 650;
        }
        .alt-code-frame {
          display: grid;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent);
          border-radius: 9px;
          background: color-mix(in srgb, #06131d 84%, transparent);
        }
        .alt-code-title {
          display: flex;
          align-items: center;
          gap: 7px;
          border-bottom: 1px solid color-mix(in srgb, var(--aurora-border-default) 80%, transparent);
          padding: 7px 8px;
          color: var(--aurora-text-primary);
          font-size: 11px;
          font-weight: 650;
        }
        .alt-code-frame pre,
        .alt-code-diagnostic pre,
        .alt-code-pill code {
          margin: 0;
          color: var(--aurora-text-primary);
          font: 11px/1.55 var(--aurora-font-mono);
          white-space: pre-wrap;
        }
        .alt-code-frame pre {
          padding: 9px 10px 10px;
        }
        .syn-key { color: #6fd2ff; }
        .syn-fn { color: #ff9fc6; }
        .syn-string { color: #78e6cb; }
        .syn-type { color: #a78bfa; }
        .alt-code-diagnostic {
          display: grid;
          gap: 8px;
        }
        .alt-code-diagnostic span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--aurora-error);
          font-size: 11px;
        }
        .alt-picker-panel {
          display: grid;
          grid-template-columns: 90px minmax(0, 1fr);
          min-height: 118px;
          overflow: hidden;
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
        }
        .alt-picker-panel aside,
        .alt-picker-panel main,
        .alt-file-picker-centered,
        .alt-selection-card {
          display: grid;
          gap: 7px;
          padding: 9px;
        }
        .alt-picker-panel aside {
          border-right: 1px solid var(--aurora-border-default);
          background: color-mix(in srgb, var(--aurora-panel-strong) 68%, transparent);
        }
        .alt-picker-panel strong,
        .alt-picker-panel span,
        .alt-picker-panel main > div,
        .alt-file-picker-centered > div:first-child,
        .alt-picker-result {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--aurora-text-primary);
          font-size: 11px;
        }
        .alt-picker-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .alt-file-picker-centered,
        .alt-selection-card {
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 65%, transparent);
        }
        .alt-file-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .alt-selection-card > div:first-child {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .alt-selection-card dl {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin: 0;
        }
        .alt-selection-card dt {
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .alt-selection-card dd {
          margin: 3px 0 0;
          color: var(--aurora-text-primary);
          font-weight: 680;
        }
        .alt-button-set {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .alt-button-set button {
          min-height: 34px;
          gap: 7px;
          padding: 0 12px;
          color: var(--aurora-text-primary);
          font-weight: 560;
          letter-spacing: 0;
        }
        .alt-button-set button:last-child {
          width: 34px;
          padding: 0;
        }
        .alt-button-set--0 button:first-child {
          border-color: color-mix(in srgb, var(--aurora-accent-primary) 76%, transparent);
          background: linear-gradient(180deg, color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent), color-mix(in srgb, var(--aurora-accent-primary) 11%, transparent));
        }
        .alt-button-set--1 button:first-child {
          background: transparent;
        }
        .alt-button-set--2 button:first-child {
          border-radius: 999px;
        }
        .alt-button-set--3 button:first-child {
          color: var(--aurora-error);
          border-color: color-mix(in srgb, var(--aurora-error) 56%, transparent);
          background: color-mix(in srgb, var(--aurora-error) 10%, transparent);
        }
        .spin {
          animation: auroraAltSpin 900ms linear infinite;
        }
        @keyframes auroraAltSpin {
          to { transform: rotate(360deg); }
        }
        .alt-toggle-sample button {
          min-width: 94px;
          height: 34px;
          gap: 7px;
          padding: 0 12px;
          color: var(--aurora-text-primary);
          font-weight: 600;
        }
        .alt-toggle-sample--0 button,
        .alt-toggle-sample--2 button,
        .alt-toggle-sample--4 button {
          border-color: var(--aurora-accent-primary);
          background: color-mix(in srgb, var(--aurora-accent-primary) 20%, transparent);
        }
        .alt-input-group {
          display: grid;
          gap: 7px;
        }
        .alt-input-group > span,
        .alt-form-control > span,
        .alt-progress-control > span {
          color: var(--aurora-accent-strong);
          font-size: 11px;
          font-weight: 690;
        }
        .alt-input-group > div,
        .alt-form-control > div {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 7px;
          min-height: 34px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 36%, transparent);
          border-radius: 8px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 70%, transparent);
          padding: 0 8px;
        }
        .alt-input-group input,
        .alt-form-control input {
          min-width: 0;
          border: 0;
          color: var(--aurora-text-primary);
          background: transparent;
          font: 600 12px/1 var(--aurora-font-body);
          outline: 0;
        }
        .alt-url-builder {
          width: 100%;
          border-radius: 8px;
          justify-content: space-between;
        }
        .alt-url-builder span {
          color: var(--aurora-text-muted);
        }
        .alt-url-builder strong {
          color: var(--aurora-text-primary);
          font-size: 12px;
        }
        .alt-form-control,
        .alt-progress-control {
          display: grid;
          gap: 7px;
        }
        .alt-progress-control {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
        }
        .alt-progress-control strong {
          color: var(--aurora-text-primary);
          font: 700 11px/1 var(--aurora-font-mono);
        }
        .alt-composer {
          display: grid;
          gap: 0;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 42%, transparent);
          border-radius: 12px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 74%, transparent);
        }
        .alt-composer-text {
          min-height: 58px;
          padding: 12px;
          color: var(--aurora-text-muted);
          font-size: 12px;
        }
        .alt-composer-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          border-top: 1px solid var(--aurora-border-default);
          padding: 8px;
        }
        .alt-composer-bar button {
          display: inline-flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 7px;
          color: var(--aurora-accent-strong);
          background: transparent;
        }
        .alt-composer-bar button:last-child {
          margin-left: auto;
          border-color: color-mix(in srgb, var(--aurora-accent-primary) 42%, transparent);
          background: color-mix(in srgb, var(--aurora-accent-primary) 13%, transparent);
        }
        .alt-conversation {
          display: grid;
          gap: 8px;
        }
        .alt-conversation .user,
        .alt-conversation .ai {
          width: fit-content;
          max-width: 92%;
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
          padding: 8px 10px;
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-panel-strong) 72%, transparent);
          font-size: 11px;
          font-weight: 600;
        }
        .alt-conversation .ai {
          justify-self: end;
          border-color: color-mix(in srgb, var(--aurora-accent-violet) 36%, transparent);
        }
        .alt-conversation .tools .aurora-component-preview {
          min-height: auto;
          padding: 0;
          border: 0;
          background: transparent;
        }
        .alt-sidebar {
          display: grid;
          grid-template-rows: auto auto 1fr auto;
          width: 210px;
          min-height: 154px;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 38%, transparent);
          border-radius: 12px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 84%, transparent);
        }
        .alt-sidebar header,
        .alt-sidebar footer,
        .alt-sidebar nav span,
        .alt-sidebar-search {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .alt-sidebar header,
        .alt-sidebar footer {
          min-height: 34px;
          border-bottom: 1px solid var(--aurora-border-default);
          padding: 0 9px;
          color: var(--aurora-text-primary);
        }
        .alt-sidebar footer {
          border-top: 1px solid var(--aurora-border-default);
          border-bottom: 0;
          margin-top: 8px;
        }
        .alt-sidebar header button {
          margin-left: auto;
          width: 22px;
          height: 22px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent);
          border-radius: 6px;
          color: var(--aurora-accent-strong);
          background: color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent);
        }
        .alt-sidebar-search {
          margin: 8px;
          min-height: 26px;
          border: 1px solid var(--aurora-border-default);
          border-radius: 7px;
          color: var(--aurora-text-muted);
          padding: 0 8px;
          font-size: 10.5px;
        }
        .alt-sidebar nav {
          display: grid;
          gap: 2px;
          padding: 0 8px;
        }
        .alt-sidebar nav span {
          min-height: 25px;
          border-radius: 7px;
          color: var(--aurora-text-secondary, var(--aurora-text-muted));
          padding: 0 7px;
          font-size: 10.5px;
          font-weight: 620;
        }
        .alt-sidebar nav span.active {
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent);
        }
        .alt-sidebar nav em {
          margin-left: auto;
          color: var(--aurora-accent-strong);
          font-style: normal;
        }
        .alt-avatar {
          display: inline-grid;
          width: 24px;
          height: 24px;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 42%, transparent);
          border-radius: 999px;
          color: var(--aurora-accent-strong);
          font: 700 9px/1 var(--aurora-font-mono);
          background: color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent);
        }
        .alt-data-table {
          display: grid;
          overflow: hidden;
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
        }
        .alt-data-table header,
        .alt-data-table > div {
          display: grid;
          grid-template-columns: auto minmax(0, 1.5fr) minmax(60px, 0.6fr) auto auto;
          align-items: center;
          gap: 8px;
          min-height: 30px;
          border-bottom: 1px solid var(--aurora-border-default);
          padding: 0 8px;
        }
        .alt-data-table header {
          grid-template-columns: minmax(0, 1.5fr) minmax(60px, 0.6fr) auto auto;
          color: var(--aurora-accent-strong);
          font: 700 9.5px/1 var(--aurora-font-mono);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .alt-data-table > div:last-child {
          border-bottom: 0;
        }
        .alt-data-table strong {
          min-width: 0;
          overflow: hidden;
          color: var(--aurora-text-primary);
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .alt-data-table > div > span:not(.alt-tiny-badge) {
          color: var(--aurora-text-muted);
          font-size: 10px;
        }
        .alt-data-table button {
          display: inline-flex;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--aurora-border-default);
          border-radius: 6px;
          color: var(--aurora-accent-strong);
          background: transparent;
        }
        .alt-data-cards {
          display: grid;
          gap: 8px;
        }
        .alt-data-cards span {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 7px;
          border: 1px solid var(--aurora-border-default);
          border-radius: 9px;
          padding: 8px;
        }
        .alt-overlay-scene {
          position: relative;
          min-height: 118px;
        }
        .alt-overlay-scene > button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 38%, transparent);
          border-radius: 8px;
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent);
          padding: 7px 9px;
        }
        .alt-overlay-panel {
          position: absolute;
          right: 4px;
          bottom: 4px;
          display: grid;
          gap: 7px;
          width: min(220px, 86%);
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 36%, transparent);
          border-radius: 11px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 94%, transparent);
          box-shadow: 0 18px 40px rgba(0,0,0,.28);
          padding: 10px;
        }
        .alt-overlay-panel header,
        .alt-overlay-panel div {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .alt-overlay-panel strong {
          color: var(--aurora-text-primary);
          font-size: 12px;
        }
        .alt-overlay-panel p {
          margin: 0;
          color: var(--aurora-text-muted);
          font-size: 10.5px;
        }
        .alt-feedback,
        .alt-media,
        .alt-direction {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 9px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent);
          border-radius: 10px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 72%, transparent);
          padding: 10px;
        }
        .alt-feedback > svg,
        .alt-direction > span {
          color: var(--aurora-accent-primary);
        }
        .alt-feedback div,
        .alt-media div {
          display: grid;
          min-width: 0;
          gap: 3px;
        }
        .alt-feedback button,
        .alt-direction button {
          width: 28px;
          height: 28px;
          padding: 0;
        }
        .alt-media {
          grid-template-columns: auto minmax(0, 1fr) auto;
        }
        .alt-media div {
          gap: 6px;
        }
        .alt-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent);
          border-radius: 10px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 70%, transparent);
          padding: 9px;
        }
        .alt-breadcrumb span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--aurora-text-secondary, var(--aurora-text-muted));
          font-size: 11px;
          font-weight: 650;
        }
        .alt-breadcrumb span.active {
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent);
          border-radius: 6px;
          padding: 4px 6px;
        }
        .alt-command {
          display: grid;
          gap: 5px;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 36%, transparent);
          border-radius: 11px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 82%, transparent);
          padding: 8px;
        }
        .alt-command-search,
        .alt-command > div:not(.alt-command-search) {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 7px;
          min-height: 28px;
          border-radius: 7px;
          color: var(--aurora-text-muted);
          padding: 0 8px;
          font-size: 11px;
        }
        .alt-command-search {
          border: 1px solid var(--aurora-border-default);
          color: var(--aurora-text-primary);
        }
        .alt-command > div.active {
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent);
        }
        .alt-palette-preview {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .alt-palette-preview span {
          min-height: 58px;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 10px;
        }
        .alt-token-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .alt-border-sample {
          display: grid;
          min-width: 120px;
          min-height: 70px;
          place-items: center;
          border: 1px solid var(--aurora-border-strong);
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-panel-strong) 72%, transparent);
          font-size: 11px;
          font-weight: 680;
        }
        .alt-border-sample--1 {
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent);
        }
        .alt-border-sample--2 {
          border-top-color: var(--aurora-accent-primary);
        }
        .alt-border-sample--3 {
          border-color: color-mix(in srgb, var(--aurora-accent-violet) 46%, transparent);
        }
        .alt-border-sample--4 {
          border-color: color-mix(in srgb, var(--aurora-accent-pink) 50%, transparent);
        }
        .alt-type-sample {
          display: grid;
          gap: 8px;
        }
        .alt-type-sample span {
          color: var(--aurora-accent-strong);
          font: 700 10px/1 var(--aurora-font-mono);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .alt-type-sample strong {
          color: var(--aurora-text-primary);
          font-size: 16px;
          line-height: 1.25;
        }
        .alt-type-sample em {
          color: var(--aurora-text-muted);
          font: 11px/1.4 var(--aurora-font-mono);
          font-style: normal;
        }
        .alt-type-sample--1 strong { font-size: 22px; }
        .alt-type-sample--3 strong {
          color: var(--aurora-accent-pink);
          font-family: var(--aurora-font-mono);
        }
        .alt-brand {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .alt-brand span {
          display: grid;
          place-items: center;
          gap: 6px;
          min-height: 70px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent);
          border-radius: 10px;
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-panel-strong) 68%, transparent);
          font-size: 11px;
          font-weight: 690;
        }
        .alt-brand span:nth-child(2) { color: var(--aurora-accent-pink); }
        .alt-brand span:nth-child(3) { color: var(--aurora-accent-violet); }
        .alt-direction strong {
          color: var(--aurora-text-primary);
          font-size: 12px;
        }
        .alt-card-preview {
          display: grid;
          gap: 10px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent);
          border-radius: 12px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 70%, transparent);
          padding: 11px;
        }
        .alt-card-preview header {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 8px;
        }
        .alt-card-preview p {
          margin: 0;
          color: var(--aurora-text-muted);
          font-size: 11px;
        }
        .alt-card-preview div:last-child {
          display: flex;
          gap: 5px;
        }
        .alt-card-preview div:last-child span {
          flex: 1;
          height: 5px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent);
        }
        .alt-carousel {
          display: grid;
          grid-template-columns: auto repeat(3, minmax(0, 1fr));
          align-items: center;
          gap: 8px;
        }
        .alt-carousel button {
          width: 30px;
          height: 30px;
          padding: 0;
        }
        .alt-carousel span {
          display: grid;
          gap: 5px;
          min-height: 76px;
          align-content: center;
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
          padding: 8px;
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-panel-strong) 62%, transparent);
        }
        .alt-carousel span.active {
          border-color: var(--aurora-accent-primary);
          background: color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent);
        }
        .alt-carousel strong {
          font-size: 11px;
        }
        .alt-carousel em {
          color: var(--aurora-accent-strong);
          font: 10px/1 var(--aurora-font-mono);
          font-style: normal;
        }
        .alt-chart {
          display: flex;
          align-items: end;
          gap: 8px;
          min-height: 102px;
          border-left: 1px solid var(--aurora-border-default);
          border-bottom: 1px solid var(--aurora-border-default);
          padding: 10px 10px 0;
        }
        .alt-chart span {
          flex: 1;
          min-width: 16px;
          border-radius: 7px 7px 0 0;
          background: linear-gradient(180deg, var(--aurora-accent-primary), color-mix(in srgb, var(--aurora-accent-violet) 70%, transparent));
        }
        .aurora-color-lab {
          display: grid;
          gap: 14px;
          padding: 14px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent);
          border-radius: 12px;
          background: color-mix(in srgb, var(--aurora-panel-strong) 72%, transparent);
        }
        .aurora-color-lab h3 {
          color: var(--aurora-text-primary);
          font-size: 15px;
        }
        .aurora-color-lab p {
          margin-top: 4px;
          color: var(--aurora-text-muted);
          font-size: 12px;
          line-height: 1.5;
        }
        .aurora-color-token-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 9px;
        }
        .aurora-color-token-grid--accent {
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        }
        .aurora-color-token {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
          padding: 10px;
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
          background: color-mix(in srgb, var(--aurora-control-surface) 72%, transparent);
        }
        .aurora-color-token span:first-child {
          color: var(--aurora-text-primary);
          font-size: 12px;
          font-weight: 650;
        }
        .aurora-color-token input {
          width: 32px;
          height: 24px;
          border: 0;
          padding: 0;
          background: transparent;
          cursor: pointer;
        }
        .aurora-color-token code {
          color: var(--aurora-accent-strong);
          font: 10.5px/1 var(--aurora-font-mono);
        }
        .aurora-color-suggestions {
          grid-column: 1 / -1;
          display: flex;
          gap: 5px;
        }
        .aurora-color-suggestions button {
          width: 22px;
          height: 18px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 5px;
          cursor: pointer;
        }
        @media (max-width: 760px) {
          .aurora-alt-grid,
          .aurora-color-token-grid,
          .aurora-color-token-grid--accent {
            grid-template-columns: 1fr;
          }
          .alt-data-table header,
          .alt-data-table > div {
            grid-template-columns: auto minmax(0, 1fr) auto;
          }
          .alt-data-table header span:nth-child(2),
          .alt-data-table > div > span:not(.alt-tiny-badge) {
            display: none;
          }
        }
      `}</style>
      <div className="aurora-alt-head">
        <h2 id={`${section}-alternatives-heading`}>Component alternatives</h2>
        <p>{title} has {complaints.length} tracked complaint{complaints.length === 1 ? "" : "s"}; each complaint now shows five actual {title} variants, not generic direction cards.</p>
      </div>
      {section === "colors" && <ColorTokenLab />}
      {complaints.map((complaint, index) => (
        <ComplaintAlternatives key={`${complaint.text}-${index}`} section={section} complaint={complaint} index={index} />
      ))}
    </section>
  )
}

export default GalleryAlternatives
