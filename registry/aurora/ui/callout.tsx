"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CalloutVariant = "info" | "success" | "warn" | "error" | "neutral" | "rose" | "violet"

type ToneTokens = { accent: string; bg: string; border: string; text: string }

const toneMap: Record<CalloutVariant, ToneTokens> = {
  info: {
    accent: "var(--aurora-info)",
    bg:     "var(--aurora-info-surface)",
    border: "var(--aurora-info-border)",
    text:   "var(--aurora-info-foreground)",
  },
  success: {
    accent: "var(--aurora-success)",
    bg:     "var(--aurora-success-surface)",
    border: "var(--aurora-success-border)",
    text:   "var(--aurora-success-foreground)",
  },
  warn: {
    accent: "var(--aurora-warn)",
    bg:     "var(--aurora-warn-surface)",
    border: "var(--aurora-warn-border)",
    text:   "var(--aurora-warn-foreground)",
  },
  error: {
    accent: "var(--aurora-error)",
    bg:     "var(--aurora-error-surface)",
    border: "var(--aurora-error-border)",
    text:   "var(--aurora-error-foreground)",
  },
  neutral: {
    accent: "var(--aurora-neutral)",
    bg:     "var(--aurora-neutral-surface)",
    border: "var(--aurora-neutral-border)",
    text:   "var(--aurora-neutral-foreground)",
  },
  rose: {
    accent: "var(--aurora-accent-pink)",
    bg:     "var(--aurora-accent-pink-surface)",
    border: "var(--aurora-accent-pink-border)",
    text:   "var(--aurora-accent-pink-strong)",
  },
  violet: {
    accent: "var(--aurora-accent-violet)",
    bg:     "var(--aurora-accent-violet-surface)",
    border: "var(--aurora-accent-violet-border)",
    text:   "var(--aurora-accent-violet-strong)",
  },
}

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CalloutVariant
  title?: React.ReactNode
  icon?: React.ReactNode
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant = "info", title, icon, children, style, ...props }, ref) => {
    const { accent, bg, border, text } = toneMap[variant]

    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[var(--aurora-radius-1)] border p-4", className)}
        style={{
          background: bg,
          borderColor: border,
          boxShadow: `inset 3px 0 0 ${accent}`,
          ...style,
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          className="mt-0.5 size-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          {title && (
            <div style={{ color: "var(--aurora-text-primary)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-label)", letterSpacing: "var(--aurora-letter-ui)", lineHeight: "var(--aurora-line-ui)" }}>
              {title}
            </div>
          )}
          {children && (
            <div style={{ color: text, fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.5, marginTop: title ? 4 : 0 }}>
              {children}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Callout.displayName = "Callout"

export { Callout }
export default Callout
