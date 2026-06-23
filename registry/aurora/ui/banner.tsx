"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BannerStatus = "success" | "warn" | "error" | "info";
export type BannerStyle = "elevated" | "tag";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BannerStatus;
  /**
   * CD-parity alias for {@link variant}. When provided it takes precedence so
   * Claude Design compositions can drive tone directly (`success | warn | error`).
   */
  tone?: BannerStatus;
  kind?: BannerStyle;
  title?: string;
  description?: string;
  onDismiss?: () => void;
  /** CD-parity alias for {@link onDismiss}. */
  onClose?: () => void;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Status colour map
// ---------------------------------------------------------------------------

const STATUS_COLOR: Record<BannerStatus, string> = {
  success: "var(--aurora-success)",
  warn:    "var(--aurora-warn)",
  error:   "var(--aurora-error)",
  info:    "var(--aurora-accent-primary)",
};

const STATUS_LABEL: Record<BannerStatus, string> = {
  success: "OK",
  warn:    "Warn",
  error:   "Error",
  info:    "Info",
};

// ---------------------------------------------------------------------------
// Status icons — CD parity (24px line icons, currentColor)
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: BannerStatus }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (status) {
    case "success":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      );
    case "warn":
      return (
        <svg {...common}>
          <path d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "error":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

// ---------------------------------------------------------------------------
// Elevated variant — Style A1 (CD-parity)
// <div class="banner-elev">
//   <span class="banner-elev-icon"><StatusIcon/></span>
//   <div><h4>…</h4><p>…</p></div>
//   <Button variant="plain" size="unstyled" class="banner-elev-dismiss">×</Button>
// </div>
// ---------------------------------------------------------------------------

function BannerElevated({
  variant = "info",
  title,
  description,
  onDismiss,
  action,
  children,
  className,
  ...rest
}: Omit<BannerProps, "kind" | "tone" | "onClose">) {
  const color = STATUS_COLOR[variant];

  const [visible, setVisible] = React.useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      className={cn("flex items-center gap-3.5 px-4 py-3.5", className)}
      style={{
        background: `color-mix(in srgb, ${color} 10%, var(--aurora-panel-strong))`,
        border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
        borderRadius: "var(--aurora-radius-2, 18px)",
        boxShadow: "var(--aurora-shadow-medium)",
      }}
      {...rest}
    >
      {/* Icon chip — 44px rounded square, tone tint */}
      <span
        aria-hidden
        className="banner-elev-icon"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: 12,
          color,
          background: `color-mix(in srgb, ${color} 16%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 32%, transparent)`,
        }}
      >
        <StatusIcon status={variant} />
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h4
            style={{
              margin: 0,
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "var(--aurora-type-control)",
              fontWeight: 700,
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
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>

      {/* Dismiss × button */}
      {onDismiss && (
        <Button variant="plain" size="unstyled"
          type="button"
          aria-label="Dismiss"
          onClick={handleDismiss}
          className="banner-elev-dismiss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:rounded-[4px]"
          style={{
            alignSelf: "flex-start",
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
            (e.currentTarget as HTMLButtonElement).style.color = "var(--aurora-text-primary)";
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
}: Omit<BannerProps, "kind" | "onDismiss" | "tone" | "onClose">) {
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
  tone,
  kind: bannerStyle = "elevated",
  title,
  description,
  onDismiss,
  onClose,
  action,
  children,
  className,
  ...rest
}: BannerProps) {
  const status = tone ?? variant;
  const dismiss = onDismiss ?? onClose;

  if (bannerStyle === "tag") {
    return (
      <BannerTag
        variant={status}
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
      variant={status}
      title={title}
      description={description}
      onDismiss={dismiss}
      action={action}
      className={className}
      {...rest}
    >
      {children}
    </BannerElevated>
  );
}

Banner.displayName = "Banner";
