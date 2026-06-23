"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Commit } from "@/registry/aurora/blocks/ai/elements/commit"

export default function AiCommitDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / commit"
        heading="Commit"
        description="Git commit — author avatar, copyable hash chip, branch and diffstat, plus a compact single-row variant."
      />
      <section
        className="grid gap-4"
        style={{
          padding: "20px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Commit
          hash="ca8cb38"
          message="Add serde derive support"
          author="jmagar"
          time="4m ago"
          branch="feat/serde"
          files={3}
          additions={128}
          deletions={14}
          badge
        />
        <Commit
          variant="compact"
          hash="7f1a902"
          message="Fix lint in primitives"
          author="jmagar"
        />
      </section>
    </div>
  )
}
