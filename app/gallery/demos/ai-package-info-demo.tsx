"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { PackageInfo } from "@/registry/aurora/blocks/ai/elements/package-info"

export default function AiPackageInfoDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / package-info"
        heading="Package Info"
        description="Dependency card — registry tone, version, license/size & install copy, using the real registry implementation with compact operator styling."
      />
      <section
        className="grid gap-4"
        style={{
          padding: "20px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          maxWidth: 560,
        }}
      >
        <PackageInfo
          name="serde"
          version="1.0.210"
          description="A generic serialization/deserialization framework"
          registry="cargo"
          license="MIT/Apache-2.0"
          size="92 KB"
          latest
        />
        <PackageInfo
          variant="compact"
          name="tokio"
          version="1.40.0"
          description="Async runtime"
          registry="cargo"
          outdated
        />
      </section>
    </div>
  )
}
