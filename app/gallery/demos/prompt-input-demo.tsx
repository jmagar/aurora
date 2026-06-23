"use client"

import React, { useState } from "react"
import { PromptInput, Attachment } from "@/registry/aurora/blocks/ai/prompt-input/prompt-input"

export default function PromptInputDemo() {
  const [value, setValue] = useState(
    "Crawl docs.rs/serde and summarize how derive works"
  )
  const [isStreaming, setIsStreaming] = useState(false)
  const [model, setModel] = useState("claude-sonnet-4-6")
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "1", name: "serde.rs", type: "file" },
  ])

  function handleSubmit(v: string, atts: Attachment[]) {
    if (isStreaming) return
    void v
    void atts
    setIsStreaming(true)
  }

  function handleStop() {
    setIsStreaming(false)
  }

  function handleRemoveAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "36px 40px",
        background: "var(--aurora-page-bg)",
        backgroundImage:
          "radial-gradient(800px 420px at 50% -20%, color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent), transparent 60%)",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <PromptInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          onStop={handleStop}
          attachments={attachments}
          onRemoveAttachment={handleRemoveAttachment}
          model={model}
          onModelChange={setModel}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  )
}
