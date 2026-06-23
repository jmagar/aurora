"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Snippet } from "@/registry/aurora/blocks/ai/elements/snippet"

// Matches the Claude Design "Snippet" dsCard composition 1:1.
const CODE = `export async function search(q) {
  const res = await client.search({ query: q, top_k: 8 });
  return res.hits.map((h) => h.id);
}`

export default function AiSnippetDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / snippet"
        heading="Snippet"
        description="Code snippet on a recessed surface with a language chip and an icon-only copy control, using the real registry implementation."
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
        <Snippet language="ts" code={CODE} />
      </section>
    </div>
  )
}
