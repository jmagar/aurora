"use client"

/**
 * Aurora Confirmation — operator approve/cancel gate for a risky action.
 *
 * Visual layer is ported 1:1 from the Claude Design source (icon badge, intent
 * tint, sunken detail list, right-aligned action row). Architecture stays
 * shadcn/Aurora: `forwardRef`, `displayName`, `React.memo`, full
 * `React.HTMLAttributes` spread, and the Radix/cva `Button` for actions.
 *
 * This file deliberately re-implements `Confirmation` (rather than re-exporting
 * the legacy `core` version) so it can carry CD's `intent` + `details` API while
 * keeping every architectural guarantee. Token-only colors (`--aurora-*`); no
 * hardcoded hex; no `violet`.
 */

import * as React from "react"
import { CircleAlert, TriangleAlert } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

export type ConfirmationIntent = "default" | "danger"

export interface ConfirmationProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  /** Optional list of statements/lines previewing exactly what will run. */
  details?: React.ReactNode[]
  /** `danger` swaps the icon to a triangle-alert and tints the badge rose. */
  intent?: ConfirmationIntent
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>
  onCancel?: React.MouseEventHandler<HTMLButtonElement>
}

const CSS = `
.aurora-confirm {
  display: grid;
  gap: 16px;
  padding: 22px;
  background: var(--aurora-surface-raised);
  border: 1px solid var(--aurora-border-strong);
  border-radius: var(--aurora-radius-1);
  box-shadow: var(--aurora-shadow-medium), var(--aurora-highlight-medium);
  box-sizing: border-box;
  color: var(--aurora-text-primary);
}
.aurora-confirm__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.aurora-confirm__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: 1px solid var(--aurora-border-strong);
  background: var(--aurora-control-surface);
  color: var(--aurora-text-muted);
  flex-shrink: 0;
}
.aurora-confirm--danger .aurora-confirm__badge {
  border-color: color-mix(in srgb, var(--aurora-accent-pink) 38%, var(--aurora-border-strong));
  background: color-mix(in srgb, var(--aurora-accent-pink) 14%, var(--aurora-control-surface));
  color: var(--aurora-accent-pink);
}
.aurora-confirm__text { display: grid; gap: 4px; min-width: 0; }
.aurora-confirm__title {
  margin: 0;
  font-family: var(--font-sans, Inter, sans-serif);
  font-weight: 700;
  font-size: 21px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--aurora-text-primary);
}
.aurora-confirm__desc {
  margin: 0;
  font-family: var(--font-sans, Inter, sans-serif);
  font-size: 15px;
  line-height: 1.45;
  color: var(--aurora-text-muted);
}
.aurora-confirm__details {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--aurora-border-strong);
  background: color-mix(in srgb, var(--aurora-page-bg) 55%, transparent);
}
.aurora-confirm__detail {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: baseline;
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  line-height: 1.45;
  color: var(--aurora-text-primary);
}
.aurora-confirm__chevron { color: var(--aurora-text-muted); flex-shrink: 0; }
.aurora-confirm--danger .aurora-confirm__chevron { color: color-mix(in srgb, var(--aurora-accent-pink) 80%, var(--aurora-text-muted)); }
.aurora-confirm__actions { display: flex; justify-content: flex-end; gap: 12px; }
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-confirmation", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

const Confirmation = React.forwardRef<HTMLDivElement, ConfirmationProps>(
  (
    {
      title,
      description,
      details,
      intent = "default",
      confirmLabel = "Approve",
      cancelLabel = "Cancel",
      onConfirm,
      onCancel,
      className,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

    const Icon = intent === "danger" ? TriangleAlert : CircleAlert
    const cls = [
      "aurora-confirm",
      intent === "danger" && "aurora-confirm--danger",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <div ref={ref} className={cls} role="alertdialog" aria-label={title} {...props}>
        <div className="aurora-confirm__head">
          <span className="aurora-confirm__badge" aria-hidden>
            <Icon className="size-6" aria-hidden />
          </span>
          <div className="aurora-confirm__text">
            <h3 className="aurora-confirm__title">{title}</h3>
            {description ? <p className="aurora-confirm__desc">{description}</p> : null}
          </div>
        </div>

        {details && details.length > 0 ? (
          <div className="aurora-confirm__details">
            {details.map((detail, index) => (
              <div className="aurora-confirm__detail" key={index}>
                <span className="aurora-confirm__chevron" aria-hidden>
                  &rsaquo;
                </span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="aurora-confirm__actions">
          <Button type="button" variant="neutral" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="rose" size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    )
  }
)
Confirmation.displayName = "Confirmation"

const MemoConfirmation = React.memo(Confirmation)
MemoConfirmation.displayName = "Confirmation"

export { MemoConfirmation as Confirmation }
export default MemoConfirmation
