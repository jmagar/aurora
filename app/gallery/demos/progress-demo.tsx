"use client"

import * as React from "react"
import { Progress } from "@/registry/aurora/ui/progress"

const section: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "32px",
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
}

const groupLabel: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "var(--aurora-font-mono)",
  color: "var(--aurora-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "4px",
}

const progressRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}

const progressItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
}

const itemLabel: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const itemName: React.CSSProperties = {
  fontSize: "12px",
  fontFamily: "var(--aurora-font-sans)",
  color: "var(--aurora-text-primary)",
}

const itemValue: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "var(--aurora-font-mono)",
  color: "var(--aurora-text-muted)",
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

export default function ProgressDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "32px 0" }}>
      <div>
        <h2 style={heading}>Progress</h2>
        <p style={subheading}>
          Determinate and indeterminate progress bars across sizes and color variants. Shimmer and glow are built in.
        </p>
      </div>

      <div style={section}>
        <div style={groupLabel}>Determinate — various values</div>
        <div style={progressRow}>
          {[10, 25, 50, 75, 90, 100].map((v) => (
            <div key={v} style={progressItem}>
              <div style={itemLabel}>
                <span style={itemName}>Gateway sync</span>
                <span style={itemValue}>{v}%</span>
              </div>
              <Progress value={v} />
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Indeterminate — loading states</div>
        <div style={progressRow}>
          <div style={progressItem}>
            <span style={itemName}>Connecting to gateway…</span>
            <Progress />
          </div>
          <div style={progressItem}>
            <span style={itemName}>Provisioning environment…</span>
            <Progress variant="warn" />
          </div>
          <div style={progressItem}>
            <span style={itemName}>Escalating to human…</span>
            <Progress variant="rose" />
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>With built-in label</div>
        <div style={progressRow}>
          <Progress value={42} showLabel />
          <Progress value={68} showLabel label="68 / 100 tasks" />
          <Progress value={91} showLabel label="91% deployed" />
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Color variants</div>
        <div style={progressRow}>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Agent throughput</span>
              <span style={{ ...itemValue, color: "var(--aurora-accent-primary)" }}>default</span>
            </div>
            <Progress value={72} variant="default" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>CPU usage</span>
              <span style={{ ...itemValue, color: "var(--aurora-warn)" }}>warn</span>
            </div>
            <Progress value={81} variant="warn" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Error rate</span>
              <span style={{ ...itemValue, color: "var(--aurora-error)" }}>error</span>
            </div>
            <Progress value={34} variant="error" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Human escalations</span>
              <span style={{ ...itemValue, color: "var(--aurora-accent-pink)" }}>rose</span>
            </div>
            <Progress value={19} variant="rose" />
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Sizes — sm / default / lg</div>
        <div style={progressRow}>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Micro metric</span>
              <span style={itemValue}>sm</span>
            </div>
            <Progress value={60} size="sm" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Standard metric</span>
              <span style={itemValue}>default</span>
            </div>
            <Progress value={60} size="default" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Featured metric</span>
              <span style={itemValue}>lg</span>
            </div>
            <Progress value={60} size="lg" />
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Deployment status — labby-prod-01</div>
        <div style={progressRow}>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Gateway connection</span>
              <span style={{ ...itemValue, color: "var(--aurora-success)" }}>Connected</span>
            </div>
            <Progress value={100} variant="default" size="sm" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Environment bootstrap</span>
              <span style={itemValue}>87%</span>
            </div>
            <Progress value={87} variant="default" size="sm" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Agent deployment</span>
              <span style={itemValue}>Loading…</span>
            </div>
            <Progress size="sm" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Memory allocation</span>
              <span style={{ ...itemValue, color: "var(--aurora-warn)" }}>79%</span>
            </div>
            <Progress value={79} variant="warn" size="sm" />
          </div>
          <div style={progressItem}>
            <div style={itemLabel}>
              <span style={itemName}>Disk usage</span>
              <span style={{ ...itemValue, color: "var(--aurora-error)" }}>93%</span>
            </div>
            <Progress value={93} variant="error" size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
