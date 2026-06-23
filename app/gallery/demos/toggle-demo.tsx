"use client"

import { Toggle } from "@/registry/aurora/ui/toggle"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

export default function ToggleDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Toggle"
        description="Pressable border-and-glow control that holds an on/off state. Lights up cyan when pressed, used for log-view and stream options."
      />

      {/* CD dsCard composition: a single flex row of pressable toggles */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <Toggle defaultPressed>Wrap lines</Toggle>
        <Toggle>Color-code</Toggle>
        <Toggle defaultPressed>Live tail</Toggle>
      </div>
    </div>
  )
}
