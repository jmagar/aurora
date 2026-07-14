"use client"

import * as React from "react"
import { Card } from "@/registry/aurora/ui/card"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

/* Mirrors the Claude Design Card preview (Gateway edge-1 · tier-2 + edge-2 · tier-1)
   1:1, rendered with the registry Card/Badge/Button. */

const hd: React.CSSProperties = { display: "flex", alignItems: "center", gap: 11 }
const mark: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0,
  background: "linear-gradient(150deg, color-mix(in srgb, var(--aurora-accent-primary) 24%, var(--aurora-panel-strong)), var(--aurora-panel-strong))",
  border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 34%, var(--aurora-border-strong))",
}
const title: React.CSSProperties = { fontFamily: "var(--aurora-font-display)", fontWeight: 800, fontSize: 15.5, letterSpacing: "-0.02em" }
const sub: React.CSSProperties = { fontSize: 11.5, color: "var(--aurora-text-muted)", marginTop: 2 }
const rule: React.CSSProperties = { height: 1, background: "var(--aurora-border-default)", margin: "15px 0" }
const metrics: React.CSSProperties = { display: "flex", gap: 22 }
const mL: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--aurora-text-muted)" }
const mV: React.CSSProperties = { fontFamily: "var(--aurora-font-display)", fontWeight: 800, fontSize: 21, letterSpacing: "-0.03em", marginTop: 5, fontVariantNumeric: "tabular-nums" }
const unit: React.CSSProperties = { fontSize: 13, color: "var(--aurora-text-muted)" }

function Spark() {
  const bars = [9, 14, 11, 18, 13, 22, 17, 26, 30]
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 30, marginLeft: "auto" }}>
      {bars.map((h, i) => (
        <span
          key={i}
          style={{
            width: 4,
            height: h,
            borderRadius: 2,
            background: i === bars.length - 1 ? "var(--aurora-accent-strong)" : "color-mix(in srgb, var(--aurora-accent-primary) 55%, transparent)",
          }}
        />
      ))}
    </div>
  )
}

export default function CardDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="Card"
        description="The canonical Tier-2 panel — composed surface with header, metrics, and footer slots. Tier-1 is the lighter, interactive list/toolbar surface."
      />

      <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* Gateway edge-1 — Tier-2 */}
        <Card style={{ flex: "1.4 1 320px", display: "flex", flexDirection: "column", padding: 20 }}>
          <div style={hd}>
            <div style={mark}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3 5 7v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V7Z" stroke="var(--aurora-accent-strong)" strokeWidth="1.5" />
                <circle cx="12" cy="11" r="2" fill="var(--aurora-accent-strong)" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={title}>Gateway edge-1</div>
              <div style={sub}>us-east · 7 services</div>
            </div>
            <Badge tone="success" dot>Online</Badge>
          </div>
          <div style={rule} />
          <div style={metrics}>
            <div><div style={mL}>P99</div><div style={mV}>42<span style={unit}>ms</span></div></div>
            <div><div style={mL}>Req/s</div><div style={mV}>1.2<span style={unit}>k</span></div></div>
            <div style={{ flex: 1 }} />
            <Spark />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            <Button variant="aurora" size="sm">Open Console</Button>
            <Button size="sm">Logs</Button>
          </div>
        </Card>

        {/* edge-2 — Tier-1, interactive */}
        <Card elevated={false} interactive style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 9, padding: 18 }}>
          <div style={hd}>
            <div style={{ ...mark, background: "var(--aurora-control-surface)", borderColor: "var(--aurora-border-default)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--aurora-text-muted)" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <div>
              <div style={{ ...title, fontSize: 14 }}>edge-2</div>
              <div style={sub}>Tier-1 surface</div>
            </div>
          </div>
          <div style={{ ...sub, lineHeight: 1.55, marginTop: 0 }}>
            A lighter list/toolbar surface. Hover to lift — the interactive affordance.
          </div>
        </Card>
      </div>
    </div>
  )
}
