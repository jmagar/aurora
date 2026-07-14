"use client"

import React from "react"
import { Thinking } from "@/registry/aurora/blocks/ai/thinking/thinking"

// CD dsCard composition (Thinking · reasoning / cot / plan), 1:1.
// A 520-wide reasoning surface with a "Thought for 6s" block and a Plan block.
export default function ThinkingDemo() {
  return (
    <div
      style={{
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
        width: "min(520px, 100%)",
        boxSizing: "border-box",
        padding: "24px 30px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <Thinking
        type="thinking"
        duration={6}
        defaultOpen
        content="The struct derives Serialize, so serde generates the impl at compile time. No runtime reflection is involved."
      />
      <Thinking type="thinking" isStreaming defaultOpen />
      <Thinking
        type="plan"
        defaultOpen
        steps={[
          { label: "Crawl docs.rs", status: "done" },
          { label: "Embed 4 198 chunks", status: "inprog" },
          { label: "Answer with citations", status: "pending" },
        ]}
      />
    </div>
  )
}
