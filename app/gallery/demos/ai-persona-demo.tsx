"use client"

import * as React from "react"
import { Persona } from "@/registry/aurora/blocks/ai/elements/persona"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

/* Mirrors the Claude Design Persona preview 1:1. */

export default function AiPersonaDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Persona"
        description="Identity card — avatar, role, presence, and capability chips, plus a compact selectable row."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <Persona name="Triage Agent" role="Reads logs, files issues" presence="online" tags={["logs", "issues", "read-only"]} badge />
        <Persona variant="compact" name="Gateway Operator" role="Full control-plane access" presence="busy" selected onClick={() => {}} />
      </div>
    </div>
  )
}
