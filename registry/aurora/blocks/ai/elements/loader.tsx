"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Loader — thinking / busy indicator.
//
// Icon-only by default (spinner / dots / bars / pulse), with an optional muted
// label. Self-contained: keyframes + tone colours are injected once so the
// indicator animates even when no shared stylesheet is mounted. All colour is
// derived from `--aurora-*` tokens (rose default, cyan via `tone="accent"`).
// ---------------------------------------------------------------------------

const LOADER_ID = "aurora-ai-loader-keyframes"

function injectLoader() {
  if (typeof document === "undefined") return
  if (document.getElementById(LOADER_ID)) return
  const style = document.createElement("style")
  style.id = LOADER_ID
  style.textContent = `
    @keyframes aurora-loader-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes aurora-loader-dot {
      0%, 80%, 100% { opacity: 0.25; transform: scale(0.7); }
      40%           { opacity: 1;    transform: scale(1); }
    }
    @keyframes aurora-loader-bar {
      0%, 100% { transform: scaleY(0.35); }
      50%      { transform: scaleY(1); }
    }
    @keyframes aurora-loader-pulse-ring {
      0%   { transform: scale(0.45); opacity: 0.9; }
      100% { transform: scale(1);    opacity: 0; }
    }
    @keyframes aurora-loader-pulse-core {
      0%, 100% { opacity: 1;    transform: scale(1); }
      50%      { opacity: 0.55; transform: scale(0.82); }
    }
    .aurora-ai-loader__spinner {
      border: 2px solid color-mix(in srgb, var(--aurora-loader-tone) 22%, transparent);
      border-top-color: var(--aurora-loader-tone);
      border-radius: 9999px;
      animation: aurora-loader-spin 0.7s linear infinite;
    }
    .aurora-ai-loader__dot {
      background: var(--aurora-loader-tone);
      border-radius: 9999px;
      animation: aurora-loader-dot 1.2s ease-in-out infinite;
    }
    .aurora-ai-loader__bar {
      background: var(--aurora-loader-tone);
      border-radius: 9999px;
      transform-origin: center bottom;
      animation: aurora-loader-bar 1s ease-in-out infinite;
    }
    .aurora-ai-loader__pulse-frame {
      border: 1px solid color-mix(in srgb, var(--aurora-loader-tone) 38%, transparent);
      border-radius: 9999px;
    }
    .aurora-ai-loader__pulse-ring {
      border: 1.5px solid var(--aurora-loader-tone);
      border-radius: 9999px;
      animation: aurora-loader-pulse-ring 1.4s ease-out infinite;
    }
    .aurora-ai-loader__pulse-core {
      background: var(--aurora-loader-tone);
      border-radius: 9999px;
      animation: aurora-loader-pulse-core 1.4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .aurora-ai-loader__spinner,
      .aurora-ai-loader__dot,
      .aurora-ai-loader__bar,
      .aurora-ai-loader__pulse-ring,
      .aurora-ai-loader__pulse-core {
        animation-duration: 0.001ms;
        animation-iteration-count: 1;
      }
    }
  `
  document.head.appendChild(style)
}

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

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      style,
      variant = "spinner",
      tone = "rose",
      label,
      size = 22,
      role,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      injectLoader()
    }, [])

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
              fontFamily: "var(--font-sans)",
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
)
Loader.displayName = "Loader"

export { Loader, loaderVariants }
export default Loader
