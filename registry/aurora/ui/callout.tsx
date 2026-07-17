"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function devWarn(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message)
  }
}

export type CalloutVariant = "info" | "success" | "warn" | "error" | "neutral" | "rose"

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
    text:        "var(--aurora-accent-pink-foreground)",
    accentShadow: "0 0 10px var(--aurora-accent-pink)",
    accentInset:  "inset 3px 0 0 var(--aurora-accent-pink)",
  },
}

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CalloutVariant
  title?: React.ReactNode
  icon?: React.ReactNode
}

function Callout({ className, variant = "info", title, icon, children, style, ref, ...props }: CalloutProps & { ref?: React.Ref<HTMLDivElement> }) {
    const safeVariant: CalloutVariant = Object.hasOwn(toneMap, variant) ? variant : "info"
    const titleId = React.useId()
    const bodyId = React.useId()
    if (safeVariant !== variant) {
      devWarn(`[Aurora Callout] Unknown variant "${variant}". Falling back to "info".`)
    }
    const { accent, bg, border, text, accentShadow, accentInset } = toneMap[safeVariant]
    const liveProps =
      safeVariant === "warn" || safeVariant === "error"
        ? { role: "alert" as const, "aria-live": "assertive" as const }
        : { role: "status" as const, "aria-live": "polite" as const }

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
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={children ? bodyId : undefined}
        {...liveProps}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-4 shrink-0 items-center justify-center"
            style={{ color: accent }}
          >
            {icon}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="mt-1.5 size-2 shrink-0 rounded-full"
            style={{ background: accent, boxShadow: accentShadow }}
          />
        )}
        <div className="min-w-0">
          {title && (
            <div id={titleId} style={{ color: "var(--aurora-text-primary)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-label)", letterSpacing: "var(--aurora-letter-ui)", lineHeight: "var(--aurora-line-ui)" }}>
              {title}
            </div>
          )}
          {children && (
            <div id={bodyId} style={{ color: text, fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.5, marginTop: title ? 4 : 0 }}>
              {children}
            </div>
          )}
        </div>
      </div>
    )
}

export { Callout }
export default Callout
