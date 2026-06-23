"use client"

import * as React from "react"
import { Button } from "./button"

// ---------------------------------------------------------------------------
// Shared CSS injection — accent-dot pop animation
// ---------------------------------------------------------------------------

const RADIO_GROUP_CSS = `
@keyframes aurora-radio-pop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
`

let radioGroupCSSInjected = false
function ensureRadioGroupCSS() {
  if (radioGroupCSSInjected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.textContent = RADIO_GROUP_CSS
  document.head.appendChild(el)
  radioGroupCSSInjected = true
}

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
      ensureRadioGroupCSS()
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
      background: "var(--aurora-accent-foreground)",
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
            "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)",
            "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent)",
          ].join(", ")
        : checked
        ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 25%, transparent)"
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
        <Button variant="plain" size="unstyled"
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
        </Button>

        {children && (
          <span
            style={{
              color: disabled ? "var(--aurora-text-muted)" : "var(--aurora-text-primary)",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "var(--aurora-type-control)",
              fontWeight: "var(--aurora-weight-body)",
              letterSpacing: "var(--aurora-letter-ui)",
              userSelect: "none",
              lineHeight: "var(--aurora-line-ui)",
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

export { RadioGroup, RadioGroupItem }
