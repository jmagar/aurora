"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { StatusTone } from "./status-indicator"

const toneColor: Record<StatusTone, string> = {
  online:     "var(--aurora-success)",
  syncing:    "var(--aurora-info)",
  queued:     "var(--aurora-neutral)",
  degraded:   "var(--aurora-warn)",
  offline:    "var(--aurora-neutral)",
  error:      "var(--aurora-error)",
  automating: "var(--aurora-accent-violet)",
}

export type TimelineProps = React.HTMLAttributes<HTMLOListElement>

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
  ({ className, tone = "queued", title, meta, children, ...props }, ref) => (
    <li ref={ref} className={cn("relative grid grid-cols-[20px_minmax(0,1fr)] gap-3 pb-5 last:pb-0", className)} {...props}>
      <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-4 w-px bg-[var(--aurora-border-default)] last:hidden" />
      <span
        aria-hidden="true"
        className="relative mt-1 size-2.5 rounded-full"
        style={{ background: toneColor[tone], boxShadow: `0 0 10px ${toneColor[tone]}` }}
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
)
TimelineItem.displayName = "TimelineItem"

export { Timeline, TimelineItem }
