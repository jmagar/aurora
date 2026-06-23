"use client"

import * as React from "react"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  Conversation,
  Message,
  MessageAvatar,
  MessageContent,
} from "@/registry/aurora/blocks/ai/elements/conversation"

type Role = "user" | "assistant"

const SCRIPT: Array<[Role, string, React.ReactNode]> = [
  ["user", "JM", "How does serde derive work?"],
  [
    "assistant",
    "AX",
    "It generates the Serialize / Deserialize impls at compile time — no runtime reflection.",
  ],
  ["user", "JM", "Any runtime cost?"],
  [
    "assistant",
    "AX",
    "None — it's all monomorphized at build time, so it's as fast as a hand-written impl.",
  ],
  ["user", "JM", "What about enums?"],
  [
    "assistant",
    "AX",
    <>
      Same deal — each variant gets its own arm. Use{" "}
      <code>#[serde(tag = &quot;type&quot;)]</code> for internally-tagged JSON.
    </>,
  ],
  ["user", "JM", "Nice. And skipping fields?"],
  [
    "assistant",
    "AX",
    <>
      <code>#[serde(skip)]</code> drops it entirely;{" "}
      <code>#[serde(skip_serializing_if = &quot;Option::is_none&quot;)]</code>{" "}
      omits nulls.
    </>,
  ],
]

function ConversationDemo() {
  const [n, setN] = React.useState(3)

  React.useEffect(() => {
    if (n >= SCRIPT.length) return
    const t = setTimeout(() => setN((c) => c + 1), 2200)
    return () => clearTimeout(t)
  }, [n])

  return (
    <Conversation maxHeight={360}>
      {SCRIPT.slice(0, n).map(([role, who, text], i) => (
        <Message key={i} role={role}>
          <MessageAvatar label={who} tone={role === "user" ? "cyan" : "rose"} />
          <MessageContent tone={role} prose>
            {text}
          </MessageContent>
        </Message>
      ))}
    </Conversation>
  )
}

export default function AiConversationDemo() {
  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Conversation"
        description="Live thread — auto-stick on stream, jump-to-latest with N-new."
      />

      <div className="max-w-[560px]">
        <ConversationDemo />
      </div>
    </div>
  )
}
