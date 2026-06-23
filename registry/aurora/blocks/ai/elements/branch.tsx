"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Copy, GitBranch, RefreshCw } from "lucide-react"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"
import { cn } from "@/lib/utils"

/**
 * Branch — versioned answer navigation.
 *
 * Architecture is the canonical shadcn-registry pattern: a self-contained
 * `forwardRef` component with a typed prop API. Visuals match the Aurora /
 * Claude Design source 1:1 — a raised panel whose top tier holds the active
 * version's content and whose footer toolbar carries the branch label, an
 * optional "AI" tag, a row of version dots (the active one an elongated rose
 * pill), the active version's model meta, copy + regenerate actions, and a
 * prev / counter / next stepper.
 *
 * It is an uncontrolled stepper by default (`defaultIndex`); pass `index` +
 * `onIndexChange` to drive it from the outside.
 */

export interface BranchVersion {
  /** The answer text for this version. */
  content: React.ReactNode
  /** Model that produced this version (shown in the meta slot). */
  model?: string
  /** Time-to-generate for this version (shown beside the model). */
  time?: string
}

export interface BranchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy"> {
  /** Ordered list of answer versions to navigate between. */
  versions: BranchVersion[]
  /** Initial active version (uncontrolled). Defaults to 0. */
  defaultIndex?: number
  /** Controlled active version. Provide with `onIndexChange`. */
  index?: number
  /** Fires when the active version changes (controlled or uncontrolled). */
  onIndexChange?: (index: number) => void
  /** Branch label shown beside the git icon. */
  label?: string
  /** Render the "AI" tag in the toolbar. */
  badge?: boolean
  /** Copy action — renders the copy button when provided. Receives the active version. */
  onCopy?: (version: BranchVersion, index: number) => void
  /** Regenerate action — renders the regenerate button when provided. */
  onRegenerate?: (version: BranchVersion, index: number) => void
}

function clampIndex(value: number, length: number) {
  if (length <= 0) return 0
  if (value < 0) return 0
  if (value > length - 1) return length - 1
  return value
}

const Branch = React.forwardRef<HTMLDivElement, BranchProps>(
  (
    {
      versions,
      defaultIndex = 0,
      index: indexProp,
      onIndexChange,
      label = "Alternative",
      badge = false,
      onCopy,
      onRegenerate,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const count = versions.length
    const isControlled = indexProp != null
    const [internalIndex, setInternalIndex] = React.useState(() => clampIndex(defaultIndex, count))

    const active = clampIndex(isControlled ? (indexProp as number) : internalIndex, count)
    const version = versions[active]

    const setIndex = React.useCallback(
      (next: number) => {
        const clamped = clampIndex(next, count)
        if (!isControlled) setInternalIndex(clamped)
        onIndexChange?.(clamped)
      },
      [count, isControlled, onIndexChange]
    )

    const goPrev = () => setIndex(active - 1)
    const goNext = () => setIndex(active + 1)

    const atStart = active <= 0
    const atEnd = active >= count - 1

    const showActions = typeof onCopy === "function" || typeof onRegenerate === "function"
    const showMeta = version != null && (version.model != null || version.time != null)

    const styleId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const scope = `aurora-branch-${styleId}`

    return (
      <div
        ref={ref}
        className={cn(scope, "overflow-hidden", className)}
        style={{
          background: "var(--aurora-surface-raised)",
          border: "1px solid var(--aurora-border-strong)",
          borderRadius: "var(--aurora-radius-1)",
          boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
          ...style,
        }}
        {...props}
      >
        <style>{`
          .${scope} .aurora-branch__content {
            font-family: var(--font-sans);
            font-size: 17px;
            line-height: 1.5;
            color: var(--aurora-text-primary);
            padding: 18px 20px 20px;
          }
          .${scope} .aurora-branch__toolbar {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 14px;
            border-top: 1px solid var(--aurora-border-default);
            background: color-mix(in srgb, var(--aurora-accent-primary) 4%, transparent);
          }
          .${scope} .aurora-branch__label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: var(--font-display);
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--aurora-text-muted);
            white-space: nowrap;
          }
          .${scope} .aurora-branch__dots {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .${scope} .aurora-branch__dot {
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: color-mix(in srgb, var(--aurora-accent-primary) 55%, transparent);
            transition: width var(--motion-duration-fast, 140ms) var(--motion-ease-out, ease),
              background var(--motion-duration-fast, 140ms) var(--motion-ease-out, ease);
          }
          .${scope} .aurora-branch__dot[data-active="true"] {
            width: 22px;
            background: var(--aurora-rose-gradient);
            box-shadow: 0 0 6px color-mix(in srgb, var(--aurora-accent-pink) 50%, transparent);
          }
          .${scope} .aurora-branch__meta {
            font-family: var(--font-mono);
            font-size: 13px;
            color: var(--aurora-text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
          }
          .${scope} .aurora-branch__counter {
            font-family: var(--font-mono);
            font-size: 13px;
            font-weight: 600;
            color: var(--aurora-text-primary);
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
          }
          .${scope} .aurora-branch__spacer { flex: 1 1 auto; min-width: 8px; }
          .${scope} .aurora-branch__group { display: inline-flex; align-items: center; gap: 8px; }
        `}</style>

        <div className="aurora-branch__content" aria-live="polite">
          {version?.content}
        </div>

        <div className="aurora-branch__toolbar" role="group" aria-label="Version navigation">
          <span className="aurora-branch__label">
            <GitBranch
              className="size-4"
              aria-hidden
              style={{ color: "var(--aurora-accent-pink)" }}
            />
            {label}
          </span>

          {badge ? (
            <Badge variant="rose" style={{ letterSpacing: "0.14em" }}>
              AI
            </Badge>
          ) : null}

          {count > 1 ? (
            <span className="aurora-branch__dots" aria-hidden>
              {versions.map((_, i) => (
                <span key={i} className="aurora-branch__dot" data-active={i === active} />
              ))}
            </span>
          ) : null}

          {showMeta ? (
            <span className="aurora-branch__meta" title={[version?.model, version?.time].filter(Boolean).join(" · ")}>
              {[version?.model, version?.time].filter(Boolean).join(" · ")}
            </span>
          ) : null}

          <span className="aurora-branch__spacer" />

          {showActions ? (
            <span className="aurora-branch__group">
              {typeof onCopy === "function" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="aurora-btn--icon"
                  aria-label="Copy version"
                  onClick={() => version && onCopy(version, active)}
                >
                  <Copy className="size-4" aria-hidden />
                </Button>
              ) : null}
              {typeof onRegenerate === "function" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="aurora-btn--icon"
                  aria-label="Regenerate version"
                  onClick={() => version && onRegenerate(version, active)}
                >
                  <RefreshCw className="size-4" aria-hidden />
                </Button>
              ) : null}
            </span>
          ) : null}

          <span className="aurora-branch__group">
            <Button
              type="button"
              variant="aurora"
              size="sm"
              className="aurora-btn--icon"
              aria-label="Previous version"
              disabled={atStart}
              onClick={goPrev}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <span className="aurora-branch__counter">
              {count === 0 ? "0 / 0" : `${active + 1} / ${count}`}
            </span>
            <Button
              type="button"
              variant="aurora"
              size="sm"
              className="aurora-btn--icon"
              aria-label="Next version"
              disabled={atEnd}
              onClick={goNext}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </span>
        </div>
      </div>
    )
  }
)
Branch.displayName = "Branch"

export { Branch }
export default Branch
