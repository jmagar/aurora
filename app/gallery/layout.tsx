"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LabbyLockup } from "@/components/labby-brand"

const SHADCN_PARITY_ITEMS = [
  ["Alert", "alert"],
  ["Alert dialog", "alert-dialog"],
  ["Aspect ratio", "aspect-ratio"],
  ["Calendar", "calendar"],
  ["Card", "card"],
  ["Carousel", "carousel"],
  ["Chart", "chart"],
  ["Collapsible", "collapsible"],
  ["Command", "command"],
  ["Data table", "data-table"],
  ["Date picker", "date-picker"],
  ["Direction", "direction"],
  ["Drawer", "drawer"],
  ["Field", "field"],
  ["Hover card", "hover-card"],
  ["Input", "input"],
  ["Input group", "input-group"],
  ["Input OTP", "input-otp"],
  ["Item", "item"],
  ["Label", "label"],
  ["Menubar", "menubar"],
  ["Native select", "native-select"],
  ["Navigation menu", "navigation-menu"],
  ["Popover", "popover"],
  ["Radio group", "radio-group"],
  ["Resizable", "resizable"],
  ["Scroll area", "scroll-area"],
  ["Select", "select"],
  ["Slider", "slider"],
  ["Sonner", "sonner"],
  ["Table", "table"],
  ["Textarea", "textarea"],
  ["Toggle", "toggle"],
  ["Toggle group", "toggle-group"],
  ["Typography", "typography"],
].map(([label, slug]) => ({ label, slug }))

const AI_PARITY_ITEMS = [
  ["Attachments", "attachments"],
  ["Chain of thought", "chain-of-thought"],
  ["Checkpoint", "checkpoint"],
  ["Confirmation", "confirmation"],
  ["Context", "context"],
  ["Conversation", "conversation"],
  ["Inline citation", "inline-citation"],
  ["Message", "message"],
  ["Model selector", "model-selector"],
  ["Plan", "plan"],
  ["Queue", "queue"],
  ["Reasoning", "reasoning"],
  ["Shimmer", "shimmer"],
  ["Sources", "sources"],
  ["Suggestion", "suggestion"],
  ["Task", "task"],
  ["Tool", "tool"],
  ["Agent", "agent"],
  ["Commit", "commit"],
  ["Environment variables", "environment-variables"],
  ["JSX preview", "jsx-preview"],
  ["Package info", "package-info"],
  ["Sandbox", "sandbox"],
  ["Schema display", "schema-display"],
  ["Snippet", "snippet"],
  ["Stack trace", "stack-trace"],
  ["Test results", "test-results"],
  ["Audio player", "audio-player"],
  ["Mic selector", "mic-selector"],
  ["Persona", "persona"],
  ["Speech input", "speech-input"],
  ["Transcription", "transcription"],
  ["Voice selector", "voice-selector"],
  ["Canvas", "canvas"],
  ["Connection", "connection"],
  ["Controls", "controls"],
  ["Edge", "edge"],
  ["Node", "node"],
  ["Panel", "panel"],
  ["Image", "image"],
  ["Open in chat", "open-in-chat"],
].map(([label, slug]) => ({ label, slug }))

