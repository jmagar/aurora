"use client"

/**
 * Aurora Action — a quiet, icon-first action button for AI message affordances
 * (copy / retry / thumbs-up, etc.).
 *
 * Visual values are ported 1:1 from the Claude Design "Action" source:
 *  - default: a 10px-radius bordered ghost square (32px) over the control
 *    surface, with a muted icon that lifts to the primary accent on hover.
 *  - icon + text: borderless ghost row (icon + label) — no surface/border.
 *  - pressed: a rose/pink-tinted toggle state (border + surface + icon) used
 *    for affirmative toggles like a thumbs-up.
 *  - size="sm": a tighter 28px square with a smaller hit area.
 *
 * Architecture stays shadcn: typed props, `forwardRef`, `displayName`,
 * `React.memo`, a real `<button>` with proper a11y (`aria-pressed` mirrors the
 * `pressed` toggle; `label` becomes the visible text, otherwise consumers pass
 * `aria-label`). Styling reads `--aurora-*` tokens via a stable class so the
 * registry stays config-free (Tailwind v4) and tokens drive every value.
 * Violet is intentionally not used.
 */

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional visible label, rendered after the icon (icon + text variant). */
  label?: React.ReactNode
  /** Toggled / affirmative state — applies the rose-tinted styling + aria-pressed. */
  pressed?: boolean
  /** Size scale. */
  size?: "default" | "sm"
}

const Action = React.forwardRef<HTMLButtonElement, ActionProps>(
  (
    {
      className,
      children,
      label,
      pressed,
      size = "default",
      type = "button",
      ...props
    },
    ref
  ) => {
    const hasLabel = label != null && label !== false
    return (
      <button
        ref={ref}
        type={type}
        data-size={size}
        data-has-label={hasLabel ? "true" : undefined}
        data-pressed={pressed ? "true" : undefined}
        aria-pressed={pressed != null ? pressed : undefined}
        className={cn("aurora-action", className)}
        {...props}
      >
        {children}
        {hasLabel ? <span className="aurora-action__label">{label}</span> : null}
      </button>
    )
  }
)
Action.displayName = "Action"

const MemoAction = React.memo(Action)
MemoAction.displayName = "Action"

export { MemoAction as Action }
export default MemoAction
