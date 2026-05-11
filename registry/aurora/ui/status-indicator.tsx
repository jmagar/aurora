"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusTone = "online" | "syncing" | "queued" | "degraded" | "offline" | "error" | "automating"

export const toneColor: Record<StatusTone, { color: string; shadow: string }> = {
  online:     { color: "var(--aurora-success)",        shadow: "0 0 10px var(--aurora-success)" },
  syncing:    { color: "var(--aurora-info)",           shadow: "0 0 10px var(--aurora-info)" },
  queued:     { color: "var(--aurora-neutral)",        shadow: "0 0 10px var(--aurora-neutral)" },
  degraded:   { color: "var(--aurora-warn)",           shadow: "0 0 10px var(--aurora-warn)" },
  offline:    { color: "var(--aurora-neutral)",        shadow: "0 0 10px var(--aurora-neutral)" },
  error:      { color: "var(--aurora-error)",          shadow: "0 0 10px var(--aurora-error)" },
  automating: { color: "var(--aurora-accent-violet)",  shadow: "0 0 10px var(--aurora-accent-violet)" },
}

// Dim tones use muted foreground so the label does not compete with the dot.
const dimTones = new Set<StatusTone>(["queued", "offline"])

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone
  label?: React.ReactNode
  pulse?: boolean
}

function StatusIndicator({ className, tone = "online", label, pulse = tone === "syncing" || tone === "automating", style, ...props }: StatusIndicatorProps) {
  const { color, shadow } = toneColor[tone]
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
        style={{ background: color, boxShadow: shadow }}
      />
      {label ?? tone}
    </span>
  )
}

export { StatusIndicator }
export default StatusIndicator
