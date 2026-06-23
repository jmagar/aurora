"use client"

/**
 * Aurora Connection — a flow edge between two nodes (e.g. a data pipeline hop).
 *
 * Visual layer is ported 1:1 from the Claude Design source: two rounded node
 * pills, each with a status-tinted dot + label, joined by a directional edge
 * (line + arrowhead) carrying an optional label. The edge reflects `status`:
 *   - `ok`      — teal, solid
 *   - `active`  — cyan, dashed + animated (flowing)
 *   - `error`   — rose, solid
 *   - `pending` — slate, dashed (static)
 * `bidirectional` adds a reverse arrowhead at the source end.
 *
 * This file deliberately re-implements `Connection` (rather than re-exporting the
 * legacy `core` version) so it can carry CD's `label` / `status` /
 * `bidirectional` API while keeping every shadcn/Aurora guarantee: `forwardRef`,
 * `displayName`, `React.memo`, and full `React.HTMLAttributes` spread.
 * Token-only colors (`--aurora-*`); no hardcoded hex; no `violet`.
 */

import * as React from "react"

export type ConnectionStatus = "ok" | "active" | "error" | "pending"

export interface ConnectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source node label. */
  from: string
  /** Target node label. */
  to: string
  /** Optional caption rendered above the edge (e.g. latency, status code). */
  label?: string
  /** Drives the edge + dot tint and the dash/flow treatment. */
  status?: ConnectionStatus
  /** Adds a reverse arrowhead at the source end. */
  bidirectional?: boolean
}

const CSS = `
.aurora-connection {
  display: inline-flex;
  align-items: center;
  gap: 0;
  color: var(--aurora-text-primary);
  --conn-tone: var(--aurora-text-muted);
}
.aurora-connection[data-status="ok"]      { --conn-tone: var(--aurora-success); }
.aurora-connection[data-status="active"]  { --conn-tone: var(--aurora-accent-primary); }
.aurora-connection[data-status="error"]   { --conn-tone: var(--aurora-error); }
.aurora-connection[data-status="pending"] { --conn-tone: var(--aurora-text-muted); }

.aurora-connection__node {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid var(--aurora-border-default);
  background: var(--aurora-control-surface);
  box-shadow: var(--aurora-highlight-medium);
  box-sizing: border-box;
}
.aurora-connection__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--conn-tone);
  flex-shrink: 0;
}
.aurora-connection[data-status="active"] .aurora-connection__dot {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--conn-tone) 26%, transparent);
}
.aurora-connection__name {
  font-family: var(--font-sans, Inter, sans-serif);
  font-weight: 700;
  font-size: 17px;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--aurora-text-primary);
  white-space: nowrap;
}

.aurora-connection__edge {
  position: relative;
  display: inline-flex;
  align-items: center;
  align-self: center;
  flex-shrink: 0;
  width: 96px;
  height: 2px;
  margin: 0 8px;
}
.aurora-connection__label {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  color: var(--conn-tone);
  white-space: nowrap;
}
.aurora-connection__line {
  flex: 1 1 auto;
  height: 2px;
  border-radius: 999px;
  background: var(--conn-tone);
}
.aurora-connection[data-dashed="true"] .aurora-connection__line {
  height: 0;
  border-top: 2px dashed var(--conn-tone);
  border-radius: 0;
  background: none;
}
.aurora-connection[data-status="active"] .aurora-connection__line {
  background: none;
  height: 0;
  border-top: 2px dashed var(--conn-tone);
  border-radius: 0;
}
.aurora-connection[data-flowing="true"] .aurora-connection__line {
  background-image: repeating-linear-gradient(
    90deg,
    var(--conn-tone) 0,
    var(--conn-tone) 6px,
    transparent 6px,
    transparent 12px
  );
  background-size: 12px 2px;
  background-repeat: repeat-x;
  background-position: 0 0;
  border-top: 0;
  height: 2px;
  animation: aurora-connection-flow var(--motion-duration-slow, 360ms) linear infinite;
}
@keyframes aurora-connection-flow {
  to { background-position: 12px 0; }
}
@media (prefers-reduced-motion: reduce) {
  .aurora-connection[data-flowing="true"] .aurora-connection__line { animation: none; }
}
.aurora-connection__arrow {
  position: relative;
  width: 0;
  height: 0;
  flex-shrink: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}
.aurora-connection__arrow--end {
  border-left: 7px solid var(--conn-tone);
  margin-left: 1px;
}
.aurora-connection__arrow--start {
  border-right: 7px solid var(--conn-tone);
  margin-right: 1px;
}
`

let injected = false
function ensureCSS() {
  if (injected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.setAttribute("data-aurora-connection", "")
  el.textContent = CSS
  document.head.appendChild(el)
  injected = true
}

const Connection = React.forwardRef<HTMLDivElement, ConnectionProps>(
  (
    {
      from,
      to,
      label,
      status = "ok",
      bidirectional = false,
      className,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

    const dashed = status === "active" || status === "pending"
    const flowing = status === "active"
    const cls = ["aurora-connection", className].filter(Boolean).join(" ")
    const ariaLabel = `${from} ${bidirectional ? "↔" : "→"} ${to}${
      label ? ` (${label})` : ""
    }`

    return (
      <div
        ref={ref}
        className={cls}
        data-status={status}
        data-dashed={dashed || undefined}
        data-flowing={flowing || undefined}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        <span className="aurora-connection__node">
          <span className="aurora-connection__dot" aria-hidden />
          <span className="aurora-connection__name">{from}</span>
        </span>

        <span className="aurora-connection__edge" aria-hidden>
          {label ? <span className="aurora-connection__label">{label}</span> : null}
          {bidirectional ? (
            <span className="aurora-connection__arrow aurora-connection__arrow--start" />
          ) : null}
          <span className="aurora-connection__line" />
          <span className="aurora-connection__arrow aurora-connection__arrow--end" />
        </span>

        <span className="aurora-connection__node">
          <span className="aurora-connection__dot" aria-hidden />
          <span className="aurora-connection__name">{to}</span>
        </span>
      </div>
    )
  }
)
Connection.displayName = "Connection"

const MemoConnection = React.memo(Connection)
MemoConnection.displayName = "Connection"

export { MemoConnection as Connection }
export default MemoConnection
