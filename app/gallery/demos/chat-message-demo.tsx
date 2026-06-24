"use client"

import * as React from "react"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { ChatMessage } from "@/registry/aurora/ui/chat-message"

export default function ChatMessageDemo() {
  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="Components"
        heading="ChatMessage"
        description="User + agent turns · citations"
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 560,
          padding: "18px 22px",
          borderRadius: "var(--aurora-radius-2, 10px)",
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
          onCopy={() => {}}
          onRetry={() => {}}
          citations={[
            { label: "docs.rs/serde", href: "#" },
            { label: "serde.rs", href: "#" },
          ]}
        >
          <p>
            Serde&apos;s <code>derive</code> generates <code>Serialize</code> /{" "}
            <code>Deserialize</code> impls at compile time from your struct — no
            runtime reflection. The trait system does the work.
          </p>
        </ChatMessage>
      </div>
    </div>
  )
}
