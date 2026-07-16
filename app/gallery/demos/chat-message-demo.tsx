"use client"

import * as React from "react"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { useClipboard } from "@/registry/aurora/lib/use-clipboard"
import { ChatMessage } from "@/registry/aurora/ui/chat-message"

export default function ChatMessageDemo() {
  const { copied, copy } = useClipboard(1200)
  const [variant, setVariant] = React.useState<"summary" | "detail">("summary")

  const assistantMessage =
    variant === "summary"
      ? "Serde derives compile `Serialize` and `Deserialize` implementations from your Rust types, so the reflection work happens before the binary ships."
      : "Serde's derive macros expand into concrete trait implementations during compilation. That keeps runtime overhead low and lets the compiler surface missing bounds immediately."

  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="Components"
        heading="ChatMessage"
        description="User and assistant turns with citations and real action affordances."
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 620,
          padding: "20px 24px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-page-bg)",
          boxSizing: "border-box",
        }}
      >
        <ChatMessage role="user">How does serde derive work?</ChatMessage>
        <ChatMessage
          role="assistant"
          author="Axon"
          time="14:32"
          onCopy={() => void copy(assistantMessage)}
          onRetry={() =>
            setVariant((current) => (current === "summary" ? "detail" : "summary"))
          }
          citations={[
            { label: "docs.rs/serde", href: "#" },
            { label: "serde.rs", href: "#" },
          ]}
        >
          <p>
            {assistantMessage}
          </p>
        </ChatMessage>
        <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)", margin: 0 }}>
          {copied ? "Copied the latest assistant reply." : "Use Retry to swap between response variants."}
        </p>
      </div>
    </div>
  )
}
