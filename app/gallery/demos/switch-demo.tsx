"use client"

import * as React from "react"
import { Switch } from "@/registry/aurora/ui/switch"

const section: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "clamp(16px, 4vw, 32px)",
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
}

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "24px",
}

const groupLabel: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "var(--aurora-font-mono)",
  color: "var(--aurora-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "4px",
}

function SwitchWithCaption({ caption, ...props }: { caption: string } & React.ComponentPropsWithoutRef<typeof Switch>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Switch {...props} />
      <span style={{ fontSize: "11px", fontFamily: "var(--aurora-font-mono)", color: "var(--aurora-text-muted)", marginTop: "4px" }}>
        {caption}
      </span>
    </div>
  )
}

function LabeledSwitch({
  id,
  label,
  description,
  defaultChecked = false,
  disabled = false,
}: {
  id: string
  label: string
  description?: string
  defaultChecked?: boolean
  disabled?: boolean
}) {
  const [checked, setChecked] = React.useState(defaultChecked)

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "12px 16px",
        borderRadius: "var(--aurora-radius-1)",
        background: checked ? "color-mix(in srgb, #29b6f6 4%, transparent)" : "transparent",
        border: "1px solid",
        borderColor: checked ? "color-mix(in srgb, #29b6f6 18%, transparent)" : "var(--aurora-border-default)",
        transition: "background 200ms, border-color 200ms",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div>
        <label
          htmlFor={id}
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--aurora-font-sans)",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {label}
        </label>
        {description && (
          <span style={{ fontSize: "11px", color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)", marginTop: "2px", display: "block" }}>
            {description}
          </span>
        )}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={setChecked} disabled={disabled} />
    </div>
  )
}

export default function SwitchDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: 0 }}>
      <div style={section}>
        <div style={groupLabel}>Default size — off / on</div>
        <div style={row}>
          <SwitchWithCaption caption="off" />
          <SwitchWithCaption caption="on" defaultChecked />
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Sizes — sm / default / lg</div>
        <div style={{ ...row, alignItems: "flex-end" }}>
          {(["sm", "default", "lg"] as const).flatMap((size) => [
            <div key={`${size}-off`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={groupLabel}>{size} off</div>
              <Switch size={size} />
            </div>,
            <div key={`${size}-on`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={groupLabel}>{size} on</div>
              <Switch size={size} defaultChecked />
            </div>,
          ])}
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Disabled states</div>
        <div style={row}>
          <SwitchWithCaption caption="disabled off" disabled />
          <SwitchWithCaption caption="disabled on" defaultChecked disabled />
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Settings panel — gateway config</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <LabeledSwitch id="auto-reconnect" label="Auto-reconnect" description="Reconnect gateway on connection drop" defaultChecked />
          <LabeledSwitch id="enable-tls" label="Enforce TLS" description="Require encrypted transport for all agents" defaultChecked />
          <LabeledSwitch id="log-verbose" label="Verbose logging" description="Emit full trace logs to observability backend" />
          <LabeledSwitch id="human-fallback" label="Human-in-the-loop fallback" description="Escalate to operator when agent confidence is low" defaultChecked />
          <LabeledSwitch id="maintenance" label="Maintenance mode" description="Pause all agent traffic for this gateway" disabled />
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Inline label pattern</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { id: "feature-agents", label: "Agent management", defaultChecked: true },
            { id: "feature-gateways", label: "Gateway provisioning", defaultChecked: true },
            { id: "feature-eval", label: "Evaluation suite", defaultChecked: false },
            { id: "feature-audit", label: "Audit logging", defaultChecked: true },
          ].map(({ id, label, defaultChecked }) => (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Switch id={id} defaultChecked={defaultChecked} size="sm" />
              <label
                htmlFor={id}
                style={{
                  fontSize: "13px",
                  color: "var(--aurora-text-primary)",
                  fontFamily: "var(--aurora-font-sans)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
