"use client"

import * as React from "react"
import {
  Activity,
  BadgeCheck,
  Blocks,
  Braces,
  ChevronRight,
  CircleDot,
  FileText,
  FolderTree,
  GalleryHorizontalEnd,
  Layers3,
  ListChecks,
  MessageSquare,
  MousePointer2,
  Palette,
  PanelLeft,
  PanelTop,
  Sparkles,
  WandSparkles,
} from "lucide-react"

type Complaint = {
  text: string
  path: string
  mode?: "compact" | "color" | "button" | "border" | "code" | "navigation"
}

type Alternative = {
  title: string
  description: string
  Icon: React.ElementType
  tone: "cyan" | "pink" | "violet" | "success" | "warn"
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

const TONE_COLOR = {
  cyan: "var(--aurora-accent-primary)",
  pink: "var(--aurora-accent-pink)",
  violet: "var(--aurora-accent-violet)",
  success: "var(--aurora-success)",
  warn: "var(--aurora-warn)",
} as const

function alternativesFor(complaint: Complaint): Alternative[] {
  if (complaint.mode === "button") {
    return [
      { title: "Soft command", description: "Low height, lighter 560 label weight, clear pressed inset, strong focus ring.", Icon: MousePointer2, tone: "cyan" },
      { title: "Material edge", description: "Flat blue fill, crisp hover lift, disabled opacity, and no border jitter.", Icon: BadgeCheck, tone: "cyan" },
      { title: "Ghost rail", description: "Mostly textless control with a left icon rail and visible active stripe.", Icon: PanelLeft, tone: "violet" },
      { title: "Segment action", description: "Buttons group into pills with one active state and aligned icon/text rhythm.", Icon: Blocks, tone: "pink" },
      { title: "Loading command", description: "Built-in spinner slot, compact progress shimmer, and stable width across states.", Icon: Activity, tone: "success" },
    ]
  }

  if (complaint.mode === "color") {
    return [
      { title: "Electric material", description: "Bright sky-blue primary, clean rose, and saturated violet with cool neutral surfaces.", Icon: Palette, tone: "cyan" },
      { title: "Studio neon", description: "Higher contrast accents with white-forward text and restrained dark panels.", Icon: Sparkles, tone: "pink" },
      { title: "Glass console", description: "Icy blue foregrounds, violet AI markers, and transparent interaction layers.", Icon: Layers3, tone: "violet" },
      { title: "Signal palette", description: "Semantic colors separate status from brand while staying visibly saturated.", Icon: CircleDot, tone: "success" },
      { title: "Monochrome plus", description: "A quieter base with one strong blue, one rose highlight, and one AI violet.", Icon: WandSparkles, tone: "warn" },
    ]
  }

  if (complaint.mode === "code") {
    return [
      { title: "Token spectrum", description: "Language tokens get distinct function, type, string, number, and comment colors.", Icon: Braces, tone: "cyan" },
      { title: "Diff-aware", description: "Syntax colors pair with subtle add/remove rows and diagnostics in the gutter.", Icon: FileText, tone: "success" },
      { title: "Command console", description: "Monospace-first surface with compact titlebar, status chips, and no heavy frame.", Icon: PanelTop, tone: "violet" },
      { title: "Inline snippet", description: "Short code samples become badge-height code pills with copy on hover.", Icon: Blocks, tone: "pink" },
      { title: "Inspector code", description: "Code sits beside metadata in a split panel for review and debugging contexts.", Icon: ListChecks, tone: "warn" },
    ]
  }

  if (complaint.mode === "navigation") {
    return [
      { title: "Breadcrumb rail", description: "Icon-led hierarchy with separators that read as navigation at a glance.", Icon: FolderTree, tone: "cyan" },
      { title: "Site nav slab", description: "Persistent section navigation with compact icons, counts, and active row treatment.", Icon: PanelLeft, tone: "violet" },
      { title: "Command shell", description: "Command surfaces use search, shortcut, and action structure instead of alert chrome.", Icon: MessageSquare, tone: "pink" },
      { title: "Scroll reset", description: "Route changes pin the content start while preserving sidebar scroll state.", Icon: ChevronRight, tone: "success" },
      { title: "Route merge", description: "Duplicate routes redirect to the strongest canonical demo and disappear from nav.", Icon: GalleryHorizontalEnd, tone: "warn" },
    ]
  }

  if (complaint.mode === "border") {
    return [
      { title: "Hairline", description: "One-pixel cool border with no glow, relying on contrast and spacing.", Icon: Blocks, tone: "cyan" },
      { title: "Inner keyline", description: "Subtle inset line plus flat surface, no wrap-around corner lighting.", Icon: Layers3, tone: "violet" },
      { title: "Split edge", description: "Top edge is lighter than side/bottom for a cleaner elevated control.", Icon: PanelTop, tone: "pink" },
      { title: "Pressed trench", description: "Pressed states use inner shadow and tone shift instead of outer glow.", Icon: MousePointer2, tone: "success" },
      { title: "Radius ladder", description: "Small controls stay tight while large cards keep a controlled eight-to-twelve radius.", Icon: CircleDot, tone: "warn" },
    ]
  }

  return [
    { title: "Micro chip", description: "Badge-height control with one icon, one signal, and optional tooltip instead of prose.", Icon: BadgeCheck, tone: "cyan" },
    { title: "Inline command", description: "Dense row with status first, label second, metadata right-aligned.", Icon: ListChecks, tone: "success" },
    { title: "Split inspector", description: "Compact two-column card where the action stays narrow and details sit on demand.", Icon: PanelLeft, tone: "violet" },
    { title: "Stacked badges", description: "Several small file/action chips replace one large framed panel.", Icon: FileText, tone: "pink" },
    { title: "Floating capsule", description: "Icon-only closed state expands into a bounded capsule without page-wide width.", Icon: Sparkles, tone: "warn" },
  ]
}

function AlternativePreview({ alternative, index }: { alternative: Alternative; index: number }) {
  const color = TONE_COLOR[alternative.tone]

  if (index === 0) {
    return (
      <div className="aurora-alt-preview aurora-alt-preview--chips">
        {[alternative.Icon, FileText, ChevronRight].map((Icon, itemIndex) => (
          <span key={itemIndex} className="aurora-alt-chip" style={{ ["--alt-color" as string]: itemIndex === 0 ? color : "var(--aurora-accent-strong)" }}>
            <Icon size={13} strokeWidth={1.9} />
            {itemIndex === 1 ? <span>config.ts</span> : null}
          </span>
        ))}
      </div>
    )
  }

  if (index === 1) {
    return (
      <div className="aurora-alt-preview aurora-alt-preview--rows">
        {[0, 1, 2].map((row) => (
          <div key={row} className="aurora-alt-row">
            <CircleDot size={12} style={{ color }} />
            <span className="aurora-alt-row-name">{row === 0 ? "primary-edge" : row === 1 ? "worker-pool" : "registry-sync"}</span>
            <span className="aurora-alt-row-meta">{row === 0 ? "live" : row === 1 ? "12ms" : "idle"}</span>
          </div>
        ))}
      </div>
    )
  }

  if (index === 2) {
    return (
      <div className="aurora-alt-preview aurora-alt-preview--split">
        <div className="aurora-alt-icon" style={{ color }}>
          <alternative.Icon size={18} strokeWidth={1.8} />
        </div>
        <div>
          <div className="aurora-alt-titleline">Inspector</div>
          <div className="aurora-alt-subline">bounded details, no page stretch</div>
        </div>
      </div>
    )
  }

  if (index === 3) {
    return (
      <div className="aurora-alt-preview aurora-alt-preview--matrix">
        {[0, 1, 2, 3].map((cell) => (
          <span key={cell} style={{ borderColor: cell === 0 ? color : "var(--aurora-border-default)" }}>
            {cell === 0 ? <alternative.Icon size={13} /> : null}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="aurora-alt-preview aurora-alt-preview--capsule">
      <span className="aurora-alt-dot" style={{ background: color }} />
      <alternative.Icon size={15} strokeWidth={1.9} />
      <span className="aurora-alt-progress">
        <span style={{ width: "46%", background: color }} />
      </span>
    </div>
  )
}

function ComplaintAlternatives({ complaint, index }: { complaint: Complaint; index: number }) {
  const alternatives = alternativesFor(complaint)

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
          <article key={alternative.title} className="aurora-alt-card">
            <AlternativePreview alternative={alternative} index={alternativeIndex} />
            <div>
              <h3>{alternative.title}</h3>
              <p>{alternative.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

type Token = {
  key: string
  label: string
}

const ACCENT_TOKENS: Token[] = [
  { key: "accentPrimary", label: "Accent primary" },
  { key: "accentPink", label: "Accent pink" },
  { key: "accentViolet", label: "Accent violet" },
]

const DERIVED_TOKENS: Token[] = [
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
  return Math.max(0, Math.min(255, value))
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
          max-width: min(1120px, 100%);
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
          grid-template-columns: repeat(5, minmax(150px, 1fr));
          gap: 10px;
        }
        .aurora-alt-card {
          display: grid;
          gap: 10px;
          min-height: 170px;
          border: 1px solid var(--aurora-border-default);
          border-radius: 10px;
          background: color-mix(in srgb, var(--aurora-control-surface) 68%, transparent);
          padding: 10px;
        }
        .aurora-alt-card h3 {
          color: var(--aurora-text-primary);
          font-size: 12px;
          font-weight: 690;
          line-height: 1.25;
        }
        .aurora-alt-card p {
          margin-top: 4px;
          color: var(--aurora-text-secondary, var(--aurora-text-muted));
          font-size: 11px;
          line-height: 1.45;
        }
        .aurora-alt-preview {
          min-height: 66px;
          border-radius: 9px;
          border: 1px solid color-mix(in srgb, var(--aurora-border-strong) 58%, transparent);
          background: linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong) 94%, transparent), color-mix(in srgb, var(--aurora-control-surface) 86%, transparent));
        }
        .aurora-alt-preview--chips,
        .aurora-alt-preview--capsule {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px;
        }
        .aurora-alt-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 24px;
          max-width: 100%;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--alt-color) 42%, transparent);
          color: var(--alt-color);
          background: color-mix(in srgb, var(--alt-color) 10%, transparent);
          padding: 0 8px;
          font-size: 10.5px;
          font-weight: 650;
        }
        .aurora-alt-preview--rows {
          display: grid;
          align-content: center;
          gap: 5px;
          padding: 8px;
        }
        .aurora-alt-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 7px;
          min-height: 19px;
        }
        .aurora-alt-row-name {
          color: var(--aurora-text-primary);
          font-size: 10.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .aurora-alt-row-meta {
          color: var(--aurora-accent-strong);
          font: 10px/1 var(--aurora-font-mono);
        }
        .aurora-alt-preview--split {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 10px;
          padding: 10px;
        }
        .aurora-alt-icon {
          display: inline-flex;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid currentColor;
          background: color-mix(in srgb, currentColor 10%, transparent);
        }
        .aurora-alt-titleline {
          color: var(--aurora-text-primary);
          font-size: 12px;
          font-weight: 700;
        }
        .aurora-alt-subline {
          margin-top: 3px;
          color: var(--aurora-text-muted);
          font-size: 10.5px;
        }
        .aurora-alt-preview--matrix {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          padding: 10px;
        }
        .aurora-alt-preview--matrix span {
          display: grid;
          min-height: 44px;
          place-items: center;
          border: 1px solid;
          border-radius: 8px;
          color: var(--aurora-accent-strong);
          background: color-mix(in srgb, var(--aurora-panel-medium) 62%, transparent);
        }
        .aurora-alt-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
        }
        .aurora-alt-progress {
          position: relative;
          width: 100%;
          height: 7px;
          border-radius: 999px;
          overflow: hidden;
          background: var(--aurora-control-surface);
        }
        .aurora-alt-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
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
        @media (max-width: 980px) {
          .aurora-alt-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 620px) {
          .aurora-alt-grid,
          .aurora-color-token-grid,
          .aurora-color-token-grid--accent {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="aurora-alt-head">
        <h2 id={`${section}-alternatives-heading`}>Alternative directions</h2>
        <p>{title} has {complaints.length} tracked complaint{complaints.length === 1 ? "" : "s"}; each complaint has five selectable variants below.</p>
      </div>
      {section === "colors" && <ColorTokenLab />}
      {complaints.map((complaint, index) => (
        <ComplaintAlternatives key={`${complaint.text}-${index}`} complaint={complaint} index={index} />
      ))}
    </section>
  )
}

export default GalleryAlternatives
