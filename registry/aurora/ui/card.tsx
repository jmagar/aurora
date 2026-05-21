"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ─── Card ────────────────────────────────────────────────────────────────── */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true the card becomes a focusable, hoverable interactive tile. */
  interactive?: boolean
  /**
   * Accent colour family for featured / active / highlighted cards.
   * Pass `false` or omit to render without an accent.
   */
  accent?: "cyan" | "rose" | "violet" | false
  /** Elevates the card to Tier-2 visual weight (panel-strong background). */
  elevated?: boolean
}

const ACCENT_TOKEN: Record<"cyan" | "rose" | "violet", string> = {
  cyan:   "var(--aurora-accent-primary)",
  rose:   "var(--aurora-accent-pink)",
  violet: "var(--aurora-accent-violet)",
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, style, interactive, accent, elevated, tabIndex, ...props }, ref) => {
    const accentToken = accent ? ACCENT_TOKEN[accent] : null

    /* ── base background ── */
    const baseBg = elevated
      ? "var(--aurora-panel-strong)"
      : "var(--aurora-panel-medium)"

    /* ── accent overlay: very subtle top-tinted linear-gradient ── */
    const accentBg = accentToken
      ? `linear-gradient(180deg, color-mix(in srgb, ${accentToken} 6%, ${baseBg}) 0%, ${baseBg} 40%)`
      : baseBg

    /* ── accent border + glow box-shadow ── */
    const baseShadow = elevated
      ? "var(--aurora-shadow-strong)"
      : "var(--aurora-shadow-medium)"

    const insetHighlight = elevated
      ? "inset 0 1px 0 rgba(255,255,255,0.055)"
      : "inset 0 1px 0 rgba(255,255,255,0.04)"

    const accentGlow = accentToken
      ? `0 0 0 1px color-mix(in srgb, ${accentToken} 20%, transparent), 0 0 20px color-mix(in srgb, ${accentToken} 12%, transparent)`
      : null

    const boxShadow = [baseShadow, insetHighlight, accentGlow]
      .filter(Boolean)
      .join(", ")

    const borderColor = accentToken
      ? `color-mix(in srgb, ${accentToken} 60%, var(--aurora-border-default))`
      : elevated
        ? "var(--aurora-border-strong)"
        : "var(--aurora-border-default)"

    return (
      <div
        ref={ref}
        tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
        className={cn(
          "rounded-[8px] border",
          interactive && [
            "cursor-pointer",
            "transition-all duration-150",
            /* hover: lighten bg + lift shadow */
            "hover:bg-[color-mix(in_srgb,var(--aurora-hover-bg)_30%,var(--aurora-panel-medium))]",
            "hover:shadow-[0_4px_16px_color-mix(in_srgb,var(--aurora-accent-primary)_8%,transparent)]",
            "hover:border-[var(--aurora-border-strong)]",
            /* focus ring */
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-[var(--aurora-accent-primary)]",
            "focus-visible:ring-offset-0",
          ],
          className,
        )}
        style={{
          background: accentBg,
          borderColor,
          boxShadow,
          ...style,
        }}
        {...props}
      />
    )
  },
)
Card.displayName = "Card"

/* ─── CardHeader ──────────────────────────────────────────────────────────── */

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-b px-4 py-3", className)}
      style={{ borderColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  ),
)
CardHeader.displayName = "CardHeader"

/* ─── CardTitle ───────────────────────────────────────────────────────────── */

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Polymorphic heading level. Defaults to `h3` (no breaking change). */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
}

const CardTitle = React.forwardRef<HTMLElement, CardTitleProps>(
  ({ className, style, as: Tag = "h3", ...props }, ref) => (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={cn("aurora-text-section", className)}
      style={{ color: "var(--aurora-text-primary)", ...style }}
      {...props}
    />
  ),
)
CardTitle.displayName = "CardTitle"

/* ─── CardDescription ─────────────────────────────────────────────────────── */

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, style, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("aurora-text-body-sm", className)}
      style={{ color: "var(--aurora-text-muted)", marginTop: "4px", ...style }}
      {...props}
    />
  ),
)
CardDescription.displayName = "CardDescription"

/* ─── CardContent ─────────────────────────────────────────────────────────── */

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-3", className)} {...props} />
  ),
)
CardContent.displayName = "CardContent"

/* ─── CardFooter ──────────────────────────────────────────────────────────── */

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t px-4 py-3", className)}
      style={{ borderColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
export default Card
