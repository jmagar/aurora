"use client"

/**
 * Aurora Design System — Alert Dialog
 *
 * Confirmation surface for destructive / high-friction decisions, built on the
 * Aurora modal (`dialog`) + `button` primitives. Visual layer is ported from the
 * Claude Design source (reads only `--aurora-*` tokens) so it renders identically
 * in dark + `.light`.
 *
 * Two usage modes, both first-class:
 *   1. Prop-driven (CD parity):
 *        <AlertDialog destructive title="Delete environment?" description="…"
 *                     confirmLabel="Delete" cancelLabel="Cancel" />
 *   2. Compound (Radix-style escape hatch):
 *        <AlertDialog>
 *          <AlertDialogTrigger asChild><Button>Open</Button></AlertDialogTrigger>
 *          <AlertDialogContent>
 *            <AlertDialogHeader>
 *              <AlertDialogTitle>…</AlertDialogTitle>
 *              <AlertDialogDescription>…</AlertDialogDescription>
 *            </AlertDialogHeader>
 *            <AlertDialogFooter>
 *              <AlertDialogCancel asChild><Button variant="neutral">Cancel</Button></AlertDialogCancel>
 *              <AlertDialogAction asChild><Button variant="rose">Confirm</Button></AlertDialogAction>
 *            </AlertDialogFooter>
 *          </AlertDialogContent>
 *        </AlertDialog>
 *
 * peer deps: @radix-ui/react-dialog (via ./dialog)
 */

import * as React from "react"
import { AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/aurora/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/aurora/ui/dialog"

// ─── Compound parts (Radix passthrough — a11y + escape-hatch API preserved) ─────

const AlertDialogTrigger = DialogTrigger
const AlertDialogContent = DialogContent
const AlertDialogHeader = DialogHeader
const AlertDialogTitle = DialogTitle
const AlertDialogDescription = DialogDescription
const AlertDialogBody = DialogBody
const AlertDialogFooter = DialogFooter
const AlertDialogCancel = DialogClose
const AlertDialogAction = DialogClose

// ─── Visual layer (ported from Claude Design — reads only --aurora-* tokens) ────

const CSS = `
.aurora-alert {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  padding: 28px;
  border-radius: var(--aurora-radius-3);
  border: 1px solid color-mix(in srgb, var(--aurora-border-default) 55%, var(--aurora-page-bg));
  background: linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong));
  box-shadow: var(--aurora-shadow-strong), var(--aurora-highlight-strong);
  box-sizing: border-box;
}
.aurora-alert__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--aurora-accent-pink-border);
  background: var(--aurora-accent-pink-surface);
  color: var(--aurora-accent-pink);
  flex-shrink: 0;
}
.aurora-alert--info .aurora-alert__icon {
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent);
  background: color-mix(in srgb, var(--aurora-accent-primary) 12%, var(--aurora-panel-medium));
  color: var(--aurora-accent-primary);
}
.aurora-alert__main { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.aurora-alert__title {
  margin: 0;
  font-family: var(--font-display, var(--font-sans, Manrope, sans-serif));
  font-weight: 700;
  font-size: 19px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--aurora-text-primary);
}
.aurora-alert__desc {
  margin: 0;
  font-family: var(--font-sans, Inter, sans-serif);
  font-size: 15px;
  line-height: 1.5;
  color: var(--aurora-text-muted);
}
.aurora-alert__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-alert-dialog", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

// ─── Prop-driven CD-parity card ────────────────────────────────────────────────

export interface AlertDialogCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Heading text. */
  title?: React.ReactNode
  /** Supporting copy below the heading. */
  description?: React.ReactNode
  /** Destructive (rose) treatment — warning-triangle icon + rose confirm. Default true for alert dialogs. */
  destructive?: boolean
  /** Confirm button label. */
  confirmLabel?: React.ReactNode
  /** Cancel button label. */
  cancelLabel?: React.ReactNode
  /** Confirm handler. */
  onConfirm?: () => void
  /** Cancel handler. */
  onCancel?: () => void
}

function AlertDialogCard({
  ref,
  className,
  title,
  description,
  destructive = true,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  ...props
}: AlertDialogCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  React.useEffect(() => {
    ensureCSS()
  }, [])

  const Icon = destructive ? AlertTriangle : Info

  return (
    <div
      ref={ref}
      role="alertdialog"
      aria-modal="false"
      className={cn("aurora-alert", !destructive && "aurora-alert--info", className)}
      {...props}
    >
      <span className="aurora-alert__icon" aria-hidden>
        <Icon className="size-5" />
      </span>
      <div className="aurora-alert__main">
        {title ? <h2 className="aurora-alert__title">{title}</h2> : null}
        {description ? <p className="aurora-alert__desc">{description}</p> : null}
        <div className="aurora-alert__footer">
          <Button variant="neutral" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "rose" : "aurora"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Polymorphic root ──────────────────────────────────────────────────────────
// When `title` (or `description`) is supplied, render the CD-parity inline card.
// Otherwise behave as the Radix `Dialog` root so the compound parts above keep
// working as a modal escape hatch.

export type AlertDialogProps =
  | (AlertDialogCardProps & { children?: never })
  | (React.ComponentPropsWithoutRef<typeof Dialog> & {
      title?: undefined
      description?: undefined
    })

function AlertDialog(props: AlertDialogProps) {
  if ("title" in props && props.title !== undefined) {
    const { title, ...rest } = props as AlertDialogCardProps
    return <AlertDialogCard title={title} {...rest} />
  }
  if ("description" in props && props.description !== undefined) {
    return <AlertDialogCard {...(props as AlertDialogCardProps)} />
  }
  return <Dialog {...(props as React.ComponentPropsWithoutRef<typeof Dialog>)} />
}
AlertDialog.displayName = "AlertDialog"

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogCard,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
}

export default AlertDialog
