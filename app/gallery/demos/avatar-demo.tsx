"use client"

import * as React from "react"
import { Avatar, AvatarGroup } from "@/registry/aurora/ui/avatar"

// ─── CD dsCard chrome (ported as inline styles) ──────────────────────────────

const lbl: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 12px",
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  marginBottom: "18px",
}

// CD tone order: cyan, pink, teal/success, sand/warn.
const tones = [
  "var(--aurora-accent-primary)",
  "var(--aurora-accent-pink)",
  "var(--aurora-success)",
  "var(--aurora-warn)",
]

// CD shield icon path.
const SHIELD_ICON = '<path d="M12 2 5 7v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V7Z"/>'

export default function AvatarDemo() {
  return (
    <div
      style={{
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
        boxSizing: "border-box",
        padding: "30px",
        borderRadius: "var(--aurora-radius-2)",
        border: "1px solid var(--aurora-border-default)",
      }}
    >
      <div className="lbl" style={lbl}>
        Status · ring · icon · square
      </div>
      <div style={rowStyle}>
        <Avatar initials="JM" tone={tones[0]} status="online" />
        <Avatar initials="AX" tone={tones[1]} status="busy" ring />
        <Avatar initials="LB" tone={tones[2]} status="away" />
        <Avatar icon={SHIELD_ICON} tone={tones[0]} />
        <Avatar initials="SQ" tone={tones[1]} shape="square" />
      </div>

      <div className="lbl" style={lbl}>
        Group · overflow
      </div>
      <div style={{ ...rowStyle, marginBottom: 0 }}>
        <AvatarGroup max={4} size={34}>
          {["JM", "AX", "LB", "OP", "RS", "ML"].map((x, i) => (
            <Avatar key={i} initials={x} tone={tones[i % 4]} />
          ))}
        </AvatarGroup>
      </div>
    </div>
  )
}
