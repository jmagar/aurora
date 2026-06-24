"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  Response,
  type ResponseSource,
} from "@/registry/aurora/blocks/ai/elements/response"

// Mirrors the Claude Design "Response" dsCard composition 1:1.
const MD =
  "The **token bucket** was exhausted, so the gateway returned `402`. [[1]] Backing off and retrying with the fallback key:\n\n```rust\nlet key = fallback_key()?;\nclient.retry_with(key).await?;\n```\n\n- Wait 2s, then retry\n- Swap to `fallback_key()` [[2]]"

const SOURCES: ResponseSource[] = [
  {
    title: "Rate limiting & token buckets — Gateway docs",
    href: "https://labby.dev/docs/rate-limits",
    description:
      "How the gateway meters requests per key and returns 402 when the bucket drains.",
  },
  {
    title: "Fallback keys and retry policy",
    href: "https://labby.dev/docs/fallback-keys",
    description: "Configure a secondary key the client swaps to on 402/429.",
  },
]

export default function AiResponseDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Response"
        description="Markdown answer with inline code, fenced code blocks (copy + language chip), citation chips, bullet lists, and a streaming fade — rendered with the real registry implementation."
      />
      <section
        className="grid gap-3"
        style={{
          padding: "16px 20px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "var(--aurora-text-muted)",
          }}
        >
          Hover a citation chip ¹ ² to preview its source.
        </div>
        <Response
          markdown={MD}
          sources={SOURCES}
          onCitationClick={() => {}}
        />
      </section>
    </div>
  )
}
