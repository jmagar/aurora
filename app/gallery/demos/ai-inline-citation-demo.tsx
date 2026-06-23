"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { InlineCitation } from "@/registry/aurora/blocks/ai/elements/inline-citation"

export default function AiInlineCitationDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / inline-citation"
        heading="Inline citation"
        description="Citation chip — hover or focus a chip to preview its source."
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
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.9 }}>
          Serde uses derive macros{" "}
          <InlineCitation
            index={1}
            href="#"
            title="Serde — Derive"
            url="serde.rs/derive.html"
          />{" "}
          to generate code at compile time{" "}
          <InlineCitation
            index={2}
            href="#"
            title="The Rust Reference — Procedural Macros"
            url="doc.rust-lang.org/reference"
          />
          .{" "}
          <span style={{ color: "var(--aurora-text-muted)" }}>(hover a chip)</span>
        </p>
      </section>
    </div>
  )
}
