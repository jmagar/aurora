"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Source, Sources } from "@/registry/aurora/blocks/ai/elements/sources"

export default function AiSourcesDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Sources"
        description="Citation list — count badge, collapsible, holds Source rows."
      />
      <div
        style={{
          padding: "22px 26px",
          background: "var(--aurora-page-bg)",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-default)",
        }}
      >
        <Sources title="Sources" collapsible>
          <Source index={1} source={{ title: "Serde derive macro reference", href: "https://serde.rs/derive.html", badge: "DOCS" }} />
          <Source index={2} source={{ title: "Zero-cost deserialization in Rust", href: "https://blog.rust-lang.org/serde-perf" }} />
          <Source index={3} source={{ title: "tokio runtime internals", href: "https://docs.rs/tokio" }} />
        </Sources>
      </div>
    </div>
  )
}
