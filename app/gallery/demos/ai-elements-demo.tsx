"use client"

import * as React from "react"
import {
  EnvironmentVariables,
  InlineCitation,
  Message,
  MessageAvatar,
  MessageContent,
  Source,
  Sources,
  StackTrace,
  TaskList,
  TestResults,
} from "@/registry/aurora/blocks/ai/elements/ai-elements"

const panel: React.CSSProperties = {
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
  padding: 24,
}

const heading: React.CSSProperties = {
  color: "var(--aurora-text-primary)",
  fontFamily: "var(--aurora-font-display)",
  fontSize: 22,
  fontWeight: 760,
  lineHeight: 1.2,
  marginBottom: 6,
}

const copy: React.CSSProperties = {
  color: "var(--aurora-text-muted)",
  fontSize: 13,
  lineHeight: 1.55,
}

export default function AiElementsDemo() {
  return (
    <div style={{ display: "grid", gap: 28, padding: 0 }}>
      <div>
        <h2 style={heading}>AI Elements</h2>
        <p style={copy}>Agent transcript primitives for messages, citations, sources, task state, tests, errors, and runtime configuration.</p>
      </div>

      <section style={panel}>
        <Message>
          <MessageAvatar label="AI" tone="orange" />
          <MessageContent>
            Gateway policy was updated after validating the registry manifest <InlineCitation index={1} href="#source-manifest" /> and the runtime logs <InlineCitation index={2} href="#source-logs" />.
            <div style={{ marginTop: 14 }}>
              <Sources>
                <Source source={{ title: "registry.json", href: "#source-manifest", description: "Published component manifest", badge: "1" }} />
                <Source source={{ title: "docker compose logs", href: "#source-logs", description: "Container runtime output", badge: "2" }} />
              </Sources>
            </div>
          </MessageContent>
        </Message>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
        <TaskList
          tasks={[
            { id: "1", title: "Inspect Registry", description: "Read registry entries and generated output", status: "completed" },
            { id: "2", title: "Run Gallery Smoke", description: "Open every route with agent-browser", status: "running" },
            { id: "3", title: "Publish Package", description: "Waiting for approval", status: "queued" },
          ]}
        />

        <TestResults
          results={[
            { name: "pnpm lint", status: "passed", duration: "2.9s" },
            { name: "pnpm build", status: "passed", duration: "12.8s" },
            { name: "visual sweep", status: "running", message: "Capturing updated component screenshots" },
          ]}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
        <StackTrace
          title="Build Failure"
          frames={[
            { file: "registry/aurora/blocks/agent/agent.tsx", line: 84, column: 12, label: "Missing required registry dependency" },
            { file: "app/gallery/demos/ai-elements-demo.tsx", line: 33, column: 4, label: "Demo import failed" },
          ]}
        />

        <EnvironmentVariables
          variables={[
            { key: "NEXT_PUBLIC_LAB_API_URL", value: "http://localhost:8001", required: true },
            { key: "LAB_MARKETPLACE_TOKEN", secret: true, required: true },
            { key: "AURORA_DEBUG_OVERLAY", value: "false" },
          ]}
        />
      </div>

    </div>
  )
}
