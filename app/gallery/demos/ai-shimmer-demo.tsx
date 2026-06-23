"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Shimmer } from "@/registry/aurora/blocks/ai/elements/shimmer"

export default function AiShimmerDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / shimmer"
        heading="Shimmer"
        description="Skeleton loader — line / lines / block / avatar / card. Sweeping placeholder surfaces for streaming and pending content."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          justifyContent: "center",
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Shimmer variant="lines" lines={3} />
        <Shimmer variant="card" />
      </section>
    </div>
  )
}
