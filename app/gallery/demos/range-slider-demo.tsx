"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { RangeSlider } from "@/registry/aurora/ui/range-slider"

// CD dsCard chrome ported as an inline style: the single range track is capped
// to a comfortable width on the page surface, matching the CD preview padding.
const row: React.CSSProperties = {
  // Fixed width: the slider's track is absolutely positioned, so it needs a
  // definite-width ancestor (a %-width wrapper collapses inside the shrink-wrap
  // gallery column). 480px gives the wide, prominent track CD shows spanning
  // its preview card.
  width: "480px",
}

// CD composition (1:1): a single two-thumb range slider at [30, 70], showing the
// filled segment between the thumbs and the glowing thumbs.
export default function RangeSliderDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="RangeSlider"
        description="Aurora extension · two-thumb range. A filled segment between two glowing thumbs; pass a tone to recolor the fill and thumbs."
      />
      <div style={row}>
        <RangeSlider defaultValue={[30, 70]} aria-label="Range" />
      </div>
    </div>
  )
}
