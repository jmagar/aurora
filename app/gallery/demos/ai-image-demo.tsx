"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Image as AiImage } from "@/registry/aurora/blocks/ai/elements/image"

// CD-parity composition for the AiImage element: three AI-generated image cards
// — ready (with AI badge, model pill, prompt overlay, metadata footer + regenerate),
// generating (spinner, percent, rose progress bar) and failed (alert + retry) —
// reproduced 1:1 from the Claude Design dsCard.

// The ready-state scene from the CD source: a radial navy field with a cyan orb,
// topographic flow lines and sparkle dots.
const SCENE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Cdefs%3E%3CradialGradient id='g' cx='62%25' cy='30%25' r='75%25'%3E%3Cstop offset='0' stop-color='%231c425a'/%3E%3Cstop offset='0.5' stop-color='%230d2230'/%3E%3Cstop offset='1' stop-color='%2307131c'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='400' cy='118' r='52' fill='none' stroke='%2367cbfa' stroke-width='1.5' opacity='0.55'/%3E%3Ccircle cx='400' cy='118' r='30' fill='%2329b6f6' opacity='0.18'/%3E%3Cg fill='none' stroke='%2329b6f6' stroke-width='1.4' opacity='0.7'%3E%3Cpath d='M-10 250 C120 210 200 270 320 235 C440 200 540 255 650 220'/%3E%3Cpath d='M-10 285 C120 250 220 305 330 270 C450 232 550 290 650 258'/%3E%3Cpath d='M-10 320 C130 288 210 335 340 305 C460 278 560 322 650 296'/%3E%3C/g%3E%3Cg fill='%2367cbfa'%3E%3Ccircle cx='150' cy='90' r='1.6'/%3E%3Ccircle cx='520' cy='70' r='1.6'/%3E%3Ccircle cx='250' cy='150' r='1.2'/%3E%3Ccircle cx='560' cy='160' r='1.2'/%3E%3C/g%3E%3C/svg%3E"

export default function AiImageDemo() {
  const [gen, setGen] = React.useState(false)
  const [prog, setProg] = React.useState(0.42)

  React.useEffect(() => {
    if (!gen) return
    const t = setTimeout(() => setGen(false), 2200)
    return () => clearTimeout(t)
  }, [gen])

  React.useEffect(() => {
    const t = setInterval(() => setProg((p) => (p >= 0.95 ? 0.18 : p + 0.04)), 550)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / image"
        heading="Image"
        description="AI-generated image — ready, generating and failed, with prompt, model, seed and expand."
      />
      <section
        style={{
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            alignItems: "start",
            gap: 16,
          }}
        >
          <AiImage
            src={gen ? undefined : SCENE}
            loading={gen}
            aspect="4:3"
            model="Imagen 3"
            prompt="Topographic cyan flow field over deep navy, luminous orb"
            caption="flow-field-04.png"
            dimensions="1024×768"
            seed="82213"
            onRegenerate={() => setGen(true)}
            onExpand={() => {}}
          />
          <AiImage
            status="generating"
            aspect="4:3"
            progress={prog}
            model="Imagen 3"
            caption="Sampling steps…"
          />
          <AiImage
            status="failed"
            aspect="4:3"
            caption="Content filter · retry"
            onRetry={() => {}}
          />
        </div>
      </section>
    </div>
  )
}
