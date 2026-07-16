"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

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

// ─── Chip (selected value) ──────────────────────────────────────────────────

interface MultiSelectChipProps {
  label: React.ReactNode
  onRemove?: () => void
  disabled?: boolean
}

const MultiSelectChip = ({ ref, label, onRemove, disabled }: MultiSelectChipProps & { ref?: React.Ref<HTMLSpanElement> }) => (
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
      {onRemove ? (
        <Button
          type="button"
          variant="plain"
          size="unstyled"
          disabled={disabled}
          aria-label="Remove"
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
          onKeyDown={(event) => event.stopPropagation()}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-[6px]",
            "text-[var(--aurora-text-muted)] transition-colors duration-100",
            "hover:bg-[color-mix(in_srgb,var(--aurora-accent-primary)_22%,transparent)]",
            "hover:text-[var(--aurora-accent-strong)]",
            "focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]"
          )}
        >
          <X className="h-3 w-3" aria-hidden />
        </Button>
      ) : null}
    </span>
  )
MultiSelectChip.displayName = "MultiSelectChip"

// ─── Option row (checkbox item) ───────────────────────────────────────────────

interface MultiSelectItemProps {
  id: string
  option: MultiSelectOption
  selected: boolean
  active: boolean
  onToggle: () => void
  onActive: () => void
}

const MultiSelectItem = ({ ref, id, option, selected, active, onToggle, onActive }: MultiSelectItemProps & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled || undefined}
      data-active={active || undefined}
      tabIndex={-1}
      onMouseMove={() => {
        if (!option.disabled) onActive()
      }}
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
        "data-[active]:bg-[var(--aurora-hover-bg)]",
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
        {selected ? <Check className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden /> : null}
      </span>
      <span className="truncate">{option.label}</span>
    </div>
  )
MultiSelectItem.displayName = "MultiSelectItem"

// ─── Root ─────────────────────────────────────────────────────────────────────

const MultiSelect = (
    { ref,
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
      "aria-label": ariaLabel,
      ...props
    }: MultiSelectProps & { ref?: React.Ref<HTMLDivElement> }
  ) => {
    const listboxId = React.useId()
    const [activeIndex, setActiveIndex] = React.useState(-1)
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

    const findEnabledIndex = React.useCallback(
      (start: number, direction: 1 | -1) => {
        if (options.length === 0) return -1
        for (let offset = 0; offset < options.length; offset += 1) {
          const index = (start + direction * offset + options.length) % options.length
          if (!options[index]?.disabled) return index
        }
        return -1
      },
      [options]
    )

    const openAt = React.useCallback(
      (edge: "first" | "last" = "first") => {
        setOpen(true)
        setActiveIndex(
          findEnabledIndex(edge === "first" ? 0 : options.length - 1, edge === "first" ? 1 : -1)
        )
      },
      [findEnabledIndex, options.length, setOpen]
    )

    const moveActive = React.useCallback(
      (direction: 1 | -1) => {
        const start = activeIndex < 0
          ? direction === 1 ? 0 : options.length - 1
          : activeIndex + direction
        setActiveIndex(findEnabledIndex(start, direction))
      },
      [activeIndex, findEnabledIndex, options.length]
    )

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full", className)}
        style={{ fontFamily: "var(--aurora-font-sans)" }}
        {...props}
      >
        {/* Trigger */}
        <div
          role="combobox"
          aria-label={ariaLabel ?? placeholder}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            if (!disabled) {
              if (open) setOpen(false)
              else openAt("first")
            }
          }}
          onKeyDown={(event) => {
            if (disabled) return
            if (event.key === "ArrowDown") {
              event.preventDefault()
              if (open) moveActive(1)
              else openAt("first")
            } else if (event.key === "ArrowUp") {
              event.preventDefault()
              if (open) moveActive(-1)
              else openAt("last")
            } else if (event.key === "Home" && open) {
              event.preventDefault()
              setActiveIndex(findEnabledIndex(0, 1))
            } else if (event.key === "End" && open) {
              event.preventDefault()
              setActiveIndex(findEnabledIndex(options.length - 1, -1))
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              if (open && activeIndex >= 0) {
                const option = options[activeIndex]
                if (option && !option.disabled) toggle(option.value)
              } else {
                openAt("first")
              }
            } else if (event.key === "Escape") {
              event.preventDefault()
              setOpen(false)
            }
          }}
          className={cn(
            "flex w-full items-center justify-between gap-2",
            "min-h-[44px] px-3 py-2",
            "border rounded-[var(--aurora-radius-1)]",
            "text-left text-[var(--aurora-text-primary)]",
            "transition-all duration-150 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)]",
            "aria-disabled:pointer-events-none aria-disabled:opacity-45",
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
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--aurora-text-muted)]" aria-hidden />
        </div>

        {/* Panel */}
        {open ? (
          <div
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            className={cn(
              "w-full overflow-hidden p-2",
              "border border-[color-mix(in_srgb,var(--aurora-accent-primary)_55%,transparent)]",
              // Square top, rounded bottom: the panel is the lower half of one
              // continuous outline with the trigger (no seam, no cartoon radius).
              "rounded-b-[var(--aurora-radius-1)] rounded-t-none",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
            )}
            data-state="open"
            style={{
              // -1px overlaps the trigger's bottom edge so the borders merge.
              marginTop: -1,
              background: "var(--aurora-panel-strong)",
              boxShadow: "var(--aurora-shadow-medium)",
            }}
          >
            {options.map((opt, index) => (
              <MultiSelectItem
                key={opt.value}
                id={`${listboxId}-option-${index}`}
                option={opt}
                selected={value.includes(opt.value)}
                active={activeIndex === index}
                onToggle={() => toggle(opt.value)}
                onActive={() => setActiveIndex(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    )
  }
MultiSelect.displayName = "MultiSelect"

// ─── Exports ──────────────────────────────────────────────────────────────────

export { MultiSelect, MultiSelectChip, MultiSelectItem }

export default MultiSelect
