"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { AttachmentChip } from "@/registry/aurora/blocks/attachment/attachment"
import { Thinking } from "@/registry/aurora/blocks/thinking/thinking"
import { ToolCalls } from "@/registry/aurora/blocks/tool-calls/tool-calls"
import { Button } from "@/registry/aurora/ui/button"
import { Callout } from "@/registry/aurora/ui/callout"
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

const AI_DESCRIPTIONS: Partial<Record<string, string>> = {
  reasoning: "Compact reasoning stays collapsed until you need the full summary.",
  tool: "A single inline tool event with expandable input and output.",
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
      return <Message><MessageAvatar label="AI" /><MessageContent tone="assistant">Gateway sync completed. <InlineCitation index={1} href="#" /></MessageContent></Message>
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
      return <ContextPanel used={42100} limit={128000} items={sourceItems} />
    case "conversation":
      return (
        <Conversation>
          <Message role="user"><MessageAvatar label="U" tone="rose" /><MessageContent tone="user">Show installed plugins and recent registry activity.</MessageContent></Message>
          <Message><MessageAvatar label="AI" /><MessageContent tone="assistant">I grouped the identical tool calls so the activity stays compact while you keep the conversation in view.</MessageContent></Message>
          <ToolCalls
            calls={[
              { id: "1", tool: "files.read", status: "completed", args: { path: "registry.json" }, result: "Loaded registry metadata." },
              { id: "2", tool: "files.read", status: "completed", args: { path: "components.json" }, result: "Loaded shadcn config." },
              { id: "3", tool: "files.read", status: "completed", args: { path: "next.config.ts" }, result: "Loaded hosting config." },
              { id: "4", tool: "registry.lookup", status: "completed", args: { package: "aurora-button" }, result: "Resolved aurora-button from the local registry." },
              { id: "5", tool: "registry.lookup", status: "completed", args: { package: "aurora-dialog" }, result: "Resolved aurora-dialog from the local registry." },
            ]}
          />
          <Message><MessageAvatar label="AI" /><MessageContent tone="assistant">Found 18 active plugins and 5 modified registry surfaces.</MessageContent></Message>
        </Conversation>
      )
    case "model-selector":
      return <ModelSelector label="Model" models={["gpt-5.5", "gpt-5.4", "gpt-5.3-codex"]} />
    case "queue":
      return <Queue tasks={tasks} />
    case "reasoning":
      return <Thinking type="thinking" content="Checked registry metadata, verified source paths, then selected the minimal install plan." />
    case "chain-of-thought":
      return <Thinking type="cot" steps={planSteps} defaultOpen />
    case "shimmer":
      return <div className="grid gap-3"><Shimmer /><Shimmer style={{ width: "70%" }} /></div>
    case "suggestion":
      return (
        <Suggestion
          options={[
            { id: "latest", title: "Install the latest compatible version", description: "Fastest path when the local registry already has the dependency graph.", badge: "default" },
            { id: "locked", title: "Pin to the currently deployed version", description: "Safer when you need parity with the production workspace.", badge: "safe" },
            { id: "preview", title: "Open the diff before installing", description: "Best when you want to inspect target files and registry dependencies first.", badge: "review" },
          ]}
        />
      )
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
      return <Sandbox command="pnpm dev" status="running" runtime="Node 20" envCount={12} paths={["/workspace/app", "/workspace/registry", "/workspace/.next"]}><p className="aurora-text-body" style={{ margin: 0 }}>Container-ready preview process with a mounted app directory, compiled output, and injected registry credentials.</p></Sandbox>
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
      return <Transcription segments={[{ speaker: "Operator", timecode: "00:01", text: "Search installed plugins.", confidence: 97 }, { speaker: "Assistant", timecode: "00:04", text: "Opening the marketplace detail panel.", confidence: 94 }]} />
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
  const compactSurface = slug === "reasoning" || slug === "tool"
  const description = AI_DESCRIPTIONS[slug] ?? `Aurora AI Elements page for ${title.toLowerCase()}, using the real registry implementation with compact operator styling.`

  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow={`AI elements / ${slug}`}
        heading={title}
        description={description}
      />
      <section
        className={compactSurface ? "inline-flex" : "grid gap-4"}
        style={
          compactSurface
            ? {
                alignSelf: "start",
                justifySelf: "start",
                width: "fit-content",
                maxWidth: "100%",
              }
            : {
                padding: "20px",
                borderRadius: "var(--aurora-radius-2)",
                border: "1px solid var(--aurora-border-strong)",
                background: "var(--aurora-panel-strong)",
                boxShadow: "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,0.05)",
              }
        }
      >
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
