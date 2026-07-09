"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CommandItem {
  /** Group heading the item is filed under (also drives the filter chips). */
  group: string
  /** Primary label shown on the row. */
  label: string
  /** Optional supporting description rendered beneath the label. */
  description?: string
  /** Optional leading icon (rendered inside the icon tile). */
  icon?: React.ReactNode
  /** Optional trailing keyboard shortcut hint. */
  shortcut?: string
}

export interface CommandProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Command/search items. */
  items: CommandItem[]
  /** Search-field placeholder. */
  placeholder?: string
  /** Render the palette expanded on first paint. */
  defaultOpen?: boolean
  /** Message shown when no item matches the query. */
  emptyMessage?: string
  /** Fired when an item is activated (Enter or click). */
  onSelect?: (item: CommandItem) => void
}

const ALL = "All"

function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        minWidth: "1.65rem",
        height: "1.65rem",
        padding: "0 0.45rem",
        borderRadius: "8px",
        border: "1px solid var(--aurora-border-strong)",
        background: "color-mix(in srgb, var(--aurora-control-surface) 70%, transparent)",
        color: "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: "0.78rem",
        fontWeight: "var(--aurora-weight-label)",
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  )
}

function Command(
  { ref, items, placeholder = "Type a command or search…", defaultOpen = false, emptyMessage = "No results found.", onSelect, className, ...props }: CommandProps & { ref?: React.Ref<HTMLDivElement> },
) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<string>(ALL)
  const [active, setActive] = React.useState(0)
  const listRef = React.useRef<HTMLDivElement>(null)

  const groups = React.useMemo(() => {
    const seen: string[] = []
    for (const item of items) if (!seen.includes(item.group)) seen.push(item.group)
    return seen
  }, [items])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const inGroup = filter === ALL || item.group === filter
      const matches = q === "" || `${item.label} ${item.description ?? ""}`.toLowerCase().includes(q)
      return inGroup && matches
    })
  }, [items, query, filter])

  // Clamp the active index to the current result set at read time (avoids setState-in-effect).
  const activeIndex = filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1)

  // Group the filtered results, preserving group order.
  const sections = React.useMemo(() => {
    const map = new Map<string, { item: CommandItem; index: number }[]>()
    filtered.forEach((item, index) => {
      const bucket = map.get(item.group) ?? []
      bucket.push({ item, index })
      map.set(item.group, bucket)
    })
    return groups.filter((group) => map.has(group)).map((group) => ({ group, rows: map.get(group)! }))
  }, [filtered, groups])

  const activeItem = filtered[activeIndex]

  function commit(item: CommandItem | undefined) {
    if (!item) return
    onSelect?.(item)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((current) => (filtered.length === 0 ? 0 : (current + 1) % filtered.length))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((current) => (filtered.length === 0 ? 0 : (current - 1 + filtered.length) % filtered.length))
    } else if (event.key === "Enter") {
      event.preventDefault()
      commit(activeItem)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
  }

  // Ensure the highlighted row stays visible.
  React.useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    node?.scrollIntoView({ block: "nearest" })
  }, [active])

  if (!open) {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 border px-4 transition-[border-color,box-shadow] duration-150 focus-visible:outline-none"
          style={{
            height: "2.75rem",
            borderRadius: "999px",
            background: "var(--aurora-control-surface)",
            borderColor: "var(--aurora-border-strong)",
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-control)",
            fontWeight: "var(--aurora-weight-label)",
          }}
        >
          <SearchIcon />
          <span>{placeholder}</span>
          <Kbd className="ml-2">⌘K</Kbd>
        </button>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-label="Command palette"
      className={cn("flex flex-col overflow-hidden", className)}
      style={{
        borderRadius: "var(--aurora-radius-3)",
        border: "1px solid var(--aurora-border-strong)",
        background:
          "linear-gradient(180deg, var(--aurora-panel-strong) 0%, var(--aurora-panel-medium) 100%)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        color: "var(--aurora-text-primary)",
        fontFamily: "var(--aurora-font-sans)",
      }}
      onKeyDown={onKeyDown}
      {...props}
    >
      {/* Search header */}
      <div
        className="flex items-center gap-3 px-5"
        style={{ height: "4rem", borderBottom: "1px solid var(--aurora-border-strong)" }}
      >
        <span style={{ color: "var(--aurora-text-muted)" }}>
          <SearchIcon size={20} />
        </span>
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent outline-none"
          style={{
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "1.35rem",
            fontWeight: "var(--aurora-weight-body)",
          }}
        />
        <Kbd>esc</Kbd>
      </div>

      {/* Filter chips */}
      <div
        className="flex flex-wrap items-center gap-2 px-5"
        style={{ paddingTop: "0.9rem", paddingBottom: "0.9rem", borderBottom: "1px solid var(--aurora-border-strong)" }}
      >
        {[ALL, ...groups].map((group) => {
          const isActive = filter === group
          return (
            <button
              key={group}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(group)}
              className="inline-flex items-center border transition-colors duration-150 focus-visible:outline-none"
              style={{
                height: "2.25rem",
                padding: "0 1rem",
                borderRadius: "999px",
                background: isActive
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
                  : "var(--aurora-control-surface)",
                borderColor: isActive
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 55%, transparent)"
                  : "var(--aurora-border-strong)",
                color: isActive ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "var(--aurora-type-control)",
                fontWeight: "var(--aurora-weight-label)",
              }}
            >
              {group}
            </button>
          )
        })}
      </div>

      {/* Results */}
      <div
        ref={listRef}
        role="listbox"
        aria-label="Commands"
        className="min-h-0 flex-1 overflow-y-auto"
        style={{ padding: "0.75rem 0.85rem" }}
      >
        {sections.length === 0 ? (
          <div style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)", padding: "1rem 0.75rem" }}>
            {emptyMessage}
          </div>
        ) : (
          sections.map(({ group, rows }) => (
            <div key={group} style={{ marginBottom: "0.35rem" }}>
              <div
                style={{
                  padding: "0.75rem 0.9rem 0.4rem",
                  color: "var(--aurora-text-muted)",
                  fontFamily: "var(--aurora-font-sans)",
                  fontSize: "0.78rem",
                  fontWeight: "var(--aurora-weight-label)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {group}
              </div>
              {rows.map(({ item, index }) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={`${item.group}-${item.label}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-active={isActive}
                    onMouseMove={() => setActive(index)}
                    onClick={() => commit(item)}
                    className="relative flex w-full items-center gap-4 text-left transition-colors duration-150 focus-visible:outline-none"
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "var(--aurora-radius-2)",
                      border: isActive
                        ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 55%, transparent)"
                        : "1px solid transparent",
                      background: isActive
                        ? "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)"
                        : "transparent",
                      boxShadow: isActive
                        ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 24%, transparent), 0 0 22px color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent)"
                        : "none",
                    }}
                  >
                    {isActive ? (
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "3px",
                          height: "1.6rem",
                          borderRadius: "999px",
                          background: "var(--aurora-accent-primary)",
                        }}
                      />
                    ) : null}
                    <span
                      className="inline-flex shrink-0 items-center justify-center"
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "var(--aurora-radius-1)",
                        border: "1px solid var(--aurora-border-strong)",
                        background: isActive
                          ? "color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-control-surface))"
                          : "var(--aurora-control-surface)",
                        color: isActive ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate"
                        style={{
                          color: "var(--aurora-text-primary)",
                          fontFamily: "var(--aurora-font-sans)",
                          fontSize: "1.15rem",
                          fontWeight: "var(--aurora-weight-label)",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.label}
                      </span>
                      {item.description ? (
                        <span
                          className="block truncate"
                          style={{
                            color: "var(--aurora-text-muted)",
                            fontFamily: "var(--aurora-font-sans)",
                            fontSize: "var(--aurora-type-control)",
                            fontWeight: "var(--aurora-weight-body)",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    {item.shortcut ? (
                      <span
                        className="shrink-0"
                        style={{
                          color: "var(--aurora-text-muted)",
                          fontFamily: "var(--aurora-font-mono)",
                          fontSize: "var(--aurora-type-control)",
                          fontWeight: "var(--aurora-weight-label)",
                        }}
                      >
                        {item.shortcut}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between gap-3 px-5"
        style={{ height: "3.75rem", borderTop: "1px solid var(--aurora-border-strong)" }}
      >
        <div className="min-w-0 truncate" style={{ fontSize: "var(--aurora-type-control)" }}>
          {activeItem ? (
            <>
              <span style={{ color: "var(--aurora-text-primary)", fontWeight: "var(--aurora-weight-label)" }}>
                {activeItem.label}
              </span>
              {activeItem.description ? (
                <span style={{ color: "var(--aurora-text-muted)" }}>{" — "}{activeItem.description}</span>
              ) : null}
            </>
          ) : (
            <span style={{ color: "var(--aurora-text-muted)" }}>No selection</span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>↵</Kbd>
          <span style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)" }}>Open</span>
        </div>
      </div>
    </div>
  )
}

function SearchIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export { Command }
export default Command
