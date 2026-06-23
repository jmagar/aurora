"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { MessageContent } from "@/registry/aurora/blocks/ai/elements/message-content"

export default function AiMessageContentDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="MessageContent"
        description="Bubble — sender/time, attachments, delivery ticks, retry, quote-on-select."
      />
      <section
        style={{
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ alignSelf: "flex-end" }}>
            <MessageContent
              tone="user"
              time="14:32"
              status="read"
              attachments={[{ name: "schema.sql", meta: "4 KB" }]}
            >
              Can you migrate this?
            </MessageContent>
          </div>

          <MessageContent
            tone="assistant"
            sender="Triage Agent"
            time="14:32"
            streaming
            onQuote={() => {}}
          >
            Done — select any of this text to quote it back into a reply.
          </MessageContent>

          <MessageContent tone="error" onRetry={() => {}}>
            Couldn&apos;t reach the model.
          </MessageContent>
        </div>
      </section>
    </div>
  )
}
