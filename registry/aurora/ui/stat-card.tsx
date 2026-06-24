"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StatTrend = "up" | "down" | "flat";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  /** Change badge contents (e.g. "-8%", "+1"). */
  delta?: React.ReactNode;
  /**
   * Direction of the change badge. Drives the badge color:
   * `up` → positive (cyan), `down` → error (rose), `flat` → neutral.
   * Takes precedence over the legacy `deltaPositive` boolean.
   */
  trend?: StatTrend;
  /** Legacy color hint for the change badge. `trend` wins when both are set. */
  deltaPositive?: boolean;
  /** Caption under the value (CD `sub`). Alias of `description`. */
  sub?: React.ReactNode;
  /** Caption under the value. */
  description?: React.ReactNode;
  /**
   * Inline SVG path markup rendered inside the leading icon chip
   * (the inner content of a `0 0 24 24` viewBox stroke icon).
   */
  icon?: string;
  /** Compact tier: no icon chip, tighter padding, smaller value. */
  compact?: boolean;
  /** Optional left accent rail tone (legacy). */
  tone?: "neutral" | "info" | "success" | "warn" | "error";
}

export interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------

export function StatCard(
  {
    ref,
    label,
    value,
    delta,
    trend,
    deltaPositive,
    sub,
    description,
    icon,
    compact = false,
    tone = "neutral",
    className,
    style,
    ...rest
  }: StatCardProps & { ref?: React.Ref<HTMLDivElement> },
) {
  // Resolve the change-badge color. `trend` wins; fall back to the legacy
  // `deltaPositive` boolean, then to a muted neutral.
  const deltaColor =
    trend === "up"
      ? "var(--aurora-accent-strong)"
      : trend === "down"
        ? "var(--aurora-error)"
        : trend === "flat"
          ? "var(--aurora-text-muted)"
          : deltaPositive === undefined
            ? "var(--aurora-text-muted)"
            : deltaPositive
              ? "var(--aurora-accent-strong)"
              : "var(--aurora-error)";

  const toneColor =
    tone === "info"
      ? "var(--aurora-info)"
      : tone === "success"
        ? "var(--aurora-success)"
        : tone === "warn"
          ? "var(--aurora-warn)"
          : tone === "error"
            ? "var(--aurora-error)"
            : "var(--aurora-border-strong)";

  const caption = sub ?? description;
  const showDelta = delta !== undefined;
  const normalizedDelta =
    (trend === "up" || deltaPositive === true) &&
    typeof delta === "string" &&
    delta.length > 0 &&
    !delta.startsWith("+") &&
    !delta.startsWith("-")
      ? `+${delta}`
      : delta;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-1 flex-col overflow-hidden",
        compact ? "min-h-[78px]" : "min-h-[116px]",
        className,
      )}
      style={{
        width: "100%",
        minWidth: compact ? 120 : 150,
        gap: compact ? 6 : 10,
        padding: compact ? "12px 14px" : "16px 16px 14px",
        background: "var(--aurora-panel-medium)",
        border: "1px solid var(--aurora-border-strong)",
        borderRadius: "var(--aurora-radius-1)",
        boxShadow:
          "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        ...style,
      }}
      {...rest}
    >
      {/* Legacy left accent rail — only when a non-neutral tone is set */}
      {tone !== "neutral" && (
        <span
          aria-hidden="true"
          style={{
            background: toneColor,
            bottom: 0,
            left: 0,
            opacity: 0.9,
            position: "absolute",
            top: 0,
            width: 3,
          }}
        />
      )}

      {/* Header row: icon chip (full only) + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {!compact && icon && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 30,
              height: 30,
              borderRadius: 8,
              background:
                "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent)",
              color: "var(--aurora-accent-strong)",
            }}
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-body-sm)",
            fontWeight: "var(--aurora-weight-label)",
            letterSpacing: "var(--aurora-letter-ui)",
            color: "var(--aurora-text-muted)",
            lineHeight: 1.25,
          }}
        >
          {label}
        </span>
      </div>

      <span
        className="tabular-nums"
        style={{
          fontFamily: "var(--aurora-font-display)",
          fontWeight: 800,
          fontSize: compact ? 22 : 26,
          letterSpacing: "-0.025em",
          lineHeight: 1,
          color: "var(--aurora-text-primary)",
        }}
      >
        {value}
      </span>

      {caption !== undefined && caption !== null && (
        <span
          style={{
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-caption)",
            lineHeight: 1.35,
          }}
        >
          {caption}
        </span>
      )}

      {showDelta && (
        <span
          style={{
            alignSelf: "flex-start",
            background: `color-mix(in srgb, ${deltaColor} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${deltaColor} 24%, transparent)`,
            borderRadius: 5,
            color: deltaColor,
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-caption)",
            fontWeight: "var(--aurora-weight-ui)",
            letterSpacing: "var(--aurora-letter-ui)",
            lineHeight: 1,
            marginTop: "auto",
            padding: "4px 6px",
          }}
        >
          {normalizedDelta}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatGrid
// ---------------------------------------------------------------------------

export function StatGrid({ ref, children, className, style, ...rest }: StatGridProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("gap-4", className)}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 220px))",
        justifyContent: "start",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
