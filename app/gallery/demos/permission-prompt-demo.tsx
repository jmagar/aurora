"use client"

import React from "react"
import { PermissionPrompt } from "@/registry/aurora/blocks/auth/permission-prompt/permission-prompt"

// Rebuilt to reproduce the Claude Design `PermissionPrompt.dsCard` composition 1:1:
// two inline prompts (one safe, one dangerous) inside the dsCard's tight page frame
// (520px wide, 24px/30px padding, 14px gap), rendered with the registry component.
export default function PermissionPromptDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-6)",
        padding: "var(--aurora-space-8) var(--aurora-space-4)",
      }}
    >
      <h2
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--aurora-text-muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Permission Prompt
      </h2>

      {/* dsCard page frame: opaque page-bg surface, fixed width, tight padding + gap */}
      <div
        style={{
          width: 520,
          maxWidth: "100%",
          boxSizing: "border-box",
          background: "var(--aurora-page-bg)",
          color: "var(--aurora-text-primary)",
          padding: "24px 30px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-default)",
        }}
      >
        <PermissionPrompt
          variant="inline"
          tool="Run shell command"
          action="Axon wants to execute a command in your workspace."
          target="$ cargo build --release"
        />
        <PermissionPrompt
          variant="inline"
          isDangerous
          tool="Delete files"
          action="Axon wants to remove files matching a glob."
          target="rm -rf ./dist"
        />
      </div>
    </div>
  )
}
