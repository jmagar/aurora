"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const shimmerVariants = cva("aurora-ai-shimmer-bar shrink-0 overflow-hidden", {
  variants: {
    variant: {
      // Single skeleton line.
      line: "h-3 w-full rounded-full",
      // Stack of skeleton lines (rendered as a flex column wrapper).
      lines: "",
      // Solid block / media placeholder.
      block: "h-24 w-full rounded-[var(--aurora-radius-1)]",
      // Circular avatar placeholder.
      avatar: "size-10 rounded-full",
      // Card composition (avatar + text rows in an elevated panel).
      card: "",
    },
  },
  defaultVariants: {
    variant: "line",
  },
})

type ShimmerBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> &
  VariantProps<typeof shimmerVariants> & {
    /** Number of lines to render when `variant="lines"`. */
    lines?: number
  }

export type ShimmerProps = ShimmerBaseProps

function ShimmerBar({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("aurora-ai-shimmer-bar shrink-0 overflow-hidden", className)}
      style={style}
    />
  )
}

const Shimmer = React.forwardRef<HTMLDivElement, ShimmerProps>(
  ({ className, style, variant = "line", lines = 3, role, ...props }, ref) => {
    const a11y = {
      role: role ?? "status",
      "aria-busy": true as const,
      "aria-live": "polite" as const,
      "aria-label": props["aria-label"] ?? "Loading content",
    }

    // Multiple stacked lines; the final line is shortened to read as a paragraph.
    if (variant === "lines") {
      return (
        <div
          ref={ref}
          className={cn("flex w-full flex-col gap-2.5", className)}
          style={style}
          {...a11y}
          {...props}
        >
          {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
            <ShimmerBar
              key={i}
              className="h-3 rounded-full"
              style={{ width: i === lines - 1 ? "62%" : "100%" }}
            />
          ))}
        </div>
      )
    }

    // Card: elevated panel with an avatar and three text rows.
    if (variant === "card") {
      return (
        <div
          ref={ref}
          className={cn("flex w-full items-start gap-4", className)}
          style={{
            padding: "16px 18px",
            borderRadius: "var(--aurora-radius-2)",
            border: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-panel-medium)",
            boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
            ...style,
          }}
          {...a11y}
          {...props}
        >
          <ShimmerBar className="aurora-ai-shimmer-bar size-12 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1">
            <ShimmerBar className="h-3 rounded-full" style={{ width: "52%" }} />
            <ShimmerBar className="h-3 rounded-full" style={{ width: "100%" }} />
            <ShimmerBar className="h-3 rounded-full" style={{ width: "76%" }} />
          </div>
        </div>
      )
    }

    // Single line / block / avatar primitives.
    return (
      <div
        ref={ref}
        className={cn(shimmerVariants({ variant }), className)}
        style={style}
        {...a11y}
        {...props}
      />
    )
  }
)
Shimmer.displayName = "Shimmer"

export { Shimmer, shimmerVariants }
