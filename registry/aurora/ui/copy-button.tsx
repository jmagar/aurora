"use client"

/**
 * Aurora CopyButton — copy-to-clipboard action control.
 *
 * Aurora extension matching the Claude Design source 1:1. A neutral lit-outline
 * button (border + glow, no flooded fill) that copies `value` to the clipboard
 * and briefly swaps to a "copied" success state. Renders icon-only when no
 * `label` is supplied.
 *
 * Visual layer lives in registry/aurora/styles/aurora-components.css
 * (`@layer aurora-components`, reads only `--aurora-*` tokens) so it renders
 * identically in dark + `.light`. Architecture stays shadcn: `forwardRef`,
 * `displayName`, named + default export, a11y (aria-label, aria-live status).
 */

import * as React from "react"
import { cn } from "@/lib/utils"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

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

function CopyButton(
  {
    ref,
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
  }: CopyButtonProps & { ref?: React.Ref<HTMLButtonElement> }
) {
    const [copied, setCopied] = React.useState(false)
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

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

export { CopyButton }
export default CopyButton
