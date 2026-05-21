"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BannerStatus = "warn" | "error" | "info";
export type BannerStyle = "elevated" | "tag";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BannerStatus;
  kind?: BannerStyle;
  title?: string;
  description?: string;
  onDismiss?: () => void;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Status colour map
// ---------------------------------------------------------------------------

const STATUS_COLOR: Record<BannerStatus, string> = {
  warn:  "var(--aurora-warn)",
  error: "var(--aurora-error)",
  info:  "var(--aurora-accent-primary)",
};

const STATUS_LABEL: Record<BannerStatus, string> = {
  warn:  "Warn",
  error: "Error",
  info:  "Info",
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
// Elevated variant — Style A1
// <div class="banner-elev banner-elev-warn">
//   <div class="dot"></div>
//   <div><h4>…</h4><p>…</p></div>
//   <Button variant="plain" size="unstyled" class="banner-elev-dismiss">×</Button>
// </div>
// ---------------------------------------------------------------------------

function BannerElevated({
  variant = "info",
  title,
  description,
  onDismiss,
  children,
  className,
  ...rest
}: Omit<BannerProps, "kind">) {
  const color = STATUS_COLOR[variant];

  React.useEffect(injectPulseKeyframes, []);

  const [visible, setVisible] = React.useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      className={cn("flex items-center gap-3 rounded-[var(--aurora-radius-2)] px-4 py-3", className)}
      style={{
        background: `color-mix(in srgb, ${color} 10%, var(--aurora-panel-strong))`,
        border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
        borderRadius: "var(--aurora-radius-2, 18px)",
        boxShadow: `var(--aurora-shadow-medium), 0 0 16px color-mix(in srgb, ${color} 15%, transparent)`,
      }}
      {...rest}
    >
      {/* 8px glowing dot */}
      <span
        aria-hidden
        className="banner-elev-dot"
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          flexShrink: 0,
          animation: "aurora-dot-pulse 2s ease-in-out infinite",
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h4
            style={{
              margin: 0,
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "var(--aurora-type-control)",
              fontWeight: "var(--aurora-weight-label)",
              lineHeight: "var(--aurora-line-ui)",
              color: "var(--aurora-text-primary)",
            }}
          >
            {title}
          </h4>
        )}
        {description && (
          <p
            style={{
              margin: 0,
              marginTop: title ? 2 : 0,
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "var(--aurora-type-label)",
              fontWeight: "var(--aurora-weight-body)",
              lineHeight: 1.5,
              color: "var(--aurora-text-muted)",
            }}
          >
            {description}
          </p>
        )}
        {children}
      </div>

      {/* Dismiss × button */}
      {onDismiss && (
        <Button variant="plain" size="unstyled"
          type="button"
          aria-label="Dismiss"
          onClick={handleDismiss}
          className="banner-elev-dismiss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-accent-primary)] focus-visible:rounded-[4px]"
          style={{
            marginLeft: "auto",
            flexShrink: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-body)",
            lineHeight: 1,
            padding: "0 2px",
            color: "var(--aurora-text-muted)",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = color;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--aurora-text-muted)";
          }}
        >
          ×
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tag variant — Style C
// <div class="banner-c banner-c-warn">
//   <span class="banner-c-tag">Warn</span>
//   <p>Message text here.</p>
// </div>
// ---------------------------------------------------------------------------

function BannerTag({
  variant = "info",
  title,
  description,
  children,
  className,
  ...rest
}: Omit<BannerProps, "kind" | "onDismiss">) {
  const color = STATUS_COLOR[variant];
  const label = STATUS_LABEL[variant];

  return (
    <div
      role="status"
      className={cn("flex items-center gap-3", className)}
      style={{
        background: "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "8px",
        padding: "10px 14px",
      }}
      {...rest}
    >
      {/* Tag chip */}
      <span
        className="banner-c-tag"
        style={{
          flexShrink: 0,
          borderRadius: "4px",
          fontFamily: "var(--aurora-font-mono)",
          fontSize: "var(--aurora-type-micro)",
          fontWeight: "var(--aurora-weight-label)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          lineHeight: 1.4,
          padding: "2px 6px",
          color,
          background: `color-mix(in srgb, ${color} 14%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        }}
      >
        {label}
      </span>

      {/* Message */}
      <p
        style={{
          margin: 0,
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "var(--aurora-type-control)",
          fontWeight: "var(--aurora-weight-body)",
          color: "var(--aurora-text-muted)",
          lineHeight: "var(--aurora-line-ui)",
        }}
      >
        {title}
        {description ? (description) : null}
        {children}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export function Banner({
  variant = "info",
  kind: bannerStyle = "elevated",
  title,
  description,
  onDismiss,
  children,
  className,
  ...rest
}: BannerProps) {
  if (bannerStyle === "tag") {
    return (
      <BannerTag
        variant={variant}
        title={title}
        description={description}
        className={className}
        {...rest}
      >
        {children}
      </BannerTag>
    );
  }

  return (
    <BannerElevated
      variant={variant}
      title={title}
      description={description}
      onDismiss={onDismiss}
      className={className}
      {...rest}
    >
      {children}
    </BannerElevated>
  );
}

Banner.displayName = "Banner";
