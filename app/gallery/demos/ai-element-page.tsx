"use client"

import * as React from "react"
import { AttachmentChip } from "@/registry/aurora/blocks/attachment/attachment"
import { Thinking } from "@/registry/aurora/blocks/thinking/thinking"
import { ToolCalls } from "@/registry/aurora/blocks/tool-calls/tool-calls"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"
import { Callout } from "@/registry/aurora/ui/callout"
import { Collapsible } from "@/registry/aurora/ui/collapsible"
import {
  Agent,
  AudioPlayer,
  Canvas,
  Checkpoint,
  Commit,
  Confirmation,
  Connection,
  ContextPanel,
  Controls,
  Conversation,
  Edge,
  EnvironmentVariables,
  Image,
  InlineCitation,
  JsxPreview,
  MicSelector,
  Message,
  MessageAvatar,
  MessageContent,
  ModelSelector,
  Node,
  OpenInChat,
  PackageInfo,
  Panel,
  Persona,
  Queue,
  Sandbox,
  SchemaDisplay,
  Shimmer,
  Snippet,
  Source,
  Sources,
  SpeechInput,
  StackTrace,
  Suggestion,
  TaskList,
  TestResults,
  Transcription,
  VoiceSelector,
} from "@/registry/aurora/blocks/ai-elements/ai-elements"

const AI_TITLES: Record<string, string> = {
  attachments: "Attachments",
  "chain-of-thought": "Chain of thought",
  checkpoint: "Checkpoint",
  confirmation: "Confirmation",
  context: "Context",
  conversation: "Conversation",
  "inline-citation": "Inline citation",
  message: "Message",
  "model-selector": "Model selector",
  plan: "Plan",
  queue: "Queue",
  reasoning: "Reasoning",
  shimmer: "Shimmer",
  sources: "Sources",
  suggestion: "Suggestion",
  task: "Task",
  tool: "Tool",
  agent: "Agent",
  commit: "Commit",
  "environment-variables": "Environment variables",
  "jsx-preview": "JSX preview",
  "package-info": "Package info",
  sandbox: "Sandbox",
  "schema-display": "Schema display",
  snippet: "Snippet",
  "stack-trace": "Stack trace",
  "test-results": "Test results",
  "audio-player": "Audio player",
  "mic-selector": "Mic selector",
  persona: "Persona",
  "speech-input": "Speech input",
  transcription: "Transcription",
  "voice-selector": "Voice selector",
  canvas: "Canvas",
  connection: "Connection",
  controls: "Controls",
  edge: "Edge",
  node: "Node",
  panel: "Panel",
  image: "Image",
  "open-in-chat": "Open in chat",
}

const sourceItems = [
  { title: "Gateway registry", href: "#", description: "Source-backed metadata", badge: "doc" },
  { title: "Runtime policy", href: "#", description: "Permission constraints", badge: "toml" },
]

const tasks = [
  { id: "1", title: "Resolve package", description: "Read registry metadata", status: "completed" as const },
  { id: "2", title: "Build sandbox", description: "Create isolated execution surface", status: "running" as const },
  { id: "3", title: "Publish result", description: "Waiting for operator approval", status: "queued" as const },
]

const planSteps = [
  { label: "Resolve package", detail: "Read registry metadata", status: "done" as const },
  { label: "Build sandbox", detail: "Create isolated execution surface", status: "inprog" as const },
  { label: "Publish result", detail: "Waiting for operator approval", status: "pending" as const },
]

