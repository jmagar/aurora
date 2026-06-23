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

const STYLE_ID = "aurora-actions-style"

const ACTIONS_CSS = `
.aurora-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}
.aurora-action {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: none;
  margin: 0;
  font-family: var(--font-sans, Inter, sans-serif);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  color: var(--aurora-text-muted);
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  transition:
    color var(--motion-fast, 140ms) ease,
    background var(--motion-fast, 140ms) ease,
    border-color var(--motion-fast, 140ms) ease,
    box-shadow var(--motion-fast, 140ms) ease;
}
.aurora-action > svg {
  flex: none;
  display: block;
}
/* icon-only: framed square */
.aurora-action[data-shape="icon"] {
  width: 38px;
  height: 38px;
  padding: 0;
  border-radius: 12px;
  border-color: var(--aurora-border-strong);
  background: linear-gradient(
    180deg,
    var(--aurora-panel-strong-top),
    var(--aurora-panel-strong)
  );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.aurora-action[data-shape="icon"]:hover:not(:disabled) {
  color: var(--aurora-text-primary);
  background: var(--aurora-hover-bg);
}
/* icon + text: ghost */
.aurora-action[data-shape="text"] {
  height: 34px;
  padding: 0 4px;
  border-radius: 8px;
  background: none;
}
.aurora-action[data-shape="text"]:hover:not(:disabled) {
  color: var(--aurora-text-primary);
}
/* pressed / toggled */
.aurora-action[data-pressed="true"] {
  color: var(--aurora-text-primary);
  border-color: color-mix(
    in srgb,
    var(--aurora-accent-primary) 38%,
    var(--aurora-border-strong)
  );
  background: color-mix(
    in srgb,
    var(--aurora-accent-primary) 12%,
    var(--aurora-panel-strong)
  );
}
.aurora-action:focus-visible {
  outline: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent),
    0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent);
}
.aurora-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`

function ActionsStyle() {
  return (
    <style
      id={STYLE_ID}
       
      dangerouslySetInnerHTML={{ __html: ACTIONS_CSS }}
    />
  )
}

export type ActionsProps = React.HTMLAttributes<HTMLDivElement>

const Actions = React.forwardRef<HTMLDivElement, ActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn("aurora-actions", className)}
      {...props}
    >
      <ActionsStyle />
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
