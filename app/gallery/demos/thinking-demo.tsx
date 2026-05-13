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
      <Thinking
        type="thinking"
        defaultOpen={false}
        duration={7}
        content="The request involves a complex multi-step migration. I considered several strategies including blue-green, canary, and rolling deployments before settling on a hybrid approach that minimizes downtime."
      />
    </div>
  )
}
