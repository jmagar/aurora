"use client"

import * as React from "react"
import { Agent } from "@/registry/aurora/blocks/ai/elements/agent"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

export default function AiAgentDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Agent"
        description="Agent card — live activity, progress, metadata footer, and a compact grid tile. Status drives the pill, avatar pulse, and activity affordances."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "11px", maxWidth: "560px" }}>
        <Agent
          name="Axon"
          role="RAG control plane"
          status="running"
          badge
          model="claude-sonnet-4"
          task="Indexing repository…"
          progress={0.62}
          tokens={12400}
          elapsed="1m 12s"
          onClick={() => {}}
        />
        <Agent
          name="Cortex"
          role="Eval harness"
          status="blocked"
          model="gpt-4o"
          task="Awaiting API key"
          tokens={3200}
          elapsed="0m 48s"
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "11px" }}>
          <Agent variant="compact" name="Beacon" status="completed" />
          <Agent variant="compact" name="Relay" status="idle" />
        </div>
      </div>
    </div>
  )
}
