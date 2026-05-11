"use client"

import * as React from "react"
import { cn, devWarn } from "@/lib/utils"

export type CalloutVariant = "info" | "success" | "warn" | "error" | "neutral" | "rose" | "violet"

type ToneTokens = { accent: string; bg: string; border: string; text: string; accentShadow: string; accentInset: string }

const toneMap: Record<CalloutVariant, ToneTokens> = {
  info: {
    accent:      "var(--aurora-info)",
    bg:          "var(--aurora-info-surface)",
    border:      "var(--aurora-info-border)",
    text:        "var(--aurora-info-foreground)",
    accentShadow: "0 0 10px var(--aurora-info)",
    accentInset:  "inset 3px 0 0 var(--aurora-info)",
  },
  success: {
    accent:      "var(--aurora-success)",
    bg:          "var(--aurora-success-surface)",
    border:      "var(--aurora-success-border)",
    text:        "var(--aurora-success-foreground)",
    accentShadow: "0 0 10px var(--aurora-success)",
    accentInset:  "inset 3px 0 0 var(--aurora-success)",
  },
  warn: {
    accent:      "var(--aurora-warn)",
    bg:          "var(--aurora-warn-surface)",
    border:      "var(--aurora-warn-border)",
    text:        "var(--aurora-warn-foreground)",
    accentShadow: "0 0 10px var(--aurora-warn)",
    accentInset:  "inset 3px 0 0 var(--aurora-warn)",
  },
  error: {
    accent:      "var(--aurora-error)",
    bg:          "var(--aurora-error-surface)",
    border:      "var(--aurora-error-border)",
    text:        "var(--aurora-error-foreground)",
    accentShadow: "0 0 10px var(--aurora-error)",
    accentInset:  "inset 3px 0 0 var(--aurora-error)",
  },
  neutral: {
    accent:      "var(--aurora-neutral)",
    bg:          "var(--aurora-neutral-surface)",
    border:      "var(--aurora-neutral-border)",
    text:        "var(--aurora-neutral-foreground)",
    accentShadow: "0 0 10px var(--aurora-neutral)",
    accentInset:  "inset 3px 0 0 var(--aurora-neutral)",
  },
  rose: {
    accent:      "var(--aurora-accent-pink)",
    bg:          "var(--aurora-accent-pink-surface)",
    border:      "var(--aurora-accent-pink-border)",
    text:        "var(--aurora-accent-pink-strong)",
    accentShadow: "0 0 10px var(--aurora-accent-pink)",
    accentInset:  "inset 3px 0 0 var(--aurora-accent-pink)",
  },
  violet: {
    accent:      "var(--aurora-accent-violet)",
    bg:          "var(--aurora-accent-violet-surface)",
    border:      "var(--aurora-accent-violet-border)",
    text:        "var(--aurora-accent-violet-strong)",
    accentShadow: "0 0 10px var(--aurora-accent-violet)",
    accentInset:  "inset 3px 0 0 var(--aurora-accent-violet)",
  },
}

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CalloutVariant
  title?: React.ReactNode
  icon?: React.ReactNode
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant = "info", title, icon, children, style, ...props }, ref) => {
    const safeVariant: CalloutVariant = variant in toneMap ? variant : "info"
    if (safeVariant !== variant) {
      devWarn(`[Aurora Callout] Unknown variant "${variant}". Falling back to "info".`)
    }
    const { accent, bg, border, text, accentShadow, accentInset } = toneMap[safeVariant]

    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[var(--aurora-radius-1)] border p-4", className)}
        style={{
          background: bg,
          borderColor: border,
          boxShadow: accentInset,
          ...style,
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          className="mt-0.5 size-2 rounded-full"
          style={{ background: accent, boxShadow: accentShadow }}
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
