"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Source } from "@/registry/aurora/blocks/ai/elements/source"

export default function AiSourceDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Source"
        description="Citation row — index chip, domain, badge, hover lit."
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          justifyContent: "center",
          padding: "22px 26px",
          background: "var(--aurora-page-bg)",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-default)",
        }}
      >
        <Source
          index={1}
          source={{
            title: "Serde derive macro reference",
            href: "https://serde.rs/derive.html",
            description: "How #[derive(Serialize, Deserialize)] expands at compile time.",
            badge: "DOCS",
          }}
        />
        <Source
          index={2}
          source={{
            title: "Zero-cost deserialization in Rust",
            href: "https://blog.rust-lang.org/serde-perf",
          }}
        />
      </div>
    </div>
  )
}
