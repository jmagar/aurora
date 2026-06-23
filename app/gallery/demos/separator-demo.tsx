"use client"

import * as React from "react"
import { Separator } from "@/registry/aurora/ui/separator"

const card: React.CSSProperties = {
  width: 420,
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: 30,
  background: "var(--aurora-page-bg)",
  color: "var(--aurora-text-primary)",
  fontSize: 13,
  fontFamily: "var(--aurora-font-sans)",
}

const muted: React.CSSProperties = {
  color: "var(--aurora-text-muted)",
}

const inlineRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  height: 24,
  color: "var(--aurora-text-muted)",
}

export default function SeparatorDemo() {
  return (
    <div style={card}>
      <div style={muted}>Gateways</div>
      <Separator style={{ margin: "12px 0" }} />
      <div style={muted}>Sessions</div>
      <Separator style={{ margin: "12px 0" }} />
      <div style={inlineRow}>
        Run
        <Separator orientation="vertical" />
        Ask
        <Separator orientation="vertical" />
        Settings
      </div>
    </div>
  )
}
