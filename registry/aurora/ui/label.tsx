"use client"

/**
 * Aurora Label — names a control. Matches the Claude Design source visually:
 * bright primary text at label weight, a rose (`--aurora-accent-pink`) required
 * asterisk, and a muted/dimmed disabled state.
 *
 * The visual layer is ported from the CD source onto a plain `<label>` element,
 * preserving native `htmlFor` association and all label HTML attributes.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Appends a rose required indicator (`*`) after the label text. */
  required?: boolean
  /** Dims the label to the muted tier (pairs with a disabled control). */
  disabled?: boolean
}

function Label({ className, style, required, disabled, children, ref, ...props }: LabelProps & { ref?: React.Ref<HTMLLabelElement> }) {
  return (
    <label
      ref={ref}
      data-disabled={disabled ? "" : undefined}
      className={cn("aurora-text-label", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        color: disabled
          ? "var(--aurora-text-muted)"
          : "var(--aurora-text-primary)",
        cursor: disabled ? "not-allowed" : "default",
        ...style,
      }}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" style={{ color: "var(--aurora-accent-pink)" }}>
          *
        </span>
      )}
    </label>
  )
}

export { Label }
export default Label
