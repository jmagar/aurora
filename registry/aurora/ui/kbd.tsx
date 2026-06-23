"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type KbdVariant = "raised" | "solid" | "outline" | "ghost" | "accent"

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual treatment of the keycap chip.
   * - `raised`  — recessed control surface with a top highlight + bottom inset (default).
   * - `solid`   — flat filled panel surface, brighter label.
   * - `outline` — transparent fill, border only.
   * - `ghost`   — borderless translucent fill, softest.
   * - `accent`  — cyan-tinted surface, cyan border + label.
   * @default "raised"
   */
  variant?: KbdVariant
  /**
   * Escape hatch. When true, renders a bare `<kbd>` with only `className` and the
   * forwarded props/ref — no inline style skin — so the consumer's CSS owns the
   * appearance. The styled path (default) is unaffected.
   * @default false
   */
  unstyled?: boolean
}

const variantStyle: Record<KbdVariant, React.CSSProperties> = {
  raised: {
    background: "var(--aurora-control-surface)",
    border: "1px solid var(--aurora-border-strong)",
    boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.35), var(--aurora-highlight-medium)",
    color: "var(--aurora-text-muted)",
  },
  solid: {
    background: "var(--aurora-panel-strong)",
    border: "1px solid var(--aurora-border-strong)",
    boxShadow: "var(--aurora-highlight-medium)",
    color: "var(--aurora-text-primary)",
  },
  outline: {
    background: "transparent",
    border: "1px solid var(--aurora-border-strong)",
    boxShadow: "none",
    color: "var(--aurora-text-muted)",
  },
  ghost: {
    background: "color-mix(in srgb, var(--aurora-control-surface) 70%, transparent)",
    border: "1px solid transparent",
    boxShadow: "none",
    color: "var(--aurora-text-muted)",
  },
  accent: {
    background: "color-mix(in srgb, var(--aurora-accent-primary) 14%, var(--aurora-panel-medium))",
    border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 38%, transparent)",
    boxShadow: "var(--aurora-highlight-medium)",
    color: "var(--aurora-accent-strong)",
  },
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, style, variant = "raised", unstyled = false, ...props }, ref) => {
    if (unstyled) {
      return <kbd ref={ref} className={className} {...props} />
    }

    return (
      <kbd
        ref={ref}
        className={cn("inline-flex min-w-5 items-center justify-center rounded-[5px] px-1.5", className)}
        style={{
          fontFamily: "var(--aurora-font-mono)",
          fontSize: 11,
          fontWeight: 600,
          height: 20,
          lineHeight: 1,
          ...variantStyle[variant],
          ...style,
        }}
        {...props}
      />
    )
  }
)
Kbd.displayName = "Kbd"

export { Kbd }
export default Kbd
