"use client"

import * as React from "react"
import { Collapsible } from "@/registry/aurora/ui/collapsible"

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

export default function CollapsibleDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Collapsible</h2>
        <p style={copy}>Details disclosure with a chevron — one open, one closed.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
        <Collapsible title="Advanced options" defaultOpen>
          Crawl depth, rerank, and concurrency live here.
        </Collapsible>
        <Collapsible title="Danger zone">
          Delete the gateway and all its sessions.
        </Collapsible>
      </div>
    </div>
  )
}
