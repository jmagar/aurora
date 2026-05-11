"use client"

import * as React from "react"
import { Badge } from "@/registry/aurora/ui/badge"

const section: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "32px",
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
}

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "10px",
}

const groupLabel: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "var(--aurora-font-mono)",
  color: "var(--aurora-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "4px",
}

const heading: React.CSSProperties = {
  fontSize: "18px",
  fontFamily: "var(--aurora-font-display)",
  fontWeight: 600,
  color: "var(--aurora-text-primary)",
  marginBottom: "4px",
}

const subheading: React.CSSProperties = {
  fontSize: "13px",
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--aurora-font-sans)",
  marginBottom: "24px",
}

const tableRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "10px 16px",
  borderBottom: "1px solid var(--aurora-border-default)",
  fontSize: "13px",
  fontFamily: "var(--aurora-font-sans)",
  color: "var(--aurora-text-primary)",
}

const tableCell: React.CSSProperties = {
  flex: 1,
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--aurora-font-mono)",
  fontSize: "12px",
}

export default function BadgesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "32px 0" }}>
      <div>
        <h2 style={heading}>Badge</h2>
        <p style={subheading}>
          Semantic badges communicate system meaning (info, success, warn, error, neutral). Expressive badges — rose and violet — carry identity emphasis, not status.
        </p>
      </div>

      <div style={section}>
        <div style={groupLabel}>Semantic roles — with dot</div>
        <div style={row}>
          <Badge variant="info"    dot>Syncing</Badge>
          <Badge variant="success" dot>Healthy</Badge>
          <Badge variant="warn"    dot>Degraded</Badge>
          <Badge variant="error"   dot>Offline</Badge>
          <Badge variant="neutral" dot>Queued</Badge>
        </div>

        <div style={groupLabel}>Expressive identity</div>
        <div style={row}>
          <Badge variant="violet" dot>Automated</Badge>
          <Badge variant="rose">Escalated</Badge>
        </div>

        <div style={groupLabel}>Without dot</div>
        <div style={row}>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warn">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Gateway statuses</div>
        <div style={row}>
          <Badge variant="success" dot>Connected</Badge>
          <Badge variant="warn" dot>Reconnecting</Badge>
          <Badge variant="error" dot>Unreachable</Badge>
          <Badge variant="default" dot>Provisioning</Badge>
        </div>

        <div style={groupLabel}>Agent states</div>
        <div style={row}>
          <Badge variant="default" dot>Running</Badge>
          <Badge variant="success" dot>Completed</Badge>
          <Badge variant="warn" dot>Waiting</Badge>
          <Badge variant="error" dot>Failed</Badge>
          <Badge variant="rose" dot>Escalated</Badge>
        </div>

        <div style={groupLabel}>Environment types</div>
        <div style={row}>
          <Badge variant="default">Production</Badge>
          <Badge variant="success">Staging</Badge>
          <Badge variant="warn">Preview</Badge>
          <Badge variant="rose">Development</Badge>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Table context — agents list</div>
        <div
          style={{
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "var(--aurora-radius-1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              ...tableRow,
              background: "var(--aurora-panel-strong)",
              fontFamily: "var(--aurora-font-mono)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--aurora-text-muted)",
            }}
          >
            <span style={{ flex: 2 }}>Agent</span>
            <span style={{ flex: 1 }}>Gateway</span>
            <span style={{ flex: 1 }}>Status</span>
            <span style={{ flex: 1 }}>Health</span>
          </div>

          {([
            { name: "labby-prod-01", gateway: "us-east-1", status: "default" as const, statusLabel: "Running", health: "success" as const, healthLabel: "Healthy" },
            { name: "labby-staging-02", gateway: "eu-west-1", status: "warn" as const, statusLabel: "Waiting", health: "warn" as const, healthLabel: "Degraded" },
            { name: "labby-worker-03", gateway: "us-west-2", status: "success" as const, statusLabel: "Completed", health: "success" as const, healthLabel: "Healthy" },
            { name: "labby-eval-04", gateway: "ap-south-1", status: "error" as const, statusLabel: "Failed", health: "error" as const, healthLabel: "Offline" },
            { name: "labby-escalate-05", gateway: "us-east-1", status: "rose" as const, statusLabel: "Escalated", health: "warn" as const, healthLabel: "Degraded" },
          ] as const).map((r) => (
            <div
              key={r.name}
              style={{ ...tableRow, background: "var(--aurora-panel-medium)" }}
            >
              <span style={{ flex: 2, color: "var(--aurora-text-primary)", fontFamily: "var(--aurora-font-mono)", fontSize: "12px" }}>
                {r.name}
              </span>
              <span style={{ ...tableCell, flex: 1 }}>{r.gateway}</span>
              <span style={{ flex: 1 }}>
                <Badge variant={r.status} dot>{r.statusLabel}</Badge>
              </span>
              <span style={{ flex: 1 }}>
                <Badge variant={r.health}>{r.healthLabel}</Badge>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
