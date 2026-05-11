"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { StatusTone } from "./status-indicator"

export type TimelineProps = React.HTMLAttributes<HTMLOListElement>

const toneColor: Record<StatusTone, { color: string; shadow: string }> = {
  online:     { color: "var(--aurora-success)",        shadow: "0 0 10px var(--aurora-success)" },
  syncing:    { color: "var(--aurora-info)",           shadow: "0 0 10px var(--aurora-info)" },
  queued:     { color: "var(--aurora-neutral)",        shadow: "0 0 10px var(--aurora-neutral)" },
  degraded:   { color: "var(--aurora-warn)",           shadow: "0 0 10px var(--aurora-warn)" },
  offline:    { color: "var(--aurora-neutral)",        shadow: "0 0 10px var(--aurora-neutral)" },
  error:      { color: "var(--aurora-error)",          shadow: "0 0 10px var(--aurora-error)" },
  automating: { color: "var(--aurora-accent-violet)",  shadow: "0 0 10px var(--aurora-accent-violet)" },
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn("space-y-0", className)} {...props} />
))
Timeline.displayName = "Timeline"

export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  tone?: StatusTone
  title: React.ReactNode
  meta?: React.ReactNode
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, tone = "queued", title, meta, children, ...props }, ref) => {
    const safeTone = tone in toneColor ? tone : "queued"
    if (tone !== safeTone && process.env.NODE_ENV !== "production") {
      console.warn(`[Aurora TimelineItem] Unknown tone "${tone}". Valid values: ${Object.keys(toneColor).join(", ")}. Falling back to "queued".`)
    }

    return (
      <li ref={ref} className={cn("relative grid grid-cols-[20px_minmax(0,1fr)] gap-3 pb-5 last:pb-0", className)} {...props}>
        <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-4 w-px bg-[var(--aurora-border-default)] last:hidden" />
        <span
          aria-hidden="true"
          className="relative mt-1 size-2.5 rounded-full"
          style={{ background: toneColor[safeTone].color, boxShadow: toneColor[safeTone].shadow }}
        />
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span style={{ color: "var(--aurora-text-primary)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-label)", letterSpacing: "var(--aurora-letter-ui)", lineHeight: "var(--aurora-line-dense)" }}>{title}</span>
            {meta && <span style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-caption)", fontWeight: "var(--aurora-weight-ui)", letterSpacing: "var(--aurora-letter-meta)", lineHeight: 1.35 }}>{meta}</span>}
          </span>
          {children && <span className="block pt-1" style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.5 }}>{children}</span>}
        </span>
      </li>
    )
  }
)
TimelineItem.displayName = "TimelineItem"

export { Timeline, TimelineItem }
