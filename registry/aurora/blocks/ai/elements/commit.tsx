"use client"

import * as React from "react"
import { Check, GitBranch, GitCommitHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export type CommitVariant = "default" | "compact"

export interface CommitProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Short commit hash, e.g. `ca8cb38`. */
  hash: string
  /** Commit subject line. */
  message: string
  /** Author handle; first letter seeds the avatar. */
  author?: string
  /** Relative timestamp, e.g. `4m ago`. */
  time?: string
  /** Branch name shown in the diffstat row. */
  branch?: string
  /** Files touched. */
  files?: number
  /** Lines added. */
  additions?: number
  /** Lines removed. */
  deletions?: number
  /** Render the AI authorship badge next to the subject. */
  badge?: boolean
  /** Density. `compact` collapses to a single row (avatar · message · hash). */
  variant?: CommitVariant
}

// ── Aurora token panel surface (mirrors the elements panelStyle) ───────────────
function commitPanelStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--aurora-surface-raised)",
    border: "1px solid var(--aurora-border-strong)",
    borderRadius: "var(--aurora-radius-1)",
    boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
    ...style,
  }
}

function CommitAvatar({ seed, size }: { seed: string; size: number }) {
  const initial = (seed.trim()[0] ?? "?").toUpperCase()
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        color: "var(--aurora-accent-primary)",
        border: "1.5px solid color-mix(in srgb, var(--aurora-accent-primary) 60%, transparent)",
        background: "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)",
        fontFamily: "var(--aurora-font-display)",
        fontWeight: 700,
        fontSize: size * 0.4,
        lineHeight: 1,
      }}
    >
      {initial}
    </span>
  )
}

function HashChip({ hash }: { hash: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      /* clipboard unavailable */
    }
  }, [hash])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `Copied ${hash}` : `Copy commit ${hash}`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-2.5 py-1 transition-colors"
      style={{
        border: "1px solid var(--aurora-accent-pink-border)",
        background: "var(--aurora-accent-pink-surface)",
        color: "var(--aurora-accent-pink)",
      }}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <GitCommitHorizontal className="size-3.5" aria-hidden style={{ opacity: 0.85 }} />
      )}
      <span className="aurora-text-code" style={{ color: "var(--aurora-accent-pink)" }}>
        {hash}
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Copied" : ""}
      </span>
    </button>
  )
}

const Commit = React.memo(
  React.forwardRef<HTMLDivElement, CommitProps>(function Commit(
    {
      hash,
      message,
      author,
      time,
      branch,
      files,
      additions,
      deletions,
      badge = false,
      variant = "default",
      className,
      style,
      ...props
    },
    ref,
  ) {
    const seed = author ?? message
    const hasDiffstat =
      branch != null ||
      files != null ||
      additions != null ||
      deletions != null

    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5",
            className,
          )}
          style={commitPanelStyle(style)}
          {...props}
        >
          <CommitAvatar seed={seed} size={28} />
          <span
            className="block min-w-0 truncate"
            style={{
              color: "var(--aurora-text-primary)",
              fontFamily: "var(--aurora-font-display)",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {message}
          </span>
          <span
            className="aurora-text-code shrink-0"
            style={{ color: "var(--aurora-accent-pink)" }}
          >
            {hash}
          </span>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("grid gap-3 px-4 py-3.5", className)}
        style={commitPanelStyle(style)}
        {...props}
      >
        {/* Header: avatar · message + meta + badge · hash chip */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5">
          <CommitAvatar seed={seed} size={44} />
          <span className="grid min-w-0 gap-0.5">
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                className="min-w-0 truncate"
                style={{
                  color: "var(--aurora-text-primary)",
                  fontFamily: "var(--aurora-font-display)",
                  fontWeight: 700,
                  fontSize: 19,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {message}
              </span>
              {badge ? (
                <span
                  className="shrink-0 rounded-[7px] px-1.5 py-0.5"
                  style={{
                    border: "1px solid var(--aurora-accent-pink-border)",
                    background: "var(--aurora-accent-pink-surface)",
                    color: "var(--aurora-accent-pink)",
                    fontFamily: "var(--aurora-font-mono)",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    lineHeight: 1.4,
                  }}
                >
                  AI
                </span>
              ) : null}
            </span>
            {author || time ? (
              <span className="aurora-text-meta block truncate">
                {author}
                {author && time ? " · " : ""}
                {time}
              </span>
            ) : null}
          </span>
          <HashChip hash={hash} />
        </div>

        {/* Diffstat: branch · files / additions / deletions */}
        {hasDiffstat ? (
          <>
            <div
              aria-hidden
              style={{ height: 1, background: "var(--aurora-border-default)" }}
            />
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                {branch != null ? (
                  <>
                    <GitBranch
                      className="size-3.5 shrink-0"
                      aria-hidden
                      style={{ color: "var(--aurora-text-muted)" }}
                    />
                    <span
                      className="aurora-text-code truncate"
                      style={{ color: "var(--aurora-text-muted)" }}
                    >
                      {branch}
                    </span>
                  </>
                ) : null}
              </span>
              <span className="flex shrink-0 items-center gap-3.5 aurora-text-code">
                {files != null ? (
                  <span style={{ color: "var(--aurora-text-muted)" }}>{files} files</span>
                ) : null}
                {additions != null ? (
                  <span style={{ color: "var(--aurora-success)" }}>+{additions}</span>
                ) : null}
                {deletions != null ? (
                  <span style={{ color: "var(--aurora-error)" }}>&minus;{deletions}</span>
                ) : null}
              </span>
            </div>
          </>
        ) : null}
      </div>
    )
  }),
)
Commit.displayName = "Commit"

export { Commit }
