"use client"

import * as React from "react"
import { CheckCircle2, ListChecks, LoaderCircle } from "lucide-react"
import { Badge } from "@/registry/aurora/ui/badge"

/**
 * Queue — a live processing queue: a titled panel with a running-count summary
 * and a list of jobs. Each job carries a status:
 *   - `done`     dimmed title, teal check ring, outlined "DONE" badge
 *   - `running`  the "head" job — highlighted with Axon-orange automation
 *                identity and a live "RUNNING" badge
 *   - `queued`   numbered by queue position, plain muted "QUEUED" trailing label
 *
 * Self-contained, CD-parity implementation. No violet/purple AI emphasis.
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
            <ListChecks className="size-5 shrink-0" aria-hidden style={{ color: "var(--axon-orange)" }} />
            <span
              className="aurora-text-label"
              style={{ color: "var(--aurora-text-primary)", fontWeight: 700, fontSize: "1.05rem" }}
            >
              {title}
            </span>
          </div>
          <span
            className="aurora-text-meta tabular-nums"
            style={{
              flex: "none",
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
        gap: "14px",
        padding: running ? "13px 14px" : "11px 14px",
        borderRadius: "var(--aurora-radius-2)",
        border: running
          ? "1px solid var(--axon-orange-border)"
          : "1px solid transparent",
        background: running
          ? "var(--axon-orange-surface)"
          : "transparent",
        boxShadow: running
          ? "0 0 18px color-mix(in srgb, var(--axon-orange) 14%, transparent)"
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
            className="aurora-text-meta tabular-nums"
            style={{
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
    return <Badge tone="neutral" fill="outline">Queued</Badge>
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
          border: "1px solid var(--axon-orange-border)",
          background: "var(--axon-orange-surface)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "var(--aurora-type-caption)",
          fontWeight: 700,
          letterSpacing: "0.075em",
          textTransform: "uppercase",
          color: "var(--axon-orange-strong)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          aria-hidden
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "999px",
            background: "var(--axon-orange)",
            boxShadow: "0 0 6px color-mix(in srgb, var(--axon-orange) 70%, transparent)",
          }}
        />
        Running
      </span>
    )
  }

  // done
  return <Badge tone="success" fill="outline">Done</Badge>
}

function PositionNumber({ children }: { children?: React.ReactNode }) {
  return (
    <span
      className="aurora-text-meta tabular-nums"
      style={{
        color: "var(--aurora-text-muted)",
      }}
    >
      {children}
    </span>
  )
}

function CheckRing() {
  return (
    <CheckCircle2 className="size-[22px] shrink-0" aria-hidden style={{ color: "var(--aurora-success)" }} />
  )
}

function Spinner() {
  return (
    <LoaderCircle
      aria-hidden
      className="size-6 shrink-0 animate-spin"
      strokeWidth={2}
      style={{ color: "var(--axon-orange)" }}
    />
  )
}

export { Queue }
