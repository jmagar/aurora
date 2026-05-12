"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon } from "lucide-react"
import { LabbyLockup } from "@/components/labby-brand"

const NAV = [
  { group: "Foundations", items: [
    { label: "Color tokens", slug: "colors" },
    { label: "Typography", slug: "type" },
    { label: "Spacing & radii", slug: "spacing" },
    { label: "Brand & mark", slug: "brand" },
    { label: "Direction", slug: "direction" },
  ]},
  { group: "Controls", items: [
    { label: "Buttons", slug: "buttons" },
    { label: "Button group", slug: "button-group" },
    { label: "Badges", slug: "badges" },
    { label: "Toggle switch", slug: "switch" },
    { label: "Toggle", slug: "toggle" },
    { label: "Toggle group", slug: "toggle-group" },
    { label: "Avatar", slug: "avatar" },
    { label: "Progress", slug: "progress" },
    { label: "Spinner", slug: "spinner" },
    { label: "Separator", slug: "separator" },
    { label: "Toolbar", slug: "toolbar" },
    { label: "Kbd", slug: "kbd" },
  ]},
  { group: "Form elements", items: [
    { label: "Inputs & selects", slug: "forms" },
    { label: "Input", slug: "input" },
    { label: "Field", slug: "field" },
    { label: "Label", slug: "label" },
    { label: "Input group", slug: "input-group" },
    { label: "Input OTP", slug: "input-otp" },
    { label: "Native select", slug: "native-select" },
    { label: "Select", slug: "select" },
    { label: "Combobox", slug: "combobox" },
    { label: "Checkbox & radio", slug: "checkboxes" },
    { label: "Radio group", slug: "radio-group" },
    { label: "Slider", slug: "slider" },
    { label: "Number input", slug: "number-input" },
    { label: "Textarea", slug: "textarea" },
    { label: "Calendar", slug: "calendar" },
    { label: "Date picker", slug: "date-picker" },
    { label: "Tabs & pills", slug: "tabs" },
  ]},
  { group: "Feedback", items: [
    { label: "Alert", slug: "alert" },
    { label: "Banners", slug: "banners" },
    { label: "Callout", slug: "callout" },
    { label: "Toasts", slug: "toasts" },
    { label: "Sonner", slug: "sonner" },
    { label: "Tooltip", slug: "tooltip" },
    { label: "Empty states", slug: "empty" },
    { label: "Skeleton", slug: "skeleton" },
    { label: "Status indicator", slug: "status-indicator" },
    { label: "Shimmer", slug: "shimmer" },
    { label: "Confirmation", slug: "confirmation" },
  ]},
  { group: "Navigation", items: [
    { label: "Breadcrumb", slug: "breadcrumb" },
    { label: "Pagination", slug: "pagination" },
    { label: "Command", slug: "command" },
    { label: "Navigation menu", slug: "navigation-menu" },
    { label: "Menubar", slug: "menubar" },
  ]},
  { group: "Data", items: [
    { label: "Stat cards", slug: "stats" },
    { label: "Tables", slug: "tables" },
    { label: "Data table", slug: "data-table" },
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
    { label: "Share dialog", slug: "share-dialog" },
  ]},
  { group: "Chat & AI", items: [
    { label: "Prompt input", slug: "prompt-input" },
    { label: "AI elements", slug: "ai-elements" },
    { label: "Message", slug: "message" },
    { label: "Conversation", slug: "conversation" },
    { label: "Model selector", slug: "model-selector" },
    { label: "Persona", slug: "persona" },
    { label: "Open in chat", slug: "open-in-chat" },
    { label: "Reasoning", slug: "reasoning" },
    { label: "Tool calls", slug: "tool-calls" },
    { label: "Tool", slug: "tool" },
    { label: "Thinking", slug: "thinking" },
    { label: "Chain of thought", slug: "chain-of-thought" },
    { label: "Plan", slug: "plan" },
    { label: "Queue", slug: "queue" },
    { label: "Task", slug: "task" },
    { label: "Suggestion", slug: "suggestion" },
    { label: "Code block", slug: "code-block" },
    { label: "Artifact", slug: "artifact" },
    { label: "Terminal", slug: "terminal" },
    { label: "Permission prompt", slug: "permission-prompt" },
    { label: "Ask user question", slug: "ask-user-question" },
    { label: "Permissions config", slug: "permissions-dropdown" },
    { label: "Command palette", slug: "command-palette" },
    { label: "Sidebar", slug: "sidebar" },
  ]},
  { group: "Runtime & execution", items: [
    { label: "Agent", slug: "agent" },
    { label: "Checkpoint", slug: "checkpoint" },
    { label: "Commit", slug: "commit" },
    { label: "Context panel", slug: "context" },
    { label: "Environment variables", slug: "environment-variables" },
    { label: "Package info", slug: "package-info" },
    { label: "Schema display", slug: "schema-display" },
    { label: "Sandbox", slug: "sandbox" },
    { label: "Snippet", slug: "snippet" },
    { label: "JSX preview", slug: "jsx-preview" },
    { label: "Stack trace", slug: "stack-trace" },
    { label: "Test results", slug: "test-results" },
    { label: "Panel", slug: "panel" },
    { label: "Control strip", slug: "controls" },
    { label: "Canvas", slug: "canvas" },
    { label: "Connection", slug: "connection" },
    { label: "Edge", slug: "edge" },
    { label: "Node", slug: "node" },
  ]},
  { group: "Media & voice", items: [
    { label: "Audio player", slug: "audio-player" },
    { label: "Mic selector", slug: "mic-selector" },
    { label: "Speech input", slug: "speech-input" },
    { label: "Transcription", slug: "transcription" },
    { label: "Voice selector", slug: "voice-selector" },
  ]},
  { group: "Content", items: [
    { label: "Attachment chip", slug: "attachment" },
    { label: "AI attachments", slug: "attachments" },
    { label: "Sources", slug: "sources" },
    { label: "Inline citation", slug: "inline-citation" },
    { label: "File picker", slug: "file-picker" },
    { label: "File tree", slug: "file-tree" },
    { label: "Code editor", slug: "code-editor" },
    { label: "Web preview", slug: "web-preview" },
    { label: "Aspect ratio", slug: "aspect-ratio" },
    { label: "Card", slug: "card" },
    { label: "Carousel", slug: "carousel" },
    { label: "Chart", slug: "chart" },
    { label: "Image", slug: "image" },
    { label: "Item", slug: "item" },
    { label: "Resizable panels", slug: "resizable-panels" },
    { label: "Resizable", slug: "resizable" },
    { label: "Scroll area", slug: "scroll-area" },
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

const NAV_SLUG_ALIASES: Record<string, string> = {
  tokens: "colors",
  typography: "type",
  button: "buttons",
  badge: "badges",
  banner: "banners",
  toast: "toasts",
  "empty-state": "empty",
  "stat-card": "stats",
  "filter-bar": "filters",
  dialog: "modals",
  "dropdown-menu": "dropdowns",
  "error-page": "error-pages",
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [light, setLight] = React.useState(false)
  const [navOpen, setNavOpen] = React.useState(false)

  // Apply theme class
  React.useEffect(() => {
    const previousColorScheme = document.documentElement.style.colorScheme
    document.documentElement.classList.toggle("light", light)
    document.documentElement.classList.toggle("dark", !light)
    document.documentElement.style.colorScheme = light ? "light" : "dark"
    return () => {
      document.documentElement.style.colorScheme = previousColorScheme
    }
  }, [light])

  // Close mobile nav on route change
  React.useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  // Lock body scroll while mobile nav is open (iOS-safe technique)
  React.useEffect(() => {
    if (!navOpen) return
    const scrollY = window.scrollY
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, scrollY)
    }
  }, [navOpen])

  const activeSlug = React.useMemo(() => {
    const section = pathname.split("/").pop() ?? ""
    const normalized = section.startsWith("ai-") ? section.slice(3) : section
    return NAV_SLUG_ALIASES[normalized] ?? normalized
  }, [pathname])

  // Derive the current page label for the mobile header breadcrumb
  const activeLabel = React.useMemo(() => {
    for (const group of NAV) {
      const found = group.items.find((item) => item.slug === activeSlug)
      if (found) return found.label
    }
    return null
  }, [activeSlug])

  return (
    <div className="aurora-gallery-shell" data-nav-open={navOpen ? "true" : "false"}>
      <a href="#gallery-main" className="aurora-gallery-skip-link">
        Skip to content
      </a>

      {/* Backdrop — mobile only, closes nav when tapped */}
      <div
        className="aurora-gallery-backdrop"
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
      />

      <style>{`
        /* ── Shell ─────────────────────────────────────────────────────── */
        .aurora-gallery-shell {
          display: grid;
          grid-template-columns: 248px minmax(0, 1fr);
          min-height: 100vh;
        }

        /* ── Skip link ─────────────────────────────────────────────────── */
        .aurora-gallery-skip-link {
          position: fixed;
          left: 16px;
          top: 16px;
          z-index: 60;
          border-radius: 10px;
          border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 46%, transparent);
          background: var(--aurora-panel-strong);
          color: var(--aurora-text-primary);
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transform: translateY(-160%);
          transition: transform 120ms ease;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
        }
        .aurora-gallery-skip-link:focus-visible {
          transform: translateY(0);
          outline: none;
          box-shadow:
            0 0 0 2px color-mix(in srgb, var(--aurora-panel-strong) 82%, transparent),
            0 0 0 4px color-mix(in srgb, var(--aurora-accent-primary) 52%, transparent),
            0 10px 28px rgba(0, 0, 0, 0.28);
        }

        /* ── Backdrop ──────────────────────────────────────────────────── */
        .aurora-gallery-backdrop {
          display: none;
        }

        /* ── Sidebar nav ───────────────────────────────────────────────── */
        .aurora-gallery-nav {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          scrollbar-width: thin;
          background: var(--aurora-nav-bg);
          border-right: 1px solid var(--aurora-border-default);
          padding: 18px 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* ── Nav header ────────────────────────────────────────────────── */
        .aurora-gallery-nav-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 0 4px 16px;
          border-bottom: 1px solid var(--aurora-border-default);
          flex-shrink: 0;
        }

        .aurora-gallery-brand-link {
          border-radius: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .aurora-gallery-brand-link:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 2px color-mix(in srgb, var(--aurora-nav-bg) 88%, transparent),
            0 0 0 4px color-mix(in srgb, var(--aurora-accent-primary) 44%, transparent);
        }

        .aurora-gallery-nav-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ── Nav body (scrollable list) ────────────────────────────────── */
        .aurora-gallery-nav-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          flex: 1;
          min-height: 0;
        }

        .aurora-gallery-section-heading {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--aurora-text-muted);
          padding: 14px 8px 6px;
          user-select: none;
        }

        /* ── Nav links ─────────────────────────────────────────────────── */
        .aurora-gallery-link {
          display: block;
          padding: 7px 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: var(--aurora-text-muted);
          text-decoration: none;
          background: transparent;
          border: 1px solid transparent;
          transition:
            background-color 120ms ease,
            border-color 120ms ease,
            box-shadow 120ms ease,
            color 120ms ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          min-height: 36px;
          display: flex;
          align-items: center;
        }
        .aurora-gallery-link:hover {
          color: var(--aurora-text-primary);
          background: color-mix(in srgb, var(--aurora-control-surface) 74%, transparent);
          border-color: color-mix(in srgb, var(--aurora-border-strong) 44%, transparent);
        }
        .aurora-gallery-link[aria-current="page"] {
          font-weight: 600;
          color: var(--aurora-text-primary);
          background: var(--aurora-control-surface);
          border-color: color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent);
        }
        .aurora-gallery-link:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 2px color-mix(in srgb, var(--aurora-nav-bg) 82%, transparent),
            0 0 0 4px color-mix(in srgb, var(--aurora-accent-primary) 44%, transparent);
        }

        /* ── Shared button style ───────────────────────────────────────── */
        .aurora-gallery-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 32px;
          min-width: 32px;
          border-radius: 9px;
          border: 1px solid var(--aurora-border-strong);
          background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(0,0,0,.1));
          color: var(--aurora-text-primary);
          cursor: pointer;
          padding: 0 10px;
          font-size: 12px;
          font-weight: 600;
          font-family: var(--aurora-font-sans);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition:
            border-color 120ms ease,
            background-color 120ms ease,
            color 120ms ease,
            box-shadow 120ms ease;
          white-space: nowrap;
          user-select: none;
        }
        .aurora-gallery-button:hover {
          border-color: color-mix(in srgb, var(--aurora-accent-primary) 24%, var(--aurora-border-strong));
          background: color-mix(in srgb, var(--aurora-control-surface) 82%, rgba(0, 0, 0, 0.12));
        }
        .aurora-gallery-button:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 2px color-mix(in srgb, var(--aurora-nav-bg) 82%, transparent),
            0 0 0 4px color-mix(in srgb, var(--aurora-accent-primary) 44%, transparent);
        }

        /* Icon-only button variant */
        .aurora-gallery-button--icon {
          padding: 0;
          width: 32px;
          height: 32px;
          min-width: 32px;
          min-height: 32px;
        }

        /* ── Main content area ─────────────────────────────────────────── */
        .aurora-gallery-main {
          width: 100%;
          min-width: 0;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px clamp(20px, 4vw, 48px) 64px;
        }

        /* ── Mobile-only elements ─────────────────────────────────────── */
        .aurora-gallery-mobile-crumb {
          display: none;
        }
        .aurora-gallery-menu-toggle {
          display: none;
        }

        /* ── Mobile collapsible wrapper ────────────────────────────────── */
        .aurora-gallery-nav-collapse {
          /* desktop: always open, no animation */
          display: contents;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* MOBILE  ≤ 760px                                                 */
        /* ═══════════════════════════════════════════════════════════════ */
        @media (max-width: 760px) {
          /* Shell becomes single column */
          .aurora-gallery-shell {
            display: flex;
            flex-direction: column;
          }

          /* Nav becomes a sticky top bar */
          .aurora-gallery-nav {
            position: sticky;
            top: 0;
            z-index: 20;
            height: auto;
            overflow: visible;
            border-right: 0;
            border-bottom: 1px solid var(--aurora-border-default);
            padding: 10px 12px 0;
            gap: 0;
          }

          /* Header: brand left, actions right, breadcrumb below */
          .aurora-gallery-nav-header {
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 0;
            min-height: 48px;
          }

          /* Show mobile-only elements */
          .aurora-gallery-menu-toggle {
            display: inline-flex;
          }

          /* Active page breadcrumb between brand and actions */
          .aurora-gallery-mobile-crumb {
            display: block;
            flex: 1;
            font-size: 13px;
            font-weight: 600;
            color: var(--aurora-text-primary);
            padding: 0 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          /* Backdrop — dim the content behind open nav */
          .aurora-gallery-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 18;
            background: rgba(0, 0, 0, 0.42);
            backdrop-filter: blur(1px);
            -webkit-backdrop-filter: blur(1px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 220ms ease;
          }
          .aurora-gallery-shell[data-nav-open="true"] .aurora-gallery-backdrop {
            opacity: 1;
            pointer-events: auto;
          }

          /* Animated nav body — uses grid-template-rows for smooth height animation */
          .aurora-gallery-nav-collapse {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }
          .aurora-gallery-nav[data-open="true"] .aurora-gallery-nav-collapse {
            grid-template-rows: 1fr;
          }

          /* Inner scroll container — must have min-height: 0 for the grid animation */
          .aurora-gallery-nav-body {
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: min(66vh, 540px);
            -webkit-overflow-scrolling: touch;
            padding: 6px 0 12px;
            border-top: 1px solid var(--aurora-border-default);
            flex: none;
          }

          /* Main: tighter padding on mobile */
          .aurora-gallery-main {
            max-width: none;
            padding: 20px 16px 48px;
          }
        }
      `}</style>

      <nav
        className="aurora-gallery-nav"
        aria-label="Component gallery"
        data-open={navOpen ? "true" : "false"}
      >
        <div className="aurora-gallery-nav-header">
          <Link href="/gallery/buttons" className="aurora-gallery-brand-link" aria-label="Aurora Design System home">
            <LabbyLockup markSize={28} wordmarkSize={17} />
          </Link>

          {/* Current page name — mobile only */}
          {activeLabel && (
            <span className="aurora-gallery-mobile-crumb" aria-hidden="true">
              {activeLabel}
            </span>
          )}

          <div className="aurora-gallery-nav-actions">
            {/* Theme toggle */}
            <button
              type="button"
              className="aurora-gallery-button aurora-gallery-button--icon"
              aria-pressed={light}
              aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
              title={light ? "Dark mode" : "Light mode"}
              onClick={() => setLight((v) => !v)}
            >
              {light ? <Moon size={15} strokeWidth={2} /> : <Sun size={15} strokeWidth={2} />}
            </button>

            {/* Mobile nav toggle — hidden on desktop via CSS */}
            <button
              type="button"
              className="aurora-gallery-button aurora-gallery-button--icon aurora-gallery-menu-toggle"
              aria-controls="gallery-nav-body"
              aria-expanded={navOpen}
              aria-label={navOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? <X size={15} strokeWidth={2.25} /> : <Menu size={15} strokeWidth={2.25} />}
            </button>
          </div>
        </div>

        {/* Animated collapse wrapper — on desktop this is display:contents */}
        <div className="aurora-gallery-nav-collapse">
          <div id="gallery-nav-body" className="aurora-gallery-nav-body">
            {NAV.map((group) => (
              <div key={group.group}>
                <div className="aurora-gallery-section-heading">{group.group}</div>
                {group.items.map((item) => {
                  const active = activeSlug === item.slug
                  return (
                    <Link
                      key={item.slug}
                      href={`/gallery/${item.slug}`}
                      className="aurora-gallery-link"
                      aria-current={active ? "page" : undefined}
                      onClick={() => setNavOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main id="gallery-main" className="aurora-gallery-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
