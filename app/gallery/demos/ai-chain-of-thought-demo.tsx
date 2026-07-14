"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { ChainOfThought } from "@/registry/aurora/blocks/ai/elements/chain-of-thought"

// CD-parity composition for the ChainOfThought AI element: a streaming reasoning
// timeline with per-step status nodes, the Axon-orange "AI" identity badge, and a header
// summary — reproduced 1:1 from the Claude Design dsCard.
export default function AiChainOfThoughtDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / chain of thought"
        heading="Chain of Thought"
        description="Reasoning steps — collapsible, per-step status, streaming."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <ChainOfThought
          isStreaming
          badge
          summary="Thought for 4.2s"
          steps={[
            {
              label: "Parse the struct fields",
              detail: "4 named fields, 1 generic",
              status: "done",
              duration: "0.4s",
            },
            {
              label: "Generate the Serialize impl",
              status: "done",
              duration: "1.1s",
            },
            {
              label: "Emit token stream",
              detail: "writing serialize_struct…",
              status: "inprog",
            },
          ]}
        />
      </section>
    </div>
  )
}
