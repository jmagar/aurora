"use client"

import React, { useState } from "react"
import { Button } from "@/registry/aurora/ui/button"
import { AskUserQuestion } from "@/registry/aurora/blocks/ask-user-question/ask-user-question"

const MODEL_OPTIONS = [
  { id: "claude-opus-4-5", label: "Claude Opus 4.5", description: "Most powerful model. Best for complex reasoning and nuanced tasks.", preview: "// Token limit: 200k context\n// Best for: architecture, analysis, long docs" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", description: "Balanced speed and capability. Ideal for most coding and writing tasks.", preview: "// Token limit: 200k context\n// Best for: code, writing, general tasks" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", description: "Fastest and most cost-efficient. Great for short, focused tasks.", preview: "// Token limit: 200k context\n// Best for: quick answers, summarization" },
]

const PERMISSION_OPTIONS = [
  { id: "read_files", label: "Read files", description: "Allow the agent to read source files and configuration in your project." },
  { id: "write_files", label: "Write and modify files", description: "Allow the agent to create and edit files. Changes can be reviewed before saving." },
  { id: "run_commands", label: "Run shell commands", description: "Allow the agent to run build scripts, tests, and other shell commands." },
  { id: "network_access", label: "Network access", description: "Allow the agent to make HTTP requests to external APIs for documentation and search." },
  { id: "git_operations", label: "Git operations", description: "Allow reading git history, creating branches, and staging changes." },
]

export default function AskUserQuestionDemo() {
  const [modelAnswer, setModelAnswer] = useState<string | null>(null)
  const [permissionsAnswer, setPermissionsAnswer] = useState<string[] | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aurora-space-8)", padding: "var(--aurora-space-8) var(--aurora-space-4)" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--aurora-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Ask User Question</h2>

      <div style={{ background: "var(--aurora-panel-medium)", border: "1px solid var(--aurora-border-default)", borderRadius: "var(--aurora-radius-2)", padding: "20px", boxShadow: "var(--aurora-shadow-medium)" }}>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "16px", fontWeight: 500 }}>type=radio - model selection with code previews</p>
        {modelAnswer ? (
          <div style={{ padding: "14px 16px", background: "color-mix(in srgb, var(--aurora-success) 8%, var(--aurora-control-surface))", border: "1px solid color-mix(in srgb, var(--aurora-success) 25%, transparent)", borderRadius: "var(--aurora-radius-1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--aurora-success)" }}>Selected: {MODEL_OPTIONS.find((o) => o.id === modelAnswer)?.label}</p>
              <p style={{ margin: "3px 0 0", fontSize: "11px", color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)" }}>{modelAnswer}</p>
            </div>
            <Button size="sm" variant="neutral" onClick={() => setModelAnswer(null)}>Reset</Button>
          </div>
        ) : (
          <AskUserQuestion question="Which model would you like to use for this session?" type="radio" options={MODEL_OPTIONS} onSubmit={(v) => setModelAnswer(v as string)} />
        )}
      </div>

      <div style={{ background: "var(--aurora-panel-medium)", border: "1px solid var(--aurora-border-default)", borderRadius: "var(--aurora-radius-2)", padding: "20px", boxShadow: "var(--aurora-shadow-medium)" }}>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "16px", fontWeight: 500 }}>type=multi - permission selection (select multiple)</p>
        {permissionsAnswer ? (
          <div style={{ padding: "14px 16px", background: "color-mix(in srgb, var(--aurora-success) 8%, var(--aurora-control-surface))", border: "1px solid color-mix(in srgb, var(--aurora-success) 25%, transparent)", borderRadius: "var(--aurora-radius-1)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--aurora-success)" }}>Granted {permissionsAnswer.length} permissions</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {permissionsAnswer.map((id) => (
                <span key={id} style={{ padding: "2px 8px", background: "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent)", borderRadius: "8px", fontSize: "11px", color: "var(--aurora-accent-primary)", fontWeight: 500 }}>
                  {PERMISSION_OPTIONS.find((o) => o.id === id)?.label ?? id}
                </span>
              ))}
            </div>
            <Button size="sm" variant="neutral" onClick={() => setPermissionsAnswer(null)} style={{ alignSelf: "flex-start" }}>Reset</Button>
          </div>
        ) : (
          <AskUserQuestion question="Which permissions should the agent have for this project?" type="multi" options={PERMISSION_OPTIONS} onSubmit={(v) => setPermissionsAnswer(v as string[])} />
        )}
      </div>
    </div>
  )
}
