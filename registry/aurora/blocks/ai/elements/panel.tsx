"use client"

import * as React from "react"

// ---------------------------------------------------------------------------
// Panel — generic AI-element card.
//
// CD parity: a raised AI-element surface with a recessed strong border and an
// inset top highlight, a header row with an optional tone-tinted icon tile, a
// tone-colored uppercase eyebrow above a bold title, an actions slot on the
// trailing edge, the body content, and an optional footer separated by a hair
// rule. Tones map onto Aurora accents — cyan (primary), rose (pink), orange
// (axon) and neutral. No violet (removed from the system).
//
// Architecture: standalone forwardRef + memo, superset of the original
// `title` + children API (both still render). The optional `icon` accepts an
// inner SVG path string (matching the CD bundle's `icon` contract) and is drawn
// inside a 24x24 stroked viewBox.
// ---------------------------------------------------------------------------

type PanelTone = "cyan" | "rose" | "orange" | "neutral"

const toneColor: Record<PanelTone, string> = {
  cyan: "var(--aurora-accent-primary)",
  rose: "var(--aurora-accent-pink)",
  orange: "var(--axon-orange)",
  neutral: "var(--aurora-text-muted)",
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tone-colored uppercase label above the title. */
  eyebrow?: React.ReactNode
  /** Panel title. */
  title?: React.ReactNode
  /** Accent family for the eyebrow + icon tile. Defaults to cyan. No violet. */
  tone?: PanelTone
  /** Inner SVG markup for the header icon (24x24 stroked viewBox), matching the CD bundle contract. */
  icon?: string
  /** Trailing-edge actions slot (buttons rendered with `.aurora-ael__btn`). */
  actions?: React.ReactNode
  /** Optional footer text, separated by a hair rule. */
  footer?: React.ReactNode
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ eyebrow, title, tone = "cyan", icon, actions, footer, className, children, style, ...props }, ref) => {
    const hasHeader = Boolean(eyebrow || title || icon || actions)

    return (
      <aside
        ref={ref}
        className={["aurora-ael", className].filter(Boolean).join(" ")}
        style={{ ["--aurora-ael-tone" as string]: toneColor[tone], ...style }}
        {...props}
      >
        {hasHeader ? (
          <div className="aurora-ael__head">
            {icon ? (
              <span className="aurora-ael__icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: icon }}
                />
              </span>
            ) : null}

            {eyebrow || title ? (
              <div className="aurora-ael__titles">
                {eyebrow ? <span className="aurora-ael__eyebrow">{eyebrow}</span> : null}
                {title ? <span className="aurora-ael__title">{title}</span> : null}
              </div>
            ) : null}

            {actions ? <div className="aurora-ael__actions">{actions}</div> : null}
          </div>
        ) : null}

        {children != null ? <div className="aurora-ael__body">{children}</div> : null}

        {footer ? <div className="aurora-ael__foot">{footer}</div> : null}
      </aside>
    )
  },
)

Panel.displayName = "Panel"

const MemoPanel = React.memo(Panel)
MemoPanel.displayName = "Panel"

export { MemoPanel as Panel }
export default MemoPanel
