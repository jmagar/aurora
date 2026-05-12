"use client"

import * as React from "react"
import { Spinner } from "@/registry/aurora/ui/spinner"
import { StatusIndicator } from "@/registry/aurora/ui/status-indicator"

const panel: React.CSSProperties = {
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
  padding: 24,
}

const heading: React.CSSProperties = {
  color: "var(--aurora-text-primary)",
  fontFamily: "var(--aurora-font-display)",
  fontSize: 22,
  fontWeight: 760,
  lineHeight: 1.2,
  marginBottom: 6,
}

const copy: React.CSSProperties = {
  color: "var(--aurora-text-muted)",
  fontSize: 13,
  lineHeight: 1.55,
}

export default function SpinnerDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Spinner</h2>
        <p style={copy}>Compact loading indicators for registry refreshes, agent runs, and background verification.</p>
      </div>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Sizes</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </div>
      </section>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Tones</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Spinner tone="cyan" />
          <Spinner tone="rose" />
          <Spinner tone="muted" />
        </div>
      </section>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Operational row</h3>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Spinner size="sm" />
            <span className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>Refreshing marketplace registry</span>
          </div>
          <StatusIndicator tone="syncing" label="Syncing sources" />
        </div>
      </section>
    </div>
  )
}
