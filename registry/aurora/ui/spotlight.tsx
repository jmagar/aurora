"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpotlightItem {
  /** Group heading the item is filed under. */
  group: string
  /** Primary label shown on the row. */
  label: string
  /** Optional supporting description rendered beneath the label. */
  desc?: string
  /** Optional trailing tag rendered in mono on the right. */
  tag?: string
  /** Optional leading icon (rendered inside the icon tile). */
  icon?: React.ReactNode
  /** Extra search terms not shown but matched against the query. */
  keywords?: string
}

export interface SpotlightProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Spotlight items, in display order; grouped by `group`. */
  items: SpotlightItem[]
  /** Search-field placeholder. */
  placeholder?: string
  /** Field scale. `lg` is the marquee size; `md` is the compact default. */
  size?: "md" | "lg"
  /** Focus the field on mount. */
  autoFocus?: boolean
  /** Expand the results panel as soon as the field is focused. */
  openOnFocus?: boolean
  /** Trailing keyboard shortcut hint shown inside the field. */
  shortcut?: string
  /** Message shown when no item matches the query. */
  emptyMessage?: string
  /** Fired when an item is activated (Enter or click). */
  onSelect?: (item: SpotlightItem) => void
  /** Initial value for the search query. */
  defaultQuery?: string
}

const SIZES = {
  md: { height: "2.5rem", radius: "var(--aurora-radius-2)", icon: 16, type: "0.9rem", pad: "0 0.85rem", gap: "0.6rem" },
  lg: { height: "3rem", radius: "var(--aurora-radius-3)", icon: 18, type: "1.05rem", pad: "0 1.05rem", gap: "0.7rem" },
} as const

