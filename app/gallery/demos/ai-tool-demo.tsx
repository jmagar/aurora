"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Tool } from "@/registry/aurora/blocks/ai/elements/tool"

// CD-parity composition for the Tool AI element: a single collapsible tool call
// (axon.search), opened by default, showing its JSON input and a result summary.
export default function AiToolDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / tool"
        heading="Tool"
        description="A collapsible tool call with its structured input and a result summary."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          justifyContent: "center",
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Tool
          name="axon.search"
          status="done"
          defaultOpen
          args={{ query: "serde derive", top_k: 5 }}
        >
          5 hits · top score 0.82
        </Tool>
      </section>
    </div>
  )
}
