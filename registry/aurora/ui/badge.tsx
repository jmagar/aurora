"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "px-2 py-0.5",
    "uppercase leading-none",
    "border",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "text-[var(--aurora-accent-primary)]",
          "border-[color-mix(in_srgb,var(--aurora-accent-primary)_30%,transparent)]",
        ].join(" "),
        success: [
          "text-[var(--aurora-success)]",
          "border-[color-mix(in_srgb,var(--aurora-success)_30%,transparent)]",
        ].join(" "),
        warn: [
          "text-[var(--aurora-warn)]",
          "border-[color-mix(in_srgb,var(--aurora-warn)_30%,transparent)]",
        ].join(" "),
        error: [
          "text-[var(--aurora-error)]",
          "border-[color-mix(in_srgb,var(--aurora-error)_30%,transparent)]",
        ].join(" "),
        rose: [
          "text-[var(--aurora-accent-pink)]",
          "border-[color-mix(in_srgb,var(--aurora-accent-pink)_30%,transparent)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantBgMap: Record<string, string> = {
  default: "color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent)",
  success: "color-mix(in srgb, var(--aurora-success) 10%, transparent)",
  warn: "color-mix(in srgb, var(--aurora-warn) 10%, transparent)",
  error: "color-mix(in srgb, var(--aurora-error) 10%, transparent)",
  rose: "color-mix(in srgb, var(--aurora-accent-pink) 10%, transparent)",
}

const dotColorMap: Record<string, string> = {
  default: "var(--aurora-accent-primary)",
  success: "var(--aurora-success)",
  warn: "var(--aurora-warn)",
  error: "var(--aurora-error)",
  rose: "var(--aurora-accent-pink)",
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
          fontSize: "var(--aurora-type-micro)",
          fontWeight: 650,
          letterSpacing: "0.075em",
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
