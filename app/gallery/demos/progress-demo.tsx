"use client"

import * as React from "react"
import { Progress } from "@/registry/aurora/ui/progress"

// Ported 1:1 from the Claude Design `Progress.dsCard` composition.

const row: React.CSSProperties = {
  marginBottom: "22px",
}

const label: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 9px",
}

const stage: React.CSSProperties = {
  background: "var(--aurora-page-bg)",
  color: "var(--aurora-text-primary)",
  padding: "32px 30px",
  borderRadius: "var(--aurora-radius-2)",
  border: "1px solid var(--aurora-border-default)",
  maxWidth: "440px",
}

export default function ProgressDemo() {
  return (
    <div style={stage}>
      <div style={row}>
        <p style={label}>Determinate</p>
        <Progress value={64} />
      </div>
      <div style={row}>
        <p style={label}>Indeterminate</p>
        <Progress indeterminate />
      </div>
      <div style={{ ...row, marginBottom: 0 }}>
        <p style={label}>Success tone</p>
        <Progress value={88} tone="var(--aurora-success)" />
      </div>
    </div>
  )
}
