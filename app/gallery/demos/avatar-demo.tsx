"use client"

import * as React from "react"
import { Shield } from "lucide-react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Avatar, AvatarGroup } from "@/registry/aurora/ui/avatar"

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
  flexWrap: "wrap",
}

const tones = [
  "var(--aurora-accent-primary)",
  "var(--aurora-accent-pink)",
  "var(--aurora-success)",
  "var(--aurora-warn)",
]

export default function AvatarDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Avatar"
        description="Identity chips for people, agents, and service actors. Status dots, tone rings, square and bot variants, beacon presence, icon fallbacks, and grouped overflow."
      />

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
          Status · Ring · Bot · Beacon
        </div>
        <div style={rowStyle}>
          <Avatar initials="JM" tone={tones[0]} status="online" />
          <Avatar initials="AX" tone={tones[1]} status="busy" ring />
          <Avatar initials="LB" tone={tones[2]} status="away" />
          <Avatar initials="AI" variant="bot" tone={tones[0]} />
          <Avatar initials="OP" variant="beacon" tone={tones[0]} />
        </div>

        <div className="lbl" style={lbl}>
          Icon · Square
        </div>
        <div style={rowStyle}>
          <Avatar icon={<Shield aria-hidden />} tone={tones[0]} />
          <Avatar initials="SQ" tone={tones[1]} shape="square" />
          <Avatar initials="ID" tone={tones[3]} shape="square" ring />
        </div>

        <div className="lbl" style={lbl}>
          Group · Overflow
        </div>
        <div style={{ ...rowStyle, marginBottom: 0 }}>
          <AvatarGroup max={4} size={34}>
            {["JM", "AX", "LB", "OP", "RS", "ML"].map((value, index) => (
              <Avatar key={value} initials={value} tone={tones[index % 4]} />
            ))}
          </AvatarGroup>
        </div>
      </div>
    </div>
  )
}
