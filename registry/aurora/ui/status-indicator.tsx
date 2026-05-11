"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusTone = "online" | "syncing" | "queued" | "degraded" | "offline" | "error" | "automating"

const toneColor: Record<StatusTone, string> = {
  online:     "var(--aurora-success)",
  syncing:    "var(--aurora-info)",
  queued:     "var(--aurora-neutral)",
  degraded:   "var(--aurora-warn)",
  offline:    "var(--aurora-neutral)",
  error:      "var(--aurora-error)",
  automating: "var(--aurora-accent-violet)",
}

// Dim tones use muted foreground so the label does not compete with the dot.
const dimTones = new Set<StatusTone>(["queued", "offline"])

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone
  label?: React.ReactNode
  pulse?: boolean
}

function StatusIndicator({ className, tone = "online", label, pulse = tone === "syncing", style, ...props }: StatusIndicatorProps) {
  const color = toneColor[tone]
  const labelColor = dimTones.has(tone)
    ? "var(--aurora-neutral-foreground)"
    : "var(--aurora-text-primary)"

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      style={{
        color: labelColor,
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
