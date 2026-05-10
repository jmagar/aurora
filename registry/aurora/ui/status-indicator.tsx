"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusTone = "online" | "syncing" | "queued" | "degraded" | "offline" | "error"

const toneColor: Record<StatusTone, string> = {
  online: "var(--aurora-success)",
  syncing: "var(--aurora-accent-primary)",
  queued: "var(--aurora-text-muted)",
  degraded: "var(--aurora-warn)",
  offline: "var(--aurora-text-muted)",
  error: "var(--aurora-error)",
}

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone
  label?: React.ReactNode
  pulse?: boolean
}

function StatusIndicator({ className, tone = "online", label, pulse = tone === "syncing", style, ...props }: StatusIndicatorProps) {
  const color = toneColor[tone]

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      style={{
        color: "var(--aurora-text-primary)",
        fontSize: "var(--aurora-type-body-sm)",
        fontWeight: "var(--aurora-weight-ui)",
        lineHeight: "var(--aurora-line-ui)",
        ...style,
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 rounded-full", pulse && "animate-pulse")}
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      {label ?? tone}
    </span>
  )
}

export { StatusIndicator }
export default StatusIndicator
