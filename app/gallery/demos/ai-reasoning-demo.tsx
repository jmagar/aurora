"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Reasoning } from "@/registry/aurora/blocks/ai/elements/reasoning"

// CD-parity composition for the Reasoning AI element: a resolved summary that
// expands to its rose-railed reasoning, plus a live streaming tail.
export default function AiReasoningDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / reasoning"
        heading="Reasoning"
        description="Compact reasoning stays collapsed until you need the full summary."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "11px",
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Reasoning duration={4} defaultOpen>
          The gateway returned 402, so the token bucket is exhausted. I&apos;ll back off 2s and retry
          the request with the fallback key.
        </Reasoning>
        <Reasoning isStreaming>Checking the rate-limit headers…</Reasoning>
      </section>
    </div>
  )
}
