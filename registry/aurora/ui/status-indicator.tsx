"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusTone = "online" | "syncing" | "queued" | "degraded" | "offline" | "error" | "automating"

const toneColor: Record<StatusTone, { color: string; shadow: string }> = {
  online:     { color: "var(--aurora-success)",        shadow: "0 0 10px var(--aurora-success)" },
  syncing:    { color: "var(--aurora-info)",           shadow: "0 0 10px var(--aurora-info)" },
  queued:     { color: "var(--aurora-neutral)",        shadow: "0 0 10px var(--aurora-neutral)" },
  degraded:   { color: "var(--aurora-warn)",           shadow: "0 0 10px var(--aurora-warn)" },
  offline:    { color: "var(--aurora-neutral)",        shadow: "0 0 10px var(--aurora-neutral)" },
  error:      { color: "var(--aurora-error)",          shadow: "0 0 10px var(--aurora-error)" },
  automating: { color: "var(--aurora-accent-violet)",  shadow: "0 0 10px var(--aurora-accent-violet)" },
}

// Dim tones use --aurora-neutral-foreground so the label does not compete visually with the dot.
const isDim: Record<StatusTone, boolean> = {
  online:     false,
  syncing:    false,
  queued:     true,
  degraded:   false,
  offline:    true,
  error:      false,
  automating: false,
}

const pulseTones = new Set<StatusTone>(["syncing", "automating"])

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone
  label?: React.ReactNode
  pulse?: boolean
}

function StatusIndicator({ className, tone = "online", label, pulse, style, ...props }: StatusIndicatorProps) {
  const safeTone = tone in toneColor ? tone : "online"
  if (tone !== safeTone && process.env.NODE_ENV !== "production") {
    console.warn(`[Aurora StatusIndicator] Unknown tone "${tone}". Valid values: ${Object.keys(toneColor).join(", ")}. Falling back to "online".`)
  }

  const resolvedPulse = pulse ?? pulseTones.has(safeTone)
  const { color, shadow } = toneColor[safeTone]
  const labelColor = isDim[safeTone]
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
        className={cn("size-2 rounded-full", resolvedPulse && "animate-pulse")}
        style={{ background: color, boxShadow: shadow }}
      />
      {label ?? tone}
    </span>
  )
}

export { StatusIndicator }
export default StatusIndicator
