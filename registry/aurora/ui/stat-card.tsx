"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  delta?: React.ReactNode;
  deltaPositive?: boolean;
  description?: React.ReactNode;
  tone?: "neutral" | "info" | "success" | "warn" | "error";
}

export interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard({ label, value, delta, deltaPositive, description, tone = "neutral", className, style, ...rest }, ref) {
    const deltaColor =
      deltaPositive === undefined
        ? "var(--aurora-text-muted)"
        : deltaPositive
          ? "var(--aurora-accent-strong)"
          : "var(--aurora-error)";
    const toneColor =
      tone === "info"
        ? "var(--aurora-accent-primary)"
        : tone === "success"
          ? "var(--aurora-success)"
          : tone === "warn"
            ? "var(--aurora-warn)"
            : tone === "error"
              ? "var(--aurora-error)"
              : "var(--aurora-border-strong)";

    return (
      <div
        ref={ref}
        className={cn("relative flex min-h-[116px] flex-col gap-2 overflow-hidden px-4 py-3.5", className)}
        style={{
          width: "100%",
          maxWidth: 220,
          background: "var(--aurora-panel-medium)",
          border: `1px solid var(--aurora-border-strong)`,
          borderRadius: 8,
          boxShadow:
            "var(--aurora-shadow-medium), inset 0 1px 0 rgba(255,255,255,0.04)",
          ...style,
        }}
        {...rest}
      >
        <span
          aria-hidden="true"
          style={{
            background: toneColor,
            bottom: 0,
            left: 0,
            opacity: tone === "neutral" ? 0.45 : 0.9,
            position: "absolute",
            top: 0,
            width: 3,
          }}
        />

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

        <span
          className="tabular-nums"
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: "-0.025em",
            lineHeight: 1,
            color: "var(--aurora-text-primary)",
          }}
        >
          {value}
        </span>

        <span
          style={{
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-caption)",
            lineHeight: 1.35,
            minHeight: 15,
          }}
        >
          {description}
        </span>

        {delta !== undefined && (
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
            {deltaPositive === true && delta !== undefined
              ? typeof delta === "string" && !delta.startsWith("+")
                ? `+${delta}`
                : delta
              : delta}
          </span>
        )}
      </div>
    );
  },
);

StatCard.displayName = "StatCard";

// ---------------------------------------------------------------------------
// StatGrid
// ---------------------------------------------------------------------------

export const StatGrid = React.forwardRef<HTMLDivElement, StatGridProps>(
  function StatGrid({ children, className, style, ...rest }, ref) {
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
  },
);

StatGrid.displayName = "StatGrid";