const Spotlight = function Spotlight(
  { ref,
    items,
    placeholder = "Search…",
    size = "md",
    autoFocus = false,
    openOnFocus = false,
    shortcut,
    emptyMessage = "No results found.",
    onSelect,
    defaultQuery = "",
    className,
    ...props
  }: SpotlightProps & { ref?: React.Ref<HTMLDivElement> },
) {
  const s = SIZES[size]
  const [query, setQuery] = React.useState(defaultQuery)
  const [focused, setFocused] = React.useState(false)
  const [active, setActive] = React.useState(0)
  const listRef = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()

  const groups = React.useMemo(() => {
    const seen: string[] = []
    for (const item of items) if (!seen.includes(item.group)) seen.push(item.group)
    return seen
  }, [items])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q === "") return items
    return items.filter((item) =>
      `${item.label} ${item.desc ?? ""} ${item.tag ?? ""} ${item.keywords ?? ""}`
        .toLowerCase()
        .includes(q),
    )
  }, [items, query])

  // Clamp the active index to the current result set at read time (avoids setState-in-effect).
  const activeIndex = filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1)

  // Group the filtered results, preserving group order.
  const sections = React.useMemo(() => {
    const map = new Map<string, { item: SpotlightItem; index: number }[]>()
    filtered.forEach((item, index) => {
      const bucket = map.get(item.group) ?? []
      bucket.push({ item, index })
      map.set(item.group, bucket)
    })
    return groups.filter((group) => map.has(group)).map((group) => ({ group, rows: map.get(group)! }))
  }, [filtered, groups])

  const open = openOnFocus ? focused : focused || query.trim() !== ""
  const activeItem = filtered[activeIndex]

  function commit(item: SpotlightItem | undefined) {
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
      setFocused(false)
    }
  }

  // Ensure the highlighted row stays visible.
  React.useEffect(() => {
    if (!open) return
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    node?.scrollIntoView({ block: "nearest" })
  }, [active, open])

  return (
    <div
      ref={ref}
      className={cn("flex flex-col", className)}
      style={{ gap: "0.35rem", fontFamily: "var(--aurora-font-sans)", color: "var(--aurora-text-primary)" }}
      {...props}
    >
      {/* Search field */}
      <div
        className="flex items-center transition-[border-color,box-shadow] duration-150"
        style={{
          height: s.height,
          padding: s.pad,
          gap: s.gap,
          borderRadius: s.radius,
          background: "var(--aurora-control-surface)",
          border: focused
            ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 70%, transparent)"
            : "1px solid var(--aurora-border-strong)",
          boxShadow: focused
            ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent), 0 0 28px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)"
            : "var(--aurora-highlight-strong)",
        }}
      >
        <span aria-hidden style={{ color: "var(--aurora-accent-primary)", display: "inline-flex" }}>
          <SearchIcon size={s.icon} />
        </span>
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          role="combobox"
          aria-autocomplete="list"
          className="min-w-0 flex-1 border-0 bg-transparent outline-none"
          style={{
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: s.type,
            fontWeight: "var(--aurora-weight-body)",
          }}
        />
        {shortcut ? <Kbd>{shortcut}</Kbd> : null}
      </div>

      {/* Expanding results panel */}
      {open ? (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Spotlight results"
          className="overflow-y-auto"
          style={{
            maxHeight: "20rem",
            padding: "0.4rem",
            borderRadius: "var(--aurora-radius-3)",
            border: "1px solid var(--aurora-border-strong)",
            background:
              "linear-gradient(180deg, var(--aurora-panel-strong-top) 0%, var(--aurora-panel-strong) 100%)",
            boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          }}
        >
          {sections.length === 0 ? (
            <div
              style={{
                color: "var(--aurora-text-muted)",
                fontSize: "var(--aurora-type-control)",
                padding: "1rem 0.9rem",
              }}
            >
              {emptyMessage}
            </div>
          ) : (
            sections.map(({ group, rows }) => (
              <div key={group} style={{ marginBottom: "0.25rem" }}>
                <div
                  style={{
                    padding: "0.5rem 0.6rem 0.25rem",
                    color: "var(--aurora-text-muted)",
                    fontFamily: "var(--aurora-font-sans)",
                    fontSize: "0.7rem",
                    fontWeight: "var(--aurora-weight-label)",
                    letterSpacing: "0.1em",
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
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => commit(item)}
                      className="relative flex w-full items-center text-left transition-colors duration-150 focus-visible:outline-none"
                      style={{
                        gap: "0.7rem",
                        padding: "0.5rem 0.65rem",
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
                      {item.icon ? (
                        <span
                          aria-hidden
                          className="inline-flex shrink-0 items-center justify-center"
                          style={{
                            width: "1.85rem",
                            height: "1.85rem",
                            borderRadius: "var(--aurora-radius-1)",
                            border: "1px solid var(--aurora-border-strong)",
                            background: isActive
                              ? "color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-control-surface))"
                              : "var(--aurora-control-surface)",
                            color: isActive
                              ? "var(--aurora-accent-primary)"
                              : "var(--aurora-text-muted)",
                          }}
                        >
                          {item.icon}
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span
                          className="block truncate"
                          style={{
                            color: "var(--aurora-text-primary)",
                            fontFamily: "var(--aurora-font-sans)",
                            fontSize: "0.92rem",
                            fontWeight: "var(--aurora-weight-body)",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.label}
                        </span>
                        {item.desc ? (
                          <span
                            className="block truncate"
                            style={{
                              color: "var(--aurora-text-muted)",
                              fontFamily: "var(--aurora-font-sans)",
                              fontSize: "var(--aurora-type-control)",
                              fontWeight: "var(--aurora-weight-body)",
                              lineHeight: 1.4,
                              marginTop: "0.15rem",
                            }}
                          >
                            {item.desc}
                          </span>
                        ) : null}
                      </span>
                      {item.tag ? (
                        <span
                          className="shrink-0"
                          style={{
                            color: "var(--aurora-text-muted)",
                            fontFamily: "var(--aurora-font-mono)",
                            fontSize: "var(--aurora-type-control)",
                            fontWeight: "var(--aurora-weight-body)",
                          }}
                        >
                          {item.tag}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}

Spotlight.displayName = "Spotlight"

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="inline-flex shrink-0 items-center justify-center"
      style={{
        minWidth: "1.9rem",
        height: "1.9rem",
        padding: "0 0.5rem",
        borderRadius: "10px",
        border: "1px solid var(--aurora-border-strong)",
        background: "color-mix(in srgb, var(--aurora-control-surface) 70%, transparent)",
        color: "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: "0.82rem",
        fontWeight: "var(--aurora-weight-label)",
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
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

export { Spotlight }
export default Spotlight
