"use client"

import React, { useState } from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import { AskUserQuestion } from "@/registry/aurora/blocks/ai/ask-user-question/ask-user-question"

// CD dsCard composition (1:1): a single radio question asking which transport
// the gateway should use, with three transport options.
const TRANSPORT_OPTIONS = [
  { id: "stdio", label: "stdio", description: "Local process over stdin/stdout. Lowest latency." },
  { id: "http", label: "streamable-http", description: "HTTP with chunked streaming. Best for remote." },
  { id: "sse", label: "sse", description: "Server-sent events. Legacy fallback." },
]

// dsCard chrome: the CD card renders on the page background with generous
// padding (24px 30px) and the standard panel surface tier.
const dsCard: React.CSSProperties = {
  background: "var(--aurora-page-bg)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
  padding: "24px 30px",
  boxShadow: "var(--aurora-shadow-medium)",
}

export default function AskUserQuestionDemo() {
  const [answer, setAnswer] = useState<string | null>(null)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-8)",
        padding: "var(--aurora-space-8) var(--aurora-space-4)",
        overflowX: "hidden",
      }}
    >
      <GalleryPageIntro
        eyebrow="Chat & AI"
        heading="Ask user question"
        description="A focused confirmation surface for radio, multi-select, and text answers. The cards stay compact, readable, and mobile-safe."
      />

      <div style={dsCard}>
        {answer ? (
          <div
            style={{
              padding: "16px 20px",
              background:
                "color-mix(in srgb, var(--aurora-success) 8%, var(--aurora-control-surface))",
              border:
                "1px solid color-mix(in srgb, var(--aurora-success) 25%, transparent)",
              borderRadius: "var(--aurora-radius-1)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--aurora-success)",
                  fontFamily: "var(--aurora-font-sans)",
                }}
              >
                Selected:{" "}
                {TRANSPORT_OPTIONS.find((option) => option.id === answer)?.label}
              </p>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 12,
                  color: "var(--aurora-text-muted)",
                  fontFamily: "var(--aurora-font-mono)",
                }}
              >
                {answer}
              </p>
            </div>
            <Button size="sm" variant="neutral" onClick={() => setAnswer(null)}>
              Reset
            </Button>
          </div>
        ) : (
          <AskUserQuestion
            type="radio"
            question="Which transport should the gateway use?"
            options={TRANSPORT_OPTIONS}
            onSubmit={(value) => setAnswer(value as string)}
          />
        )}
      </div>
    </div>
  )
}
