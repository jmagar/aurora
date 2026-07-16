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
 * `forwardRef` component with a typed prop API. The raised panel holds the
 * active version's content and a footer toolbar with the branch label, optional
 * AI badge, version dots, model meta, copy/regenerate actions, and a compact
 * previous / counter / next stepper.
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

const Branch = (
    { ref,
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
    }: BranchProps & { ref?: React.Ref<HTMLDivElement> }
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

    // Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

    return (
      <div
        ref={ref}
        className={cn("aurora-branch", "overflow-hidden", className)}
        style={{
          background: "var(--aurora-surface-raised)",
          border: "1px solid var(--aurora-border-strong)",
          borderRadius: "var(--aurora-radius-1)",
          boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
          ...style,
        }}
        {...props}
      >
        <div className="aurora-branch__content" aria-live="polite">
          {version?.content}
        </div>

        <div className="aurora-branch__toolbar" role="group" aria-label="Version navigation">
          <span className="aurora-branch__label">
            <GitBranch
              aria-hidden
              width={16}
              height={16}
              strokeWidth={1.65}
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
            <span
              className="aurora-branch__meta"
              title={[version?.model, version?.time].filter(Boolean).join(" · ")}
              style={{ fontFamily: "var(--aurora-font-sans)" }}
            >
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
                  <Copy aria-hidden width={16} height={16} strokeWidth={1.65} />
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
                  <RefreshCw aria-hidden width={16} height={16} strokeWidth={1.65} />
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
              <ChevronLeft aria-hidden width={16} height={16} strokeWidth={1.65} />
            </Button>
            <span
              className="aurora-branch__counter"
              style={{ fontFamily: "var(--aurora-font-sans)" }}
            >
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
              <ChevronRight aria-hidden width={16} height={16} strokeWidth={1.65} />
            </Button>
          </span>
        </div>
      </div>
    )
  }
Branch.displayName = "Branch"

export { Branch }
export default Branch
