"use client"

import React, { useState } from "react"
import { Button } from "@/registry/aurora/ui/button"
import { PermissionPrompt } from "@/registry/aurora/blocks/permission-prompt/permission-prompt"

export default function PermissionPromptDemo() {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({})

  const prompts = [
    { id: "read", tool: "ReadFile", action: "Read file contents", target: "src/gateway/auth.ts", isDangerous: false, label: "Read - safe file access" },
    { id: "write", tool: "WriteFile", action: "Modify file on disk", target: "src/config/connection-pool.ts", isDangerous: false, label: "Write - file modification" },
    { id: "exec", tool: "Bash", action: "Execute shell command", target: "npm run build && npm test", isDangerous: false, label: "Exec - shell command" },
    { id: "danger", tool: "Bash", action: "Destructive - cannot be undone", target: "rm -rf dist/ && git reset --hard HEAD~3", isDangerous: true, label: "Dangerous - destructive action" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aurora-space-6)", padding: "var(--aurora-space-8) var(--aurora-space-4)" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--aurora-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Permission Prompt</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {prompts.map((p) => (
          <div key={p.id}>
            <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "8px", fontWeight: 500 }}>{p.label}</p>
            {dismissed[p.id] ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "var(--aurora-panel-medium)", border: "1px solid var(--aurora-border-default)", borderRadius: "var(--aurora-radius-1)", fontSize: "12px", color: "var(--aurora-text-muted)" }}>
                <span>Dismissed</span>
                <Button size="sm" variant="neutral" onClick={() => setDismissed((prev) => ({ ...prev, [p.id]: false }))}>Reset</Button>
              </div>
            ) : (
              <PermissionPrompt
                variant="inline"
                tool={p.tool}
                action={p.action}
                target={p.target}
                isDangerous={p.isDangerous}
                onAllow={() => setDismissed((prev) => ({ ...prev, [p.id]: true }))}
                onDeny={() => setDismissed((prev) => ({ ...prev, [p.id]: true }))}
                onAllowAlways={() => setDismissed((prev) => ({ ...prev, [p.id]: true }))}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: "12px", fontWeight: 600, color: "var(--aurora-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "8px 0" }}>Banner variant</h3>
        <div style={{ border: "1px solid var(--aurora-border-default)", borderRadius: "var(--aurora-radius-1)", overflow: "hidden" }}>
          <PermissionPrompt variant="banner" tool="Bash" action="Run deployment script" target="./scripts/deploy.sh staging" onAllow={() => {}} onDeny={() => {}} onAllowAlways={() => {}} />
        </div>
      </div>
    </div>
  )
}
