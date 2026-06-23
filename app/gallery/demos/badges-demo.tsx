"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Badge } from "@/registry/aurora/ui/badge"

// CD dsCard demo chrome ported as inline styles.
const lbl: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 12px",
}

const row: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "18px",
}

// CD re-tints `warn` to its orange tertiary accent within the demo surface,
// scoped here exactly as the dsCard does (`:root{--aurora-warn:#d97757}`).
const demoSurface: React.CSSProperties = {
  ["--aurora-warn" as string]: "#d97757",
  background: "var(--aurora-page-bg)",
  color: "var(--aurora-text-primary)",
  padding: "26px 30px",
  borderRadius: "var(--aurora-radius-2, 12px)",
  border: "1px solid var(--aurora-border-default)",
}

const aiSparkle = '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>'

export default function BadgesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Badge"
        description="Semantic badges communicate system meaning. Six tones, three fills, optional live dot and inline icon."
      />

      <div style={demoSurface}>
        <div style={lbl}>Tones · live dot</div>
        <div style={row}>
          <Badge tone="success" dot>Healthy</Badge>
          <Badge tone="warn" dot>Degraded</Badge>
          <Badge tone="error" dot>Down</Badge>
          <Badge tone="cyan" dot>Syncing</Badge>
          <Badge tone="rose" icon={aiSparkle}>AI</Badge>
        </div>

        <div style={lbl}>Fills</div>
        <div style={row}>
          <Badge tone="cyan" variant="soft">Soft</Badge>
          <Badge tone="cyan" variant="solid">Solid</Badge>
          <Badge tone="cyan" variant="outline">Outline</Badge>
          <Badge tone="rose" variant="solid">Live</Badge>
        </div>

        <div style={lbl}>Sizes · labels</div>
        <div style={{ ...row, marginBottom: 0 }}>
          <Badge tone="neutral" size="sm" variant="outline">v0.9.4</Badge>
          <Badge tone="neutral" size="md" variant="outline">v0.9.4</Badge>
          <Badge tone="cyan" size="sm">Beta</Badge>
        </div>
      </div>
    </div>
  )
}
