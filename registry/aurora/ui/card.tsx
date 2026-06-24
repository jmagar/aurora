"use client"

/**
 * Aurora Card — the canonical panel. Two tiers (strong / medium), optional
 * accent edge, optional interactive hover-lift + glow.
 *
 * Visual layer matches the Claude Design source (panel gradient, 22/18px radii,
 * strong shadow, lift-on-hover) ported via an injected stylesheet keyed to
 * data-attributes. Architecture keeps the shadcn compound parts.
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { injectOnce } from "@/registry/aurora/lib/inject-once"

type CardAccent = "cyan" | "rose"

// ─── Visual layer (Claude Design parity) ───────────────────────────────────────

const CSS = `
.aurora-card { color: var(--aurora-text-primary); border: 1px solid var(--aurora-border-default); box-sizing: border-box; }
.aurora-card[data-tier="2"] {
  background: linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong));
  border-color: color-mix(in srgb, var(--aurora-border-default) 55%, var(--aurora-page-bg));
  border-radius: var(--aurora-radius-3);
  box-shadow: var(--aurora-shadow-strong), var(--aurora-highlight-strong);
}
.aurora-card[data-tier="1"] {
  background: linear-gradient(180deg, var(--aurora-panel-medium-top), var(--aurora-panel-medium));
  border-color: color-mix(in srgb, var(--aurora-border-default) 42%, var(--aurora-page-bg));
  border-radius: var(--aurora-radius-2);
  box-shadow: var(--aurora-shadow-medium), var(--aurora-highlight-medium);
}
.aurora-card[data-accent="cyan"] {
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 60%, var(--aurora-border-default));
  box-shadow: var(--aurora-shadow-strong), var(--aurora-highlight-strong), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent), 0 0 20px color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent);
}
.aurora-card[data-accent="rose"] {
  border-color: color-mix(in srgb, var(--aurora-accent-pink) 60%, var(--aurora-border-default));
  box-shadow: var(--aurora-shadow-strong), var(--aurora-highlight-strong), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-pink) 22%, transparent), 0 0 20px color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent);
}
.aurora-card[data-interactive="true"] {
  cursor: pointer;
  transition: transform 160ms var(--motion-ease-out, ease), box-shadow 160ms var(--motion-ease-out, ease), border-color 160ms var(--motion-ease-out, ease);
}
.aurora-card[data-interactive="true"]:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 38%, var(--aurora-border-strong));
  box-shadow: var(--aurora-shadow-strong), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent);
}
.aurora-card[data-interactive="true"]:focus-visible {
  outline: none;
  box-shadow: var(--aurora-shadow-strong), 0 0 0 3px var(--aurora-focus-ring);
}
@media (prefers-reduced-motion: reduce) { .aurora-card[data-interactive="true"] { transition: none; } }
`

function ensureCSS() { injectOnce("aurora-card", CSS) }

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

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, accent, elevated, tabIndex, ...props }, ref) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

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
