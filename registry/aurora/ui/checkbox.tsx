"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// CSS injection — data-state driven, matches CD exactly
// ---------------------------------------------------------------------------

const CSS = `
.aurora-checkbox {
  display: inline-grid; place-items: center; flex-shrink: 0; cursor: pointer;
  width: 19px; height: 19px; border-radius: 5px; padding: 0;
  background: var(--aurora-control-surface); border: 1px solid var(--aurora-border-strong);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
  transition: background 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
  position: relative;
}
.aurora-checkbox:hover {
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 40%, var(--aurora-border-strong));
}
.aurora-checkbox:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent);
}
.aurora-checkbox[data-state="checked"],
.aurora-checkbox[data-state="indeterminate"] {
  background: color-mix(in srgb, var(--aurora-accent-primary) 30%, var(--aurora-control-surface));
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 60%, var(--aurora-border-strong));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent);
}
.aurora-checkbox:disabled { opacity: 0.45; cursor: not-allowed; }
.aurora-checkbox svg {
  color: var(--aurora-accent-strong); opacity: 0;
  transition: opacity 120ms ease;
  position: absolute;
}
.aurora-checkbox[data-state="checked"] svg.aurora-checkbox__check { opacity: 1; }
.aurora-checkbox[data-state="indeterminate"] svg.aurora-checkbox__dash { opacity: 1; }
`

let _injected = false
function ensureCSS() {
  if (_injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-checkbox", "")
  el.textContent = CSS
  document.head.appendChild(el)
  _injected = true
}

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
  React.useEffect(() => { ensureCSS() }, [])

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

export { Checkbox }
export default Checkbox
