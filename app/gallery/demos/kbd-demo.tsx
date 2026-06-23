"use client"

import * as React from "react"
import { Kbd, type KbdVariant } from "@/registry/aurora/ui/kbd"

const VARIANTS: KbdVariant[] = ["raised", "solid", "outline", "ghost", "accent"]
const KEYS = ["⌘", "K", "⇧", "Esc"]

const labelStyle: React.CSSProperties = {
  font: "10px var(--aurora-font-mono)",
  color: "var(--aurora-text-muted)",
  width: 64,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
}

export default function KbdDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "24px 30px",
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
        borderRadius: "var(--aurora-radius-2)",
        border: "1px solid var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
      }}
    >
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={labelStyle}>{variant}</span>
          {KEYS.map((key) => (
            <Kbd key={key} variant={variant}>
              {key}
            </Kbd>
          ))}
        </div>
      ))}
    </div>
  )
}
