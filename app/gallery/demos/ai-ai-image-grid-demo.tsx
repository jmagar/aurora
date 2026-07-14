"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { AiImageGrid } from "@/registry/aurora/blocks/ai/elements/ai-image-grid"

// CD-parity composition for the AiImageGrid element: a 2×2 select-one grid of
// candidate variations with an "AI" identity badge + model pill on the chosen
// tile, a cyan selection ring, Axon-orange check, and a "Regenerate all" header action —
// reproduced 1:1 from the Claude Design dsCard.

// Candidate scene from the CD source: a radial navy field (variable hue + light
// origin per candidate) with a cyan orb outline and topographic flow lines.
function scene(cx: number, hue: string): string {
  return (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cdefs%3E%3CradialGradient id='g' cx='" +
    cx +
    "%25' cy='34%25' r='80%25'%3E%3Cstop offset='0' stop-color='" +
    hue +
    "'/%3E%3Cstop offset='0.55' stop-color='%230d2230'/%3E%3Cstop offset='1' stop-color='%2307131c'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23g)'/%3E%3Ccircle cx='" +
    cx * 3 +
    "' cy='130' r='38' fill='none' stroke='%2367cbfa' stroke-width='1.4' opacity='0.6'/%3E%3Cg fill='none' stroke='%2329b6f6' stroke-width='1.3' opacity='0.7'%3E%3Cpath d='M-10 300 C100 268 180 320 290 290 C360 270 420 305 420 290'/%3E%3Cpath d='M-10 335 C110 305 200 350 300 320 C380 296 420 330 420 320'/%3E%3C/g%3E%3C/svg%3E"
  )
}

const IMAGES = [
  scene(30, "%231c425a"),
  scene(60, "%23234a52"),
  scene(45, "%23193a4a"),
  scene(70, "%231f4256"),
]

export default function AiImageGridDemo() {
  const [tick, setTick] = React.useState(0)

  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="AI Image Grid"
        description="Candidate variations — a 2×2 select-one grid with AI badge, model pill, a cyan selection ring and a regenerate-all action."
      />
      <section
        style={{
          padding: "24px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div style={{ maxWidth: 388, margin: "0 auto" }}>
          <AiImageGrid
            key={tick}
            caption="4 candidates · pick one"
            model="Imagen 3"
            defaultValue={0}
            images={IMAGES}
            onRegenerate={() => setTick((t) => t + 1)}
          />
        </div>
      </section>
    </div>
  )
}
