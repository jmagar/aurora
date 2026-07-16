"use client"

import * as React from "react"
import { Focus, Grid2X2, Minus, Move, Plus, RotateCcw } from "lucide-react"
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
            icon={Minus}
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
            icon={Plus}
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(400, z + 25))}
          />
          <ControlsDivider />
          <ControlButton icon={Focus}>
            Fit
          </ControlButton>
        </Controls>

        <Controls orientation="vertical">
          <ControlButton
            icon={Move}
            aria-label="Move"
            active={tool === "move"}
            onClick={() => setTool("move")}
          />
          <ControlButton
            icon={Grid2X2}
            aria-label="Select"
            active={tool === "select"}
            onClick={() => setTool("select")}
          />
          <ControlsDivider />
          <ControlButton
            icon={RotateCcw}
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
