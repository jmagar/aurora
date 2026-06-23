"use client"

import * as React from "react"
import { Check, Grid2x2, RotateCw, Sparkles } from "lucide-react"

// AiImageGrid — a candidate-variation surface: a 2×2 (or N-up) grid of
// AI-generated image tiles where exactly one can be selected. A header row
// carries a grid glyph + caption and a "Regenerate all" affordance; the chosen
// tile gets a rose selection ring, an "AI" identity badge, a model pill and a
// rose check button. Selection follows a single-select radiogroup pattern.
//
// Visual spec ported 1:1 from the Claude Design source. Rose
// (--aurora-accent-pink) is the AI/automation identity + selection accent
// (violet was removed from the system); the cyan accent drives the idle tile
// hover ring. All values reference the --aurora-* token layer.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AiImageGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "defaultValue"> {
  /** Image sources, one per candidate tile. */
  images: string[]
  /** Caption shown beside the grid glyph in the header (e.g. "4 candidates · pick one"). */
  caption?: string
  /** Model label shown in the selected tile's top-right pill (e.g. "Imagen 3"). */
  model?: string
  /** Controlled selected index. Use with `onSelect`. */
  value?: number
  /** Initial selected index for the uncontrolled case. Defaults to 0. */
  defaultValue?: number
  /** Selection handler — receives the index of the chosen tile. */
  onSelect?: (index: number) => void
  /** Regenerate-all handler — shows the "Regenerate all" button in the header. */
  onRegenerate?: () => void
  /** Accessible label for the radiogroup. Defaults to "Image candidates". */
  label?: string
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const ROSE = "var(--aurora-accent-pink)"
const CYAN = "var(--aurora-accent-primary)"

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

const AiImageGrid = React.forwardRef<HTMLDivElement, AiImageGridProps>(
  (
    {
      images,
      caption,
      model,
      value,
      defaultValue = 0,
      onSelect,
      onRegenerate,
      label = "Image candidates",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState(defaultValue)
    const selected = isControlled ? (value as number) : internal

    const select = React.useCallback(
      (index: number) => {
        if (!isControlled) setInternal(index)
        onSelect?.(index)
      },
      [isControlled, onSelect]
    )

    const refs = React.useRef<Array<HTMLButtonElement | null>>([])

    const onKeyDown = (e: React.KeyboardEvent) => {
      const count = images.length
      if (count === 0) return
      let next: number | null = null
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (selected + 1) % count
          break
        case "ArrowLeft":
        case "ArrowUp":
          next = (selected - 1 + count) % count
          break
        case "Home":
          next = 0
          break
        case "End":
          next = count - 1
          break
        default:
          return
      }
      e.preventDefault()
      select(next)
      refs.current[next]?.focus()
    }

    return (
      <div
        ref={ref}
        className={["aurora-ai-image-grid grid gap-3", className].filter(Boolean).join(" ")}
        style={style}
        {...props}
      >
        {/* Header: grid glyph + caption + regenerate-all */}
        {caption || onRegenerate ? (
          <div className="flex items-center justify-between gap-3">
            <span
              className="inline-flex items-center"
              style={{
                gap: 8,
                fontFamily: "var(--aurora-font-sans)",
                fontSize: 13.5,
                fontWeight: 700,
                color: "var(--aurora-text-primary)",
              }}
            >
              <Grid2x2
                className="size-4"
                aria-hidden
                style={{ color: "var(--aurora-text-muted)" }}
              />
              {caption}
            </span>
            {onRegenerate ? (
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex items-center"
                style={{
                  gap: 6,
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "var(--aurora-font-sans)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "var(--aurora-text-muted)",
                  transition:
                    "color var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = CYAN
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--aurora-text-muted)"
                }}
              >
                <RotateCw className="size-3.5" aria-hidden />
                Regenerate all
              </button>
            ) : null}
          </div>
        ) : null}

        {/* Tile grid */}
        <div
          role="radiogroup"
          aria-label={label}
          onKeyDown={onKeyDown}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {images.map((src, i) => {
            const isSelected = i === selected
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Candidate ${i + 1}${isSelected ? " (selected)" : ""}`}
                tabIndex={isSelected ? 0 : -1}
                ref={(el) => {
                  refs.current[i] = el
                }}
                onClick={() => select(i)}
                className="aurora-ai-image-grid-tile group"
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  width: "100%",
                  padding: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  borderRadius: "var(--aurora-radius-1)",
                  background:
                    "radial-gradient(120% 120% at 50% 34%, #1c425a 0%, #0d2230 52%, #07131c 100%)",
                  border: isSelected
                    ? `1.5px solid ${ROSE}`
                    : "1.5px solid var(--aurora-border-strong)",
                  boxShadow: isSelected
                    ? `0 0 0 3px color-mix(in srgb, ${ROSE} 22%, transparent), var(--aurora-shadow-medium)`
                    : "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
                  transition:
                    "border-color var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease), box-shadow var(--motion-duration-fast, 160ms) var(--motion-ease-out, ease)",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = `color-mix(in srgb, ${CYAN} 55%, var(--aurora-border-strong))`
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--aurora-border-strong)"
                  }
                }}
              >
                { }
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 size-full object-cover"
                  draggable={false}
                />

                {/* Selected tile chrome: AI badge + model pill */}
                {isSelected ? (
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

                {/* Selection check */}
                {isSelected ? (
                  <span
                    aria-hidden
                    className="absolute grid place-items-center"
                    style={{
                      bottom: 10,
                      right: 10,
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: ROSE,
                      color: "var(--aurora-page-bg)",
                      boxShadow: `0 0 12px color-mix(in srgb, ${ROSE} 50%, transparent)`,
                    }}
                  >
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)
AiImageGrid.displayName = "AiImageGrid"

export { AiImageGrid }
export default AiImageGrid
