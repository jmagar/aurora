"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Edge } from "@/registry/aurora/blocks/ai/elements/edge"

export default function AiEdgeDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / edge"
        heading="Edge"
        description="Graph edge label as a tone-tinted pill — success / active / warn / error / muted, with optional direction arrows, a dashed variant, and an animated flow, using the real registry implementation."
      />
      <section
        className="flex flex-wrap items-center gap-2"
        style={{
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Edge label="200 OK" tone="success" direction="forward" />
        <Edge label="sync" tone="active" direction="both" animated />
        <Edge label="429 retry" tone="warn" />
        <Edge label="502" tone="error" direction="back" />
        <Edge label="pending" tone="muted" dashed />
      </section>
    </div>
  )
}
