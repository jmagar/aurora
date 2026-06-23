"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  Controls,
  ControlButton,
  ControlsDivider,
} from "@/registry/aurora/blocks/ai/elements/controls"

export default function AiControlsDemo() {
  const [zoom, setZoom] = React.useState(100)
  const [tool, setTool] = React.useState<"move" | "select">("move")

  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / controls"
        heading="Controls"
        description="Toolbar cluster — a raised, rounded panel of icon buttons split by hairline dividers. Horizontal zoom bar plus a vertical tool rail with an active (cyan ring) state."
      />
      <section
        className="flex flex-wrap items-center justify-center"
        style={{
          gap: 22,
          padding: "32px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Controls>
          <ControlButton
            icon='<path d="M5 12h14"/>'
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(25, z - 25))}
          />
          <span
            style={{
              minWidth: 46,
              textAlign: "center",
              fontFamily: "var(--aurora-font-display)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--aurora-text-primary)",
            }}
          >
            {zoom}%
          </span>
          <ControlButton
            icon='<path d="M12 5v14M5 12h14"/>'
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(400, z + 25))}
          />
          <ControlsDivider />
          <ControlButton icon='<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/>'>
            Fit
          </ControlButton>
        </Controls>

        <Controls orientation="vertical">
          <ControlButton
            icon='<path d="m5 9 5-5 5 5M5 15l5 5 5-5"/>'
            aria-label="Move"
            active={tool === "move"}
            onClick={() => setTool("move")}
          />
          <ControlButton
            icon='<path d="M3 3h7v7H3zM14 14h7v7h-7z"/>'
            aria-label="Select"
            active={tool === "select"}
            onClick={() => setTool("select")}
          />
          <ControlsDivider />
          <ControlButton
            icon='<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>'
            aria-label="Reset"
            onClick={() => {
              setZoom(100)
              setTool("move")
            }}
          />
        </Controls>
      </section>
    </div>
  )
}
