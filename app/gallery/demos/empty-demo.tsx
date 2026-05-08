"use client";

import * as React from "react";
import { EmptyState } from "@/registry/aurora/ui/empty-state";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M8 2v12M2 8h12" />
    </svg>
  );
}

function GatewayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="18" height="10" rx="2" />
      <path d="M6 10h10M6 13.5h5" />
      <circle cx="16" cy="13.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M15.5 15.5l4 4" />
    </svg>
  );
}

function PluginIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="10" height="10" rx="2" />
      <path d="M13 12h3a2 2 0 000-4h-3" />
      <path d="M7 8V5" />
      <path d="M10 8V5" />
    </svg>
  );
}

function AuroraButton({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" }) {
  const isPrimary = variant === "primary";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        border: isPrimary ? "1px solid var(--aurora-accent-primary)" : "1px solid var(--aurora-border-default)",
        background: isPrimary ? "var(--aurora-accent-primary)" : "var(--aurora-control-surface)",
        color: isPrimary ? "#000" : "var(--aurora-text-primary)",
      }}
    >
      {children}
    </button>
  );
}

export default function EmptyDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          States
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Empty states
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          Shown when a list or query returns no data. Each variant includes a dashed border, optional icon, and a clear call-to-action.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <EmptyState
          icon={<GatewayIcon />}
          title="No gateways yet"
          description="Add your first gateway to start routing traffic through Labby. Gateways connect your services to agents and policy rules."
          action={
            <AuroraButton variant="primary">
              <PlusIcon />
              Add gateway
            </AuroraButton>
          }
        />

        <EmptyState
          icon={<SearchIcon />}
          title="No results found"
          description="No gateways matched your current filters. Try adjusting the environment, region, or status filter."
          action={
            <AuroraButton variant="ghost">
              Clear all filters
            </AuroraButton>
          }
        />

        <EmptyState
          icon={<PluginIcon />}
          title="No plugins installed"
          description="Browse the Labby plugin registry to find auth proxies, rate limiters, and observability integrations."
          action={
            <AuroraButton variant="primary">
              <PlusIcon />
              Browse registry
            </AuroraButton>
          }
        />
      </div>

      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
          Minimal (no icon)
        </p>
        <EmptyState
          title="No audit events in this window"
          description="Audit events for the selected time range will appear here. Expand the range or check the gateway filter."
        />
      </div>
    </div>
  );
}
