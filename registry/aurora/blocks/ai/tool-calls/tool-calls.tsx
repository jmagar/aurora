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

const statusColor: Record<ToolCall["status"], string> = {
  running: "var(--aurora-accent-primary)",
  completed: "var(--aurora-success)",
  error: "var(--aurora-error)",
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
        color: "var(--aurora-text-muted)",
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
      }}
    >
      <path d="M2.5 4.5L6 7.5L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatusDot({ status }: { status: ToolCall["status"] }) {
  const color = statusColor[status]

  if (status === "running") {
    return (
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          width: 9,
          height: 9,
          borderRadius: "999px",
          border: `2px solid ${color}`,
          borderTopColor: "transparent",
          animation: "aurora-spin 0.7s linear infinite",
          flexShrink: 0,
        }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: 9,
        height: 9,
        borderRadius: "999px",
        background: color,
        boxShadow: `0 0 8px ${color}`,
        flexShrink: 0,
      }}
    />
  )
}

function ToolBadge({ tool }: { tool: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        minWidth: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        border: "1px solid var(--aurora-border-default)",
        background: "var(--aurora-control-surface)",
        color: "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
        flexShrink: 0,
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

function ToolCallRow({ call }: { call: ToolCall }) {
  const [expanded, setExpanded] = React.useState(false)
  const duration = durationMs(call)

  return (
    <div
      style={{
        display: "inline-block",
        width: expanded ? "min(100%, 560px)" : "fit-content",
        maxWidth: "100%",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: expanded ? 16 : 999,
        background: "var(--aurora-panel-strong)",
        boxShadow: expanded ? "var(--aurora-highlight-medium)" : "none",
        overflow: "hidden",
      }}
    >
      <Button
        variant="plain"
        size="unstyled"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          width: expanded ? "100%" : "auto",
          maxWidth: "100%",
          padding: "8px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <StatusDot status={call.status} />
        <ToolBadge tool={call.tool} />
        <span
          style={{
            color: "var(--aurora-text-primary)",
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.35,
            fontFamily: "var(--aurora-font-mono)",
            whiteSpace: "nowrap",
          }}
        >
          {call.tool}
        </span>
        {duration !== null && (
          <span
            style={{
              color: "var(--aurora-text-muted)",
              fontSize: 11,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {formatDuration(duration)}
          </span>
        )}
        <Chevron expanded={expanded} />
      </Button>

      {expanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "0 12px 12px",
          }}
        >
          <DetailCard label="input">{JSON.stringify(call.args, null, 2)}</DetailCard>
          {call.result && (
            <DetailCard label="output" tone={call.status === "error" ? "var(--aurora-error)" : "var(--aurora-text-primary)"}>
              {call.result}
            </DetailCard>
          )}
        </div>
      )}
    </div>
  )
}

export function ToolCalls({ calls }: ToolCallsProps) {
  return (
    <>
      <style>{`
        @keyframes aurora-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
          width: "100%",
        }}
      >
        {calls.map((call) => (
          <ToolCallRow key={call.id} call={call} />
        ))}

        {calls.length === 0 && (
          <div
            style={{
              color: "var(--aurora-text-muted)",
              fontSize: 12,
            }}
          >
            No tool calls yet
          </div>
        )}
      </div>
    </>
  )
}

export default ToolCalls
