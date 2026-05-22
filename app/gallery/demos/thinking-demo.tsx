"use client"

import React from "react"
import { Thinking } from "@/registry/aurora/blocks/ai/thinking/thinking"

export default function ThinkingDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-4)",
        padding: 0,
      }}
    >
      <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "8px", fontWeight: 500 }}>
        AI reasoning surface — violet marks automation and generated output. Semantic colors (success, error) remain reserved for step outcomes.
      </p>
      <Thinking
        type="thinking"
        defaultOpen={false}
        duration={7}
        content="The request involves a complex multi-step migration. I considered several strategies including blue-green, canary, and rolling deployments before settling on a hybrid approach that minimizes downtime."
      />
    </div>
  )
}
