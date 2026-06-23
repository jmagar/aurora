"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/aurora/ui/radio-group"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

export default function RadioGroupDemo() {
  const [transport, setTransport] = React.useState("streamable-http")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Radio group"
        description="Single-select control with an accent dot — used for transport, log level, and policy choices across gateway settings."
      />

      {/* CD dsCard composition — single-select transport picker */}
      <div
        style={{
          maxWidth: 420,
          boxSizing: "border-box",
          padding: 30,
          border: "1px solid var(--aurora-border-default)",
          borderRadius: 18,
          background: "var(--aurora-page-bg)",
        }}
      >
        <RadioGroup value={transport} onValueChange={setTransport}>
          <RadioGroupItem value="stdio">stdio</RadioGroupItem>
          <RadioGroupItem value="streamable-http">streamable-http</RadioGroupItem>
          <RadioGroupItem value="sse" disabled>
            sse (deprecated)
          </RadioGroupItem>
        </RadioGroup>
      </div>
    </div>
  )
}
