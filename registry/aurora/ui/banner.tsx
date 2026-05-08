"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BannerStatus = "info" | "warn" | "error";
export type BannerVariant = "elevated" | "tag";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant;
  status?: BannerStatus;
  title: string;
  description?: string;
  onDismiss?: () => void;
  action?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Status colour map (resolved from Aurora tokens)
// ---------------------------------------------------------------------------

const STATUS_COLOR: Record<BannerStatus, string> = {
  info: "var(--aurora-accent-primary)",   // #29b6f6
  warn: "var(--aurora-warn)",             // #c6a36b
  error: "var(--aurora-error)",           // #c78490
};

const STATUS_LABEL: Record<BannerStatus, string> = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
};

// ---------------------------------------------------------------------------
// Keyframe injection (once)
// ---------------------------------------------------------------------------

const PULSE_ID = "aurora-banner-pulse";

function injectPulseKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(PULSE_ID)) return;
  const style = document.createElement("style");
  style.id = PULSE_ID;
  style.textContent = `
    @keyframes aurora-dot-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.45; transform: scale(0.72); }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function GlowDot({ color }: { color: string }) {
  React.useEffect(injectPulseKeyframes, []);
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 6px 2px ${color}55`,
        flexShrink: 0,
        animation: "aurora-dot-pulse 2s ease-in-out infinite",
      }}
    />
  );
}

function DismissButton({
  color,
  onDismiss,
}: {
  color: string;
  onDismiss: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Dismiss"
      onClick={onDismiss}
      style={{ color }}
      className={cn(
        "ml-auto shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100",
        "focus-visible:outline-none focus-visible:ring-1",
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <path d="M2 2l10 10M12 2L2 12" />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Elevated variant  (A1)
// ---------------------------------------------------------------------------

function BannerElevated({
  status = "info",
  title,
  description,
  onDismiss,
  action,
  className,
  ...rest
}: Omit<BannerProps, "variant">) {
  const color = STATUS_COLOR[status];

  const bg = `color-mix(in srgb, ${color} 12%, var(--aurora-panel-strong))`;
  const border = `color-mix(in srgb, ${color} 32%, var(--aurora-border-default))`;

  return (
    <div
      role="status"
      className={cn("flex flex-col gap-1.5 rounded-[var(--aurora-radius-1)] px-4 py-3", className)}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: "var(--aurora-shadow-medium)",
      }}
      {...rest}
    >
      <div className="flex items-center gap-2.5">
        <GlowDot color={color} />
        <span
          className="text-[13px] font-semibold leading-snug"
          style={{ color: "var(--aurora-text-primary)" }}
        >
          {title}
        </span>
        {onDismiss && <DismissButton color={color} onDismiss={onDismiss} />}
      </div>
      {description && (
        <p
          className="text-[12.5px] leading-relaxed pl-[19px]"
          style={{ color: "var(--aurora-text-muted)" }}
        >
          {description}
        </p>
      )}
      {action && <div className="pl-[19px] pt-0.5">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tag variant  (C)
// ---------------------------------------------------------------------------

function BannerTag({
  status = "info",
  title,
  description,
  onDismiss,
  action,
  className,
  ...rest
}: Omit<BannerProps, "variant">) {
  const color = STATUS_COLOR[status];
  const label = STATUS_LABEL[status];

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-[var(--aurora-radius-1)] px-3 py-2",
        className,
      )}
      style={{
        background: "var(--aurora-control-surface)",
        border: `1px solid var(--aurora-border-default)`,
      }}
      {...rest}
    >
      {/* Monospace chip */}
      <span
        className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
        style={{
          fontFamily: "var(--aurora-font-mono)",
          color,
          background: `color-mix(in srgb, ${color} 14%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>

      {/* Inline copy */}
      <span
        className="flex-1 truncate text-[13px] leading-snug"
        style={{ color: "var(--aurora-text-primary)" }}
      >
        {title}
        {description && (
          <span
            className="ml-2"
            style={{ color: "var(--aurora-text-muted)" }}
          >
            {description}
          </span>
        )}
      </span>

      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && <DismissButton color={color} onDismiss={onDismiss} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  function Banner({ variant = "elevated", ...props }, ref) {
    const Comp = variant === "tag" ? BannerTag : BannerElevated;
    // Forward ref by spreading into a wrapper div is tricky with two
    // components — we attach a wrapping span-less div:
    return (
      <div ref={ref} className="contents">
        <Comp {...props} />
      </div>
    );
  },
);

Banner.displayName = "Banner";
