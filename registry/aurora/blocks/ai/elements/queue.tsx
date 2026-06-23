"use client"

import * as React from "react"

/**
 * Queue — a live processing queue: a titled panel with a running-count summary
 * and a list of jobs. Each job carries a status:
 *   - `done`     dimmed title, teal check ring, outlined "DONE" badge
 *   - `running`  the "head" job — highlighted in a rose-bordered box with a
 *                pink spinner and a filled "RUNNING" badge (live dot)
 *   - `queued`   numbered by queue position, plain muted "QUEUED" trailing label
 *
 * Self-contained, CD-parity implementation. No violet. Icons are inline SVG so
 * the component ships without external icon deps.
 */

export type QueueStatus = "done" | "running" | "queued"

export interface QueueItem {
  id: string | number
  title: string
  status: QueueStatus
  /** Secondary line under the title (counts, ETA, timing). */
  meta?: string
}

export interface QueueProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  items: QueueItem[]
}

const Queue = React.forwardRef<HTMLDivElement, QueueProps>(
  ({ title, items, className, style, ...props }, ref) => {
    const runningCount = items.filter((i) => i.status === "running").length
    const queuedCount = items.filter((i) => i.status === "queued").length

    // Queue positions: the running "head" is 1; queued items number from there.
    const positionBase = runningCount > 0 ? runningCount : 0

    return (
      <div
        ref={ref}
        className={["aurora-queue", className].filter(Boolean).join(" ")}
        style={
          {
            boxSizing: "border-box",
            display: "grid",
            gap: "14px",
            width: "100%",
            minWidth: 0,
            padding: "20px 22px",
            background: "var(--aurora-panel-medium)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "var(--aurora-radius-3)",
            boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Header: list icon + title, running/queued summary */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <ListIcon />
            <span
              className="aurora-text-label"
              style={{ color: "var(--aurora-text-primary)", fontWeight: 700, fontSize: "1.05rem" }}
            >
              {title}
            </span>
          </div>
          <span
            style={{
              flex: "none",
              fontFamily: "var(--aurora-font-mono)",
              fontSize: "0.9rem",
              color: "var(--aurora-text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {runningCount} running
            <span style={{ opacity: 0.6, margin: "0 0.4em" }}>·</span>
            {queuedCount} queued
          </span>
        </div>

        {/* Job rows */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "4px" }}>
          {items.map((item, index) => (
            <QueueRow
              key={item.id}
              item={item}
              position={
                item.status === "queued"
                  ? positionBase + items.slice(0, index + 1).filter((x) => x.status === "queued").length
                  : undefined
              }
            />
          ))}
        </ul>
      </div>
    )
  }
)
Queue.displayName = "Queue"

function QueueRow({ item, position }: { item: QueueItem; position?: number }) {
  const running = item.status === "running"
  const done = item.status === "done"

  return (
    <li
      aria-current={running ? "step" : undefined}
      style={{
        display: "grid",
        gridTemplateColumns: "28px minmax(0, 1fr) auto",
        alignItems: "center",
        gap: "16px",
        padding: running ? "13px 14px" : "11px 14px",
        borderRadius: "var(--aurora-radius-2)",
        border: running
          ? "1px solid color-mix(in srgb, var(--aurora-accent-pink) 55%, transparent)"
          : "1px solid transparent",
        background: running
          ? "color-mix(in srgb, var(--aurora-accent-pink) 8%, transparent)"
          : "transparent",
        boxShadow: running
          ? "0 0 18px color-mix(in srgb, var(--aurora-accent-pink) 14%, transparent)"
          : "none",
        transition:
          "border-color var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease), background var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease)",
      }}
    >
      {/* Leading slot: check / spinner / position number */}
      <span
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
        }}
      >
        {done ? <CheckRing /> : running ? <Spinner /> : <PositionNumber>{position}</PositionNumber>}
      </span>

      {/* Title + meta */}
      <span style={{ display: "grid", gap: "3px", minWidth: 0 }}>
        <span
          className="aurora-text-control"
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "1.05rem",
            fontWeight: running ? 600 : 500,
            color: done ? "var(--aurora-text-muted)" : "var(--aurora-text-primary)",
          }}
        >
          {item.title}
        </span>
        {item.meta ? (
          <span
            style={{
              fontFamily: "var(--aurora-font-mono)",
              fontSize: "0.82rem",
              color: "var(--aurora-text-muted)",
            }}
          >
            {item.meta}
          </span>
        ) : null}
      </span>

      {/* Trailing status badge */}
      <span style={{ flex: "none", justifySelf: "end" }}>
        <StatusBadge status={item.status} />
      </span>
    </li>
  )
}

function StatusBadge({ status }: { status: QueueStatus }) {
  if (status === "queued") {
    return (
      <span
        style={{
          fontFamily: "var(--aurora-font-mono)",
          fontSize: "0.78rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
        }}
      >
        Queued
      </span>
    )
  }

  if (status === "running") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          padding: "5px 11px",
          borderRadius: "999px",
          border: "1px solid color-mix(in srgb, var(--aurora-accent-pink) 55%, transparent)",
          background: "color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent)",
          fontFamily: "var(--aurora-font-mono)",
          fontSize: "0.78rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--aurora-accent-pink-strong)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          aria-hidden
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "999px",
            background: "var(--aurora-accent-pink)",
            boxShadow: "0 0 6px color-mix(in srgb, var(--aurora-accent-pink) 70%, transparent)",
          }}
        />
        Running
      </span>
    )
  }

  // done
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 11px",
        borderRadius: "999px",
        border: "1px solid var(--aurora-success-border)",
        background: "transparent",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: "0.78rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--aurora-success)",
        whiteSpace: "nowrap",
      }}
    >
      Done
    </span>
  )
}

function PositionNumber({ children }: { children?: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--aurora-font-mono)",
        fontSize: "0.95rem",
        color: "var(--aurora-text-muted)",
      }}
    >
      {children}
    </span>
  )
}

function ListIcon() {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--aurora-accent-pink)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none" }}
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

function CheckRing() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flex: "none" }}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="var(--aurora-success)"
        strokeWidth="1.75"
        opacity="0.85"
      />
      <path
        d="M8.5 12.2l2.3 2.3 4.6-4.8"
        stroke="var(--aurora-success)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      style={{ flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" stroke="var(--aurora-accent-pink)" strokeWidth="2" opacity="0.22" />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="var(--aurora-accent-pink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export { Queue }
