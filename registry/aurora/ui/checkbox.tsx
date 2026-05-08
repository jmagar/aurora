"use client"

import * as React from "react"

// ---------------------------------------------------------------------------
// Shared CSS injection
// ---------------------------------------------------------------------------

const CHECKBOX_CSS = `
@keyframes aurora-check-pop {
  0%   { transform: scale(0.6); opacity: 0; }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes aurora-radio-pop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
`

let checkboxCSSInjected = false
function ensureCheckboxCSS() {
  if (checkboxCSSInjected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.textContent = CHECKBOX_CSS
  document.head.appendChild(el)
  checkboxCSSInjected = true
}

// ---------------------------------------------------------------------------
// CheckIcon — inline SVG checkmark
// ---------------------------------------------------------------------------

function CheckIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      <path
        d="M1.5 4L3.8 6.5L8.5 1.5"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

export interface CheckboxProps {
  /** Controlled checked state */
  checked?: boolean
  /** Uncontrolled default */
  defaultChecked?: boolean
  /** Callback when value changes */
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  /** Label content rendered next to the box */
  children?: React.ReactNode
  id?: string
  className?: string
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      children,
      id,
      className,
    },
    ref
  ) => {
    React.useEffect(() => {
      ensureCheckboxCSS()
    }, [])

    const isControlled = controlledChecked !== undefined
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const checked = isControlled ? controlledChecked : internalChecked

    const [focused, setFocused] = React.useState(false)

    function toggle() {
      if (disabled) return
      const next = !checked
      if (!isControlled) setInternalChecked(next)
      onCheckedChange?.(next)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        toggle()
      }
    }

    const boxStyle: React.CSSProperties = {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 16,
      height: 16,
      borderRadius: 4,
      flexShrink: 0,
      border: checked
        ? "1.5px solid var(--aurora-accent-primary)"
        : "1.5px solid var(--aurora-border-strong)",
      background: checked
        ? "var(--aurora-accent-primary)"
        : "var(--aurora-control-surface)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background 150ms, border-color 150ms, box-shadow 150ms",
      boxShadow: focused
        ? [
            "0 0 0 3px color-mix(in srgb, #29b6f6 22%, transparent)",
            "0 0 0 1px color-mix(in srgb, #29b6f6 45%, transparent)",
          ].join(", ")
        : checked
        ? "0 0 0 1px color-mix(in srgb, #29b6f6 25%, transparent)"
        : "none",
      outline: "none",
      padding: 0,
    }

    const wrapperStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      cursor: disabled ? "not-allowed" : "pointer",
    }

    return (
      <label htmlFor={id} style={wrapperStyle} className={className}>
        <button
          ref={ref}
          id={id}
          role="checkbox"
          type="button"
          aria-checked={checked}
          aria-disabled={disabled}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          style={boxStyle}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {checked && (
            <CheckIcon
              style={{ animation: "aurora-check-pop 180ms cubic-bezier(0.4,0,0.2,1) both" }}
            />
          )}
        </button>

        {children && (
          <span
            style={{
              fontSize: 14,
              color: disabled ? "var(--aurora-text-muted)" : "var(--aurora-text-primary)",
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              userSelect: "none",
              lineHeight: 1.4,
            }}
          >
            {children}
          </span>
        )}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

// ---------------------------------------------------------------------------
// RadioGroup + RadioGroupItem
// ---------------------------------------------------------------------------

interface RadioGroupContextValue {
  value: string | undefined
  onValueChange: (v: string) => void
  disabled?: boolean
  name?: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  value: undefined,
  onValueChange: () => {},
})

export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  name?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
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
}: RadioGroupProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = isControlled ? controlledValue : internalValue

  function handleValueChange(v: string) {
    if (!isControlled) setInternalValue(v)
    onValueChange?.(v)
  }

  return (
    <RadioGroupContext.Provider
      value={{ value, onValueChange: handleValueChange, disabled, name }}
    >
      <div
        role="radiogroup"
        className={className}
        style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps {
  value: string
  disabled?: boolean
  children?: React.ReactNode
  id?: string
  className?: string
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ value, disabled: itemDisabled, children, id, className }, ref) => {
    React.useEffect(() => {
      ensureCheckboxCSS()
    }, [])

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
      }
    }

    const dotStyle: React.CSSProperties = {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "white",
      animation: "aurora-radio-pop 180ms cubic-bezier(0.4,0,0.2,1) both",
    }

    const circleStyle: React.CSSProperties = {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 16,
      height: 16,
      borderRadius: "50%",
      flexShrink: 0,
      border: checked
        ? "1.5px solid var(--aurora-accent-primary)"
        : "1.5px solid var(--aurora-border-strong)",
      background: checked
        ? "var(--aurora-accent-primary)"
        : "var(--aurora-control-surface)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background 150ms, border-color 150ms, box-shadow 150ms",
      boxShadow: focused
        ? [
            "0 0 0 3px color-mix(in srgb, #29b6f6 22%, transparent)",
            "0 0 0 1px color-mix(in srgb, #29b6f6 45%, transparent)",
          ].join(", ")
        : checked
        ? "0 0 0 1px color-mix(in srgb, #29b6f6 25%, transparent)"
        : "none",
      outline: "none",
      padding: 0,
    }

    return (
      <label
        htmlFor={id}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        className={className}
      >
        <button
          ref={ref}
          id={id}
          role="radio"
          type="button"
          aria-checked={checked}
          aria-disabled={disabled}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          style={circleStyle}
          onClick={select}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {checked && <span style={dotStyle} />}
        </button>

        {children && (
          <span
            style={{
              fontSize: 14,
              color: disabled ? "var(--aurora-text-muted)" : "var(--aurora-text-primary)",
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              userSelect: "none",
              lineHeight: 1.4,
            }}
          >
            {children}
          </span>
        )}
      </label>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Checkbox, RadioGroup, RadioGroupItem }
export default Checkbox
