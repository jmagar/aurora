"use client"

/**
 * Aurora AudioPlayer — voice/audio response element.
 *
 * Visual layer ported 1:1 from the Claude Design source: a lit-outline cyan
 * transport button, a waveform scrubber whose played bars glow cyan over a dim
 * unplayed tail, a `synthesizing` state that swaps the transport for a spinner,
 * and a `compact` single-row pill. Reads only `--aurora-*` tokens so it renders
 * pixel-identical in dark + `.light`.
 *
 * Architecture stays shadcn/registry: the Aurora `Button` (Radix `Slot`/`cva`)
 * powers transport + download, `forwardRef`, `displayName`, and the full
 * `React.HTMLAttributes` escape hatch are preserved.
 */

import * as React from "react"
import { Download, Play, Sparkles } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { Separator } from "@/registry/aurora/ui/separator"
import { Spinner } from "@/registry/aurora/ui/spinner"

export interface AudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Headline label for the clip. */
  title?: string
  /** Total duration, mm:ss. */
  duration?: string
  /** Playback progress 0–1 — drives the waveform fill and the current-time readout. */
  progress?: number
  /** Transport state. `synthesizing` swaps the play control for a spinner and hides the waveform. */
  status?: "idle" | "synthesizing"
  /** Render the Axon orange "AI Voice" pill beside the title. */
  badge?: boolean
  /** Show the square download control in the footer. */
  download?: boolean
  /** `default` is the full card; `compact` is the single-row pill. */
  variant?: "default" | "compact"
  /** Current speed multiplier label shown in the footer. */
  speed?: string
}

// Deterministic waveform bar heights (0..1) — fixed so SSR + client agree.
const WAVE_FULL = [
  0.32, 0.5, 0.42, 0.6, 0.38, 0.72, 0.48, 0.34, 0.55, 0.46, 0.82, 0.92, 0.7,
  0.58, 0.86, 0.62, 0.44, 0.78, 0.36, 0.5, 0.4, 0.66, 0.3, 0.54, 0.48, 0.6,
  0.42, 0.74, 0.5, 0.38, 0.68, 0.46, 0.56, 0.4, 0.62, 0.34, 0.7, 0.5, 0.44,
  0.58, 0.36, 0.66, 0.48, 0.4, 0.6, 0.52, 0.34, 0.7, 0.46, 0.56,
]

const WAVE_COMPACT = [
  0.3, 0.18, 0.42, 0.56, 0.66, 0.48, 0.34, 0.5, 0.4, 0.24, 0.32, 0.46, 0.7,
  0.84, 0.78, 0.62, 0.5, 0.36, 0.28, 0.44, 0.58, 0.66, 0.52, 0.4, 0.5, 0.6,
  0.46, 0.34, 0.5, 0.42, 0.3, 0.56, 0.44, 0.36, 0.5, 0.28,
]

const AI_ORANGE = "var(--axon-orange)"

function parseSeconds(value: string): number {
  const parts = value.split(":").map((p) => Number.parseInt(p, 10))
  if (parts.some(Number.isNaN)) return 0
  return parts.reduce((acc, n) => acc * 60 + n, 0)
}

