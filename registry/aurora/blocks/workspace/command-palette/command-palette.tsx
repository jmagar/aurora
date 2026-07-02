"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Input } from "@/registry/aurora/ui/input"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CommandSection = "recent" | "actions" | "skills" | "navigate"

export interface CommandSectionDef {
  id: string
  label: string
}

export interface CommandItem {
  id: string
  label: string
  description?: string
  /** Section id — one of the palette's `sections` (defaults to recent/actions/skills/navigate) */
  section: string
  /** Keyboard shortcut display (e.g. ["⌘", "K"]) */
  shortcut?: string[]
  /** Inline SVG icon element */
  icon?: React.ReactNode
  onSelect?: () => void
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandItem[]
  onSelect?: (item: CommandItem) => void
  /** Section order + labels. Defaults to the recent/actions/skills/navigate set. */
  sections?: CommandSectionDef[]
  placeholder?: string
  /**
   * Optional scorer: return 0 to drop an item, higher to rank it earlier.
   * When omitted, a case-insensitive substring match on label/description is
   * used and the incoming item order is kept.
   */
  filter?: (query: string, item: CommandItem) => number
}

// ---------------------------------------------------------------------------
// useCommandPalette hook
// ---------------------------------------------------------------------------

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  return { open, setOpen, onOpenChange: setOpen }
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8 2L3.5 8H7L6 12L10.5 6H7L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.5L8.5 5H12L9 7.5L10 11L7 9L4 11L5 7.5L2 5H5.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function NavigateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2L12 7L7 9L5 12L2 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Default items (demo)
// ---------------------------------------------------------------------------

const DEFAULT_ITEMS: CommandItem[] = [
  {
    id: "r1",
    label: "Chat with Claude",
    description: "Recent conversation",
    section: "recent",
    icon: <ClockIcon />,
  },
  {
    id: "r2",
    label: "Aurora design system",
    description: "Opened 2h ago",
    section: "recent",
    icon: <ClockIcon />,
  },
  {
    id: "a1",
    label: "New conversation",
    description: "Start a fresh chat",
    section: "actions",
    shortcut: ["⌘", "N"],
    icon: <ZapIcon />,
  },
  {
    id: "a2",
    label: "Search files",
    description: "Search across your project",
    section: "actions",
    shortcut: ["⌘", "F"],
    icon: <ZapIcon />,
  },
  {
    id: "a3",
    label: "Clear conversation",
    description: "Wipe current context",
    section: "actions",
    shortcut: ["⌘", "⇧", "K"],
    icon: <ZapIcon />,
  },
  {
    id: "s1",
    label: "Code review",
    description: "AI-powered code reviewer",
    section: "skills",
    icon: <StarIcon />,
  },
  {
    id: "s2",
    label: "Security review",
    description: "Audit for vulnerabilities",
    section: "skills",
    icon: <StarIcon />,
  },
  {
    id: "n1",
    label: "Settings",
    description: "Open preferences",
    section: "navigate",
    shortcut: ["⌘", ","],
    icon: <NavigateIcon />,
  },
  {
    id: "n2",
    label: "Documentation",
    description: "Browse Aurora docs",
    section: "navigate",
    icon: <NavigateIcon />,
  },
]

const DEFAULT_SECTIONS: CommandSectionDef[] = [
  { id: "recent", label: "Recent" },
  { id: "actions", label: "Actions" },
  { id: "skills", label: "Skills" },
  { id: "navigate", label: "Navigate" },
]

// ---------------------------------------------------------------------------
// Keyboard shortcut badge
// ---------------------------------------------------------------------------

