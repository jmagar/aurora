"use client"

import * as React from "react"
import { CircleAlert, Maximize2, RotateCw, Sparkles } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { Spinner } from "@/registry/aurora/ui/spinner"

// AiImage — an AI-generated image surface with ready / generating / failed
// states, an "AI" identity badge, model pill, prompt overlay, metadata footer
// (caption / dimensions / seed) and expand + regenerate / retry affordances.
//
// Visual spec ported 1:1 from the Claude Design source. Rose
// (--aurora-accent-pink) is the AI/automation identity accent (violet was
// removed from the system); the cyan accent drives the progress bar; status
// colors come from the semantic token layer.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AiImageStatus = "ready" | "generating" | "failed"

/** Common aspect ratios — also accepts any "W:H" string. */
export type AiImageAspect = "1:1" | "4:3" | "3:2" | "16:9" | "3:4" | (string & {})

export interface AuroraImageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Image source. When omitted (or `loading`/`status` is non-ready) the surface shows a state placeholder. */
  src?: string
  /** Alt text for the rendered image. */
  alt?: string
  /** State of the surface. Defaults to "ready"; `loading` forces "generating". */
  status?: AiImageStatus
  /** Convenience flag — same as `status="generating"`. */
  loading?: boolean
  /** Aspect ratio of the image frame (e.g. "4:3"). Defaults to "4:3". */
  aspect?: AiImageAspect
  /** Generation progress 0–1 — drives the bottom progress bar + percent label while generating. */
  progress?: number
  /** Model label shown in the top-right pill (e.g. "Imagen 3"). */
  model?: string
  /** Prompt text overlaid along the bottom of a ready image. */
  prompt?: string
  /** Caption shown in the footer below the frame. */
  caption?: string
  /** Pixel dimensions shown in the metadata row (e.g. "1024×768"). */
  dimensions?: string
  /** Seed shown in the metadata row. */
  seed?: string
  /** Regenerate handler — shows a "Regenerate" button in the ready footer. */
  onRegenerate?: () => void
  /** Expand handler — shows a hover "expand" affordance on a ready image. */
  onExpand?: () => void
  /** Retry handler — shows a "Retry" button in the failed state. */
  onRetry?: () => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function aspectValue(aspect: AiImageAspect): string {
  return /^\d+\s*:\s*\d+$/.test(aspect) ? aspect.replace(/\s/g, "") : "4 / 3"
}

const ROSE = "var(--aurora-accent-pink)"

// Translucent scrim sits over the (opaque) image — opaque→translucent over an
// image is intentional (no banding seam against a flat surface).
const PROMPT_SCRIM =
  "linear-gradient(180deg, rgba(7,19,28,0) 0%, rgba(7,19,28,0.78) 100%)"

// ---------------------------------------------------------------------------
// Pills
// ---------------------------------------------------------------------------

