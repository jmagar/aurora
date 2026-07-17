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
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useClipboard } from "@/registry/aurora/lib/use-clipboard"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

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
    const { state, copied, copy } = useClipboard(timeout)

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return

        void copy(value).then((didCopy) => {
          if (didCopy) onCopy?.(value)
        })
      },
      [onClick, onCopy, value, copy]
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
          state === "error" && "aurora-copy-btn--error",
          className
        )}
        onClick={handleClick}
        disabled={disabled}
        aria-label={resolvedAriaLabel}
        {...props}
      >
        <span className="aurora-copy-btn__icon">
          {copied ? <Check size={16} strokeWidth={1.75} aria-hidden /> : <Copy size={16} strokeWidth={1.75} aria-hidden />}
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
          {copied ? "Copied to clipboard" : state === "error" ? "Unable to copy to clipboard" : ""}
        </span>
      </button>
    )
}

export { CopyButton }
export default CopyButton
