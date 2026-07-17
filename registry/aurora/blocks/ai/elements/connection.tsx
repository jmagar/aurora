"use client"

/**
 * Aurora Connection — a flow edge between two nodes (e.g. a data pipeline hop).
 *
 * Two rounded node pills, each with a status-tinted dot + label, joined by a
 * directional edge (line + arrowhead) carrying an optional label. The edge
 * reflects `status`:
 *   - `ok`      — teal, solid
 *   - `active`  — cyan, dashed + animated (flowing)
 *   - `error`   — rose, solid
 *   - `pending` — slate, dashed (static)
 * `bidirectional` adds a reverse arrowhead at the source end.
 *
 * This file deliberately re-implements `Connection` (rather than re-exporting the
 * legacy `core` version) so it can carry the `label` / `status` /
 * `bidirectional` API while keeping every shadcn/Aurora guarantee:
 * `forwardRef`, `displayName`, `React.memo`, and full
 * `React.HTMLAttributes` spread. Token-only colors (`--aurora-*`).
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

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

const Connection = (
    { ref,
      from,
      to,
      label,
      status = "ok",
      bidirectional = false,
      className,
      ...props
    }: ConnectionProps & { ref?: React.Ref<HTMLDivElement> }
  ) => {
    const dashed = status === "active" || status === "pending"
    const flowing = status === "active"
    const cls = ["aurora-connection", className].filter(Boolean).join(" ")
    const ariaLabel = bidirectional
      ? `${from} connected bidirectionally with ${to}${label ? `, ${label}` : ""}`
      : `${from} connects to ${to}${label ? `, ${label}` : ""}`

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
          {label ? (
            <span
              className="aurora-connection__label"
              style={{ fontFamily: "var(--aurora-font-sans)" }}
            >
              {label}
            </span>
          ) : null}
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
Connection.displayName = "Connection"

const MemoConnection = React.memo(Connection)
MemoConnection.displayName = "Connection"

export { MemoConnection as Connection }
export default MemoConnection
