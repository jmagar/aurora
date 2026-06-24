"use client"

/**
 * Aurora OperationIcon — Axon operation glyph family, tone-coded.
 *
 * A self-contained icon component matching the Claude Design source 1:1. Each
 * Axon operation (`scrape`, `crawl`, `ask`, …) maps to a distinct line glyph and
 * a semantic tone derived from its operation class:
 *   - Fetch / read   → cyan   (scrape, map, retrieve, screenshot, endpoints)
 *   - Async jobs     → orange (crawl, extract, embed, ingest)
 *   - Reason         → rose   (ask, summarize, research, suggest)
 *
 * The visual layer is injected once and reads only `--aurora-*` tokens so it
 * renders identically in dark + `.light`. Architecture stays shadcn: a glyph map,
 * `forwardRef`, `displayName`, named + default export, and a11y (role/aria-label
 * with an option to mark the glyph decorative).
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { injectOnce } from "@/registry/aurora/lib/inject-once"

// ─── Tones ───────────────────────────────────────────────────────────────────

export type OperationTone = "cyan" | "orange" | "rose" | "neutral"

export type OperationName =
  | "scrape"
  | "map"
  | "retrieve"
  | "screenshot"
  | "endpoints"
  | "crawl"
  | "extract"
  | "embed"
  | "ingest"
  | "ask"
  | "summarize"
  | "research"
  | "suggest"

const TONE_BY_NAME: Record<OperationName, OperationTone> = {
  // Fetch · read (cyan)
  scrape: "cyan",
  map: "cyan",
  retrieve: "cyan",
  screenshot: "cyan",
  endpoints: "cyan",
  // Async jobs (orange)
  crawl: "orange",
  extract: "orange",
  embed: "orange",
  ingest: "orange",
  // Reason (rose)
  ask: "rose",
  summarize: "rose",
  research: "rose",
  suggest: "rose",
}

// ─── Visual layer (ported from Claude Design) ──────────────────────────────────

const CSS = `
.aurora-op-icon {
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
  border-radius: 8px; box-sizing: border-box;
  background: var(--aurora-op-surface);
  border: 1px solid var(--aurora-op-border);
  color: var(--aurora-op-fg);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
}
.aurora-op-icon svg { display: block; }

/* cyan — fetch / read */
.aurora-op-icon--cyan {
  --aurora-op-fg: var(--aurora-accent-strong);
  --aurora-op-surface: color-mix(in srgb, var(--aurora-accent-primary) 13%, var(--aurora-control-surface));
  --aurora-op-border: color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent);
}
/* orange — async jobs */
.aurora-op-icon--orange {
  --aurora-op-fg: var(--axon-orange-strong);
  --aurora-op-surface: color-mix(in srgb, var(--axon-orange) 14%, var(--aurora-control-surface));
  --aurora-op-border: color-mix(in srgb, var(--axon-orange) 36%, transparent);
}
/* rose — reason */
.aurora-op-icon--rose {
  --aurora-op-fg: var(--aurora-accent-pink-strong);
  --aurora-op-surface: color-mix(in srgb, var(--aurora-accent-pink) 13%, var(--aurora-control-surface));
  --aurora-op-border: color-mix(in srgb, var(--aurora-accent-pink) 34%, transparent);
}
/* neutral — fallback */
.aurora-op-icon--neutral {
  --aurora-op-fg: var(--aurora-text-muted);
  --aurora-op-surface: color-mix(in srgb, var(--aurora-text-muted) 8%, var(--aurora-control-surface));
  --aurora-op-border: color-mix(in srgb, var(--aurora-border-default) 70%, transparent);
}
`

function ensureCSS() { injectOnce("aurora-operation-icon", CSS) }

// ─── Glyphs ────────────────────────────────────────────────────────────────────
// Each glyph draws on a 24×24 grid with currentColor strokes.

type GlyphProps = { size: number }

function svg(children: React.ReactNode, size: number) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const GLYPHS: Record<OperationName, (p: GlyphProps) => React.ReactElement> = {
  // ── Fetch / read ──
  scrape: ({ size }) =>
    svg(
      <>
        <path d="M4 5h16v11H4z" />
        <path d="M2 19h20" />
        <path d="M8 16v3M16 16v3" />
      </>,
      size
    ),
  map: ({ size }) =>
    svg(
      <>
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
        <path d="M9 4v14M15 6v14" />
      </>,
      size
    ),
  retrieve: ({ size }) =>
    svg(
      <>
        <path d="M12 3v12" />
        <path d="m8 11 4 4 4-4" />
        <path d="M5 19h14" />
      </>,
      size
    ),
  screenshot: ({ size }) =>
    svg(
      <>
        <path d="M3 9V5h4M21 9V5h-4M3 15v4h4M21 15v4h-4" />
        <circle cx="12" cy="12" r="3" />
      </>,
      size
    ),
  endpoints: ({ size }) =>
    svg(
      <>
        <circle cx="5" cy="12" r="2.2" />
        <circle cx="19" cy="6" r="2.2" />
        <circle cx="19" cy="18" r="2.2" />
        <path d="M7 11 17 6.8M7 13l10 4.2" />
      </>,
      size
    ),
  // ── Async jobs ──
  crawl: ({ size }) =>
    svg(
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 8.8V4M12 15.2V20M8.8 12H4M15.2 12H20M9.7 9.7 6.5 6.5M14.3 14.3l3.2 3.2M14.3 9.7l3.2-3.2M9.7 14.3l-3.2 3.2" />
      </>,
      size
    ),
  extract: ({ size }) =>
    svg(
      <>
        <path d="M4 4h11v16H4z" />
        <path d="M15 12h6" />
        <path d="m18 9 3 3-3 3" />
      </>,
      size
    ),
  embed: ({ size }) =>
    svg(
      <>
        <path d="m8 6-5 6 5 6" />
        <path d="m16 6 5 6-5 6" />
        <path d="m13 4-2 16" />
      </>,
      size
    ),
  ingest: ({ size }) =>
    svg(
      <>
        <path d="M12 3v9" />
        <path d="m8 8 4 4 4-4" />
        <path d="M4 14v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      </>,
      size
    ),
  // ── Reason ──
  ask: ({ size }) =>
    svg(
      <>
        <path d="M21 12a8 8 0 0 1-8 8H8l-4 2 1-4a8 8 0 1 1 16-6Z" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2.5 2-2.5 3" />
        <path d="M12 17h.01" />
      </>,
      size
    ),
  summarize: ({ size }) =>
    svg(
      <>
        <path d="M5 5h14M5 10h14M5 15h9M5 20h5" />
      </>,
      size
    ),
  research: ({ size }) =>
    svg(
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.3-4.3" />
        <path d="M11 8v6M8 11h6" />
      </>,
      size
    ),
  suggest: ({ size }) =>
    svg(
      <>
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.4 1 2.5h6c0-1.1.2-1.8 1-2.5A6 6 0 0 0 12 3Z" />
      </>,
      size
    ),
}

// ─── Component ───────────────────────────────────────────────────────────────

export interface OperationIconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Axon operation this glyph represents (drives the icon + tone). */
  name: OperationName
  /** Glyph + tile sizing in px (tile padding scales from this). Defaults to 24. */
  size?: number
  /** Override the auto-derived tone. */
  tone?: OperationTone
  /**
   * When true the icon is purely decorative (`aria-hidden`); otherwise it is
   * exposed as an image with the operation name as its accessible label.
   */
  decorative?: boolean
}

const OperationIcon = React.forwardRef<HTMLSpanElement, OperationIconProps>(
  (
    {
      name,
      size = 24,
      tone,
      decorative = false,
      className,
      style,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

    const resolvedTone: OperationTone =
      tone ?? TONE_BY_NAME[name] ?? "neutral"
    const Glyph = GLYPHS[name]
    // Tile is ~1.5× the glyph; padding keeps the glyph centered.
    const tileSize = Math.round(size * 1.5)

    return (
      <span
        ref={ref}
        className={cn(
          "aurora-op-icon",
          `aurora-op-icon--${resolvedTone}`,
          className
        )}
        style={{ width: tileSize, height: tileSize, ...style }}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : ariaLabel ?? `${name} operation`}
        aria-hidden={decorative ? true : undefined}
        {...props}
      >
        {Glyph ? <Glyph size={size} /> : null}
      </span>
    )
  }
)
OperationIcon.displayName = "OperationIcon"

export { OperationIcon, TONE_BY_NAME, GLYPHS }
export default OperationIcon
