"use client"

import * as React from "react"
import { Bot, CircleDashed, CirclePlus, Clock, SquareCode, Star } from "lucide-react"
import { Badge } from "@/registry/aurora/ui/badge"
import { Spinner } from "@/registry/aurora/ui/spinner"

export type AgentStatus = "idle" | "running" | "blocked" | "completed"

export interface AgentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Agent display name. */
  name: string
  /** Short role / responsibility line under the name. */
  role?: string
  /** Lifecycle status — drives the status pill and live affordances. */
  status?: AgentStatus
  /** Render the rose "AGENT" identity chip beside the name. */
  badge?: boolean
  /** Model identifier shown in the metadata footer (mono). */
  model?: string
  /** Current task description shown in the activity row. */
  task?: string
  /** Progress 0..1 — renders the determinate progress bar + percentage. */
  progress?: number
  /** Token usage shown in the footer (formatted to k). */
  tokens?: number
  /** Elapsed time string shown in the footer. */
  elapsed?: string
  /** Layout density. "compact" = single-line tile for grids. */
  variant?: "default" | "compact"
}

const statusTone: Record<AgentStatus, "success" | "warn" | "neutral"> = {
  running: "success",
  completed: "success",
  blocked: "warn",
  idle: "neutral",
}

function formatTokens(value: number): string {
  if (value >= 1000) {
    const k = value / 1000
    return `${Number.isInteger(k) ? k : k.toFixed(1)}k`
  }
  return String(value)
}

function panelStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--aurora-surface-raised)",
    border: "1px solid var(--aurora-border-default)",
    borderRadius: "var(--aurora-radius-1)",
    boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
    ...style,
  }
}

interface AvatarProps {
  status: AgentStatus
  size: number
}

function AgentAvatar({ status, size }: AvatarProps) {
  const dotSize = Math.round(size * 0.3)
  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "calc(var(--aurora-radius-1) - 2px)",
        background: "color-mix(in srgb, var(--aurora-accent-pink) 8%, var(--aurora-control-surface))",
        border: "1px solid color-mix(in srgb, var(--aurora-accent-pink) 24%, var(--aurora-border-strong))",
      }}
    >
      <Bot
        style={{
          width: Math.round(size * 0.5),
          height: Math.round(size * 0.5),
          color: "var(--aurora-accent-pink)",
        }}
      />
      {status === "running" ? (
        <span
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: "var(--aurora-success)",
            border: "2px solid var(--aurora-page-bg)",
            boxShadow: "0 0 6px var(--aurora-success)",
          }}
        />
      ) : null}
    </span>
  )
}

const Agent = React.forwardRef<HTMLDivElement, AgentProps>(
  (
    {
      name,
      role,
      status = "idle",
      badge = false,
      model,
      task,
      progress,
      tokens,
      elapsed,
      variant = "default",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const tone = statusTone[status]
    const hasProgress = typeof progress === "number"
    const pct = hasProgress ? Math.round(Math.min(1, Math.max(0, progress)) * 100) : 0

    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={["flex items-center gap-3", className].filter(Boolean).join(" ")}
          style={panelStyle({ padding: "12px 14px", ...style })}
          {...props}
        >
          <AgentAvatar status={status} size={36} />
          <span
            className="min-w-0 flex-1 truncate aurora-text-control"
            style={{ color: "var(--aurora-text-primary)", fontWeight: 700, fontSize: "15px" }}
          >
            {name}
          </span>
          <Badge variant={tone} size="sm" dot={status === "running"}>
            {status}
          </Badge>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={["flex flex-col", className].filter(Boolean).join(" ")}
        style={panelStyle({ padding: "16px 18px", gap: "14px", ...style })}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <AgentAvatar status={status} size={52} />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span
                className="truncate"
                style={{
                  color: "var(--aurora-text-primary)",
                  fontFamily: "var(--aurora-font-display)",
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: 1.2,
                }}
              >
                {name}
              </span>
              {badge ? (
                <Badge variant="rose" size="sm">
                  <Star aria-hidden style={{ width: 10, height: 10 }} />
                  Agent
                </Badge>
              ) : null}
            </span>
            {role ? (
              <span
                className="block truncate"
                style={{
                  color: "var(--aurora-text-muted)",
                  fontFamily: "var(--aurora-font-sans)",
                  fontSize: "14px",
                  marginTop: 2,
                }}
              >
                {role}
              </span>
            ) : null}
          </span>
          <Badge variant={tone} dot={status === "running" || status === "completed"}>
            {status}
          </Badge>
        </div>

        {/* Activity */}
        {task ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {status === "running" ? (
                <Spinner size="sm" tone="cyan" />
              ) : (
                <CircleDashed
                  aria-hidden
                  style={{ width: 18, height: 18, color: "var(--aurora-text-muted)", flexShrink: 0 }}
                />
              )}
              <span
                className="min-w-0 flex-1 truncate"
                style={{
                  color: "var(--aurora-text-primary)",
                  fontFamily: "var(--aurora-font-sans)",
                  fontSize: "16px",
                }}
              >
                {task}
              </span>
              {hasProgress ? (
                <span
                  style={{
                    color: "var(--aurora-text-muted)",
                    fontFamily: "var(--aurora-font-mono)",
                    fontSize: "15px",
                    flexShrink: 0,
                  }}
                >
                  {pct}%
                </span>
              ) : null}
            </div>
            {hasProgress ? (
              <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{
                  height: 6,
                  borderRadius: 999,
                  background: "color-mix(in srgb, var(--aurora-success) 14%, var(--aurora-control-surface))",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: "100%",
                    width: `${pct}%`,
                    borderRadius: 999,
                    background: "var(--aurora-success)",
                    boxShadow: "0 0 8px color-mix(in srgb, var(--aurora-success) 50%, transparent)",
                    transition: "width var(--motion-medium, 240ms) ease",
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Footer */}
        {model || typeof tokens === "number" || elapsed ? (
          <div
            className="flex items-center justify-between gap-3"
            style={{ borderTop: "1px solid var(--aurora-border-default)", paddingTop: 12 }}
          >
            {model ? (
              <span className="flex min-w-0 items-center gap-2">
                <SquareCode
                  aria-hidden
                  style={{ width: 16, height: 16, color: "var(--aurora-text-muted)", flexShrink: 0 }}
                />
                <span
                  className="truncate"
                  style={{
                    color: "var(--aurora-text-muted)",
                    fontFamily: "var(--aurora-font-mono)",
                    fontSize: "15px",
                  }}
                >
                  {model}
                </span>
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-5">
              {typeof tokens === "number" ? (
                <span className="flex items-center gap-1.5">
                  <CirclePlus
                    aria-hidden
                    style={{ width: 16, height: 16, color: "var(--aurora-text-muted)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      color: "var(--aurora-text-primary)",
                      fontFamily: "var(--aurora-font-mono)",
                      fontSize: "15px",
                    }}
                  >
                    {formatTokens(tokens)}
                  </span>
                </span>
              ) : null}
              {elapsed ? (
                <span className="flex items-center gap-1.5">
                  <Clock
                    aria-hidden
                    style={{ width: 16, height: 16, color: "var(--aurora-text-muted)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      color: "var(--aurora-text-primary)",
                      fontFamily: "var(--aurora-font-mono)",
                      fontSize: "15px",
                    }}
                  >
                    {elapsed}
                  </span>
                </span>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>
    )
  }
)
Agent.displayName = "Agent"

export { Agent }
export default Agent