function formatSeconds(total: number): string {
  const safe = Math.max(0, Math.round(total))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function Waveform({
  bars,
  progress,
  height,
  className,
}: {
  bars: number[]
  progress: number
  height: number
  className?: string
}) {
  const clampedProgress = Math.min(1, Math.max(0, progress))
  const playedCount = Math.round(bars.length * clampedProgress)
  return (
    <span
      role="img"
      aria-label={`Playback waveform ${Math.round(clampedProgress * 100)}% played`}
      className={["flex min-w-0 flex-1 items-center", className].filter(Boolean).join(" ")}
      style={{ gap: 3, height }}
    >
      {bars.map((amp, i) => {
        const played = i < playedCount
        return (
          <span
            key={i}
            style={{
              flex: "1 1 0%",
              minWidth: 2,
              maxWidth: 5,
              height: `${Math.max(14, amp * 100)}%`,
              borderRadius: 999,
              background: played
                ? "var(--aurora-accent-primary)"
                : "color-mix(in srgb, var(--aurora-accent-primary) 26%, var(--aurora-control-surface))",
              boxShadow: played
                ? "0 0 6px color-mix(in srgb, var(--aurora-accent-primary) 38%, transparent)"
                : "none",
              transition: "background var(--motion-duration-fast) var(--motion-ease-out, ease)",
            }}
          />
        )
      })}
    </span>
  )
}

const cardStyle: React.CSSProperties = {
  background: "var(--aurora-surface-raised)",
  border: "1px solid var(--aurora-border-strong)",
  borderRadius: "var(--aurora-radius-1)",
  boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
}

const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  (
    {
      title = "Voice Response",
      duration = "00:42",
      progress = 0,
      status = "idle",
      badge = false,
      download = false,
      variant = "default",
      speed = "1×",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const totalSeconds = parseSeconds(duration)
    const current = formatSeconds(totalSeconds * Math.min(1, Math.max(0, progress)))
    const synthesizing = status === "synthesizing"

    // ── Compact: single-row pill ────────────────────────────────────────────
    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={["flex items-center gap-3 px-3 py-2", className].filter(Boolean).join(" ")}
          style={{ ...cardStyle, borderRadius: 999, ...style }}
          {...props}
        >
          <Button
            type="button"
            variant="aurora"
            size="icon"
            shape="pill"
            aria-label={`Play ${title}`}
          >
            <Play className="size-3.5" aria-hidden style={{ marginLeft: 1 }} />
          </Button>
          <Waveform bars={WAVE_COMPACT} progress={progress} height={22} />
          <span
            className="aurora-text-control shrink-0 tabular-nums"
            style={{ color: "var(--aurora-text-muted)" }}
          >
            {duration}
          </span>
        </div>
      )
    }

    // ── Default: full card ──────────────────────────────────────────────────
    return (
      <div
        ref={ref}
        className={["grid gap-3 p-4", className].filter(Boolean).join(" ")}
        style={{ ...cardStyle, ...style }}
        {...props}
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          {synthesizing ? (
            <span
              className="flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 42%, var(--aurora-border-strong))",
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent), transparent 58%), var(--aurora-control-surface)",
              }}
              aria-label="Synthesizing"
            >
              <Spinner size="default" tone="cyan" />
            </span>
          ) : (
            <Button
              type="button"
              variant="aurora"
              size="icon"
              shape="pill"
              aria-label={`Play ${title}`}
              style={{ width: 44, height: 44 }}
            >
              <Play className="size-[18px]" aria-hidden style={{ marginLeft: 2 }} />
            </Button>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                className="truncate aurora-text-control"
                style={{ color: "var(--aurora-text-primary)", fontWeight: 700 }}
              >
                {title}
              </span>
              {badge ? (
                <span
                  className="inline-flex shrink-0 items-center gap-1 aurora-text-label uppercase"
                  style={{
                    padding: "3px 8px",
                    borderRadius: 999,
                    color: AI_ORANGE,
                    border: "1px solid var(--axon-orange-border)",
                    background: "var(--axon-orange-surface)",
                    fontFamily: "var(--aurora-font-sans)",
                    letterSpacing: "var(--aurora-letter-label)",
                    textTransform: "none",
                  }}
                >
                  <Sparkles className="size-3" aria-hidden />
                  AI Voice
                </span>
              ) : null}
            </div>
            <div style={{ marginTop: 10 }}>
              {synthesizing ? (
                <span
                  className="block text-right aurora-text-label"
                  style={{
                    color: "var(--aurora-text-muted)",
                    fontFamily: "var(--aurora-font-sans)",
                    letterSpacing: "var(--aurora-letter-eyebrow)",
                    textTransform: "uppercase",
                  }}
                >
                  Synthesizing
                </span>
              ) : (
                <Waveform bars={WAVE_FULL} progress={progress} height={36} />
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <span className="aurora-text-control tabular-nums">
            <span style={{ color: "var(--aurora-text-primary)", fontWeight: 600 }}>{current}</span>
            <span style={{ color: "var(--aurora-text-muted)", margin: "0 7px" }}>/</span>
            <span style={{ color: "var(--aurora-text-muted)" }}>{duration}</span>
          </span>
          <span className="flex items-center gap-3">
            <span
              className="aurora-text-control tabular-nums"
              style={{ color: "var(--aurora-text-primary)", fontWeight: 700 }}
            >
              {speed}
            </span>
            {download ? (
              <Button
                type="button"
                variant="neutral"
                size="icon"
                aria-label={`Download ${title}`}
              >
                <Download className="size-4" aria-hidden />
              </Button>
            ) : null}
          </span>
        </div>
      </div>
    )
  }
)
AudioPlayer.displayName = "AudioPlayer"

export { AudioPlayer }
export default AudioPlayer
