"use client"

import * as React from "react"

export interface InlineCitationProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 1-based citation number rendered inside the chip. */
  index: number
  /** Source title shown in the hover/focus preview popover. */
  title?: string
  /** Source URL shown in the hover/focus preview popover. */
  url?: string
}

/**
 * InlineCitation — a compact rose citation chip rendered inline with body text.
 * When `title`/`url` are supplied it reveals a source preview on hover and
 * keyboard focus; otherwise it renders as a plain numbered chip.
 */
const InlineCitation = React.forwardRef<HTMLAnchorElement, InlineCitationProps>(
  ({ className, index, title, url, style, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const hasPreview = Boolean(title || url)
    const previewId = React.useId()

    const chip = (
      <a
        ref={ref}
        className={[
          "inline-flex items-center justify-center rounded-[5px] border align-baseline no-underline",
          "transition-colors",
          "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-describedby={hasPreview && open ? previewId : undefined}
        onMouseEnter={hasPreview ? () => setOpen(true) : undefined}
        onMouseLeave={hasPreview ? () => setOpen(false) : undefined}
        onFocus={hasPreview ? () => setOpen(true) : undefined}
        onBlur={hasPreview ? () => setOpen(false) : undefined}
        style={{
          minWidth: "1.05rem",
          padding: "1px 5px",
          borderColor:
            "color-mix(in srgb, var(--aurora-accent-pink) 32%, transparent)",
          background:
            "color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent)",
          color: "var(--aurora-accent-pink)",
          fontFamily: "var(--aurora-font-mono)",
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1.45,
          // focus ring color, also surfaced on hover via the data attr below
          ["--tw-ring-color" as string]:
            "color-mix(in srgb, var(--aurora-accent-pink) 45%, transparent)",
          ...style,
        }}
        onMouseOver={
          hasPreview
            ? (e) => {
                e.currentTarget.style.background =
                  "color-mix(in srgb, var(--aurora-accent-pink) 20%, transparent)"
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--aurora-accent-pink) 48%, transparent)"
                props.onMouseOver?.(e)
              }
            : props.onMouseOver
        }
        onMouseOut={
          hasPreview
            ? (e) => {
                e.currentTarget.style.background =
                  "color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent)"
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--aurora-accent-pink) 32%, transparent)"
                props.onMouseOut?.(e)
              }
            : props.onMouseOut
        }
        {...props}
      >
        {children ?? index}
      </a>
    )

    if (!hasPreview) return chip

    return (
      <span
        className="relative inline-block align-baseline"
        style={{ lineHeight: 0 }}
      >
        {chip}
        <span
          id={previewId}
          role="tooltip"
          hidden={!open}
          className="absolute left-1/2 z-50 grid gap-1"
          style={{
            bottom: "calc(100% + 8px)",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: 260,
            padding: "10px 12px",
            background: "var(--aurora-surface-raised)",
            border: "1px solid var(--aurora-border-strong)",
            borderRadius: "var(--aurora-radius-1)",
            boxShadow:
              "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
          }}
        >
          {title ? (
            <span
              style={{
                fontFamily: "var(--aurora-font-sans)",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.35,
                color: "var(--aurora-text-primary)",
              }}
            >
              {title}
            </span>
          ) : null}
          {url ? (
            <span
              style={{
                fontFamily: "var(--aurora-font-mono)",
                fontSize: 11,
                lineHeight: 1.4,
                color: "var(--aurora-accent-pink)",
                wordBreak: "break-all",
              }}
            >
              {url}
            </span>
          ) : null}
        </span>
      </span>
    )
  }
)
InlineCitation.displayName = "InlineCitation"

export { InlineCitation }
