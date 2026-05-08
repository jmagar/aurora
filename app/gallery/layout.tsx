"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { group: "Foundations", items: [
    { label: "Color tokens", slug: "colors" },
    { label: "Typography", slug: "type" },
    { label: "Spacing & radii", slug: "spacing" },
    { label: "Brand & mark", slug: "brand" },
  ]},
  { group: "Controls", items: [
    { label: "Buttons", slug: "buttons" },
    { label: "Badges", slug: "badges" },
    { label: "Toggle switch", slug: "switch" },
    { label: "Avatar", slug: "avatar" },
    { label: "Progress", slug: "progress" },
  ]},
  { group: "Form elements", items: [
    { label: "Inputs & selects", slug: "forms" },
    { label: "Checkbox & radio", slug: "checkboxes" },
    { label: "Tabs & pills", slug: "tabs" },
  ]},
  { group: "Feedback", items: [
    { label: "Banners", slug: "banners" },
    { label: "Toasts", slug: "toasts" },
    { label: "Tooltip", slug: "tooltip" },
    { label: "Empty states", slug: "empty" },
    { label: "Skeleton", slug: "skeleton" },
  ]},
  { group: "Navigation", items: [
    { label: "Breadcrumb", slug: "breadcrumb" },
    { label: "Pagination", slug: "pagination" },
  ]},
  { group: "Data", items: [
    { label: "Stat cards", slug: "stats" },
    { label: "Tables", slug: "tables" },
    { label: "Filter bars", slug: "filters" },
  ]},
  { group: "Overlays", items: [
    { label: "Modal & dialog", slug: "modals" },
    { label: "Dropdowns", slug: "dropdowns" },
    { label: "Context menu", slug: "context-menu" },
  ]},
  { group: "Chat & AI", items: [
    { label: "Prompt input", slug: "prompt-input" },
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
  ]},
  { group: "Auth & Errors", items: [
    { label: "Login", slug: "login" },
    { label: "OAuth flow", slug: "oauth" },
    { label: "Error pages", slug: "error-pages" },
  ]},
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
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <nav style={{
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        background: "var(--aurora-nav-bg)", borderRight: "1px solid var(--aurora-border-default)",
        padding: "18px 12px 24px", display: "flex", flexDirection: "column", gap: 2,
        scrollbarWidth: "thin", scrollbarColor: "var(--aurora-border-strong) transparent",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px 18px", borderBottom: "1px solid var(--aurora-border-default)", marginBottom: 10 }}>
          <svg viewBox="0 0 48 48" width={28} height={28}>
            <g transform="translate(0,1)">
              <path d="M 8 13 L 24 7 L 40 13 L 24 19 Z" fill="#24536c"/>
              <path d="M 8 21 L 24 15 L 40 21 L 24 27 Z" fill="#1c7fac"/>
              <path d="M 8 29 L 24 23 L 40 29 L 24 35 Z" fill="#29b6f6"/>
              <path d="M 8 37 L 24 31 L 40 37 L 24 43 Z" fill="#67cbfa"/>
            </g>
          </svg>
          <div>
            <div style={{ fontFamily: "var(--font-manrope, system-ui)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em", color: "var(--aurora-text-primary)" }}>
              Lab<span style={{ color: "var(--aurora-accent-primary)" }}>by</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--aurora-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>Aurora DS</div>
          </div>
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

      <main style={{ padding: "40px 48px", maxWidth: 1200 }}>{children}</main>
    </div>
  )
}
