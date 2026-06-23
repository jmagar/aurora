"use client"

// BREAKING: badgeVariants export removed in this version. See badgeVariants deprecation shim below.

import * as React from "react"
import { cn } from "@/lib/utils"

function devWarn(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message)
  }
}

// ---------------------------------------------------------------------------
// Tones
// ---------------------------------------------------------------------------
// CD parity: six tone families. `violet` was removed from the system; CD's
// expressive accents are cyan (primary), rose (secondary), and orange (warn).

export type BadgeTone =
  | "info"
  | "success"
  | "warn"
  | "error"
  | "neutral"
  | "rose"
  | "cyan"

/** Fill style — orthogonal to tone. CD parity: soft (default) / solid / outline. */
export type BadgeFill = "soft" | "solid" | "outline"

type ToneTokens = {
  /** Base accent — the saturated hue for dot, solid fill, outline border. */
  accent: string
  /** Soft-fill text color (light, legible on the tinted surface). */
  text: string
  /** Soft-fill border. */
  border: string
  /** Soft-fill tinted surface. */
  bg: string
  /** Text color used on a bright solid fill (dark, for contrast). */
  solidText: string
}

const badgeToneMap: Record<BadgeTone, ToneTokens> = {
  info: {
    accent:    "var(--aurora-info)",
    text:      "var(--aurora-info-foreground)",
    border:    "var(--aurora-info-border)",
    bg:        "var(--aurora-info-surface)",
    solidText: "var(--aurora-page-bg)",
  },
  success: {
    accent:    "var(--aurora-success)",
    text:      "var(--aurora-success-foreground)",
    border:    "var(--aurora-success-border)",
    bg:        "var(--aurora-success-surface)",
    solidText: "var(--aurora-page-bg)",
  },
  warn: {
    accent:    "var(--aurora-warn)",
    text:      "var(--aurora-warn-foreground)",
    border:    "var(--aurora-warn-border)",
    bg:        "var(--aurora-warn-surface)",
    solidText: "var(--aurora-page-bg)",
  },
  error: {
    accent:    "var(--aurora-error)",
    text:      "var(--aurora-error-foreground)",
    border:    "var(--aurora-error-border)",
    bg:        "var(--aurora-error-surface)",
    solidText: "var(--aurora-page-bg)",
  },
  neutral: {
    accent:    "var(--aurora-neutral)",
    text:      "var(--aurora-neutral-foreground)",
    border:    "var(--aurora-neutral-border)",
    bg:        "var(--aurora-neutral-surface)",
    solidText: "var(--aurora-page-bg)",
  },
  rose: {
    accent:    "var(--aurora-accent-pink)",
    text:      "var(--aurora-accent-pink-strong)",
    border:    "var(--aurora-accent-pink-border)",
    bg:        "var(--aurora-accent-pink-surface)",
    solidText: "var(--aurora-page-bg)",
  },
  cyan: {
    accent:    "var(--aurora-accent-primary)",
    text:      "color-mix(in srgb, var(--aurora-accent-primary) 88%, white)",
    border:    "color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent)",
    bg:        "color-mix(in srgb, var(--aurora-accent-primary) 12%, var(--aurora-panel-medium))",
    solidText: "var(--aurora-page-bg)",
  },
}

// ---------------------------------------------------------------------------
// Pulse keyframe injection
// ---------------------------------------------------------------------------

const PULSE_ID = "aurora-badge-pulse"