const NAV = [
  { group: "Foundations", items: [
    { label: "Color tokens", slug: "colors" },
    { label: "Typography", slug: "type" },
    { label: "Spacing & radii", slug: "spacing" },
    { label: "Brand & mark", slug: "brand" },
  ]},
  { group: "Controls", items: [
    { label: "Buttons", slug: "buttons" },
    { label: "Button group", slug: "button-group" },
    { label: "Badges", slug: "badges" },
    { label: "Toggle switch", slug: "switch" },
    { label: "Avatar", slug: "avatar" },
    { label: "Progress", slug: "progress" },
    { label: "Spinner", slug: "spinner" },
    { label: "Separator", slug: "separator" },
    { label: "Toolbar", slug: "toolbar" },
    { label: "Kbd", slug: "kbd" },
  ]},
  { group: "Form elements", items: [
    { label: "Inputs & selects", slug: "forms" },
    { label: "Field", slug: "field" },
    { label: "Input group", slug: "input-group" },
    { label: "Input OTP", slug: "input-otp" },
    { label: "Native select", slug: "native-select" },
    { label: "Combobox", slug: "combobox" },
    { label: "Checkbox & radio", slug: "checkboxes" },
    { label: "Radio group", slug: "radio-group" },
    { label: "Slider", slug: "slider" },
    { label: "Number input", slug: "number-input" },
    { label: "Tabs & pills", slug: "tabs" },
  ]},
  { group: "Feedback", items: [
    { label: "Alert", slug: "alert" },
    { label: "Banners", slug: "banners" },
    { label: "Callout", slug: "callout" },
    { label: "Toasts", slug: "toasts" },
    { label: "Tooltip", slug: "tooltip" },
    { label: "Empty states", slug: "empty" },
    { label: "Skeleton", slug: "skeleton" },
    { label: "Status indicator", slug: "status-indicator" },
  ]},
  { group: "Navigation", items: [
    { label: "Breadcrumb", slug: "breadcrumb" },
    { label: "Pagination", slug: "pagination" },
    { label: "Navigation menu", slug: "navigation-menu" },
    { label: "Menubar", slug: "menubar" },
  ]},
  { group: "Data", items: [
    { label: "Stat cards", slug: "stats" },
    { label: "Tables", slug: "tables" },
    { label: "Table", slug: "table" },
    { label: "Filter bars", slug: "filters" },
    { label: "Timeline", slug: "timeline" },
    { label: "Description list", slug: "description-list" },
    { label: "Search results", slug: "search-results" },
    { label: "Listbox", slug: "listbox" },
    { label: "Marketplace", slug: "marketplace" },
  ]},
  { group: "Overlays", items: [
    { label: "Modal & dialog", slug: "modals" },
    { label: "Alert dialog", slug: "alert-dialog" },
    { label: "Accordion", slug: "accordion" },
    { label: "Collapsible", slug: "collapsible" },
    { label: "Dropdowns", slug: "dropdowns" },
    { label: "Context menu", slug: "context-menu" },
    { label: "Popover", slug: "popover" },
    { label: "Hover card", slug: "hover-card" },
    { label: "Sheet", slug: "sheet" },
    { label: "Drawer", slug: "drawer" },
  ]},
  { group: "Chat & AI", items: [
    { label: "Prompt input", slug: "prompt-input" },
    { label: "AI elements", slug: "ai-elements" },
    { label: "Tool calls", slug: "tool-calls" },
    { label: "Thinking", slug: "thinking" },
    { label: "Code block", slug: "code-block" },
    { label: "Artifact", slug: "artifact" },
    { label: "Terminal", slug: "terminal" },
    { label: "Permission prompt", slug: "permission-prompt" },
    { label: "Ask user question", slug: "ask-user-question" },
    { label: "Permissions config", slug: "permissions-dropdown" },
    { label: "Attachments", slug: "attachment" },
    { label: "Command palette", slug: "command-palette" },
    { label: "Sidebar", slug: "sidebar" },
  ]},
  { group: "Content", items: [
    { label: "File picker", slug: "file-picker" },
    { label: "File tree", slug: "file-tree" },
    { label: "Code editor", slug: "code-editor" },
    { label: "Web preview", slug: "web-preview" },
    { label: "Share dialog", slug: "share-dialog" },
    { label: "Aspect ratio", slug: "aspect-ratio" },
    { label: "Card", slug: "card" },
    { label: "Carousel", slug: "carousel" },
    { label: "Chart", slug: "chart" },
    { label: "Item", slug: "item" },
    { label: "Resizable panels", slug: "resizable-panels" },
    { label: "Scroll area", slug: "scroll-area" },
  ]},
  { group: "Auth & Errors", items: [
    { label: "Login", slug: "login" },
    { label: "OAuth flow", slug: "oauth" },
    { label: "Error pages", slug: "error-pages" },
  ]},
  { group: "shadcn parity", items: SHADCN_PARITY_ITEMS },
  { group: "AI elements parity", items: AI_PARITY_ITEMS },
  { group: "Themes", items: [
    { label: "Light mode", slug: "lightmode" },
  ]},
]

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [light, setLight] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("light", light)
    document.documentElement.classList.toggle("dark", !light)
  }, [light])

  return (
    <div className="aurora-gallery-shell">
      <style>{`
        .aurora-gallery-shell {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          min-height: 100vh;
        }

        .aurora-gallery-nav {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          background: var(--aurora-nav-bg);
          border-right: 1px solid var(--aurora-border-default);
          padding: 18px 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .aurora-gallery-main {
          width: 100%;
          min-width: 0;
          max-width: 1200px;
          padding: 40px 48px;
        }

        @media (max-width: 760px) {
          .aurora-gallery-shell {
            display: flex;
            flex-direction: column;
          }

          .aurora-gallery-nav {
            position: sticky;
            top: 0;
            z-index: 20;
            height: auto;
            max-height: 46vh;
            border-right: 0;
            border-bottom: 1px solid var(--aurora-border-default);
            padding: 12px;
          }

          .aurora-gallery-main {
            max-width: none;
            padding: 24px 16px 40px;
          }
        }
      `}</style>
      <nav className="aurora-gallery-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px 18px", borderBottom: "1px solid var(--aurora-border-default)", marginBottom: 10 }}>
          <LabbyLockup markSize={28} wordmarkSize={17} />
        </div>

        {NAV.map((group) => (
          <div key={group.group}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--aurora-text-muted)", padding: "14px 8px 6px" }}>
              {group.group}
            </div>
            {group.items.map((item) => {
              const active = pathname === `/gallery/${item.slug}`
              return (
                <Link key={item.slug} href={`/gallery/${item.slug}`} style={{
                  display: "block", padding: "7px 10px", borderRadius: 8, fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
                  textDecoration: "none",
                  background: active ? "var(--aurora-control-surface)" : "transparent",
                  border: active ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent)" : "1px solid transparent",
                  boxShadow: active ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)" : "none",
                  transition: "background 120ms, color 120ms",
                }}>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}

        <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--aurora-border-default)" }}>
          <button onClick={() => setLight(v => !v)} style={{
            width: "100%", height: 28, padding: "0 10px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: "pointer", background: "linear-gradient(180deg, rgba(255,255,255,.045), rgba(0,0,0,.1))",
            color: "var(--aurora-text-primary)", border: "1px solid var(--aurora-border-strong)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)",
          }}>
            {light ? "Dark mode" : "Light mode"}
          </button>
        </div>
      </nav>

      <main className="aurora-gallery-main">{children}</main>
    </div>
  )
}
