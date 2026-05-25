"use client"

import React, { useState } from "react"
import { PromptInput, Attachment } from "@/registry/aurora/blocks/ai/prompt-input/prompt-input"

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
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "var(--aurora-space-4)",
          }}
        >
          Prompt Input
        </h2>

        {/* Chat frame */}
        <div
          style={{
            width: "100%",
            background: "var(--aurora-panel-medium)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "var(--aurora-radius-2)",
            overflow: "hidden",
            boxShadow: "var(--aurora-shadow-medium)",
          }}
        >
          {/* Mock chat messages */}
          <div
            style={{
              padding: "20px 20px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              minHeight: "160px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--aurora-accent-violet) 0%, var(--aurora-accent-pink) 100%)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--aurora-accent-foreground)",
                }}
              >
                A
              </div>
              <div
                style={{
                  background: "var(--aurora-panel-strong)",
                  border: "1px solid var(--aurora-border-default)",
                  borderRadius: "var(--aurora-radius-1)",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color: "var(--aurora-text-primary)",
                  lineHeight: "1.6",
                  maxWidth: "80%",
                }}
              >
                Hello! How can I help you today? Try typing{" "}
                <code
                  style={{
                    fontFamily: "var(--aurora-font-mono)",
                    color: "var(--aurora-accent-primary)",
                    fontSize: "12px",
                  }}
                >
                  /
                </code>{" "}
                for commands or{" "}
                <code
                  style={{
                    fontFamily: "var(--aurora-font-mono)",
                    color: "var(--aurora-accent-primary)",
                    fontSize: "12px",
                  }}
                >
                  @
                </code>{" "}
                to mention files.
              </div>
            </div>

            {isStreaming && (
              <div style={{ display: "flex", gap: "10px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--aurora-accent-violet) 0%, var(--aurora-accent-pink) 100%)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--aurora-accent-foreground)",
                  }}
                >
                  A
                </div>
                <div
                  style={{
                    background: "var(--aurora-panel-strong)",
                    border: "1px solid var(--aurora-border-default)",
                    borderRadius: "var(--aurora-radius-1)",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "var(--aurora-text-muted)",
                    lineHeight: "1.6",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      border: "1.5px solid var(--aurora-accent-violet)",
                      borderTopColor: "transparent",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Thinking…
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              </div>
            )}
          </div>

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

        <p
          style={{
            marginTop: "10px",
            fontSize: "11px",
            color: "var(--aurora-text-muted)",
            textAlign: "center",
          }}
        >
          Violet marks AI and automation affordances. Semantic colors stay reserved for system meaning.
        </p>
        <p
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "var(--aurora-text-muted)",
            textAlign: "center",
          }}
        >
          Type <code style={{ fontFamily: "var(--aurora-font-mono)" }}>/</code> for slash commands
          or <code style={{ fontFamily: "var(--aurora-font-mono)" }}>@</code> to mention files.
          Submit toggles streaming for 2s.
        </p>
      </div>
    </div>
  )
}
