"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { isNavigationKey, nextEnabledIndex } from "@/registry/aurora/lib/widget-interactions"

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface RadioGroupContextValue {
  value: string | undefined
  onValueChange: (v: string) => void
  disabled?: boolean
  name?: string
  firstFocusableValue?: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  value: undefined,
  onValueChange: () => {},
})

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------

export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  name?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  "aria-label"?: string
  "aria-labelledby"?: string
}

function RadioGroup({
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled,
  name,
  children,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: RadioGroupProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = isControlled ? controlledValue : internalValue
  const firstFocusableValue = React.Children.toArray(children).find((child) =>
    React.isValidElement<RadioGroupItemProps>(child) && !child.props.disabled
  )
  const firstValue = React.isValidElement<RadioGroupItemProps>(firstFocusableValue)
    ? firstFocusableValue.props.value
    : undefined

  function handleValueChange(v: string) {
    if (!isControlled) setInternalValue(v)
    onValueChange?.(v)
  }

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange, disabled, name, firstFocusableValue: firstValue }}>
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={className}
        style={{ display: "flex", flexDirection: "column", gap: 11, ...style }}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// RadioGroupItem
// ---------------------------------------------------------------------------

export interface RadioGroupItemProps {
  value: string
  disabled?: boolean
  children?: React.ReactNode
  id?: string
  className?: string
}

function RadioGroupItem({
  ref,
  value,
  disabled: itemDisabled,
  children,
  id,
  className,
}: RadioGroupItemProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const ctx = React.useContext(RadioGroupContext)
  const disabled = itemDisabled || ctx.disabled
  const checked = ctx.value === value
  const [focused, setFocused] = React.useState(false)

  function select() {
    if (!disabled) ctx.onValueChange(value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      select()
      return
    }
    if (isNavigationKey(e.key)) {
      e.preventDefault()
      const group = e.currentTarget.closest('[role="radiogroup"]')
      const radios = Array.from(group?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [])
      const current = radios.indexOf(e.currentTarget)
      const disabledItems = radios.map((radio) => radio.disabled)
      const direction = getComputedStyle(e.currentTarget).direction === "rtl" ? "rtl" : "ltr"
      const index = nextEnabledIndex(current, e.key, disabledItems, direction)
      const next = radios[index]
      if (next) {
        next.focus()
        next.click()
      }
    }
  }

  const controlId = React.useId()
  const resolvedId = id ?? controlId
  const dot = (
    <button
      ref={ref}
      id={resolvedId}
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      tabIndex={disabled ? -1 : checked || (ctx.value === undefined && ctx.firstFocusableValue === value) ? 0 : -1}
      onClick={select}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: "inline-grid",
        placeItems: "center",
        flexShrink: 0,
        width: 19,
        height: 19,
        borderRadius: "50%",
        padding: 0,
        background: "var(--aurora-control-surface)",
        border: checked
          ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 60%, var(--aurora-border-strong))"
          : "1px solid var(--aurora-border-strong)",
        boxShadow: focused
          ? "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)"
          : checked
          ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent), 0 0 12px color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent)"
          : "inset 0 1px 0 rgba(255,255,255,0.04)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        outline: "none",
        transition: "border-color 140ms ease, box-shadow 140ms ease",
      }}
    >
      {/* Inner accent dot */}
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: "var(--aurora-accent-strong)",
          boxShadow: checked ? "0 0 6px var(--aurora-accent-primary)" : "none",
          opacity: checked ? 1 : 0,
          transform: checked ? "none" : "scale(0.4)",
          transition: "opacity 120ms ease, transform 120ms ease",
        }}
      />
    </button>
  )

  if (!children) return dot

  return (
    <label
      htmlFor={resolvedId}
      className={cn(
        "inline-flex items-center gap-[9px]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      {dot}
      <span
        style={{
          color: disabled ? "var(--aurora-text-muted)" : "var(--aurora-text-primary)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "var(--aurora-type-control)",
          fontWeight: "var(--aurora-weight-body)",
          letterSpacing: "var(--aurora-letter-ui)",
          lineHeight: "var(--aurora-line-ui)",
          userSelect: "none",
        }}
      >
        {children}
      </span>
    </label>
  )
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { RadioGroup, RadioGroupItem }
