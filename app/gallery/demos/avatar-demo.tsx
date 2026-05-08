"use client"

import * as React from "react"
import { Avatar } from "@/registry/aurora/ui/avatar"

const section: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "32px",
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
}

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "16px",
}

const groupLabel: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "var(--aurora-font-mono)",
  color: "var(--aurora-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "4px",
}

const heading: React.CSSProperties = {
  fontSize: "18px",
  fontFamily: "var(--aurora-font-display)",
  fontWeight: 600,
  color: "var(--aurora-text-primary)",
  marginBottom: "4px",
}

const subheading: React.CSSProperties = {
  fontSize: "13px",
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--aurora-font-sans)",
  marginBottom: "24px",
}

function AvatarWithLabel({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {children}
      <span style={{
        fontSize: "11px",
        fontFamily: "var(--aurora-font-mono)",
        color: "var(--aurora-text-muted)",
        textAlign: "center",
        marginTop: "6px",
      }}>{caption}</span>
    </div>
  )
}

export default function AvatarDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "32px 0" }}>
      <div>
        <h2 style={heading}>Avatar</h2>
        <p style={subheading}>
          User and agent avatars across sizes and variants. Supports initials fallback, status indicators, beacon pulse, and bot styling.
        </p>
      </div>

      <div style={section}>
        <div style={groupLabel}>Sizes — sm / md / lg / xl</div>
        <div style={{ ...row, alignItems: "flex-end" }}>
          <AvatarWithLabel caption="sm">
            <Avatar size="sm" fallback="JM" alt="Jordan M" />
          </AvatarWithLabel>
          <AvatarWithLabel caption="md">
            <Avatar size="md" fallback="JM" alt="Jordan M" />
          </AvatarWithLabel>
          <AvatarWithLabel caption="lg">
            <Avatar size="lg" fallback="JM" alt="Jordan M" />
          </AvatarWithLabel>
          <AvatarWithLabel caption="xl">
            <Avatar size="xl" fallback="JM" alt="Jordan M" />
          </AvatarWithLabel>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Initials fallback — team members</div>
        <div style={row}>
          {[
            { initials: "JM", name: "Jordan Magar" },
            { initials: "AS", name: "Aria Santos" },
            { initials: "KL", name: "Kai Lin" },
            { initials: "RP", name: "Rohan Patel" },
            { initials: "EM", name: "Elena Marsh" },
            { initials: "DK", name: "Dev Kapoor" },
          ].map(({ initials, name }) => (
            <AvatarWithLabel key={initials} caption={initials}>
              <Avatar size="md" fallback={initials} alt={name} />
            </AvatarWithLabel>
          ))}
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Status variant — online / away / busy / offline</div>
        <div style={row}>
          {(["online", "away", "busy", "offline"] as const).map((status) => (
            <AvatarWithLabel key={status} caption={status}>
              <Avatar size="md" variant="status" status={status} fallback={status.slice(0, 2).toUpperCase()} alt={status} />
            </AvatarWithLabel>
          ))}
        </div>

        <div style={groupLabel}>Large status avatars</div>
        <div style={row}>
          {(["online", "away", "busy", "offline"] as const).map((status) => (
            <AvatarWithLabel key={status} caption={status}>
              <Avatar size="lg" variant="status" status={status} fallback={status.slice(0, 2).toUpperCase()} alt={status} />
            </AvatarWithLabel>
          ))}
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Beacon variant — active / live agent indicator</div>
        <div style={{ ...row, alignItems: "flex-end" }}>
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <AvatarWithLabel key={size} caption={`${size} beacon`}>
              <Avatar size={size} variant="beacon" fallback="LB" alt="Labby Agent" />
            </AvatarWithLabel>
          ))}
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Bot variant — agents and AI workers</div>
        <div style={{ ...row, alignItems: "flex-end" }}>
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <AvatarWithLabel key={size} caption={`${size} bot`}>
              <Avatar size={size} variant="bot" fallback="LB" alt="Labby" />
            </AvatarWithLabel>
          ))}
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Team panel — Labby workspace</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {[
            { name: "Jordan Magar", role: "Gateway Admin", initials: "JM", status: "online" as const },
            { name: "Aria Santos", role: "Agent Operator", initials: "AS", status: "away" as const },
            { name: "Kai Lin", role: "Environment Eng", initials: "KL", status: "online" as const },
            { name: "Rohan Patel", role: "Security Lead", initials: "RP", status: "busy" as const },
            { name: "Elena Marsh", role: "ML Researcher", initials: "EM", status: "offline" as const },
          ].map((member) => (
            <div
              key={member.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 12px",
                borderRadius: "var(--aurora-radius-1)",
              }}
            >
              <Avatar
                size="md"
                variant="status"
                status={member.status}
                fallback={member.initials}
                alt={member.name}
              />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--aurora-text-primary)", fontFamily: "var(--aurora-font-sans)" }}>
                  {member.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)" }}>
                  {member.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
