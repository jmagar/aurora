"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Listbox } from "./listbox"
import { isNavigationKey, nextEnabledIndex } from "@/registry/aurora/lib/widget-interactions"

export interface ComboboxOption {
  value: string
  label: string
  description?: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Trigger label shown when nothing is selected. */
  placeholder?: string
  /** Placeholder for the in-dropdown search field. */
  searchPlaceholder?: string
  emptyMessage?: string
  /** Render the dropdown open on first paint (uncontrolled). */
  defaultOpen?: boolean
  className?: string
}

function Combobox({ options, value, defaultValue, onValueChange, placeholder = "Search...", searchPlaceholder = "Search...", emptyMessage = "No results found.", defaultOpen = false, className }: ComboboxProps) {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(defaultOpen)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const current = controlled ? value : internalValue
  const selected = options.find((option) => option.value === current)
  const filtered = options.filter((option) => `${option.label} ${option.description ?? ""}`.toLowerCase().includes(query.toLowerCase()))
  const containerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listboxId = React.useId()

  const close = React.useCallback((restoreFocus = false) => {
    // Move focus before unmounting the popup. Deferring this until the next
    // animation frame lets the focused input disappear first, which briefly
    // drops focus to <body> and breaks the combobox focus-return contract.
    if (restoreFocus) triggerRef.current?.focus()
    setOpen(false)
    setQuery("")
    setActiveIndex(-1)
  }, [])

  const openAt = React.useCallback((edge: "first" | "last" = "first") => {
    setOpen(true)
    const index = edge === "first" ? 0 : Math.max(0, filtered.length - 1)
    setActiveIndex(filtered.length > 0 ? index : -1)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [filtered.length])

  function select(next: string) {
    if (!controlled) setInternalValue(next)
    onValueChange?.(next)
    close(true)
  }

  function navigate(key: string) {
    if (!isNavigationKey(key) || filtered.length === 0) return
    setActiveIndex((index) => nextEnabledIndex(index, key, filtered.map(() => false)))
  }

  // Close on click outside
  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, close])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        close(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, close])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button ref={triggerRef} variant="plain" size="unstyled"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => (open ? close(false) : openAt("first"))}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
            event.preventDefault()
            openAt(event.key === "ArrowUp" || event.key === "End" ? "last" : "first")
          }
        }}
        className="flex h-11 w-full items-center justify-between gap-2 border px-4 transition-[border-color,box-shadow] duration-150 focus-visible:outline-none"
        style={{
          background: "var(--aurora-control-surface)",
          borderColor: open ? "var(--aurora-accent-primary)" : "var(--aurora-border-strong)",
          borderRadius: "999px",
          boxShadow: open
            ? "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent), 0 0 18px color-mix(in srgb, var(--aurora-accent-primary) 26%, transparent)"
            : "none",
          color: selected ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "var(--aurora-type-control)",
          fontWeight: "var(--aurora-weight-label)",
        }}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronsUpDown className="size-4 opacity-70" aria-hidden />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[260px]">
          <Listbox
            id={listboxId}
            className="p-0"
            style={{
              borderRadius: "var(--aurora-radius-2)",
              boxShadow: "var(--aurora-shadow-strong)",
            }}
          >
            <div
              className="flex items-center gap-2 px-3"
              style={{ borderBottom: "1px solid var(--aurora-border-strong)" }}
            >
              <Search className="size-4 shrink-0" style={{ color: "var(--aurora-text-muted)" }} aria-hidden />
              <Input
                unstyled
                ref={inputRef}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value
                  setQuery(nextQuery)
                  const nextCount = options.filter((option) => `${option.label} ${option.description ?? ""}`.toLowerCase().includes(nextQuery.toLowerCase())).length
                  setActiveIndex(nextCount > 0 ? 0 : -1)
                }}
                onKeyDown={(event) => {
                  if (isNavigationKey(event.key)) {
                    event.preventDefault()
                    navigate(event.key)
                  } else if (event.key === "Enter" && activeIndex >= 0) {
                    event.preventDefault()
                    select(filtered[activeIndex].value)
                  } else if (event.key === "Tab") {
                    close(false)
                  }
                }}
                placeholder={searchPlaceholder}
                autoFocus
                className="h-11 w-full min-w-0 border-0 bg-transparent text-[var(--aurora-text-primary)] outline-none placeholder:text-[var(--aurora-text-muted)]"
                style={{
                  fontFamily: "var(--aurora-font-sans)",
                  fontSize: "var(--aurora-type-control)",
                  fontWeight: "var(--aurora-weight-body)",
                }}
              />
            </div>
            <div className="p-2">
              {filtered.length > 0 ? (
                filtered.map((option, index) => {
                  const isCurrent = option.value === current
                  return (
                    <Button
                      key={option.value}
                      id={`${listboxId}-option-${index}`}
                      variant="plain"
                      size="unstyled"
                      role="option"
                      aria-selected={isCurrent}
                      tabIndex={-1}
                      data-active={activeIndex === index ? "true" : undefined}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => select(option.value)}
                      className="flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left outline-none transition-colors hover:bg-[var(--aurora-hover-bg)] data-[active=true]:bg-[var(--aurora-hover-bg)]"
                      style={{
                        color: isCurrent ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)",
                        fontFamily: "var(--aurora-font-sans)",
                        fontSize: "var(--aurora-type-control)",
                        fontWeight: "var(--aurora-weight-label)",
                      }}
                    >
                      <span className="min-w-0 truncate">
                        <span className="truncate">{option.label}</span>
                        {option.description ? (
                          <span className="block truncate" style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-label)", fontWeight: "var(--aurora-weight-body)" }}>{option.description}</span>
                        ) : null}
                      </span>
                      {isCurrent ? <Check className="size-4 shrink-0" style={{ color: "var(--aurora-accent-primary)" }} aria-hidden /> : null}
                    </Button>
                  )
                })
              ) : (
                <div style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)", padding: "10px 12px" }}>{emptyMessage}</div>
              )}
            </div>
          </Listbox>
        </div>
      )}
    </div>
  )
}

export { Combobox }
export default Combobox
