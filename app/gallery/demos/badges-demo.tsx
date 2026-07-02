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

// Interactive filter-chip row — toggles a live/keyboard-activatable selection so
// the `interactive` axis reads as a real control, not a static swatch.
const FILTERS = ["Errors", "Warnings", "Info", "AI"] as const

function FilterChips() {
  const [active, setActive] = React.useState<Set<string>>(new Set(["Errors"]))

  const toggle = (name: string) =>
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  return (
    <div style={row}>
      {FILTERS.map((name) => {
        const on = active.has(name)
        return (
          <Badge
            key={name}
            tone="cyan"
            shape="pill"
            fill={on ? "solid" : "outline"}
            interactive
            onClick={() => toggle(name)}
            aria-pressed={on}
          >
            {name}
          </Badge>
        )
      })}
    </div>
  )
}

export default function BadgesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Badge"
        description="Semantic badges communicate system meaning. Seven tones, three fills, three shapes, an optional live dot, inline icons, and interactive filter chips."
      />

      <div style={demoSurface}>
        <div style={lbl}>Tones</div>
        <div style={row}>
          <Badge tone="success" dot>Healthy</Badge>
          <Badge tone="warn" dot>Degraded</Badge>
          <Badge tone="error" dot>Down</Badge>
          <Badge tone="info" dot>Info</Badge>
          <Badge tone="cyan" dot>Syncing</Badge>
          <Badge tone="neutral" dot>Idle</Badge>
          <Badge tone="rose" icon={aiSparkle}>AI</Badge>
        </div>

        <div style={lbl}>Fills</div>
        <div style={row}>
          <Badge tone="cyan" fill="soft">Soft</Badge>
          <Badge tone="cyan" fill="solid">Solid</Badge>
          <Badge tone="cyan" fill="outline">Outline</Badge>
        </div>

        <div style={lbl}>Live · pulse</div>
        <div style={row}>
          <Badge tone="error" dot pulse fill="solid">Recording</Badge>
          <Badge tone="success" dot pulse>Connected</Badge>
          <Badge tone="cyan" dot pulse>Syncing</Badge>
        </div>

        <div style={lbl}>Shapes</div>
        <div style={row}>
          <Badge tone="cyan" shape="label">Label</Badge>
          <Badge tone="cyan" shape="tag">Tag</Badge>
          <Badge tone="cyan" shape="pill">Pill</Badge>
        </div>

        <div style={lbl}>Interactive · filter chips</div>
        <FilterChips />

        <div style={lbl}>Sizes</div>
        <div style={{ ...row, marginBottom: 0 }}>
          <Badge tone="neutral" size="sm" fill="outline">Small</Badge>
          <Badge tone="neutral" size="md" fill="outline">Medium</Badge>
          <Badge tone="cyan" size="sm">Beta</Badge>
          <Badge tone="rose" size="md" shape="tag">v0.9.4</Badge>
        </div>
      </div>
    </div>
  )
}
