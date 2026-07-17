"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

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

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  name?: string
  children?: React.ReactNode
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
  ...props
}: RadioGroupProps) {
  const generatedName = React.useId()
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = isControlled ? controlledValue : internalValue

  function handleValueChange(nextValue: string) {
    if (!isControlled) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <RadioGroupContext.Provider
      value={{ value, onValueChange: handleValueChange, disabled, name: name ?? generatedName }}
    >
      <div
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={className}
        style={{ display: "flex", flexDirection: "column", gap: 11, ...style }}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "type" | "value"> {
  value: string
  children?: React.ReactNode
}

function RadioGroupItem({
  ref,
  value,
  disabled: itemDisabled,
  children,
  id,
  className,
  onFocus,
  onBlur,
  ...props
}: RadioGroupItemProps & { ref?: React.Ref<HTMLInputElement> }) {
  const generatedId = React.useId()
  const resolvedId = id ?? generatedId
  const ctx = React.useContext(RadioGroupContext)
  const disabled = itemDisabled || ctx.disabled
  const checked = ctx.value === value
  const [focused, setFocused] = React.useState(false)

  const input = (
    <Input
      {...props}
      ref={ref}
      id={resolvedId}
      unstyled
      type="radio"
      name={ctx.name}
      value={value}
      disabled={disabled}
      checked={checked}
      className="sr-only"
      onChange={() => {
        if (!disabled) ctx.onValueChange(value)
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
    />
  )

  const indicator = (
    <span
      aria-hidden="true"
      className="inline-grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full"
      style={{
        background: "var(--aurora-control-surface)",
        border: `1px solid ${
          checked
            ? "color-mix(in srgb, var(--aurora-accent-primary) 60%, var(--aurora-border-strong))"
            : "var(--aurora-border-strong)"
        }`,
        boxShadow: focused
          ? "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)"
          : checked
            ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent), 0 0 12px color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent)"
            : "var(--aurora-highlight-medium)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "border-color 140ms ease, box-shadow 140ms ease",
      }}
    >
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
    </span>
  )

  if (!children) {
    return (
      <label
        htmlFor={resolvedId}
        className={cn(
          "inline-flex items-center",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className
        )}
      >
        {input}
        {indicator}
      </label>
    )
  }

  return (
    <label
      htmlFor={resolvedId}
      className={cn(
        "inline-flex items-center gap-[9px]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      {input}
      {indicator}
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

export { RadioGroup, RadioGroupItem }
export default RadioGroup
