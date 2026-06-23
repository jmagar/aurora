"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { toneColor } from "./status-indicator"
import type { StatusTone } from "./status-indicator"

function devWarn(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message)
  }
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
  /**
   * Inline dot overrides. Spread after the semantic tone colors so callers can
   * override background or boxShadow sparingly when a surface needs a one-off
   * dot treatment without changing the tone-to-color contract. Mirrors the same
   * escape hatch on StatusIndicator.
   */
  dotStyle?: React.CSSProperties
}

// Dim tones render as a hollow ring (outline only, no fill) so a queued/idle
// step reads as "not yet reached" against the filled done/active dots — matching
// the Claude Design Timeline spec.
const hollowTones = new Set<StatusTone>(["queued", "offline"])

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, tone = "queued", title, meta, children, dotStyle, ...props }, ref) => {
    const safeTone = Object.hasOwn(toneColor, tone) ? tone : "queued"
    if (tone !== safeTone) {
      devWarn(`[Aurora TimelineItem] Unknown tone "${tone}". Valid values: ${Object.keys(toneColor).join(", ")}. Falling back to "queued".`)
    }

    const isHollow = hollowTones.has(safeTone)
    const dotColor = toneColor[safeTone].color

    return (
      <li ref={ref} className={cn("group/item relative grid grid-cols-[20px_minmax(0,1fr)] gap-3 pb-5 last:pb-0", className)} {...props}>
        <span aria-hidden="true" className="absolute bottom-0 left-[6px] top-[18px] w-px bg-[var(--aurora-border-default)] group-last/item:hidden" />
        <span
          aria-hidden="true"
          className="relative mt-1 size-3 shrink-0 rounded-full"
          style={{
            ...(isHollow
              ? { background: "transparent", boxShadow: `inset 0 0 0 2px ${dotColor}` }
              : { background: dotColor, boxShadow: toneColor[safeTone].shadow }),
            ...dotStyle,
          }}
        />
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span style={{ color: "var(--aurora-text-primary)", fontSize: "var(--aurora-type-body)", fontWeight: "var(--aurora-weight-label)", letterSpacing: "var(--aurora-letter-ui)", lineHeight: "var(--aurora-line-dense)" }}>{title}</span>
            {meta && <span style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-ui)", letterSpacing: "var(--aurora-letter-meta)", lineHeight: 1.35 }}>{meta}</span>}
          </span>
          {children && <span className="block pt-1" style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.5 }}>{children}</span>}
        </span>
      </li>
    )
  }
)
TimelineItem.displayName = "TimelineItem"

export { Timeline, TimelineItem }
