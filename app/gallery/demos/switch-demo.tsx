"use client"

import * as React from "react"
import { Switch } from "@/registry/aurora/ui/switch"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

/* Mirrors the Claude Design Switch preview 1:1 — pill toggle, cyan track. */

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 11,
  marginBottom: 16,
  fontSize: 13,
  color: "var(--aurora-text-primary)",
}

export default function SwitchDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Toggle switch"
        description="The only pill control besides scrollbars — the track tints to cyan when on; the thumb gains a self-glow. Controlled or uncontrolled."
      />
      <div>
        <div style={row}><Switch defaultChecked />Color-code by operation</div>
        <div style={row}><Switch />Compact density</div>
        <div style={row}><Switch defaultChecked disabled />Stream tokens (locked)</div>
      </div>
    </div>
  )
}
