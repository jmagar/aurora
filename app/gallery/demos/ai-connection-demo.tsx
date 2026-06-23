"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Connection } from "@/registry/aurora/blocks/ai/elements/connection"

export default function AiConnectionDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / connection"
        heading="Connection"
        description="Flow edge between two nodes — ok / active (flowing) / error / pending, with an optional label and a bidirectional variant, using the real registry implementation."
      />
      <section
        className="flex flex-col items-start gap-5"
        style={{
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Connection from="crawler" to="embedder" label="42ms" status="active" />
        <Connection from="gateway" to="upstream" label="502" status="error" />
        <Connection from="cache" to="store" label="sync" status="pending" bidirectional />
      </section>
    </div>
  )
}
