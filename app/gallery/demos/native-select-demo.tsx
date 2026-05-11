"use client"

import * as React from "react"
import { NativeSelect } from "@/registry/aurora/ui/native-select"

const section: React.CSSProperties = {
  display: "grid",
  gap: 16,
}

const panel: React.CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 18,
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
  background: "var(--aurora-panel-medium)",
  boxShadow: "var(--aurora-shadow-medium), inset 0 1px 0 rgba(255,255,255,0.04)",
}

const label: React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--aurora-font-sans)",
  fontSize: "var(--aurora-type-label)",
  fontWeight: 650,
}

export default function NativeSelectDemo() {
  const [runtime, setRuntime] = React.useState("server")

  return (
    <main style={section}>
      <header style={{ display: "grid", gap: 6 }}>
        <p className="aurora-text-label" style={{ margin: 0, color: "var(--aurora-text-muted)" }}>
          Form elements
        </p>
        <h2 className="aurora-text-display-2" style={{ margin: 0 }}>
          Native select
        </h2>
        <p className="aurora-text-body" style={{ margin: 0, maxWidth: 760, color: "var(--aurora-text-muted)" }}>
          A styled native select for simple browser-managed option menus, preserving the native select ref and event contract.
        </p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <div style={panel}>
          <label style={label}>
            Runtime
            <NativeSelect value={runtime} onChange={(event) => setRuntime(event.target.value)}>
              <option value="server">Remote Dolt server</option>
              <option value="embedded">Embedded Dolt</option>
              <option value="shared">Shared local server</option>
            </NativeSelect>
          </label>
          <p className="aurora-text-body-sm" style={{ margin: 0, color: "var(--aurora-text-muted)" }}>
            Selected: {runtime}
          </p>
        </div>

        <div style={panel}>
          <label style={label}>
            Default value
            <NativeSelect defaultValue="sonnet">
              <option value="opus">Claude Opus</option>
              <option value="sonnet">Claude Sonnet</option>
              <option value="haiku">Claude Haiku</option>
            </NativeSelect>
          </label>
        </div>

        <div style={panel}>
          <label style={label}>
            Placeholder
            <NativeSelect defaultValue="" placeholder="Select source...">
              <option value="local">Local registry</option>
              <option value="remote">Remote registry</option>
              <option value="marketplace">Marketplace index</option>
            </NativeSelect>
          </label>
        </div>

        <div style={panel}>
          <label style={label}>
            Disabled
            <NativeSelect disabled defaultValue="https">
              <option value="https">HTTPS only</option>
            </NativeSelect>
          </label>
        </div>
      </section>
    </main>
  )
}
