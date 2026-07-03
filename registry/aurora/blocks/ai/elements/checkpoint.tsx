"use client"

import * as React from "react"
import { Clock, Database, Eye, Hexagon, RotateCcw, Save } from "lucide-react"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

/**
 * Checkpoint — a saved agent checkpoint card.
 *
 * Architecture is the canonical shadcn-registry pattern: a self-contained
 * `forwardRef` component with a typed prop API. Visuals match the Aurora /
 * Claude Design source 1:1 — a raised panel with a cyan save-icon tile, a
 * status badge, an optional "AUTO" tag, a monospace metadata row, and the
 * Diff / Restore action pair. A `compact` variant drops the meta + actions.
 */

export type CheckpointStatus = "current" | "saved" | "stale"

export interface CheckpointProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Primary checkpoint label. */
  label: string
  /** Secondary description (default variant only). */
  description?: string
  /** Lifecycle status — drives the right-aligned badge. */
  status?: CheckpointStatus
  /** Step index this checkpoint captured. */
  step?: number
  /** Relative time the checkpoint was taken. */
  time?: string
  /** Human-readable snapshot size. */
  size?: string
  /** Render the "AUTO" tag beside the label. */
  badge?: boolean
  /** Layout density. `compact` = single dense row, no meta/actions. */
  variant?: "default" | "compact"
  /** Diff / view-changes action. Renders the "Diff" button when provided. */
  onView?: () => void
  /** Restore-to-checkpoint action. Renders the "Restore" button when provided. */
  onRestore?: () => void
  /** Whole-card click (compact variant — makes the row interactive). */
  onClick?: () => void
}

const STATUS_LABEL: Record<CheckpointStatus, string> = {
  current: "Current",
  saved: "Saved",
  stale: "Stale",
}

const STATUS_TONE = {
  current: "success",
  saved: "neutral",
  stale: "warn",
} as const

function MetaItem({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "var(--aurora-text-muted)",
      }}
    >
      <Icon className="size-3.5" aria-hidden style={{ color: "var(--aurora-text-muted)", opacity: 0.85 }} />
      {children}
    </span>
  )
}

const Checkpoint = React.forwardRef<HTMLDivElement, CheckpointProps>(
  (
    {
      label,
      description,
      status = "saved",
      step,
      time,
      size,
      badge = false,
      variant = "default",
      onView,
      onRestore,
      onClick,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const compact = variant === "compact"
    const interactive = compact && typeof onClick === "function"

    const tile = (
      <span
        aria-hidden
        className="grid place-items-center shrink-0"
        style={{
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          borderRadius: 12,
          background: "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)",
          border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 36%, transparent)",
          color: "var(--aurora-accent-primary)",
        }}
      >
        <Save className={compact ? "size-4" : "size-5"} />
      </span>
    )

    const statusBadge = (
      <Badge variant={STATUS_TONE[status]} style={{ letterSpacing: "0.14em" }}>
        {STATUS_LABEL[status]}
      </Badge>
    )

    const cardStyle: React.CSSProperties = {
      background: "var(--aurora-surface-raised)",
      border: "1px solid var(--aurora-border-strong)",
      borderRadius: "var(--aurora-radius-1)",
      boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
      transition: interactive
        ? "border-color var(--motion-duration-fast) var(--motion-ease-out), background var(--motion-duration-fast) var(--motion-ease-out)"
        : undefined,
      ...style,
    }

    if (compact) {
      return (
        <div
          ref={ref}
          className={["flex items-center gap-3 p-3", interactive ? "cursor-pointer aurora-checkpoint--interactive" : "", className]
            .filter(Boolean)
            .join(" ")}
          style={cardStyle}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          onClick={onClick}
          onKeyDown={
            interactive
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onClick?.()
                  }
                }
              : undefined
          }
          {...props}
        >
          {tile}
          <div
            className="min-w-0 flex-1 truncate"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--aurora-text-primary)",
            }}
          >
            {label}
          </div>
          {statusBadge}
        </div>
      )
    }

    const showMeta = step != null || time != null || size != null
    const showActions = typeof onView === "function" || typeof onRestore === "function"

    return (
      <div ref={ref} className={["grid gap-3 p-4", className].filter(Boolean).join(" ")} style={cardStyle} {...props}>
        <div className="flex items-start gap-3">
          {tile}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <span
                className="truncate"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--aurora-text-primary)",
                }}
              >
                {label}
              </span>
              {badge ? (
                <Badge variant="rose" style={{ letterSpacing: "0.14em" }}>
                  Auto
                </Badge>
              ) : null}
            </div>
            {description ? (
              <div
                className="mt-1"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  color: "var(--aurora-text-muted)",
                }}
              >
                {description}
              </div>
            ) : null}
          </div>
          <div className="self-start">{statusBadge}</div>
        </div>

        {showMeta || showActions ? (
          <div style={{ height: 1, background: "var(--aurora-border-default)", opacity: 0.7 }} />
        ) : null}

        {showMeta || showActions ? (
          <div className="flex items-center gap-5">
            {showMeta ? (
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-5">
                {step != null ? <MetaItem icon={Hexagon}>step {step}</MetaItem> : null}
                {time != null ? <MetaItem icon={Clock}>{time}</MetaItem> : null}
                {size != null ? <MetaItem icon={Database}>{size}</MetaItem> : null}
              </div>
            ) : (
              <span className="flex-1" />
            )}
            {showActions ? (
              <div className="flex items-center gap-2.5">
                {typeof onView === "function" ? (
                  <Button type="button" variant="ghost" size="sm" onClick={onView}>
                    <Eye className="size-4" aria-hidden />
                    Diff
                  </Button>
                ) : null}
                {typeof onRestore === "function" ? (
                  <Button type="button" variant="aurora" size="sm" onClick={onRestore}>
                    <RotateCcw className="size-4" aria-hidden />
                    Restore
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
)
Checkpoint.displayName = "Checkpoint"

export { Checkpoint }
