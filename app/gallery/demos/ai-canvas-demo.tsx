"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Canvas, Node } from "@/registry/aurora/blocks/ai/elements/canvas"

const nodeBase = { position: "absolute" as const, width: 168 }

export default function AiCanvasDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / canvas"
        heading="Canvas"
        description="Flow canvas — a status chip, node-count badge, dotted grid, draggable nodes with cyan input and rose output ports, edges that follow the nodes, and a zoom toolbar."
      />
      <section
        className="grid gap-4"
        style={{
          padding: "20px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Canvas
          title="ingest-pipeline"
          status="running"
          edges={[
            { from: 0, to: 1 },
            { from: 0, to: 2 },
          ]}
          // Nodes are absolutely positioned (no intrinsic width), so the canvas
          // needs a definite width or it collapses inside the shrink-wrapped
          // gallery column. minWidth covers the node extent (~500px).
          style={{ minHeight: 280, width: "100%", minWidth: 560 }}
        >
          <Node title="ingest" description="crawl → fetch" style={{ ...nodeBase, left: 24, top: 96 }} />
          <Node title="embed" description="chunk → vector" style={{ ...nodeBase, left: 300, top: 64 }} />
          <Node title="index" description="upsert → store" style={{ ...nodeBase, left: 300, top: 168 }} />
        </Canvas>
      </section>
    </div>
  )
}
