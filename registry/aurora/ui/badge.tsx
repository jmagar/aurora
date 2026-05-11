"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Aurora badge tones: semantic roles (info/success/warn/error/neutral)
// and expressive identities (rose/violet).
// "default" is preserved as a backward-compatible alias for "neutral" —
// existing callers using variant="default" for running/provisioning states
// will render with neutral styling without any prop changes.
export type BadgeTone = "info" | "success" | "warn" | "error" | "neutral" | "rose" | "violet"

type ToneTokens = { text: string; border: string; bg: string; dot: string; dotShadow: string }

const badgeToneMap: Record<BadgeTone, ToneTokens> = {
  info: {
    text:      "var(--aurora-info-foreground)",
    border:    "var(--aurora-info-border)",
    bg:        "var(--aurora-info-surface)",
    dot:       "var(--aurora-info)",
    dotShadow: "0 0 4px var(--aurora-info)",
  },
  success: {
    text:      "var(--aurora-success-foreground)",
    border:    "var(--aurora-success-border)",
    bg:        "var(--aurora-success-surface)",
    dot:       "var(--aurora-success)",
    dotShadow: "0 0 4px var(--aurora-success)",
  },
  warn: {
    text:      "var(--aurora-warn-foreground)",
    border:    "var(--aurora-warn-border)",
    bg:        "var(--aurora-warn-surface)",
    dot:       "var(--aurora-warn)",
    dotShadow: "0 0 4px var(--aurora-warn)",
  },
  error: {
    text:      "var(--aurora-error-foreground)",
    border:    "var(--aurora-error-border)",
    bg:        "var(--aurora-error-surface)",
    dot:       "var(--aurora-error)",
    dotShadow: "0 0 4px var(--aurora-error)",
  },
  neutral: {
    text:      "var(--aurora-neutral-foreground)",
    border:    "var(--aurora-neutral-border)",
    bg:        "var(--aurora-neutral-surface)",
    dot:       "var(--aurora-neutral)",
    dotShadow: "0 0 4px var(--aurora-neutral)",
  },
  rose: {
    text:      "var(--aurora-accent-pink-strong)",
    border:    "var(--aurora-accent-pink-border)",
    bg:        "var(--aurora-accent-pink-surface)",
    dot:       "var(--aurora-accent-pink)",
    dotShadow: "0 0 4px var(--aurora-accent-pink)",
  },
  violet: {
    text:      "var(--aurora-accent-violet-strong)",
    border:    "var(--aurora-accent-violet-border)",
    bg:        "var(--aurora-accent-violet-surface)",
    dot:       "var(--aurora-accent-violet)",
    dotShadow: "0 0 4px var(--aurora-accent-violet)",
  },
}

function resolveTone(variant: BadgeTone | "default" | undefined): BadgeTone {
  if (!variant || variant === "default") return "neutral"
  return variant
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic or expressive tone. "default" is a deprecated alias for "neutral". */
  variant?: BadgeTone | "default"
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot = false, style, children, ...props }, ref) => {
    const tone = resolveTone(variant)
    const { text, border, bg, dot: dotColor, dotShadow } = badgeToneMap[tone]

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 uppercase leading-none border whitespace-nowrap",
          className
        )}
        style={{
          borderRadius: "4px",
          background: bg,
          borderColor: border,
          color: text,
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
              boxShadow: dotShadow,
            }}
          />
        )}
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

// Note: badgeVariants (CVA export) has been removed.
// Components that imported badgeVariants for composition should use
// className overrides on the Badge component directly.
export { Badge }
export default Badge
