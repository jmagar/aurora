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

const PANEL_STYLES = `
  .aurora-ael {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    border-radius: var(--aurora-radius-2);
    background: var(--aurora-surface-raised);
    border: 1px solid var(--aurora-border-strong);
    box-shadow: var(--aurora-shadow-medium), var(--aurora-highlight-medium);
    color: var(--aurora-text-primary);
    font-family: var(--aurora-font-sans);
    overflow: hidden;
  }
  .aurora-ael__head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
  }
  .aurora-ael__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: var(--aurora-radius-1);
    color: var(--aurora-ael-tone, var(--aurora-accent-primary));
    border: 1px solid color-mix(in srgb, var(--aurora-ael-tone, var(--aurora-accent-primary)) 55%, transparent);
    background: color-mix(in srgb, var(--aurora-ael-tone, var(--aurora-accent-primary)) 12%, transparent);
  }
  .aurora-ael__titles {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }
  .aurora-ael__eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--aurora-ael-tone, var(--aurora-accent-primary));
    line-height: 1.2;
  }
  .aurora-ael__title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--aurora-text-primary);
    line-height: 1.2;
  }
  .aurora-ael__actions {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    margin-left: auto;
  }
  .aurora-ael__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: var(--aurora-radius-1);
    border: 1px solid var(--aurora-border-strong);
    background: color-mix(in srgb, var(--aurora-page-bg) 60%, transparent);
    color: var(--aurora-text-muted);
    cursor: pointer;
    font-family: var(--aurora-font-sans);
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .aurora-ael__btn:hover {
    color: var(--aurora-text-primary);
    border-color: var(--aurora-accent-primary);
  }
  .aurora-ael__btn:focus-visible {
    outline: 2px solid var(--aurora-focus-ring-strong);
    outline-offset: 2px;
  }
  .aurora-ael__btn.icon {
    padding: 0;
  }
  .aurora-ael__btn.sm {
    width: 32px;
    height: 32px;
  }
  .aurora-ael__body {
    padding: 12px 16px;
    border-top: 1px solid color-mix(in srgb, var(--aurora-border-strong) 60%, transparent);
    font-size: 14px;
    line-height: 1.55;
    color: var(--aurora-text-primary);
  }
  .aurora-ael__foot {
    padding: 10px 16px;
    border-top: 1px solid color-mix(in srgb, var(--aurora-border-strong) 60%, transparent);
    font-size: 14px;
    color: var(--aurora-text-muted);
  }
`

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
        <style href="aurora-panel-styles" precedence="default">
          {PANEL_STYLES}
        </style>

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