function KbdBadge({ keys }: { keys: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
      {keys.map((k, i) => (
        <kbd
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1px 5px",
            minWidth: "18px",
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-strong)",
            borderRadius: "5px",
            fontSize: "10px",
            fontFamily: "var(--aurora-font-mono)",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            lineHeight: "16px",
          }}
        >
          {k}
        </kbd>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const KEYFRAMES_CMD = `
@keyframes aurora-cmd-in {
  from { opacity: 0; transform: translate(-50%, calc(-50% - 8px)); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}
@keyframes aurora-backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.aurora-cmd-search-row:focus-within {
  border-bottom-color: var(--aurora-border-strong);
  box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent);
}
`

export function CommandPalette({
  open,
  onOpenChange,
  items = DEFAULT_ITEMS,
  onSelect,
  sections = DEFAULT_SECTIONS,
  placeholder = "Search commands, skills, files…",
  filter,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [activeIdx, setActiveIdx] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // Filter
  const filtered = query.trim()
    ? filter
      ? items
          .map((item) => ({ item, score: filter(query, item) }))
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((x) => x.item)
      : items.filter(
          (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase())
        )
    : items

  // Group by section in order
  const grouped = sections.flatMap(({ id, label }) => {
    const sectionItems = filtered.filter((i) => i.section === id)
    if (sectionItems.length === 0) return []
    return [{ section: id, label, items: sectionItems }]
  })

  const flatItems = grouped.flatMap((g) => g.items)

  // Focus input when open
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Escape key
  React.useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onOpenChange])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % Math.max(flatItems.length, 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => (i - 1 + flatItems.length) % Math.max(flatItems.length, 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = flatItems[activeIdx]
      if (item) fire(item)
    }
  }

  function fire(item: CommandItem) {
    item.onSelect?.()
    onSelect?.(item)
    setQuery("")
    setActiveIdx(0)
    onOpenChange(false)
  }

  // Scroll active item into view
  React.useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector(`[data-active="true"]`) as HTMLElement | null
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIdx])

  if (!open) return null

  let flatIndex = 0

  return (
    <>
      <style>{KEYFRAMES_CMD}</style>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={() => {
          setQuery("")
          setActiveIdx(0)
          onOpenChange(false)
        }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "var(--aurora-overlay)",
          animation: "aurora-backdrop-in 0.12s ease-out",
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          width: "560px",
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--aurora-panel-strong)",
          border: "1px solid var(--aurora-border-strong)",
          borderRadius: "var(--aurora-radius-2)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          overflow: "hidden",
          animation: "aurora-cmd-in 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Search row */}
        <div
          className="aurora-cmd-search-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--aurora-border-default)",
            transition: "border-bottom-color 0.15s, box-shadow 0.15s",
          }}
        >
          <span style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }}>
            <SearchIcon />
          </span>
          <Input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={true}
            aria-controls="cmd-palette-listbox"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIdx(0)
            }}
            placeholder={placeholder}
            aria-label="Search commands"
            className="h-auto border-none px-0 py-0 focus-visible:outline-none"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "14px",
              color: "var(--aurora-text-primary)",
              fontFamily: "var(--aurora-font-sans)",
              caretColor: "var(--aurora-accent-primary)",
            }}
          />
          <KbdBadge keys={["⌘", "K"]} />
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="cmd-palette-listbox"
          role="listbox"
          aria-label="Command results"
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "6px 0",
          }}
        >
          {grouped.length === 0 ? (
            <div
              style={{
                padding: "32px 20px",
                textAlign: "center",
                fontSize: "13px",
                color: "var(--aurora-text-muted)",
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            grouped.map(({ section, label, items: sItems }) => (
              <div key={section}>
                {/* Section header */}
                <div
                  style={{
                    padding: "6px 16px 3px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    color: "var(--aurora-text-muted)",
                  }}
                >
                  {label}
                </div>

                {sItems.map((item) => {
                  const idx = flatIndex++
                  const isActive = idx === activeIdx
                  return (
                    <Button variant="plain" size="unstyled"
                      key={item.id}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onClick={() => fire(item)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "8px 16px",
                        background: isActive ? "var(--aurora-hover-bg)" : "transparent",
                        border: "none",
                        borderLeft: isActive
                          ? "2px solid var(--aurora-accent-primary)"
                          : "2px solid transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.08s",
                      }}
                    >
                      {/* Icon */}
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: isActive
                            ? "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
                            : "var(--aurora-control-surface)",
                          border: "1px solid var(--aurora-border-default)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: isActive ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
                          transition: "background 0.08s, color 0.08s",
                        }}
                      >
                        {item.icon}
                      </span>

                      {/* Label + description */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--aurora-text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontFamily: "var(--aurora-font-sans)",
                          }}
                        >
                          {item.label}
                        </div>
                        {item.description && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--aurora-text-muted)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>

                      {/* Shortcut */}
                      {item.shortcut && <KbdBadge keys={item.shortcut} />}
                    </Button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "7px 16px",
            borderTop: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-panel-medium)",
          }}
        >
          {[
            { keys: ["↑", "↓"], label: "Navigate" },
            { keys: ["↵"], label: "Select" },
            { keys: ["Esc"], label: "Close" },
          ].map(({ keys, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <KbdBadge keys={keys} />
              <span style={{ fontSize: "11px", color: "var(--aurora-text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default CommandPalette
