"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"

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

type ToolCallGroup = {
  tool: string
  items: ToolCall[]
}

const statusColor: Record<ToolCall["status"], string> = {
  running: "var(--aurora-accent-primary)",
  completed: "var(--aurora-success)",
  error: "var(--aurora-error)",
}

function groupConsecutive(calls: ToolCall[]): ToolCallGroup[] {
  const groups: ToolCallGroup[] = []

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

  const first = vals[0]
  if (typeof first === "string") {
    return first.length > 72 ? `${first.slice(0, 72)}…` : first
  }

  return JSON.stringify(first).slice(0, 72)
}

function toolGlyph(tool: string): string {
  const segment = tool.split(/[._]/).filter(Boolean).at(-1) ?? tool
  return segment.slice(0, 2).toUpperCase()
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
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
        transition: "transform 0.15s ease",
      }}
    >
      <path d="M2.5 4.5L6 7.5L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatusDot({ status, showConnector }: { status: ToolCall["status"]; showConnector: boolean }) {
  const color = statusColor[status]

  return (
    <span style={{ position: "relative", display: "flex", justifyContent: "center", paddingTop: 4 }}>
      {showConnector && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 14,
            bottom: -22,
            width: 1,
            background: "var(--aurora-border-default)",
          }}
        />
      )}

      {status === "running" ? (
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            display: "inline-flex",
            width: 10,
            height: 10,
            borderRadius: "999px",
            border: `2px solid ${color}`,
            borderTopColor: "transparent",
            animation: "aurora-spin 0.7s linear infinite",
            background: "transparent",
          }}
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            display: "inline-flex",
            width: 10,
            height: 10,
            borderRadius: "999px",
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      )}
    </span>
  )
}

function ToolBadge({ tool }: { tool: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        minWidth: 22,
        height: 22,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        border: "1px solid var(--aurora-border-default)",
        background: "var(--aurora-control-surface)",
        color: "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      {toolGlyph(tool)}
    </span>
  )
}

function DetailCard({
  label,
  children,
  tone = "var(--aurora-text-primary)",
}: {
  label: string
  children: React.ReactNode
  tone?: string
}) {
  return (
    <div
      style={{
        background: "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: 12,
        padding: "9px 11px",
        color: tone,
        fontSize: 12,
        fontFamily: "var(--aurora-font-mono)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        overflowX: "auto",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: 6,
          color: "var(--aurora-text-muted)",
          fontSize: 10,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  )
}

function SingleCallRow({
  call,
  compact = false,
  isLast = false,
}: {
  call: ToolCall
  compact?: boolean
  isLast?: boolean
}) {
  const [expanded, setExpanded] = React.useState(false)
  const duration = durationMs(call)
  const preview = firstArgPreview(call.args)

  return (
    <div style={{ position: "relative" }}>
      <Button
        variant="plain"
        size="unstyled"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        style={{
          display: "grid",
          gridTemplateColumns: "20px minmax(0,1fr)",
          alignItems: "start",
          gap: 10,
          width: "100%",
          padding: compact ? "7px 0" : "8px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <StatusDot status={call.status} showConnector={!compact && !isLast} />

        <span className="min-w-0">
          <span
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ToolBadge tool={call.tool} />
            <span
              style={{
                color: "var(--aurora-text-primary)",
                fontSize: compact ? 12 : 13,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              {prettifyToolName(call.tool)}
            </span>
            {duration !== null && (
              <span
                style={{
                  marginLeft: "auto",
                  color: "var(--aurora-text-muted)",
                  fontSize: 11,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatDuration(duration)}
              </span>
            )}
            <Chevron expanded={expanded} />
          </span>

          {preview && !expanded && (
            <span
              style={{
                display: "block",
                paddingTop: 4,
                color: "var(--aurora-text-muted)",
                fontSize: 12,
                lineHeight: 1.45,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {preview}
            </span>
          )}
        </span>
      </Button>

      {expanded && (
        <div
          style={{
            marginLeft: 30,
            padding: compact ? "0 0 10px" : "0 12px 12px 0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <DetailCard label="args">{JSON.stringify(call.args, null, 2)}</DetailCard>
          {call.result && (
            <DetailCard label="result" tone={call.status === "error" ? "var(--aurora-error)" : "var(--aurora-text-primary)"}>
              {call.result}
            </DetailCard>
          )}
        </div>
      )}
    </div>
  )
}

function GroupRow({
  group,
  isLast = false,
}: {
  group: ToolCallGroup
  isLast?: boolean
}) {
  const [expanded, setExpanded] = React.useState(false)
  const hasRunning = group.items.some((item) => item.status === "running")
  const hasError = group.items.some((item) => item.status === "error")
  const overallStatus: ToolCall["status"] = hasRunning ? "running" : hasError ? "error" : "completed"

  const totalMs = group.items.reduce((sum, item) => {
    const duration = durationMs(item)
    return duration === null ? sum : sum + duration
  }, 0)

  return (
    <div style={{ position: "relative" }}>
      <Button
        variant="plain"
        size="unstyled"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        style={{
          display: "grid",
          gridTemplateColumns: "20px minmax(0,1fr)",
          alignItems: "start",
          gap: 10,
          width: "100%",
          padding: "8px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <StatusDot status={overallStatus} showConnector={!isLast} />

        <span className="min-w-0">
          <span
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ToolBadge tool={group.tool} />
            <span
              style={{
                color: "var(--aurora-text-primary)",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              {group.items.length} × {prettifyToolName(group.tool)}
            </span>
            {totalMs > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  color: "var(--aurora-text-muted)",
                  fontSize: 11,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatDuration(totalMs)}
              </span>
            )}
            <Chevron expanded={expanded} />
          </span>

          <span
            style={{
              display: "block",
              paddingTop: 4,
              color: "var(--aurora-text-muted)",
              fontSize: 12,
              lineHeight: 1.45,
            }}
          >
            {expanded ? "Hide grouped calls" : `${group.items.length} calls grouped together`}
          </span>
        </span>
      </Button>

      {expanded && (
        <div
          style={{
            marginLeft: 30,
            marginRight: 12,
            marginBottom: 10,
            paddingLeft: 10,
            borderLeft: "1px solid var(--aurora-border-default)",
          }}
        >
          {group.items.map((call, index) => (
            <SingleCallRow
              key={call.id}
              call={call}
              compact
              isLast={index === group.items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ToolCalls({ calls }: ToolCallsProps) {
  const groups = groupConsecutive(calls)

  return (
    <>
      <style>{`
        @keyframes aurora-spin {
          to { transform: rotate(360deg); }
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
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
              fontSize: 12,
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
              fontSize: 11,
              color: "var(--aurora-text-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {calls.length} call{calls.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "4px 0" }}>
          {groups.map((group, index) => (
            <div
              key={`${group.tool}-${index}`}
              style={{
                borderBottom: index < groups.length - 1 ? "1px solid var(--aurora-border-default)" : "none",
              }}
            >
              {group.items.length === 1 ? (
                <SingleCallRow call={group.items[0]} isLast={index === groups.length - 1} />
              ) : (
                <GroupRow group={group} isLast={index === groups.length - 1} />
              )}
            </div>
          ))}

          {calls.length === 0 && (
            <div
              style={{
                padding: "20px 12px",
                textAlign: "center",
                fontSize: 13,
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
