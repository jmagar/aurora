"use client"

/**
 * Aurora Actions — a horizontal row of message/turn action buttons.
 *
 * `Actions` is the row container (flex, 8px gap). `Action` is a single button
 * that renders in two shapes, ported 1:1 from the Claude Design source:
 *
 * - icon-only (no `label`): a square 38px button with a 12px radius, a
 *   `panel-strong-top → panel-strong` gradient surface, a `border-strong`
 *   outline, an inset top highlight, and a muted icon stroke. Hover lifts the
 *   surface to `hover-bg` and brightens the icon to `text-primary`.
 * - icon + text (with `label`): a ghost button (no box) with a muted
 *   icon + label that brightens on hover.
 *
 * A `pressed` prop drives `aria-pressed` and a lit accent-tinted state for
 * toggles (e.g. an overflow "More" trigger).
 *
 * Architecture stays shadcn: compound `Actions` + `Action` parts, `forwardRef`,
 * `displayName`, `React.memo`, native button props (`onClick`, `disabled`,
 * `type`), and full a11y (`aria-label` for icon-only, `aria-pressed` for
 * toggles, focus-visible ring). No `violet`.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

export type ActionsProps = React.HTMLAttributes<HTMLDivElement>

const Actions = React.forwardRef<HTMLDivElement, ActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn("aurora-actions", className)}
      {...props}
    >
      {children}
    </div>
  )
)
Actions.displayName = "Actions"

export interface ActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visible text label. When set, the button renders icon + text (ghost). */
  label?: React.ReactNode
  /** Toggled / active state — drives `aria-pressed` and the lit accent style. */
  pressed?: boolean
}

const Action = React.forwardRef<HTMLButtonElement, ActionProps>(
  (
    { className, children, label, pressed, type, "aria-label": ariaLabel, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type ?? "button"}
      data-shape={label != null ? "text" : "icon"}
      data-pressed={pressed ? "true" : undefined}
      aria-pressed={pressed != null ? pressed : undefined}
      aria-label={ariaLabel}
      className={cn("aurora-action", className)}
      {...props}
    >
      {children}
      {label != null ? <span>{label}</span> : null}
    </button>
  )
)
Action.displayName = "Action"

const MemoActions = React.memo(Actions)
MemoActions.displayName = "Actions"

const MemoAction = React.memo(Action)
MemoAction.displayName = "Action"

export { MemoActions as Actions, MemoAction as Action }
export default MemoActions
