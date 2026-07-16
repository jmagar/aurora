"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Loader — thinking / busy indicator.
//
// Icon-only by default (spinner / dots / bars / pulse), with an optional muted
// label. All color is derived from `--aurora-*` tokens (rose default, cyan via
// `tone="accent"`).
//
// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// CVA — tone (rose default / cyan accent) drives a single CSS custom property.
// ---------------------------------------------------------------------------

const loaderVariants = cva(
  "inline-flex shrink-0 items-center gap-2.5 align-middle",
  {
    variants: {
      tone: {
        rose: "",
        accent: "",
      },
    },
    defaultVariants: {
      tone: "rose",
    },
  }
)

const TONE_TOKEN: Record<NonNullable<LoaderTone>, string> = {
  rose: "var(--aurora-accent-pink)",
  accent: "var(--aurora-accent-primary)",
}

type LoaderTone = "rose" | "accent"
type LoaderVariant = "spinner" | "dots" | "bars" | "pulse"

export type LoaderProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> &
  VariantProps<typeof loaderVariants> & {
    /** Indicator style. */
    variant?: LoaderVariant
    /** Optional muted text shown after the indicator. */
    label?: React.ReactNode
    /** Diameter / height of the indicator in pixels. */
    size?: number
  }

const Loader = (
    { ref,
      className,
      style,
      variant = "spinner",
      tone = "rose",
      label,
      size = 22,
      role,
      ...props
    }: LoaderProps & { ref?: React.Ref<HTMLDivElement> }
  ) => {
    const toneToken = TONE_TOKEN[tone ?? "rose"]

    const a11y = {
      role: role ?? "status",
      "aria-live": "polite" as const,
      "aria-busy": true as const,
      "aria-label":
        props["aria-label"] ??
        (typeof label === "string" ? label : "Loading"),
    }

    const toneStyle = {
      ["--aurora-loader-tone" as string]: toneToken,
    } as React.CSSProperties

    let indicator: React.ReactNode

    if (variant === "dots") {
      const dot = Math.max(4, Math.round(size * 0.32))
      indicator = (
        <span
          aria-hidden="true"
          className="inline-flex items-center"
          style={{ gap: dot * 0.6, height: size }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="aurora-ai-loader__dot"
              style={{
                width: dot,
                height: dot,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </span>
      )
    } else if (variant === "bars") {
      const barW = Math.max(2, Math.round(size * 0.14))
      indicator = (
        <span
          aria-hidden="true"
          className="inline-flex items-center"
          style={{ gap: barW * 0.85, height: size }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="aurora-ai-loader__bar"
              style={{
                width: barW,
                height: size,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </span>
      )
    } else if (variant === "pulse") {
      const core = Math.max(4, Math.round(size * 0.3))
      indicator = (
        <span
          aria-hidden="true"
          className="aurora-ai-loader__pulse-frame relative inline-flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span
            className="aurora-ai-loader__pulse-ring absolute"
            style={{ width: size * 0.72, height: size * 0.72 }}
          />
          <span
            className="aurora-ai-loader__pulse-core"
            style={{ width: core, height: core }}
          />
        </span>
      )
    } else {
      // spinner (default)
      indicator = (
        <span
          aria-hidden="true"
          className="aurora-ai-loader__spinner inline-block"
          style={{ width: size, height: size }}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(loaderVariants({ tone }), className)}
        style={{ ...toneStyle, ...style }}
        {...a11y}
        {...props}
      >
        {indicator}
        {label != null ? (
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: 15,
              lineHeight: 1.2,
              color: "var(--aurora-text-muted)",
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
    )
  }
Loader.displayName = "Loader"

export { Loader, loaderVariants }
export default Loader