function chipStyle(): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    height: 22,
    padding: "0 8px",
    borderRadius: 7,
    background: "color-mix(in srgb, var(--aurora-page-bg) 64%, transparent)",
    border: "1px solid color-mix(in srgb, var(--aurora-border-strong) 80%, transparent)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    fontFamily: "var(--aurora-font-mono)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.02em",
    color: "var(--aurora-text-primary)",
    whiteSpace: "nowrap",
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Image = React.forwardRef<HTMLDivElement, AuroraImageProps>(
  (
    {
      src,
      alt = "",
      status,
      loading,
      aspect = "4:3",
      progress,
      model,
      prompt,
      caption,
      dimensions,
      seed,
      onRegenerate,
      onExpand,
      onRetry,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const resolved: AiImageStatus =
      status ?? (loading ? "generating" : src ? "ready" : "generating")
    const isFailed = resolved === "failed"
    const isGenerating = resolved === "generating"
    const isReady = resolved === "ready"

    const pct =
      typeof progress === "number"
        ? Math.round(Math.max(0, Math.min(1, progress)) * 100)
        : null

    const frameStyle: React.CSSProperties = {
      position: "relative",
      aspectRatio: aspectValue(aspect),
      width: "100%",
      overflow: "hidden",
      borderRadius: "var(--aurora-radius-1)",
      background:
        "radial-gradient(120% 120% at 62% 28%, #1c425a 0%, #0d2230 52%, #07131c 100%)",
      border: isFailed
        ? "1px solid color-mix(in srgb, var(--aurora-error) 42%, var(--aurora-border-strong))"
        : "1px solid var(--aurora-border-strong)",
      boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
    }

    return (
      <figure
        ref={ref}
        className={["aurora-ai-image grid gap-2", className].filter(Boolean).join(" ")}
        style={{ margin: 0, ...style }}
        {...props}
      >
        <div style={frameStyle}>
          {/* Image (ready only) */}
          {isReady && src ? (
             
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 size-full object-cover"
              draggable={false}
            />
          ) : null}

          {/* Top chrome: AI badge + model pill */}
          {(isReady || isGenerating) && (model || isReady) ? (
            <div
              className="absolute inset-x-0 top-0 flex items-start justify-between"
              style={{ padding: 10 }}
            >
              <span style={{ ...chipStyle(), gap: 4 }}>
                <Sparkles className="size-3" aria-hidden style={{ color: ROSE }} />
                AI
              </span>
              {model ? <span style={chipStyle()}>{model}</span> : <span />}
            </div>
          ) : null}

          {/* Ready: prompt overlay + hover expand */}
          {isReady ? (
            <>
              {prompt ? (
                <figcaption
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    padding: "26px 12px 12px",
                    background: PROMPT_SCRIM,
                    fontFamily: "var(--aurora-font-sans)",
                    fontSize: 12.5,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: "var(--aurora-text-primary)",
                  }}
                >
                  {prompt}
                </figcaption>
              ) : null}
              {onExpand ? (
                <Button
                  type="button"
                  size="icon"
                  variant="neutral"
                  aria-label="Expand image"
                  onClick={onExpand}
                  className="absolute"
                  style={{
                    top: 10,
                    right: model ? 88 : 10,
                    opacity: 0,
                    transition: "opacity var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease)",
                  }}
                >
                  <Maximize2 className="size-4" aria-hidden />
                </Button>
              ) : null}
            </>
          ) : null}

          {/* Generating: spinner + label + progress bar */}
          {isGenerating ? (
            <div className="absolute inset-0 grid place-items-center" style={{ padding: 16 }}>
              <div className="grid justify-items-center gap-3">
                <Spinner size="lg" tone="cyan" />
                <span
                  style={{
                    fontFamily: "var(--aurora-font-mono)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--aurora-text-muted)",
                  }}
                >
                  Generating{pct !== null ? ` · ${pct}%` : ""}
                </span>
              </div>
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0"
                style={{ height: 4, background: "color-mix(in srgb, var(--aurora-page-bg) 70%, transparent)" }}
              >
                <div
                  role="progressbar"
                  aria-valuenow={pct ?? undefined}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Generation progress"
                  style={{
                    height: "100%",
                    width: pct !== null ? `${pct}%` : "40%",
                    background: `linear-gradient(90deg, ${ROSE}, color-mix(in srgb, ${ROSE} 70%, var(--aurora-accent-primary)))`,
                    boxShadow: `0 0 10px color-mix(in srgb, ${ROSE} 45%, transparent)`,
                    transition: "width var(--motion-duration-slow, 360ms) var(--motion-ease-out, ease)",
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* Failed: alert icon + heading + retry */}
          {isFailed ? (
            <div className="absolute inset-0 grid place-items-center" style={{ padding: 16 }}>
              <div className="grid justify-items-center gap-3 text-center">
                <CircleAlert
                  className="size-7"
                  aria-hidden
                  style={{ color: "var(--aurora-error)" }}
                />
                <span
                  style={{
                    fontFamily: "var(--aurora-font-sans)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--aurora-text-primary)",
                  }}
                >
                  Generation failed
                </span>
                {onRetry ? (
                  <Button type="button" size="sm" variant="neutral" onClick={onRetry}>
                    <RotateCw className="size-3.5" aria-hidden />
                    Retry
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer: caption + metadata + regenerate */}
        {caption || dimensions || seed || onRegenerate ? (
          <div className="grid gap-1">
            {caption ? <span className="aurora-text-meta" style={{ color: "var(--aurora-text-muted)" }}>{caption}</span> : null}
            {dimensions || seed || onRegenerate ? (
              <div className="flex items-end justify-between gap-3">
                {dimensions || seed ? (
                  <span
                    className="aurora-text-code"
                    style={{ color: "var(--aurora-text-muted)", fontSize: 11, lineHeight: 1.5 }}
                  >
                    {dimensions}
                    {dimensions && seed ? <>{"  "}seed {seed}</> : seed ? <>seed {seed}</> : null}
                  </span>
                ) : (
                  <span />
                )}
                {onRegenerate ? (
                  <Button type="button" size="sm" variant="ghost" onClick={onRegenerate}>
                    <RotateCw className="size-3.5" aria-hidden />
                    Regenerate
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </figure>
    )
  }
)
Image.displayName = "Image"

export { Image }
export default Image
