"use client"

import * as React from "react"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Transcription — a live transcript panel.
 *
 * Architecture is the canonical shadcn-registry pattern: a self-contained
 * `forwardRef` component with a typed prop API. Visuals match the Aurora /
 * Claude Design source 1:1 — a raised panel with a mic-labelled header, a
 * pink "LIVE" indicator, and a divider above a stack of segment rows. Each
 * segment shows a cyan monospace timecode, an uppercase speaker label, the
 * transcript text, and a right-aligned status pill: a teal confidence badge
 * when `confidence` is set, otherwise a pink "LIVE" pill. The live segment
 * also gets a pink left accent bar.
 */

export interface TranscriptionSegment {
  speaker: string
  timecode: string
  text: string
  /** Confidence percentage (0–100). When omitted the segment renders as live. */
  confidence?: number
}

export interface TranscriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: TranscriptionSegment[]
}

function ConfidenceBadge({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[8px] border px-2.5 py-1 aurora-text-control tabular-nums",
        className
      )}
      style={{
        color: "var(--aurora-success)",
        borderColor: "var(--aurora-success-border)",
        background: "var(--aurora-success-surface)",
      }}
    >
      {value}%
    </span>
  )
}

function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border px-2.5 py-1 aurora-text-label",
        className
      )}
      style={{
        color: "var(--aurora-accent-pink)",
        borderColor: "var(--aurora-accent-pink-border)",
        background: "var(--aurora-accent-pink-surface)",
        textTransform: "uppercase",
      }}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full"
        style={{ background: "var(--aurora-accent-pink)" }}
      />
      LIVE
    </span>
  )
}

const Transcription = ({ ref, segments, className, style, ...props }: TranscriptionProps & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      className={cn("grid gap-3 rounded-[var(--aurora-radius-1)] border p-4", className)}
      style={{
        background: "var(--aurora-surface-raised)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        ...style,
      }}
      {...props}
    >
      <div
        className="flex items-center justify-between gap-3 pb-3"
        style={{ borderBottom: "1px solid var(--aurora-border-default)" }}
      >
        <div
          className="flex items-center gap-2 aurora-text-label"
          style={{ color: "var(--aurora-text-muted)" }}
        >
          <Mic className="size-3.5" aria-hidden />
          Transcription
        </div>
        <div
          className="flex items-center gap-1.5 aurora-text-label"
          style={{ color: "var(--aurora-accent-pink)", textTransform: "uppercase" }}
        >
          <span
            aria-hidden
            className="size-1.5 rounded-full"
            style={{ background: "var(--aurora-accent-pink)" }}
          />
          LIVE
        </div>
      </div>
      <div className="grid gap-2.5" role="log" aria-live="polite">
        {segments.map((segment) => {
          const isLive = segment.confidence == null
          return (
            <div
              key={`${segment.speaker}-${segment.timecode}`}
              className="grid grid-cols-1 items-start gap-2.5 rounded-[10px] border px-3.5 py-3 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:gap-3"
              style={{
                borderColor: isLive
                  ? "var(--aurora-accent-pink-border)"
                  : "var(--aurora-border-default)",
                borderLeft: isLive
                  ? "3px solid var(--aurora-accent-pink)"
                  : "1px solid var(--aurora-border-default)",
                background: "var(--aurora-panel-strong)",
              }}
            >
              <span
                className="aurora-text-meta tabular-nums"
                style={{ color: "var(--aurora-accent-primary)" }}
              >
                {segment.timecode}
              </span>
              <span className="min-w-0">
                <span
                  className="block aurora-text-label"
                  style={{ color: "var(--aurora-text-muted)" }}
                >
                  {segment.speaker}
                </span>
                <span
                  className="block aurora-text-body"
                  style={{ color: "var(--aurora-text-primary)", marginTop: 4 }}
                >
                  {segment.text}
                </span>
              </span>
              {isLive ? (
                <LiveBadge className="justify-self-start sm:justify-self-end" />
              ) : (
                <ConfidenceBadge
                  value={segment.confidence!}
                  className="justify-self-start sm:justify-self-end"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
Transcription.displayName = "Transcription"

export { Transcription }
