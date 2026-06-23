"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { ToolCalls, type ToolCall } from "@/registry/aurora/blocks/ai/tool-calls/tool-calls"

// CD-parity composition for the ToolCall block: a grouped agent action timeline.
// Three consecutive axon.search calls collapse into one group, followed by a
// running axon.crawl and a failed fs.write — mirroring the Claude Design dsCard.
const now = new Date()
const ago = (start: number, end = 0) => ({
  startedAt: new Date(now.getTime() - start),
  ...(end >= 0 ? { completedAt: new Date(now.getTime() - end) } : {}),
})

const CALLS: ToolCall[] = [
  {
    id: "tc1",
    tool: "axon.search",
    status: "completed",
    args: { query: "serde derive", top_k: 5 },
    result: "5 hits · top score 0.82",
    ...ago(800, 0),
  },
  {
    id: "tc2",
    tool: "axon.search",
    status: "completed",
    args: { query: "derive macro expansion" },
    result: "4 hits",
    ...ago(600, 0),
  },
  {
    id: "tc3",
    tool: "axon.search",
    status: "completed",
    args: { query: "proc-macro" },
    result: "6 hits",
    ...ago(700, 0),
  },
  {
    id: "tc4",
    tool: "axon.crawl",
    status: "running",
    args: { url: "https://docs.rs", depth: 4 },
    startedAt: new Date(now.getTime() - 4100),
  },
  {
    id: "tc5",
    tool: "fs.write",
    status: "error",
    args: { path: "/etc/hosts" },
    result: "EACCES: permission denied",
    ...ago(300, 0),
  },
]

export default function ToolCallsDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / tool-calls"
        heading="ToolCall"
        description="A grouped agent action timeline. Repeated calls to the same tool collapse into a single counted row; each row expands to its structured input and result."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "30px 34px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <ToolCalls calls={CALLS} />
      </section>
    </div>
  )
}
