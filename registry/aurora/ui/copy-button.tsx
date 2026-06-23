"use client"

/**
 * Aurora CopyButton — copy-to-clipboard action control.
 *
 * Aurora extension matching the Claude Design source 1:1. A neutral lit-outline
 * button (border + glow, no flooded fill) that copies `value` to the clipboard
 * and briefly swaps to a "copied" success state. Renders icon-only when no
 * `label` is supplied.
 *
 * Visual layer is injected once and reads only `--aurora-*` tokens so it renders
 * identically in dark + `.light`. Architecture stays shadcn: `forwardRef`,
 * `displayName`, named + default export, a11y (aria-label, aria-live status).
 */

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Visual layer (ported from Claude Design) ──────────────────────────────────

const CSS = `
.aurora-copy-btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  white-space: nowrap; cursor: pointer; user-select: none; font-family: var(--font-sans, Inter, sans-serif);
  font-weight: 560; border: 1px solid var(--aurora-border-strong); background: var(--aurora-control-surface);
  color: var(--aurora-text-primary); height: 32px; padding: 0 14px; border-radius: 9px; font-size: 13px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.34), 0 2px 6px rgba(0,0,0,0.16);
  text-decoration: none; box-sizing: border-box;
  transition: background 150ms var(--motion-ease-out, ease), border-color 150ms var(--motion-ease-out, ease), box-shadow 200ms var(--motion-ease-out, ease), color 150ms var(--motion-ease-out, ease), transform 80ms ease-out;
}
.aurora-copy-btn:hover { background: var(--aurora-hover-bg); border-color: var(--aurora-border-strong); box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 1px 2px rgba(0,0,0,0.4), 0 3px 9px rgba(0,0,0,0.22); }
.aurora-copy-btn:active { transform: translateY(1px); }
.aurora-copy-btn:focus-visible { outline: none; box-shadow: inset 0 1px 0 rgba(255,255,255,0.055), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent), 0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent); }
.aurora-copy-btn:disabled, .aurora-copy-btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; transform: none; }

/* icon-only square when there is no label */
.aurora-copy-btn--icon { width: 32px; padding: 0; }

/* copied state — brief success glow */
.aurora-copy-btn--copied {
  color: var(--aurora-success);
  border-color: color-mix(in srgb, var(--aurora-success) 46%, var(--aurora-border-strong));
  background: linear-gradient(180deg, color-mix(in srgb, var(--aurora-success) 12%, transparent), transparent 58%), var(--aurora-control-surface);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px color-mix(in srgb, var(--aurora-success) 22%, transparent);
}
.aurora-copy-btn--copied:hover {
  border-color: color-mix(in srgb, var(--aurora-success) 72%, var(--aurora-border-strong));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px color-mix(in srgb, var(--aurora-success) 42%, transparent);
}

.aurora-copy-btn__icon { display: inline-flex; align-items: center; flex-shrink: 0; }
.aurora-copy-btn__icon svg { display: block; }
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-copy-button", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function CopyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onCopy"> {
  /** Text written to the clipboard when the button is pressed. */
  value: string
  /** Visible label rendered after the icon. When omitted the button is icon-only. */
  label?: React.ReactNode
  /** Label announced/shown briefly after a successful copy. Defaults to "Copied". */
  copiedLabel?: React.ReactNode
  /** How long the copied state persists, in ms. Defaults to 2000. */
  timeout?: number
  /** Fired after `value` is written to the clipboard. */
  onCopy?: (value: string) => void
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      label,
      copiedLabel = "Copied",
      timeout = 2000,
      onCopy,
      className,
      onClick,
      disabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false)
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
      ensureCSS()
    }, [])

    React.useEffect(
      () => () => {
        if (timer.current) clearTimeout(timer.current)
      },
      []
    )

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return

        const finish = () => {
          setCopied(true)
          onCopy?.(value)
          if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => setCopied(false), timeout)
        }

        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard?.writeText
        ) {
          navigator.clipboard.writeText(value).then(finish, () => {})
        } else {
          finish()
        }
      },
      [onClick, onCopy, value, timeout]
    )

    const isIconOnly = label === undefined || label === null || label === ""
    const resolvedAriaLabel =
      ariaLabel ?? (isIconOnly ? "Copy to clipboard" : undefined)

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "aurora-copy-btn",
          isIconOnly && "aurora-copy-btn--icon",
          copied && "aurora-copy-btn--copied",
          className
        )}
        onClick={handleClick}
        disabled={disabled}
        aria-label={resolvedAriaLabel}
        {...props}
      >
        <span className="aurora-copy-btn__icon">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </span>
        {!isIconOnly ? <span>{copied ? copiedLabel : label}</span> : null}
        <span
          aria-live="polite"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {copied ? "Copied to clipboard" : ""}
        </span>
      </button>
    )
  }
)
CopyButton.displayName = "CopyButton"

export { CopyButton }
export default CopyButton
