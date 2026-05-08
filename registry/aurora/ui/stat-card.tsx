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
}

export interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard({ label, value, delta, deltaPositive, className, ...rest }, ref) {
    const deltaColor =
      deltaPositive === undefined
        ? "var(--aurora-text-muted)"
        : deltaPositive
          ? "var(--aurora-accent-strong)"
          : "var(--aurora-error)";

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 px-5 py-4", className)}
        style={{
          maxWidth: 210,
          background:
            "linear-gradient(180deg, rgba(18,40,56,0.96), rgba(12,27,38,0.98))",
          border: `1px solid var(--aurora-border-strong)`,
          borderRadius: "var(--aurora-radius-2)",
          boxShadow:
            "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        }}
        {...rest}
      >
        {/* Label */}
        <span
          className="text-[11px] font-semibold uppercase"
          style={{
            letterSpacing: "0.18em",
            color: "var(--aurora-text-muted)",
            lineHeight: 1,
          }}
        >
          {label}
        </span>

        {/* Value */}
        <span
          className="leading-none tabular-nums"
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: "-0.04em",
            color: "var(--aurora-text-primary)",
          }}
        >
          {value}
        </span>

        {/* Delta */}
        {delta !== undefined && (
          <span
            className="text-[11px] font-semibold leading-none"
            style={{ color: deltaColor }}
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
  function StatGrid({ children, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("gap-4", className)}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(175px, 210px))",
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

StatGrid.displayName = "StatGrid";
