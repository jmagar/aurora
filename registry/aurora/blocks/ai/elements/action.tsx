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
 * `aria-label`). Styling reads `--aurora-*` tokens via an injected `<style>`
 * scoped by a stable class so the registry stays config-free (Tailwind v4) and
 * tokens drive every value. Violet is intentionally not used.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

const STYLE_ID = "aurora-action-styles"

const ACTION_CSS = `
.aurora-action {
  --aurora-action-size: 32px;
  --aurora-action-icon: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  min-width: var(--aurora-action-size);
  height: var(--aurora-action-size);
  padding: 0;
  width: var(--aurora-action-size);
  border-radius: 10px;
  border: 1px solid var(--aurora-border-default);
  background: var(--aurora-control-surface);
  color: var(--aurora-text-muted);
  font-family: var(--font-sans, Inter, sans-serif);
  font-size: var(--aurora-type-control, 13px);
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  transition:
    color var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease),
    border-color var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease),
    background var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease),
    transform var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease);
}
.aurora-action svg {
  width: var(--aurora-action-icon);
  height: var(--aurora-action-icon);
  flex: none;
}
.aurora-action:hover:not(:disabled) {
  color: var(--aurora-accent-primary);
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 30%, var(--aurora-border-default));
  background: color-mix(in srgb, var(--aurora-accent-primary) 6%, var(--aurora-control-surface));
}
.aurora-action:active:not(:disabled) {
  transform: translateY(0.5px);
}
.aurora-action:focus-visible {
  border-color: var(--aurora-accent-primary);
  box-shadow: 0 0 0 3px var(--aurora-focus-ring-strong);
}
.aurora-action:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  color: var(--aurora-disabled-text);
}

/* icon + text: borderless ghost row */
.aurora-action[data-has-label="true"] {
  width: auto;
  padding: 0 10px 0 8px;
  border-color: transparent;
  background: transparent;
}
.aurora-action[data-has-label="true"]:hover:not(:disabled) {
  border-color: transparent;
  background: color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent);
}
.aurora-action__label {
  color: var(--aurora-text-primary);
  white-space: nowrap;
}

/* pressed toggle — rose/pink-tinted affirmative state */
.aurora-action[data-pressed="true"] {
  color: var(--aurora-accent-pink);
  border-color: var(--aurora-accent-pink-border);
  background: var(--aurora-accent-pink-surface);
}
.aurora-action[data-pressed="true"]:hover:not(:disabled) {
  color: var(--aurora-accent-pink-strong);
  border-color: color-mix(in srgb, var(--aurora-accent-pink) 46%, transparent);
  background: color-mix(in srgb, var(--aurora-accent-pink) 18%, var(--aurora-panel-medium));
}

/* small */
.aurora-action[data-size="sm"] {
  --aurora-action-size: 28px;
  --aurora-action-icon: 14px;
  border-radius: 8px;
  font-size: 12px;
}
.aurora-action[data-size="sm"][data-has-label="true"] {
  padding: 0 8px 0 6px;
}

@media (prefers-reduced-motion: reduce) {
  .aurora-action { transition: none; }
  .aurora-action:active:not(:disabled) { transform: none; }
}
`

function useActionStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement("style")
    el.id = STYLE_ID
    el.textContent = ACTION_CSS
    document.head.appendChild(el)
  }, [])
}

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
    useActionStyles()
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
