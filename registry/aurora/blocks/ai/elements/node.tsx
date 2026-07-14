"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Node — a flow-graph node card with a status accent, an interactive selected
 * state, and left/right connection handles.
 *
 * The status accent is a rounded bar inset on the left edge plus a matching
 * status dot before the title. Selecting the node draws a rose ring around the
 * whole card. Connection handles are the hollow cyan rings that straddle the
 * left and right vertical-center edges.
 */

export type NodeStatus = "idle" | "running" | "done" | "error"

export interface NodeProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  /** Drives the left accent bar + status dot color. */
  status?: NodeStatus
  /** Draws the rose selection ring + reports aria-pressed when interactive. */
  selected?: boolean
  /** Show the left/right connection handles. Defaults to true. */
  handles?: boolean
}

const statusColor: Record<NodeStatus, string> = {
  idle: "var(--aurora-text-muted)",
  running: "var(--aurora-accent-primary)",
  done: "var(--aurora-success)",
  error: "var(--aurora-error)",
}

const Node = React.forwardRef<HTMLDivElement, NodeProps>(
  (
    {
      title,
      description,
      status = "idle",
      selected = false,
      handles = true,
      className,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    const interactive = typeof onClick === "function"
    const accent = statusColor[status]

    return (
      <div
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-pressed={interactive ? selected : undefined}
        onClick={onClick}
        onKeyDown={
          interactive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  ;(event.currentTarget as HTMLElement).click()
                }
              }
            : undefined
        }
        className={cn("aurora-node", interactive && "aurora-node--interactive", className)}
        style={
          {
            "--node-accent": accent,
            position: "relative",
            boxSizing: "border-box",
            width: "13.5rem",
            paddingTop: "13px",
            paddingBottom: "13px",
            paddingLeft: "22px",
            paddingRight: "16px",
            background: "var(--aurora-surface-raised)",
            border: selected
              ? "1px solid color-mix(in srgb, var(--aurora-accent-pink) 70%, transparent)"
              : "1px solid var(--aurora-border-default)",
            borderRadius: "var(--aurora-radius-2)",
            boxShadow: selected
              ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-pink) 55%, transparent), 0 0 18px color-mix(in srgb, var(--aurora-accent-pink) 22%, transparent), var(--aurora-shadow-medium)"
              : "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
            cursor: interactive ? "pointer" : undefined,
            transition:
              "border-color var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease), box-shadow var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease)",
            outline: "none",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Left status accent bar */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "6px",
            top: "10px",
            bottom: "10px",
            width: "3px",
            borderRadius: "999px",
            background: "var(--node-accent)",
            boxShadow: "0 0 8px color-mix(in srgb, var(--node-accent) 45%, transparent)",
          }}
        />

        <div
          className="aurora-text-control"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--aurora-text-primary)",
            fontWeight: 700,
          }}
        >
          <span
            aria-hidden
            style={{
              flex: "none",
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              background: "var(--node-accent)",
              boxShadow: "0 0 6px color-mix(in srgb, var(--node-accent) 55%, transparent)",
            }}
          />
          {title}
        </div>

        {description ? (
          <div className="aurora-text-meta" style={{ marginTop: "4px", color: "var(--aurora-text-muted)" }}>
            {description}
          </div>
        ) : null}

        {/* Connection handles */}
        {handles ? (
          <>
            <span
              aria-hidden
              className="aurora-node__handle aurora-node__handle--left"
              style={handleStyle("left", selected)}
            />
            <span
              aria-hidden
              className="aurora-node__handle aurora-node__handle--right"
              style={handleStyle("right", selected)}
            />
          </>
        ) : null}
      </div>
    )
  }
)
Node.displayName = "Node"

function handleStyle(side: "left" | "right", selected: boolean): React.CSSProperties {
  const ring = selected ? "var(--aurora-accent-pink)" : "var(--aurora-accent-primary)"
  return {
    position: "absolute",
    top: "50%",
    [side]: "-7px",
    transform: "translateY(-50%)",
    width: "14px",
    height: "14px",
    borderRadius: "999px",
    background: "var(--aurora-page-bg)",
    border: `2px solid ${ring}`,
    boxShadow: `0 0 6px color-mix(in srgb, ${ring} 40%, transparent)`,
  }
}

export { Node }
