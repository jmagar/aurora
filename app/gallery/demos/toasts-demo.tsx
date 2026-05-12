"use client";

import * as React from "react";
import { Button } from "@/registry/aurora/ui/button";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

// Inline stacked-plane SVG mark — 16x16
function LabbyMark16({ color }: { color: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 14L10 19L18 14L10 9Z" fill={color} opacity="0.45" />
      <path d="M2 10L10 15L18 10L10 5Z" fill={color} opacity="0.65" />
      <path d="M2 6L10 11L18 6L10 1Z" fill={color} />
    </svg>
  );
}

type ToastStatus = "success" | "error" | "info" | "warn";

const STATUS_COLOR: Record<ToastStatus, string> = {
  success: "var(--aurora-success)",
  error:   "var(--aurora-error)",
  info:    "var(--aurora-accent-primary)",
  warn:    "var(--aurora-warn)",
};

const STATUS_HEX: Record<ToastStatus, string> = {
  success: "#6fcf97",
  error:   "#c78490",
  info:    "#29b6f6",
  warn:    "#c6a36b",
};

interface StaticToastProps {
  status: ToastStatus;
  title: React.ReactNode;
  description?: React.ReactNode;
}

function StaticToast({ status, title, description }: StaticToastProps) {
  const [visible, setVisible] = React.useState(true);
  const color = STATUS_COLOR[status];
  const hex = STATUS_HEX[status];

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        width: 340,
        maxWidth: "90vw",
        padding: "14px 16px",
        borderRadius: "var(--aurora-radius-1, 14px)",
        background: "var(--aurora-panel-strong)",
        border: "1px solid var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong, 0 8px 24px rgba(0,0,0,0.35))",
      }}
    >
      {/* Icon: colored circle with inline Labby mark */}
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: `color-mix(in srgb, ${color} 18%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
          flexShrink: 0,
        }}
      >
        <LabbyMark16 color={hex} />
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--aurora-text-primary)", margin: 0, lineHeight: 1.35 }}>
          {title}
        </p>
        {description && (
          <p style={{ fontSize: 12, color: "var(--aurora-text-muted)", margin: 0, lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>

      {/* Dismiss */}
      <Button variant="plain" size="unstyled"
        type="button"
        aria-label="Dismiss"
        onClick={() => setVisible(false)}
        style={{
          flexShrink: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          color,
          opacity: 0.6,
          padding: 2,
          lineHeight: 1,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" />
        </svg>
      </Button>
    </div>
  );
}

export default function ToastsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Feedback"
        heading="Toasts"
        description="Transient notifications that slide in from the bottom-right. The icon slot holds the Labby stacked-plane mark in a tinted circle."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <StaticToast
          status="success"
          title="Plugin deployed successfully"
          description="labby-auth-proxy v2.1.0 is now active on production-edge.lab.local."
        />
        <StaticToast
          status="error"
          title="Gateway connection failed"
          description="us-east-1-gw-02 refused the connection. Check firewall rules or the upstream router."
        />
        <StaticToast
          status="info"
          title="Policy sync complete"
          description="47 rules applied across 3 gateway clusters. No conflicts detected."
        />
        <StaticToast
          status="warn"
          title="Certificate expiring in 7 days"
          description="production-edge.lab.local — schedule renewal to avoid service interruption."
        />
      </div>
    </div>
  );
}
