"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean
  defaultChecked?: boolean
  /** Tri-state: render a dash instead of a tick (e.g. a partially-selected group). Visually overrides `checked`. */
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Label content rendered next to the box. */
  children?: React.ReactNode
}

function Checkbox({
  ref,
  checked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  children,
  className,
  disabled,
  onClick,
  id,
  ...props
}: CheckboxProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const isControlled = checked !== undefined
  const [internal, setInternal] = React.useState(defaultChecked)
  const on = isControlled ? checked : internal
  const state = indeterminate ? "indeterminate" : on ? "checked" : "unchecked"

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isControlled) setInternal((v) => !v)
    onCheckedChange?.(!on)
    onClick?.(e)
  }

  const box = (
    <button
      ref={ref}
      id={children ? undefined : id}
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : on}
      data-state={state}
      disabled={disabled}
      className={cn("aurora-checkbox", !children && className)}
      onClick={handleClick}
      {...(children ? {} : props)}
    >
      {/* Checkmark */}
      <svg
        className="aurora-checkbox__check"
        width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {/* Dash (indeterminate) */}
      <svg
        className="aurora-checkbox__dash"
        width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6 12h12" />
      </svg>
    </button>
  )

  if (!children) return box

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-[10px]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      {box}
      <span
        style={{
          color: disabled ? "var(--aurora-disabled-text)" : "var(--aurora-text-primary)",
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

export { Checkbox }
export default Checkbox
