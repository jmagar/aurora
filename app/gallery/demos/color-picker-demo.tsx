"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { ColorPicker } from "@/registry/aurora/ui/color-picker"

// CD dsCard composition: a single ColorPicker on the page surface, capped to a
// comfortable width. Label "Accent color", default #29b6f6, eight Aurora-token
// quick-picks (cyan, rose, orange, teal, sand, clay, sky, near-white).
const wrap: React.CSSProperties = {
  maxWidth: "360px",
}

export default function ColorPickerDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="ColorPicker"
        description="HSV picker with a saturation/brightness plane, hue slider, hex input, and quick-pick swatches. Color values flow through the Aurora token palette."
      />
      <div style={wrap}>
        <ColorPicker
          label="Accent color"
          defaultValue="#29b6f6"
          colors={[
            "#29b6f6",
            "#f9a8c4",
            "#ff9645",
            "#7dd3c7",
            "#c6a36b",
            "#c78490",
            "#72c8f5",
            "#e6f4fb",
          ]}
        />
      </div>
    </div>
  )
}
