"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Listbox } from "./listbox"

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
  const current = controlled ? value : internalValue
  const selected = options.find((option) => option.value === current)
  const filtered = options.filter((option) => `${option.label} ${option.description ?? ""}`.toLowerCase().includes(query.toLowerCase()))
  const containerRef = React.useRef<HTMLDivElement>(null)

  function select(next: string) {
    if (!controlled) setInternalValue(next)
    onValueChange?.(next)
    setOpen(false)
    setQuery("")
  }

  // Close on click outside
  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button variant="plain" size="unstyled"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((next) => !next)}
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
        <div className="absolute z-50 mt-2 w-full min-w-[260px]">
          <Listbox
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
                value={query}
                onChange={(event) => setQuery(event.target.value)}
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
                filtered.map((option) => {
                  const isCurrent = option.value === current
                  return (
                    <Button
                      key={option.value}
                      variant="plain"
                      size="unstyled"
                      role="option"
                      aria-selected={isCurrent}
                      onClick={() => select(option.value)}
                      className="flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left outline-none transition-colors hover:bg-[var(--aurora-hover-bg)]"
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