function AiExample({ slug }: { slug: string }) {
  switch (slug) {
    case "attachments":
      return <AttachmentChip name="registry.json" size={14336} onDismiss={() => {}} />
    case "message":
      return <Message><MessageAvatar label="AI" /><MessageContent>Gateway sync completed. <InlineCitation index={1} href="#" /></MessageContent></Message>
    case "inline-citation":
      return <p className="aurora-text-body">Registry source verified <InlineCitation index={2} href="#" /> with local metadata.</p>
    case "sources":
      return <Sources>{sourceItems.map((source) => <Source key={source.title} source={source} />)}</Sources>
    case "task":
      return <TaskList tasks={tasks} />
    case "plan":
      return <Thinking type="plan" steps={planSteps} defaultOpen />
    case "test-results":
      return <TestResults results={[{ name: "pnpm lint", status: "passed", duration: "3.2s" }, { name: "pnpm build", status: "running" }]} />
    case "stack-trace":
      return <StackTrace frames={[{ file: "registry/aurora/ui/button.tsx", line: 141, label: "Button render" }]} />
    case "environment-variables":
      return <EnvironmentVariables variables={[{ key: "NEXT_PUBLIC_API_URL", value: "set" }, { key: "LAB_TOKEN", secret: true, required: true }]} />
    case "checkpoint":
      return <Checkpoint label="Checkpoint saved" description="User-approved marketplace state captured." />
    case "confirmation":
      return <Confirmation title="Install plugin" description="This will update the local plugin cache." />
    case "context":
      return <ContextPanel items={sourceItems} />
    case "conversation":
      return <Conversation><Message><MessageAvatar label="U" tone="rose" /><MessageContent>Show installed plugins.</MessageContent></Message><Message><MessageAvatar label="AI" /><MessageContent>Found 18 active plugins.</MessageContent></Message></Conversation>
    case "model-selector":
      return <ModelSelector models={["gpt-5.5", "gpt-5.4", "gpt-5.3-codex"]} />
    case "queue":
      return <Queue tasks={tasks} />
    case "reasoning":
    case "chain-of-thought":
      return <Collapsible title="Reasoning summary" defaultOpen><p className="aurora-text-body" style={{ margin: 0 }}>Checked registry metadata, verified source paths, then selected the minimal install plan.</p></Collapsible>
    case "shimmer":
      return <div className="grid gap-3"><Shimmer /><Shimmer style={{ width: "70%" }} /></div>
    case "suggestion":
      return <Suggestion>Install the latest compatible version</Suggestion>
    case "tool":
      return <ToolCalls calls={[{ id: "1", tool: "registry.lookup", status: "completed", args: { package: "aurora-button" }, result: "Resolved aurora-button from the local registry." }]} />
    case "agent":
      return <Agent name="Marketplace agent" role="Registry resolver" status="running" />
    case "commit":
      return <Commit hash="a1b2c3d" message="Add marketplace parity route" author="labby" />
    case "jsx-preview":
      return <JsxPreview code={'<Button variant="rose">Install</Button>'} />
    case "package-info":
      return <PackageInfo name="@labby/marketplace" version="1.4.0" description="Local registry integration" />
    case "sandbox":
      return <Sandbox command="pnpm dev"><p className="aurora-text-body" style={{ margin: 0 }}>Container-ready preview process.</p></Sandbox>
    case "schema-display":
      return <SchemaDisplay schema={{ name: "aurora-button", type: "registry:ui" }} />
    case "snippet":
      return <Snippet language="tsx" code={'import { Button } from "@/components/ui/button"'} />
    case "image":
      return <Image alt="Aurora placeholder" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 420'%3E%3Crect width='800' height='420' fill='%2307131a'/%3E%3Cpath d='M130 130h540v160H130z' fill='%23122430'/%3E%3Cpath d='M250 170h300v24H250z' fill='%2329b6f6'/%3E%3C/svg%3E" caption="Aurora media frame" />
    case "open-in-chat":
      return <OpenInChat />
    case "audio-player":
      return <AudioPlayer />
    case "mic-selector":
      return <MicSelector devices={["Studio mic", "System default"]} />
    case "persona":
      return <Persona name="Operator" description="Concise, evidence-first assistant voice." />
    case "speech-input":
      return <SpeechInput defaultValue="Search installed plugins" />
    case "transcription":
      return <Transcription segments={["Search installed plugins.", "Open the marketplace detail panel."]} />
    case "voice-selector":
      return <VoiceSelector voices={["Neutral", "Focused", "Brief"]} />
    case "canvas":
      return <Canvas><Node title="Registry" description="Source index" /><Edge label="sync" /><Node title="Install" description="Cache update" /></Canvas>
    case "connection":
      return <Connection from="Registry" to="Gateway" />
    case "controls":
      return <Controls><Button size="sm">Run</Button><Button size="sm" variant="neutral">Stop</Button></Controls>
    case "edge":
      return <Edge label="stream" />
    case "node":
      return <Node title="Agent node" description="Runs install checks" />
    case "panel":
      return <Panel title="Inspector"><p className="aurora-text-body" style={{ margin: 0 }}>Workflow metadata and selected node details.</p></Panel>
    default:
      return <Callout title="AI element">Covered by the corresponding Aurora block route.</Callout>
  }
}

export function AiElementPage({ slug }: { slug: string }) {
  const title = AI_TITLES[slug] ?? slug

  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <Badge>{slug}</Badge>
        <h1 className="aurora-text-display-2" style={{ margin: 0 }}>{title}</h1>
        <p className="aurora-text-body" style={{ margin: 0, maxWidth: 720 }}>
          Aurora AI Elements page for the {title.toLowerCase()} component, using the real registry implementation and dark-first operator styling.
        </p>
      </header>
      <section className="grid gap-4 rounded-[var(--aurora-radius-2)] border p-5" style={{ background: "var(--aurora-panel-strong)", borderColor: "var(--aurora-border-strong)", boxShadow: "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
        <AiExample slug={slug} />
      </section>
    </div>
  )
}

export function createAiElementDemo(slug: string) {
  function AiElementDemo() {
    return <AiElementPage slug={slug} />
  }
  AiElementDemo.displayName = `AiElementDemo(${slug})`
  return AiElementDemo
}