function injectPulse() {
  if (typeof document === "undefined") return
  if (document.getElementById(PULSE_ID)) return
  const style = document.createElement("style")
  style.id = PULSE_ID
  style.textContent = `
    @keyframes aurora-badge-pulse {
      0%, 100% {
        box-shadow:
          0 0 0 0 color-mix(in srgb, var(--badge-dot-color) 40%, transparent),
          0 0 4px var(--badge-dot-color);
      }
      50% {
        box-shadow:
          0 0 0 4px transparent,
          0 0 6px var(--badge-dot-color);
      }
    }
    .aurora-badge-dot--pulse {
      animation: aurora-badge-pulse 1.6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .aurora-badge-dot--pulse {
        animation: none;
      }
    }
  `
  document.head.appendChild(style)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FILL_VALUES = new Set<BadgeFill>(["soft", "solid", "outline"])

function isFillValue(v: string): v is BadgeFill {
  return FILL_VALUES.has(v as BadgeFill)
}

function resolveTone(value: BadgeTone | "default" | "violet" | undefined): BadgeTone {
  if (!value) return "neutral"
  if (value === "default") {
    devWarn('[Aurora Badge] tone="default" is deprecated. Use tone="neutral" instead.')
    return "neutral"
  }
  if (value === "violet") {
    devWarn('[Aurora Badge] tone="violet" was removed. Falling back to "cyan".')
    return "cyan"
  }
  if (!Object.hasOwn(badgeToneMap, value)) {
    devWarn(
      `[Aurora Badge] Unknown tone "${value}". Valid values: ${Object.keys(badgeToneMap).join(", ")}. Falling back to "neutral".`
    )
    return "neutral"
  }
  return value
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Color family OR fill style. Accepts a tone ("info" | "success" | "warn" |
   * "error" | "neutral" | "rose" | "cyan") for backward compatibility, or a
   * fill keyword ("soft" | "solid" | "outline"). "default"/"violet" are
   * deprecated tone aliases (→ neutral / cyan). Prefer the explicit `tone` and
   * `fill` props.
   */
  variant?: BadgeTone | BadgeFill | "default" | "violet"
  /** Color family. <Badge tone="success"> */
  tone?: BadgeTone | "default" | "violet"
  /** Fill style: "soft" (default, tinted) | "solid" (bright) | "outline" (transparent). */
  fill?: BadgeFill
  /** Render a status dot to the left of the label. */
  dot?: boolean
  /**
   * Inline leading icon. Pass an SVG `<path>` body string (the `d=`/markup
   * inside an `<svg viewBox="0 0 24 24">`), or any React node for full control.
   */
  icon?: string | React.ReactNode
  /**
   * Animate the dot with a pulse ring — use for "live", "recording", or
   * "connected" indicators. Has no effect when `dot` is false.
   */
  pulse?: boolean
  /** Visual size. "sm" | "md" (alias "default"). Defaults to "md". */
  size?: "sm" | "md" | "default"
  /**
   * Typography and radius shape:
   * - "label"  (default) — uppercase mono, 4px radius. Status codes, tech labels.
   * - "tag"    — sentence-case sans, 4px radius. Content tags, user labels.
   * - "pill"   — sentence-case sans, 999px radius. Fully rounded chips.
   */
  shape?: "label" | "tag" | "pill"
  /**
   * Render as a clickable chip (filter tags, toggleable labels).
   * Adds cursor-pointer, focus ring, and keyboard activation (Enter/Space).
   * When `onClick` is also provided, `role="button"` is applied automatically.
   */
  interactive?: boolean
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      tone: toneProp,
      fill: fillProp,
      dot = false,
      icon,
      pulse = false,
      size = "md",
      shape = "label",
      interactive = false,
      style,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    // `variant` is overloaded for backward/CD compat: it may carry either a
    // fill keyword or a tone. Split it into the two orthogonal axes.
    const variantFill = variant && isFillValue(variant) ? (variant as BadgeFill) : undefined
    const variantTone =
      variant && !isFillValue(variant)
        ? (variant as BadgeTone | "default" | "violet")
        : undefined

    const tone = resolveTone(toneProp ?? variantTone)
    const fill: BadgeFill = fillProp ?? variantFill ?? "soft"
    const { accent, text, border, bg, solidText } = badgeToneMap[tone]

    // Inject pulse keyframes lazily — only when the feature is first used.
    React.useEffect(() => {
      if (pulse && dot) injectPulse()
    }, [pulse, dot])

    // -----------------------------------------------------------------------
    // Size tokens
    // -----------------------------------------------------------------------
    const isSm = size === "sm"
    const dotSize = isSm ? "4px" : "5px"
    const badgeRadius = shape === "pill" ? "999px" : "4px"
    const badgeFontSize = isSm
      ? "var(--aurora-type-caption)"
      : "var(--aurora-type-micro)"

    // -----------------------------------------------------------------------
    // Shape tokens
    // -----------------------------------------------------------------------
    const isLabel = shape === "label"
    const fontFamily = isLabel
      ? "var(--aurora-font-mono, 'JetBrains Mono', monospace)"
      : "var(--aurora-font-sans, Inter, sans-serif)"
    const letterSpacing = isLabel ? "0.075em" : "0.01em"

    // -----------------------------------------------------------------------
    // Fill resolution (soft / solid / outline)
    // -----------------------------------------------------------------------
    const dotColor = fill === "solid" ? solidText : accent
    const dotShadow =
      fill === "solid"
        ? "0 0 4px color-mix(in srgb, var(--badge-dot-color) 60%, transparent)"
        : "0 0 4px var(--badge-dot-color)"

    let fillStyle: React.CSSProperties
    if (fill === "solid") {
      fillStyle = {
        background: accent,
        borderColor: "transparent",
        color: solidText,
        // Subtle outer glow so the bright chip reads as "live" against the navy.
        boxShadow: `0 2px 10px color-mix(in srgb, ${accent} 32%, transparent)`,
      }
    } else if (fill === "outline") {
      fillStyle = {
        background: "transparent",
        borderColor: border,
        color: text,
      }
    } else {
      // soft (default)
      fillStyle = {
        background: bg,
        borderColor: border,
        color: text,
      }
    }

    // -----------------------------------------------------------------------
    // Icon resolution — string path body vs node
    // -----------------------------------------------------------------------
    const iconNode: React.ReactNode =
      typeof icon === "string" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width={isSm ? 11 : 12}
          height={isSm ? 11 : 12}
          fill="currentColor"
          style={{ flexShrink: 0 }}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      ) : (
        icon ?? null
      )

    // -----------------------------------------------------------------------
    // Interactive keyboard handler
    // -----------------------------------------------------------------------
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLSpanElement>) => {
        onKeyDown?.(e)
        if (interactive && onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onClick(e as unknown as React.MouseEvent<HTMLSpanElement>)
        }
      },
      [interactive, onClick, onKeyDown]
    )

    // -----------------------------------------------------------------------
    // Derived accessibility attributes
    // -----------------------------------------------------------------------
    const interactiveProps = interactive
      ? {
          tabIndex: 0,
          role: onClick ? ("button" as const) : undefined,
          onKeyDown: handleKeyDown,
          onClick,
        }
      : { onClick }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 leading-none border whitespace-nowrap",
          // Size
          isSm ? "px-1.5 py-0" : "px-2 py-0.5",
          // Shape: uppercase only for "label"
          isLabel && "uppercase",
          // Interactive
          interactive && [
            "cursor-pointer",
            "transition-[box-shadow,filter,transform] duration-150",
            "hover:brightness-125",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)]",
          ],
          className
        )}
        style={{
          borderRadius: badgeRadius,
          fontFamily,
          fontSize: badgeFontSize,
          fontWeight: 650,
          letterSpacing,
          ...fillStyle,
          ...style,
        }}
        {...interactiveProps}
        {...props}
      >
        {dot && (
          <span
            aria-hidden="true"
            className={cn(pulse && "aurora-badge-dot--pulse")}
            style={{
              display: "inline-block",
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: dotColor,
              flexShrink: 0,
              // Static glow when not pulsing; animation handles it when pulsing.
              boxShadow: pulse ? undefined : dotShadow,
              // CSS custom property consumed by the keyframe so one rule
              // works across all tones.
              ["--badge-dot-color" as string]: dotColor,
            }}
          />
        )}
        {iconNode}
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
export default Badge

/** @deprecated badgeVariants has been removed. Use the Badge component directly. */
export const badgeVariants = undefined
