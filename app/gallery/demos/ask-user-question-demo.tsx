"use client"

import React, { useState } from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import { AskUserQuestion } from "@/registry/aurora/blocks/ask-user-question/ask-user-question"

const MODEL_OPTIONS = [
  { id: "claude-opus-4-5", label: "Claude Opus 4.5", description: "Higher reasoning depth for complex planning." },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", description: "Balanced choice for day-to-day coding and writing." },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", description: "Fastest option for short, focused tasks." },
]

const PERMISSION_OPTIONS = [
  { id: "read_files", label: "Read files", description: "Inspect source and configuration." },
  { id: "write_files", label: "Write files", description: "Create and edit project files." },
  { id: "run_commands", label: "Run commands", description: "Execute tests and scripts." },
  { id: "network_access", label: "Network access", description: "Fetch docs and APIs when needed." },
]

const panel: React.CSSProperties = {
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
  padding: "20px",
  boxShadow: "var(--aurora-shadow-medium)",
}

export default function AskUserQuestionDemo() {
  const [modelAnswer, setModelAnswer] = useState<string | null>(null)
  const [permissionsAnswer, setPermissionsAnswer] = useState<string[] | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aurora-space-8)", padding: "var(--aurora-space-8) var(--aurora-space-4)", overflowX: "hidden" }}>
      <GalleryPageIntro
        eyebrow="Chat & AI"
        heading="Ask user question"
        description="A focused confirmation surface for radio, multi-select, and text answers. The cards stay compact, readable, and mobile-safe."
      />

      <div style={panel}>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "16px", fontWeight: 500 }}>Single choice</p>
        {modelAnswer ? (
          <div style={{ padding: "14px 16px", background: "color-mix(in srgb, var(--aurora-success) 8%, var(--aurora-control-surface))", border: "1px solid color-mix(in srgb, var(--aurora-success) 25%, transparent)", borderRadius: "var(--aurora-radius-1)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--aurora-success)" }}>Selected: {MODEL_OPTIONS.find((option) => option.id === modelAnswer)?.label}</p>
              <p style={{ margin: "3px 0 0", fontSize: "11px", color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)" }}>{modelAnswer}</p>
            </div>
            <Button size="sm" variant="neutral" onClick={() => setModelAnswer(null)}>Reset</Button>
          </div>
        ) : (
          <AskUserQuestion
            question="Which model should the agent use for this task?"
            type="radio"
            options={MODEL_OPTIONS}
            onSubmit={(value) => setModelAnswer(value as string)}
          />
        )}
      </div>

      <div style={panel}>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "16px", fontWeight: 500 }}>Multiple choice</p>
        {permissionsAnswer ? (
          <div style={{ padding: "14px 16px", background: "color-mix(in srgb, var(--aurora-success) 8%, var(--aurora-control-surface))", border: "1px solid color-mix(in srgb, var(--aurora-success) 25%, transparent)", borderRadius: "var(--aurora-radius-1)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--aurora-success)" }}>Granted {permissionsAnswer.length} permissions</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {permissionsAnswer.map((id) => (
                <span key={id} style={{ padding: "2px 8px", background: "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent)", borderRadius: "8px", fontSize: "11px", color: "var(--aurora-accent-primary)", fontWeight: 500 }}>
                  {PERMISSION_OPTIONS.find((option) => option.id === id)?.label ?? id}
                </span>
              ))}
            </div>
            <Button size="sm" variant="neutral" onClick={() => setPermissionsAnswer(null)} style={{ alignSelf: "flex-start" }}>Reset</Button>
          </div>
        ) : (
          <AskUserQuestion
            question="Which permissions should this run get?"
            type="multi"
            options={PERMISSION_OPTIONS}
            onSubmit={(value) => setPermissionsAnswer(value as string[])}
          />
        )}
      </div>
    </div>
  )
}
