"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "px-2 py-0.5",
    "text-[10px] font-semibold uppercase tracking-widest leading-none",
    "border",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "text-[var(--aurora-accent-primary)]",
          "border-[color-mix(in_srgb,#29b6f6_30%,transparent)]",
        ].join(" "),
        success: [
          "text-[var(--aurora-success)]",
          "border-[color-mix(in_srgb,#7dd3c7_30%,transparent)]",
        ].join(" "),
        warn: [
          "text-[var(--aurora-warn)]",
          "border-[color-mix(in_srgb,#c6a36b_30%,transparent)]",
        ].join(" "),
        error: [
          "text-[var(--aurora-error)]",
          "border-[color-mix(in_srgb,#c78490_30%,transparent)]",
        ].join(" "),
        rose: [
          "text-[var(--aurora-accent-pink)]",
          "border-[color-mix(in_srgb,#f9a8c4_30%,transparent)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantBgMap: Record<string, string> = {
  default: "color-mix(in srgb, #29b6f6 10%, transparent)",
  success: "color-mix(in srgb, #7dd3c7 10%, transparent)",
  warn: "color-mix(in srgb, #c6a36b 10%, transparent)",
  error: "color-mix(in srgb, #c78490 10%, transparent)",
  rose: "color-mix(in srgb, #f9a8c4 10%, transparent)",
}

const dotColorMap: Record<string, string> = {
  default: "#29b6f6",
  success: "#7dd3c7",
  warn: "#c6a36b",
  error: "#c78490",
  rose: "#f9a8c4",
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot = false, style, children, ...props }, ref) => {
    const resolvedVariant = variant ?? "default"
    const bg = variantBgMap[resolvedVariant] ?? variantBgMap["default"]
    const dotColor = dotColorMap[resolvedVariant] ?? dotColorMap["default"]

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        style={{
          borderRadius: "4px",
          background: bg,
          fontFamily: "var(--aurora-font-mono, 'JetBrains Mono', monospace)",
          ...style,
        }}
        {...props}
      >
        {dot && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: dotColor,
              flexShrink: 0,
              boxShadow: `0 0 4px ${dotColor}`,
            }}
          />
        )}
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
export default Badge
