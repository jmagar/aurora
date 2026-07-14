"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { SchemaDisplay } from "@/registry/aurora/blocks/ai/elements/schema-display"

export default function AiSchemaDisplayDemo() {
  return (
    <div className="flex flex-col gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Schema Display"
        description="A JSON Schema viewer — a fields table with type-colored badges and required markers, plus a raw JSON toggle."
      />
      <div className="max-w-[520px]">
        <SchemaDisplay
          title="search_docs · input"
          schema={{
            type: "object",
            required: ["query"],
            properties: {
              query: { type: "string", description: "Natural-language search query" },
              top_k: { type: "integer", description: "Number of results to return" },
              rerank: { type: "boolean", description: "Apply the cross-encoder reranker" },
              tags: { type: "array", items: { type: "string" } },
            },
          }}
        />
      </div>
    </div>
  )
}
