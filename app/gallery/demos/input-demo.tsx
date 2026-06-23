"use client"

import * as React from "react"
import { Input } from "@/registry/aurora/ui/input"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

// CD dsCard chrome ports: `.lbl` uppercase eyebrow + `.field` constrained column.
const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 8px",
}

const fieldStyle: React.CSSProperties = {
  marginBottom: 16,
  maxWidth: 300,
}

export default function InputDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Input"
        description="Aurora-styled text input with a cyan focus ring and validation states, used across gateway settings, run editors, and credential forms."
      />

      <div>
        <div style={fieldStyle}>
          <div style={labelStyle}>Default</div>
          <Input placeholder="gateway-edge-1" />
        </div>

        <div style={fieldStyle}>
          <div style={labelStyle}>Focused</div>
          <Input defaultValue="prod-cluster" autoFocus />
        </div>

        <div style={fieldStyle}>
          <div style={labelStyle}>Invalid</div>
          <Input error defaultValue="bad token" />
        </div>
      </div>
    </div>
  )
}
