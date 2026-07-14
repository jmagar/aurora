"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { AudioPlayer } from "@/registry/aurora/blocks/ai/elements/audio-player"

export default function AiAudioPlayerDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / audio-player"
        heading="AudioPlayer"
        description="Voice response — waveform scrubber, speed, synthesizing & compact."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          justifyContent: "center",
          padding: "24px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <AudioPlayer title="Voice Response" duration="00:42" progress={0.38} badge download />
        <AudioPlayer title="Synthesizing Reply" status="synthesizing" duration="00:18" />
        <AudioPlayer variant="compact" title="Quick Note" duration="00:09" progress={0.68} />
      </section>
    </div>
  )
}
