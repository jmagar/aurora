"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CalloutVariant = "info" | "success" | "warn" | "error" | "rose"

const colors: Record<CalloutVariant, string> = {
  info: "var(--aurora-accent-primary)",
  success: "var(--aurora-success)",
  warn: "var(--aurora-warn)",
  error: "var(--aurora-error)",
  rose: "var(--aurora-accent-pink)",
}

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CalloutVariant
  title?: React.ReactNode
  icon?: React.ReactNode
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant = "info", title, icon, children, style, ...props }, ref) => {
    const color = colors[variant]

    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[var(--aurora-radius-1)] border p-4", className)}
        style={{
          background: `color-mix(in srgb, ${color} 8%, var(--aurora-panel-medium))`,
          borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
          boxShadow: `inset 3px 0 0 ${color}`,
          ...style,
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          className="mt-0.5 size-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
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
            <div style={{ color: "var(--aurora-text-muted)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.5, marginTop: title ? 4 : 0 }}>
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
