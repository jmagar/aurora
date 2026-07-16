/**
 * Aurora Edge — a graph edge label rendered as a compact, tone-tinted pill.
 *
 * A rounded pill carrying a small tone-colored dot + label, with optional
 * inline direction arrows and an optional dashed / animated-flow treatment.
 * Used to annotate connections in a node graph (status codes, sync state,
 * latency, etc.).
 *
 *   tone:
 *     - `active`  — cyan (accent primary); pairs with `animated` for flow
 *     - `success` — teal
 *     - `warn`    — sand
 *     - `error`   — rose
 *     - `muted`   — slate (default)
 *   direction:
 *     - `forward` — trailing `→`
 *     - `back`    — leading `←`
 *     - `both`    — leading `←` and trailing `→`
 *     - `none`    — no arrows (default)
 *   `dashed`   — dashed pill border (e.g. a tentative / pending edge)
 *   `animated` — flowing dashed border (continuous motion); respects
 *                `prefers-reduced-motion`
 *
 * This file deliberately re-implements `Edge` (rather than re-exporting the
 * legacy `core` divider version) so it can carry the `tone` / `direction` /
 * `dashed` / `animated` API while keeping every shadcn/Aurora guarantee:
 * `forwardRef`, `displayName`, `React.memo`, and full `React.HTMLAttributes`
 * spread. Token-only colors (`--aurora-*`).
 */

import * as React from "react"

export type EdgeTone = "active" | "success" | "warn" | "error" | "muted"
export type EdgeDirection = "none" | "forward" | "back" | "both"

export interface EdgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Edge caption (e.g. "200 OK", "sync", "429 retry"). */
  label?: string
  /** Drives the dot / label / border tint. */
  tone?: EdgeTone
  /** Inline direction arrows. */
  direction?: EdgeDirection
  /** Render the pill border as a static dash. */
  dashed?: boolean
  /** Animate the dashed border as a flowing edge. */
  animated?: boolean
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

const ARROW_BACK = "←" // ←
const ARROW_FORWARD = "→" // →

const Edge = (
    { ref,
      label = "edge",
      tone = "muted",
      direction = "none",
      dashed = false,
      animated = false,
      className,
      ...props
    }: EdgeProps & { ref?: React.Ref<HTMLDivElement> }
  ) => {
    const flowing = animated
    const showBack = direction === "back" || direction === "both"
    const showForward = direction === "forward" || direction === "both"
    const cls = ["aurora-edge", className].filter(Boolean).join(" ")
    const arrowText = showBack && showForward ? "↔" : showForward ? "→" : showBack ? "←" : ""
    const ariaLabel = arrowText ? `${label} ${arrowText}` : label

    return (
      <div
        ref={ref}
        className={cls}
        data-tone={tone}
        data-direction={direction}
        data-dashed={dashed && !animated ? "true" : undefined}
        data-flowing={flowing ? "true" : undefined}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        {showBack ? (
          <span className="aurora-edge__arrow" aria-hidden>
            {ARROW_BACK}
          </span>
        ) : null}
        <span className="aurora-edge__dot" aria-hidden />
        <span className="aurora-edge__label">{label}</span>
        {showForward ? (
          <span className="aurora-edge__arrow" aria-hidden>
            {ARROW_FORWARD}
          </span>
        ) : null}
      </div>
    )
  }
Edge.displayName = "Edge"

const MemoEdge = React.memo(Edge)
MemoEdge.displayName = "Edge"

export { MemoEdge as Edge }
export default MemoEdge
