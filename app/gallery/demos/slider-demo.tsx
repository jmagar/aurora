"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Slider } from "@/registry/aurora/ui/slider"

// CD dsCard chrome ported as inline styles: stacked rows on the page surface,
// each row capped to a comfortable track width.
const row: React.CSSProperties = {
  marginBottom: "22px",
  maxWidth: "320px",
}

const lastRow: React.CSSProperties = {
  maxWidth: "320px",
}

// CD composition: three sliders — default accent, rose tone, success tone —
// each at a different fill value to show the filled track + glowing thumb.
export default function SliderDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Forms"
        heading="Slider"
        description="Range input with a filled track and glowing thumb. The fill and thumb glow track the Aurora accent; pass a tone to recolor either."
      />
      <div style={row}>
        <Slider defaultValue={60} aria-label="Default accent" />
      </div>
      <div style={row}>
        <Slider defaultValue={35} tone="var(--aurora-accent-pink)" aria-label="Rose tone" />
      </div>
      <div style={lastRow}>
        <Slider defaultValue={82} tone="var(--aurora-success)" aria-label="Success tone" />
      </div>
    </div>
  )
}
