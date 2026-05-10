"use client"

import * as React from "react"
import { Marketplace } from "@/registry/aurora/blocks/marketplace/marketplace"

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

export default function MarketplaceDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: "32px 0" }}>
      <div>
        <h2 style={heading}>Marketplace</h2>
        <p style={copy}>
          Aurora treatment for Labby marketplace sources, plugin catalog entries, MCP servers, ACP agents, install state, updates, and detail inspection.
        </p>
      </div>

      <Marketplace readOnlyPreview />
    </div>
  )
}
