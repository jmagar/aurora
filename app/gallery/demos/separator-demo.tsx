"use client"

import * as React from "react"
import { Badge } from "@/registry/aurora/ui/badge"
import { Separator } from "@/registry/aurora/ui/separator"

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

export default function SeparatorDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Separator</h2>
        <p style={copy}>Tokenized dividers for dense metadata, grouped controls, tables, and agent evidence panels.</p>
      </div>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Metadata sections</h3>
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <div className="aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>Gateway</div>
            <div className="aurora-text-control" style={{ color: "var(--aurora-text-primary)", marginTop: 4 }}>production-edge</div>
          </div>
          <Separator />
          <div>
            <div className="aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>Runtime</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <Badge variant="success" dot>Healthy</Badge>
              <Badge>v3.2.1</Badge>
            </div>
          </div>
        </div>
      </section>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Inline grouping</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minHeight: 48 }}>
          <span className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>Build</span>
          <Separator orientation="vertical" decorative={false} />
          <span className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>Test</span>
          <Separator orientation="vertical" decorative={false} />
          <span className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>Publish</span>
        </div>
      </section>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Muted custom rule</h3>
        <Separator style={{ background: "color-mix(in srgb, var(--aurora-accent-primary) 24%, transparent)" }} />
      </section>
    </div>
  )
}
