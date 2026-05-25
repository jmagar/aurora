"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { SearchResults, SearchResultItem } from "./search-results"

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
  placeholder?: string
  emptyMessage?: string
  className?: string
}

function Combobox({ options, value, defaultValue, onValueChange, placeholder = "Search...", emptyMessage = "No results found.", className }: ComboboxProps) {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
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
        className="flex h-9 w-full items-center justify-between gap-2 rounded-[var(--aurora-radius-1)] border px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0"
        style={{
          background: "var(--aurora-control-surface)",
          borderColor: open ? "var(--aurora-accent-primary)" : "var(--aurora-border-strong)",
          color: selected ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "var(--aurora-type-body-sm)",
          fontWeight: "var(--aurora-weight-body)",
        }}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronsUpDown className="size-3.5 opacity-70" aria-hidden />
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-[260px]">
          <SearchResults>
            <div className="p-2">
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} autoFocus />
            </div>
            {filtered.length > 0 ? (
              filtered.map((option) => (
                <SearchResultItem
                  key={option.value}
                  title={
                    <span className="inline-flex items-center gap-2">
                      {option.label}
                      {option.value === current && <Check className="size-3.5 text-[var(--aurora-accent-primary)]" aria-hidden />}
                    </span>
                  }
                  description={option.description}
                  active={option.value === current}
                  onClick={() => select(option.value)}
                />
              ))
            ) : (
              <div style={{ color: "var(--aurora-text-muted)", fontSize: 13, padding: "10px 12px" }}>{emptyMessage}</div>
            )}
          </SearchResults>
        </div>
      )}
    </div>
  )
}

export { Combobox }
export default Combobox
