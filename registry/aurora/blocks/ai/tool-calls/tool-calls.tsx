"use client"

import * as React from "react"
import { ChevronDown, FilePenLine, FileText, Search, Terminal, Wrench } from "lucide-react"
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

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <ChevronDown
      size={12}
      aria-hidden="true"
      style={{
        color: "var(--aurora-text-muted)",
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
      }}
    />
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

function ToolIcon({ tool }: { tool: string }) {
  const normalized = tool.toLowerCase()
  const Icon = normalized.includes("read")
    ? FileText
    : normalized.includes("write")
    ? FilePenLine
    : normalized.includes("bash") || normalized.includes("shell") || normalized.includes("terminal")
    ? Terminal
    : normalized.includes("grep") || normalized.includes("search") || normalized.includes("lookup")
    ? Search
    : Wrench

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        border: "1px solid var(--aurora-border-default)",
        background: "var(--aurora-control-surface)",
        color: "var(--aurora-accent-strong)",
        flexShrink: 0,
      }}
    >
      <Icon size={13} strokeWidth={1.8} />
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
        aria-label={`${call.tool} tool call, ${call.status}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          width: expanded ? "100%" : "auto",
          maxWidth: "100%",
          padding: expanded ? "8px 12px" : "7px 9px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <StatusDot status={call.status} />
        <ToolIcon tool={call.tool} />
        {expanded && (
          <>
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
          </>
        )}
        <span
          style={
            expanded
              ? {
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                }
              : {
                  display: "inline-flex",
                  alignItems: "center",
                }
          }
        >
          <Chevron expanded={expanded} />
        </span>
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

const TOOL_CALLS_KEYFRAMES = `
@keyframes aurora-spin {
  to { transform: rotate(360deg); }
}
`

export function ToolCalls({ calls }: ToolCallsProps) {
  return (
    <>
      <style href="aurora-tool-calls-keyframes" precedence="default">{TOOL_CALLS_KEYFRAMES}</style>

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
