/**
 * Aurora Card — the canonical panel. Two tiers (strong / medium), optional
 * accent edge, optional interactive hover-lift + glow.
 *
 * Visual layer matches the Claude Design source (panel gradient, 22/18px radii,
 * strong shadow, lift-on-hover) ported via a stylesheet keyed to
 * data-attributes. Architecture keeps the shadcn compound parts.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

type CardAccent = "cyan" | "rose"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

/* ─── Card ────────────────────────────────────────────────────────────────── */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true the card becomes a focusable, hoverable interactive tile. */
  interactive?: boolean
  /** Accent edge for featured / active / highlighted cards. Omit for none. */
  accent?: CardAccent | false
  /**
   * Visual tier. Default (omitted) is Tier-2 — the canonical panel-strong
   * gradient + strong shadow, matching the Claude Design default Card.
   * Pass `elevated={false}` for the lighter Tier-1 list/toolbar surface.
   */
  elevated?: boolean
}

function Card({ className, interactive, accent, elevated, tabIndex, ref, ...props }: CardProps & { ref?: React.Ref<HTMLDivElement> }) {
    return (
      <div
        ref={ref}
        className={cn("aurora-card", className)}
        data-tier={elevated === false ? "1" : "2"}
        data-interactive={interactive ? "true" : undefined}
        data-accent={accent || undefined}
        tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
        {...props}
      />
    )
}

/* ─── CardHeader ──────────────────────────────────────────────────────────── */

function CardHeader({ className, style, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("border-b px-4 py-3", className)}
      style={{ borderColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
}

/* ─── CardTitle ───────────────────────────────────────────────────────────── */

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Polymorphic heading level. Defaults to `h3` (no breaking change). */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
}

function CardTitle({ className, style, as: Tag = "h3", ref, ...props }: CardTitleProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={cn("aurora-text-section", className)}
      style={{ color: "var(--aurora-text-primary)", ...style }}
      {...props}
    />
  )
}

/* ─── CardDescription ─────────────────────────────────────────────────────── */

function CardDescription({ className, style, ref, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return (
    <p
      ref={ref}
      className={cn("aurora-text-body-sm", className)}
      style={{ color: "var(--aurora-text-muted)", marginTop: "4px", ...style }}
      {...props}
    />
  )
}

/* ─── CardContent ─────────────────────────────────────────────────────────── */

function CardContent({ className, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn("px-4 py-3", className)} {...props} />
}

/* ─── CardFooter ──────────────────────────────────────────────────────────── */

function CardFooter({ className, style, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("border-t px-4 py-3", className)}
      style={{ borderColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
export default Card
