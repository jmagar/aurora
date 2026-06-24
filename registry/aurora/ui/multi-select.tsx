"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  disabled?: boolean
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-3 w-3", className)}
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-3.5 w-3.5", className)}
      aria-hidden="true"
    >
      <path d="M3 8l3.5 3.5L13 4" />
    </svg>
  )
}

// ─── Chip (selected value) ──────────────────────────────────────────────────

interface MultiSelectChipProps {
  label: React.ReactNode
  onRemove?: () => void
  disabled?: boolean
}

function MultiSelectChip({ label, onRemove, disabled, ref }: MultiSelectChipProps & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5",
        "rounded-[10px] py-1 pl-2.5 pr-1.5",
        "border border-[color-mix(in_srgb,var(--aurora-accent-primary)_45%,transparent)]",
        "bg-[color-mix(in_srgb,var(--aurora-accent-primary)_12%,transparent)]",
        "text-[var(--aurora-text-primary)]"
      )}
      style={{
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "var(--aurora-type-control)",
        fontWeight: "var(--aurora-weight-ui)",
        letterSpacing: "var(--aurora-letter-ui)",
        lineHeight: "var(--aurora-line-dense)",
      }}
    >
      <span className="truncate">{label}</span>
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        aria-label="Remove"
        onClick={(e) => {
          e.stopPropagation()
          onRemove?.()
        }}
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[6px]",
          "text-[var(--aurora-text-muted)] transition-colors duration-100",
          "hover:bg-[color-mix(in_srgb,var(--aurora-accent-primary)_22%,transparent)]",
          "hover:text-[var(--aurora-accent-strong)]",
          "focus:outline-none",
          "disabled:pointer-events-none disabled:opacity-45"
        )}
      >
        <CloseIcon />
      </button>
    </span>
  )
}

// ─── Option row (checkbox item) ───────────────────────────────────────────────

interface MultiSelectItemProps {
  option: MultiSelectOption
  selected: boolean
  onToggle: () => void
}

function MultiSelectItem({ option, selected, onToggle, ref }: MultiSelectItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled || undefined}
      tabIndex={option.disabled ? undefined : -1}
      onClick={() => {
        if (!option.disabled) onToggle()
      }}
      onKeyDown={(e) => {
        if (option.disabled) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-3",
        "rounded-[10px] px-2.5 py-2",
        "outline-none transition-colors duration-100",
        "text-[var(--aurora-text-primary)]",
        "hover:bg-[var(--aurora-hover-bg)]",
        "aria-disabled:pointer-events-none aria-disabled:opacity-45"
      )}
      style={{
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "var(--aurora-type-control)",
        fontWeight: "var(--aurora-weight-ui)",
        letterSpacing: "var(--aurora-letter-ui)",
        lineHeight: "var(--aurora-line-dense)",
      }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-[7px]",
          "border transition-all duration-100",
          selected
            ? "border-[color-mix(in_srgb,var(--aurora-accent-primary)_60%,transparent)] bg-[color-mix(in_srgb,var(--aurora-accent-primary)_22%,transparent)] text-[var(--aurora-accent-strong)]"
            : "border-[var(--aurora-border-strong)] bg-[var(--aurora-control-surface)] text-transparent"
        )}
      >
        {selected ? <CheckIcon /> : null}
      </span>
      <span className="truncate">{option.label}</span>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function MultiSelect(
  {
    className,
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    open: openProp,
    defaultOpen,
    onOpenChange,
    placeholder = "Select…",
    disabled,
    ref,
    ...props
  }: MultiSelectProps & { ref?: React.Ref<HTMLDivElement> }
) {
  const listboxId = React.useId()
  const [valueState, setValueState] = React.useState<string[]>(
    defaultValue ?? []
  )
  const value = valueProp ?? valueState
  const setValue = React.useCallback(
    (next: string[]) => {
      if (valueProp === undefined) setValueState(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const [openState, setOpenState] = React.useState<boolean>(
    defaultOpen ?? false
  )
  const open = openProp ?? openState
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open, setOpen])

  const toggle = React.useCallback(
    (val: string) => {
      setValue(
        value.includes(val)
          ? value.filter((v) => v !== val)
          : [...value, val]
      )
    },
    [value, setValue]
  )

  const remove = React.useCallback(
    (val: string) => {
      setValue(value.filter((v) => v !== val))
    },
    [value, setValue]
  )

  const selectedOptions = value
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is MultiSelectOption => Boolean(o))

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ fontFamily: "var(--aurora-font-sans)" }}
      {...props}
    >
      {/* Trigger */}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between gap-2",
          "min-h-[44px] px-3 py-2",
          "border rounded-[var(--aurora-radius-1)]",
          "text-left text-[var(--aurora-text-primary)]",
          "transition-all duration-150 ease-out",
          "focus:outline-none",
          "disabled:pointer-events-none disabled:opacity-45",
          // When open, square the bottom + drop the bottom border so the panel
          // flows out of the trigger as one continuous outline (no seam).
          open
            ? "rounded-b-none border-b-transparent border-[color-mix(in_srgb,var(--aurora-accent-primary)_55%,transparent)]"
            : "border-[var(--aurora-border-strong)]"
        )}
        style={{
          background: "var(--aurora-control-surface)",
          boxShadow: open
            ? "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent)"
            : "none",
        }}
      >
        <span className="flex flex-1 flex-wrap items-center gap-2">
          {selectedOptions.length === 0 ? (
            <span
              className="text-[var(--aurora-text-muted)]"
              style={{
                fontSize: "var(--aurora-type-body-sm)",
                fontWeight: "var(--aurora-weight-ui)",
                letterSpacing: "var(--aurora-letter-ui)",
              }}
            >
              {placeholder}
            </span>
          ) : (
            selectedOptions.map((opt) => (
              <MultiSelectChip
                key={opt.value}
                label={opt.label}
                disabled={disabled}
                onRemove={() => remove(opt.value)}
              />
            ))
          )}
        </span>
        <ChevronDown className="shrink-0 text-[var(--aurora-text-muted)]" />
      </button>

      {/* Panel */}
      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className={cn(
            "mt-2 w-full overflow-hidden p-2",
            "border border-[var(--aurora-border-strong)]",
            "rounded-[var(--aurora-radius-2)]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          )}
          data-state="open"
          style={{
            background: "var(--aurora-panel-strong)",
            boxShadow:
              "var(--aurora-shadow-medium), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent)",
          }}
        >
          {options.map((opt) => (
            <MultiSelectItem
              key={opt.value}
              option={opt}
              selected={value.includes(opt.value)}
              onToggle={() => toggle(opt.value)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export { MultiSelect, MultiSelectChip, MultiSelectItem }

export default MultiSelect
