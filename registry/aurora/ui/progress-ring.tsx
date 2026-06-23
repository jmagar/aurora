"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// ProgressRing — Aurora extension · circular progress
// ---------------------------------------------------------------------------

export interface ProgressRingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Progress value, 0–100. */
  value: number;
  /** Diameter of the ring in pixels. */
  size?: number;
  /** Stroke width of the ring in pixels. */
  thickness?: number;
  /**
   * Color of the progress arc. Any CSS color; defaults to the Aurora cyan
   * accent token. Pass a `var(--aurora-*)` token to stay on-palette.
   */
  color?: string;
  /** Track (background arc) color. Defaults to a muted Aurora border tint. */
  trackColor?: string;
  /** Hide the centered percentage label. */
  hideLabel?: boolean;
  /** Custom centered content (overrides the default percentage label). */
  children?: React.ReactNode;
}

export const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  function ProgressRing(
    {
      value,
      size = 80,
      thickness = 6,
      color = "var(--aurora-accent-primary)",
      trackColor = "color-mix(in srgb, var(--aurora-border-default) 70%, transparent)",
      hideLabel = false,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const clamped = Math.max(0, Math.min(100, value));
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - clamped / 100);
    const center = size / 2;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden="true"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={thickness}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset var(--motion-slow, 0.6s) var(--ease-out, ease-out)",
            }}
          />
        </svg>
        {!hideLabel && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: Math.max(11, Math.round(size * 0.26)),
              color: "var(--aurora-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {children ?? `${Math.round(clamped)}%`}
          </div>
        )}
      </div>
    );
  },
);

ProgressRing.displayName = "ProgressRing";

export default ProgressRing;
