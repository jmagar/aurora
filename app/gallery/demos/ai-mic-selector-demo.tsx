"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { MicSelector } from "@/registry/aurora/blocks/ai/elements/mic-selector"

export default function AiMicSelectorDemo() {
  return (
    <div className="grid gap-8">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="MicSelector"
        description="Microphone picker with a live input-level meter and a mute toggle — swap inputs without dropping back to a native control."
      />

      {/* CD dsCard composition, 1:1 — the component centered on the page surface */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "22px 26px",
          minHeight: 230,
          background: "var(--aurora-page-bg)",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "var(--aurora-radius-2)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: 388 }}>
          <MicSelector devices={["MacBook Mic", "AirPods Pro", "USB Audio"]} />
        </div>
      </div>
    </div>
  )
}
