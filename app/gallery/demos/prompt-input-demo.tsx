"use client"

import React, { useState } from "react"
import { PromptInput, Attachment } from "@/registry/aurora/blocks/ai/prompt-input/prompt-input"
import { Message, MessageAvatar, MessageContent } from "@/registry/aurora/blocks/ai/elements/message"
import { Conversation } from "@/registry/aurora/blocks/ai/elements/conversation"
import { InlineCitation } from "@/registry/aurora/blocks/ai/elements/inline-citation"
import { Spinner } from "@/registry/aurora/ui/spinner"

export default function PromptInputDemo() {
  const [value, setValue] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [model, setModel] = useState("claude-sonnet-4-6")
  const [attachments, setAttachments] = useState<Attachment[]>([])

  const slashCommands = [
    { id: "clear", label: "/clear", description: "Clear conversation" },
    { id: "search", label: "/search", description: "Search the web" },
    { id: "plan", label: "/plan", description: "Generate a plan" },
    { id: "code", label: "/code", description: "Enter code mode" },
  ]

  const mentionItems = [
    { id: "src", label: "src/", kind: "folder" as const },
    { id: "readme", label: "README.md", kind: "file" as const },
    { id: "coder-agent", label: "Coder Agent", kind: "agent" as const },
  ]

  function handleSubmit(v: string, atts: Attachment[]) {
    if (isStreaming) return
    void v
    void atts
    setIsStreaming(true)
    setValue("")
    const t = setTimeout(() => setIsStreaming(false), 2000)
    return () => clearTimeout(t)
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--aurora-space-6)",
        padding: "var(--aurora-space-8) var(--aurora-space-4)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <h2
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: "22px",
            fontWeight: 760,
            color: "var(--aurora-text-primary)",
            letterSpacing: 0,
            lineHeight: 1.15,
            marginBottom: "var(--aurora-space-4)",
          }}
        >
          Prompt input
        </h2>

        {/* Chat frame */}
        <div
          style={{
            width: "100%",
            background: "var(--aurora-surface-raised)",
            border: "1px solid var(--aurora-border-strong)",
            borderRadius: "var(--aurora-radius-2)",
            overflow: "hidden",
            boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          }}
        >
          <Conversation
            style={{
              border: "none",
              borderRadius: 0,
              boxShadow: "none",
              minHeight: "160px",
              maxHeight: "none",
              background:
                "radial-gradient(circle at 14% 0%, color-mix(in srgb, var(--aurora-accent-violet) 12%, transparent), transparent 36%), var(--aurora-panel-medium)",
            }}
          >
            <Message>
              <MessageAvatar label="AI" />
              <MessageContent>
                I found three registry surfaces that need the same visual treatment. The prompt can attach files, mention context, and switch models without leaving the transcript <InlineCitation index={1} href="#" />.
              </MessageContent>
            </Message>

            {isStreaming && (
              <Message>
                <MessageAvatar label="AI" />
                <MessageContent>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--aurora-text-muted)" }}>
                    <Spinner size="sm" />
                    Generating…
                  </span>
                </MessageContent>
              </Message>
            )}
          </Conversation>

          {/* Input */}
          <div style={{ borderTop: "1px solid var(--aurora-border-default)" }}>
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
              placeholder="Message Aurora…"
              slashCommands={slashCommands}
              mentionItems={mentionItems}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
