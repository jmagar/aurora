"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  Message,
  MessageActionButton,
  MessageAvatar,
  MessageContent,
} from "@/registry/aurora/blocks/ai/elements/message"

function MessageActions() {
  return (
    <>
      <MessageActionButton title="Edit" aria-label="Edit">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      </MessageActionButton>
      <MessageActionButton title="Copy" aria-label="Copy">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </MessageActionButton>
      <MessageActionButton title="Regenerate" aria-label="Regenerate">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
        </svg>
      </MessageActionButton>
    </>
  )
}

function MessageComposition() {
  return (
    <div className="flex flex-col gap-[14px]">
      <Message role="user" time="14:32" actions={<MessageActions />}>
        <MessageContent tone="user">How does serde derive work?</MessageContent>
      </Message>

      <Message role="assistant" time="14:32" actions={<MessageActions />}>
        <MessageAvatar label="AX" tone="muted" status="online" />
        <MessageContent tone="assistant" streaming>
          Impls are generated at compile time — no runtime reflection.
        </MessageContent>
      </Message>

      <div
        style={{
          fontSize: 11,
          color: "var(--aurora-text-muted)",
          textAlign: "center",
        }}
      >
        Hover a message to reveal timestamp + actions.
      </div>
    </div>
  )
}

export default function AiMessageDemo() {
  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Message"
        description="Turn — hover actions + timestamp, streaming caret, status avatar."
      />

      <div className="max-w-[540px]">
        <MessageComposition />
      </div>
    </div>
  )
}
