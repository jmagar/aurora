"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { CopyButton } from "@/registry/aurora/ui/copy-button"

export default function CopyButtonDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="CopyButton"
        description="Aurora extension · copy to clipboard. A lit-outline button that writes a value to the clipboard and flips to a success state. Renders icon-only when no label is supplied."
      />
      <section
        style={{
          boxSizing: "border-box",
          padding: "34px 30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          color: "var(--aurora-text-primary)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <CopyButton value="ghp_xxx" label="Copy Token" />
        <CopyButton value="registry/aurora/ui/copy-button.tsx" label="Copy Path" />
        <CopyButton value="ghp_xxx" />
        <CopyButton value="ghp_xxx" label="Disabled" disabled />
      </section>
    </div>
  )
}
