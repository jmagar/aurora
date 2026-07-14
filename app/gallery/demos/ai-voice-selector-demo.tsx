"use client"

import * as React from "react"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { VoiceSelector } from "@/registry/aurora/blocks/ai/elements/voice-selector"

export default function AiVoiceSelectorDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Voice Selector"
        description="A voice picker for spoken audio output, with an inline preview player."
      />
      <div className="max-w-[420px]">
        <VoiceSelector voices={["Aurora", "Nova", "Echo"]} />
      </div>
    </div>
  )
}
