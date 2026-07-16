"use client"

import * as React from "react"
import { Direction } from "@/registry/aurora/ui/direction"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

// Demo chrome ported 1:1 from the Claude Design `Direction.dsCard` source.
// The Direction primitive is a logical LTR/RTL wrapper with no visuals of its
// own — all styling lives in the demo row chrome below.
const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: 10,
  background: "var(--aurora-panel-medium)",
  font: "13px var(--aurora-font-sans)",
}

const tagStyle: React.CSSProperties = {
  font: "11px var(--aurora-font-sans)",
  fontWeight: 650,
  letterSpacing: "var(--aurora-letter-eyebrow)",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
}

export default function DirectionDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="Direction"
        description="LTR / RTL wrapper that propagates writing direction to its subtree, so mixed-locale gateway surfaces lay out correctly."
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 420,
        }}
      >
        <Direction dir="ltr">
          <div style={rowStyle}>
            <span style={tagStyle}>LTR</span>
            <span>Search gateways…</span>
          </div>
        </Direction>
        <Direction dir="rtl">
          <div style={rowStyle}>
            <span style={tagStyle}>RTL</span>
            <span>بحث في البوابات…</span>
          </div>
        </Direction>
      </div>
    </div>
  )
}
