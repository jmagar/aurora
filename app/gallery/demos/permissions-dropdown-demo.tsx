"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button";
import {
  PermissionsDropdown,
  PermissionChip,
  ToolPermission,
  ToolPermissionState,
} from "@/registry/aurora/blocks/auth/permissions-dropdown/permissions-dropdown"

const INITIAL_TOOLS: ToolPermission[] = [
  { id: "list_routes",    name: "list_routes",    description: "Enumerate all configured gateway routes", state: "allow" },
  { id: "create_route",   name: "create_route",   description: "Add a new routing rule",                  state: "ask" },
  { id: "delete_route",   name: "delete_route",   description: "Remove an existing routing rule",         state: "block" },
  { id: "get_metrics",    name: "get_metrics",    description: "Fetch request and latency metrics",       state: "allow" },
  { id: "restart_service",name: "restart_service",description: "Restart the gateway daemon",              state: "ask" },
  { id: "read_logs",      name: "read_logs",      description: "Stream recent gateway log lines",         state: "allow" },
  { id: "rotate_token",   name: "rotate_token",   description: "Issue a new API token and revoke the old",state: "block" },
  { id: "exec_command",   name: "exec_command",   description: "Run an arbitrary shell command on the host",state: "block" },
]

export function PermissionsDropdownDemo() {
  const [tools, setTools] = React.useState<ToolPermission[]>(INITIAL_TOOLS)
  const [masterEnabled, setMasterEnabled] = React.useState(true)
  const [chipOpen, setChipOpen] = React.useState(false)

  function handleUpdate(id: string, state: ToolPermissionState) {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, state } : t)))
  }

  const allowCount = tools.filter((t) => t.state === "allow").length
  const askCount   = tools.filter((t) => t.state === "ask").length
  const blockCount = tools.filter((t) => t.state === "block").length

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "24px" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--aurora-font-sans)", fontSize: "13px", color: "var(--aurora-text-muted)" }}>
          Policy summary:
        </span>
        <PermissionChip tools={tools} onClick={() => setChipOpen((o) => !o)} />

        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          {[
            { label: `${allowCount} allowed`, color: "var(--aurora-success)" },
            { label: `${askCount} ask`,        color: "var(--aurora-accent-primary)" },
            { label: `${blockCount} blocked`,  color: "var(--aurora-error)" },
          ].map((s) => (
            <span
              key={s.label}
              style={{
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "12px",
                fontWeight: 600,
                color: s.color,
                padding: "2px 8px",
                borderRadius: "6px",
                background: `color-mix(in srgb, ${s.color} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${s.color} 25%, transparent)`,
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Panels */}
      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Always-visible full panel */}
        <div style={{ flex: "1", minWidth: "320px", maxWidth: "480px" }}>
          <div
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--aurora-text-muted)",
              marginBottom: "10px",
            }}
          >
            Full panel
          </div>
          <PermissionsDropdown
            tools={tools}
            onUpdate={handleUpdate}
            masterEnabled={masterEnabled}
            onMasterToggle={setMasterEnabled}
          />
        </div>

        {/* Chip-toggled panel */}
        <div style={{ flex: "1", minWidth: "320px", maxWidth: "480px", position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--aurora-text-muted)",
              marginBottom: "10px",
            }}
          >
            Chip-triggered (click the chip above)
          </div>
          {chipOpen ? (
            <PermissionsDropdown
              tools={tools}
              onUpdate={handleUpdate}
              masterEnabled={masterEnabled}
              onMasterToggle={setMasterEnabled}
              style={{ maxWidth: "440px" }}
            />
          ) : (
            <div
              style={{
                padding: "24px",
                background: "var(--aurora-panel-medium)",
                border: "1px dashed var(--aurora-border-default)",
                borderRadius: "var(--aurora-radius-2)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "13px",
                color: "var(--aurora-text-muted)",
                textAlign: "center",
              }}
            >
              Click the PermissionChip above to toggle this panel
            </div>
          )}
        </div>
      </div>

      <Button variant="plain" size="unstyled"
        onClick={() => setTools(INITIAL_TOOLS)}
        style={{
          alignSelf: "flex-start",
          height: "32px",
          padding: "0 14px",
          borderRadius: "8px",
          border: "1px solid var(--aurora-border-default)",
          background: "transparent",
          color: "var(--aurora-text-muted)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        Reset to defaults
      </Button>
    </div>
  )
}

export default PermissionsDropdownDemo
