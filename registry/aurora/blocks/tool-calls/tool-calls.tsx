"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToolCall {
  id: string
  tool: string
  args: Record<string, unknown>
  status: "running" | "completed" | "error"
  result?: string
  startedAt?: Date
  completedAt?: Date
}

export interface ToolCallsProps {
  calls: ToolCall[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupConsecutive(calls: ToolCall[]): Array<{ tool: string; items: ToolCall[] }> {
  const groups: Array<{ tool: string; items: ToolCall[] }> = []
  for (const call of calls) {
    const last = groups[groups.length - 1]
    if (last && last.tool === call.tool) {
      last.items.push(call)
    } else {
      groups.push({ tool: call.tool, items: [call] })
    }
  }
  return groups
}

function durationMs(call: ToolCall): number | null {
  if (call.startedAt && call.completedAt) {
    return call.completedAt.getTime() - call.startedAt.getTime()
  }
  return null
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function prettifyToolName(tool: string): string {
  return tool
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase())
}

function firstArgPreview(args: Record<string, unknown>): string {
  const vals = Object.values(args)
  if (vals.length === 0) return ""
  const v = vals[0]
  if (typeof v === "string") return v.length > 60 ? v.slice(0, 60) + "…" : v
  return JSON.stringify(v).slice(0, 60)
}

// ---------------------------------------------------------------------------
// Status icon
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: ToolCall["status"] }) {
  if (status === "running") {
    return (
      <span
        style={{
          display: "inline-block",
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          border: "2px solid var(--aurora-accent-primary)",
          borderTopColor: "transparent",
          animation: "aurora-spin 0.7s linear infinite",
          flexShrink: 0,
        }}
      />
    )
  }
  if (status === "error") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="6.5" stroke="var(--aurora-error)" strokeWidth="1.2" />
        <path d="M7 4.5V7.5M7 9.5V9.6" stroke="var(--aurora-error)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6.5" stroke="var(--aurora-success)" strokeWidth="1.2" />
      <path d="M4.5 7L6.2 8.7L9.5 5.3" stroke="var(--aurora-success)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Single call row
// ---------------------------------------------------------------------------

function SingleCallRow({ call, compact = false }: { call: ToolCall; compact?: boolean }) {
  const [expanded, setExpanded] = React.useState(false)
  const ms = durationMs(call)
  const preview = firstArgPreview(call.args)

  const rowBg =
    call.status === "error"
      ? "color-mix(in srgb, var(--aurora-error) 6%, transparent)"
      : call.status === "running"
      ? "transparent"
      : "transparent"

  const borderLeft =
    call.status === "error"
      ? "2px solid var(--aurora-error)"
      : call.status === "running"
      ? "2px solid var(--aurora-accent-primary)"
      : "2px solid var(--aurora-success)"

  return (
    <div
      style={{
        background: rowBg,
        borderLeft,
        marginLeft: compact ? "0" : "0",
      }}
    >
      <Button variant="plain" size="unstyled"
        onClick={() => setExpanded((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: compact ? "5px 10px" : "8px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {call.status === "running" ? (
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "2px solid var(--aurora-accent-primary)",
              borderTopColor: "transparent",
              animation: "aurora-spin 0.7s linear infinite",
              flexShrink: 0,
            }}
          />
        ) : (
          <StatusIcon status={call.status} />
        )}

        <span
          style={{
            fontSize: compact ? "12px" : "13px",
            fontWeight: 500,
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--aurora-font-mono)",
            flexShrink: 0,
          }}
        >
          {call.tool}
        </span>

        {preview && (
          <span
            style={{
              fontSize: "12px",
              color: "var(--aurora-text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              flex: 1,
            }}
          >
            {preview}
          </span>
        )}

        {ms !== null && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              color: "var(--aurora-text-muted)",
              flexShrink: 0,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatDuration(ms)}
          </span>
        )}

        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            color: "var(--aurora-text-muted)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        >
          <path d="M2.5 4.5L6 7.5L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {expanded && (
        <div
          style={{
            padding: "0 12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {/* Args */}
          <div
            style={{
              background: "var(--aurora-control-surface)",
              border: "1px solid var(--aurora-border-default)",
              borderRadius: "10px",
              padding: "8px 10px",
              fontSize: "12px",
              fontFamily: "var(--aurora-font-mono)",
              color: "var(--aurora-text-muted)",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            <span style={{ color: "var(--aurora-text-muted)", fontSize: "10px", display: "block", marginBottom: "4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>args</span>
            {JSON.stringify(call.args, null, 2)}
          </div>

          {/* Result */}
          {call.result && (
            <div
              style={{
                background: "var(--aurora-control-surface)",
                border: "1px solid var(--aurora-border-default)",
                borderRadius: "10px",
                padding: "8px 10px",
                fontSize: "12px",
                fontFamily: "var(--aurora-font-mono)",
                color:
                  call.status === "error"
                    ? "var(--aurora-error)"
                    : "var(--aurora-text-primary)",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                maxHeight: "160px",
                overflowY: "auto",
              }}
            >
              <span
                style={{
                  color: "var(--aurora-text-muted)",
                  fontSize: "10px",
                  display: "block",
                  marginBottom: "4px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                result
              </span>
              {call.result}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Group row
// ---------------------------------------------------------------------------

function GroupRow({ group }: { group: { tool: string; items: ToolCall[] } }) {
  const [expanded, setExpanded] = React.useState(false)
  const { tool, items } = group

  const hasRunning = items.some((c) => c.status === "running")
  const hasError = items.some((c) => c.status === "error")
  const allDone = items.every((c) => c.status === "completed")

  const overallStatus: ToolCall["status"] = hasRunning
    ? "running"
    : hasError
    ? "error"
    : "completed"

  const totalMs = items.reduce((acc, c) => {
    const ms = durationMs(c)
    return ms !== null ? acc + ms : acc
  }, 0)

  const label =
    items.length === 1
      ? prettifyToolName(tool)
      : `${items.length} × ${prettifyToolName(tool)}`

  const borderLeft =
    overallStatus === "error"
      ? "2px solid var(--aurora-error)"
      : overallStatus === "running"
      ? "2px solid var(--aurora-accent-primary)"
      : "2px solid var(--aurora-success)"

  return (
    <div style={{ borderLeft }}>
      <Button variant="plain" size="unstyled"
        onClick={() => setExpanded((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: "6px 10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={expanded}
      >
        {overallStatus === "running" ? (
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "2px solid var(--aurora-accent-primary)",
              borderTopColor: "transparent",
              animation: "aurora-spin 0.7s linear infinite",
              flexShrink: 0,
            }}
          />
        ) : (
          <StatusIcon status={overallStatus} />
        )}

        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--aurora-text-primary)",
          }}
        >
          {label}
        </span>

        {allDone && totalMs > 0 && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              color: "var(--aurora-text-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatDuration(totalMs)}
          </span>
        )}

        {items.length > 1 && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{
              flexShrink: 0,
              marginLeft: allDone && totalMs > 0 ? "6px" : "auto",
              color: "var(--aurora-text-muted)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s",
            }}
          >
            <path d="M2.5 4.5L6 7.5L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Button>

      {/* Expanded sub-list */}
      {expanded && items.length > 1 && (
        <div
          style={{
            marginLeft: "22px",
            borderLeft: "1px solid var(--aurora-border-default)",
            marginBottom: "4px",
          }}
        >
          {items.map((call) => (
            <SingleCallRow key={call.id} call={call} compact />
          ))}
        </div>
      )}

      {/* Single item expanded inline */}
      {expanded && items.length === 1 && (
        <div style={{ marginLeft: "22px" }}>
          <SingleCallRow call={items[0]} compact />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ToolCalls({ calls }: ToolCallsProps) {
  const groups = groupConsecutive(calls)

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes aurora-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes aurora-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div
        style={{
          background: "var(--aurora-panel-medium)",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "var(--aurora-radius-2)",
          overflow: "hidden",
          maxHeight: 420,
          overflowY: "auto",
          boxShadow: "var(--aurora-highlight-medium)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderBottom: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-panel-strong)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1L8.1 4.2L11.5 4.7L9 7.2L9.6 10.6L6.5 9L3.4 10.6L4 7.2L1.5 4.7L4.9 4.2L6.5 1Z" stroke="var(--aurora-accent-primary)" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--aurora-text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            Tool Calls
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              color: "var(--aurora-text-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {calls.length} call{calls.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {groups.map((group, i) => (
            <div
              key={`${group.tool}-${i}`}
              style={{
                borderBottom:
                  i < groups.length - 1
                    ? "1px solid var(--aurora-border-default)"
                    : "none",
              }}
            >
              <GroupRow group={group} />
            </div>
          ))}

          {calls.length === 0 && (
            <div
              style={{
                padding: "20px 12px",
                textAlign: "center",
                fontSize: "13px",
                color: "var(--aurora-text-muted)",
              }}
            >
              No tool calls yet
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ToolCalls
