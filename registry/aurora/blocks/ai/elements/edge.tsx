"use client"

/**
 * Aurora Edge — a graph edge label rendered as a compact, tone-tinted pill.
 *
 * Ported 1:1 from the Claude Design source: a rounded pill carrying a small
 * tone-colored dot + label, with optional inline direction arrows and an
 * optional dashed / animated-flow treatment. Used to annotate connections in a
 * node graph (status codes, sync state, latency, etc.).
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
 * legacy `core` divider version) so it can carry CD's `tone` / `direction` /
 * `dashed` / `animated` API while keeping every shadcn/Aurora guarantee:
 * `forwardRef`, `displayName`, `React.memo`, and full `React.HTMLAttributes`
 * spread. Token-only colors (`--aurora-*`); no hardcoded hex; no `violet`.
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

const CSS = `
.aurora-edge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: var(--radius-pill, 999px);
  border: 1px solid var(--edge-border);
  background: var(--edge-surface);
  box-shadow: var(--aurora-highlight-medium);
  box-sizing: border-box;
  font-family: var(--font-sans, Inter, sans-serif);
  font-weight: 600;
  font-size: 15px;
  line-height: 1.1;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: var(--edge-tone);
  --edge-tone: var(--aurora-text-muted);
  --edge-border: color-mix(in srgb, var(--edge-tone) 34%, transparent);
  --edge-surface: color-mix(in srgb, var(--edge-tone) 12%, var(--aurora-panel-medium));
}
.aurora-edge[data-tone="active"]  { --edge-tone: var(--aurora-accent-primary); }
.aurora-edge[data-tone="success"] { --edge-tone: var(--aurora-success); }
.aurora-edge[data-tone="warn"]    { --edge-tone: var(--aurora-warn); }
.aurora-edge[data-tone="error"]   { --edge-tone: var(--aurora-error); }
.aurora-edge[data-tone="muted"]   { --edge-tone: var(--aurora-text-muted); }

.aurora-edge[data-tone="active"] {
  box-shadow: var(--aurora-highlight-medium),
    0 0 0 1px color-mix(in srgb, var(--edge-tone) 26%, transparent),
    0 0 18px color-mix(in srgb, var(--edge-tone) 22%, transparent);
}

.aurora-edge__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--edge-tone);
  flex-shrink: 0;
}
.aurora-edge[data-tone="active"] .aurora-edge__dot {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--edge-tone) 26%, transparent);
}

.aurora-edge__arrow {
  font-family: var(--font-mono, monospace);
  font-weight: 500;
  color: color-mix(in srgb, var(--edge-tone) 78%, transparent);
  flex-shrink: 0;
}

.aurora-edge[data-dashed="true"] {
  border-style: dashed;
}
.aurora-edge[data-flowing="true"] {
  border-style: dashed;
  background-image: var(--edge-surface),
    repeating-linear-gradient(
      90deg,
      var(--edge-tone) 0,
      var(--edge-tone) 6px,
      transparent 6px,
      transparent 12px
    );
  background-position: 0 0, 0 0;
  background-size: 100% 100%, 12px 1px;
  background-repeat: no-repeat, repeat-x;
  animation: aurora-edge-flow var(--motion-duration-slow, 360ms) linear infinite;
}
@keyframes aurora-edge-flow {
  to { background-position: 0 0, 12px 0; }
}
@media (prefers-reduced-motion: reduce) {
  .aurora-edge[data-flowing="true"] { animation: none; }
}
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-edge", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

const ARROW_BACK = "←" // ←
const ARROW_FORWARD = "→" // →

const Edge = React.forwardRef<HTMLDivElement, EdgeProps>(
  (
    {
      label = "edge",
      tone = "muted",
      direction = "none",
      dashed = false,
      animated = false,
      className,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

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
)
Edge.displayName = "Edge"

const MemoEdge = React.memo(Edge)
MemoEdge.displayName = "Edge"

export { MemoEdge as Edge }
export default MemoEdge
