"use client"

import React, { useState } from "react"
import { Terminal, TerminalLine } from "@/registry/aurora/blocks/navigation/terminal/terminal"

// ---------------------------------------------------------------------------
// CD dsCard composition (1:1): axon · in-process — a streaming crawl + ask log.
//   cmd     → command   comment → muted    info → info
//   warn    → warn      success → success  out  → output
// ---------------------------------------------------------------------------

const AXON_LINES: TerminalLine[] = [
  { text: "axon crawl https://docs.rs --wait", type: "command" },
  { text: "→ 202 job ca8cb383 · depth 4 · max 500", type: "muted" },
  { text: "  fetch docs.rs/serde → 200 · 9 links", type: "info" },
  { text: "  retry docs.rs/syn → 429 · backoff 2s", type: "warn" },
  { text: "  embed batch 1 · 18 chunks → axon", type: "info" },
  { text: "  ✓ 642 pages · 4 198 chunks indexed", type: "success" },
  { text: "", type: "output" },
  { text: 'axon ask "how does serde derive work?"', type: "command" },
  {
    text: "Serde derive generates impls at compile time — no runtime reflection.",
    type: "output",
  },
]

export default function TerminalDemo() {
  const [lines, setLines] = useState<TerminalLine[]>(AXON_LINES)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-6)",
        padding: "var(--aurora-space-8) var(--aurora-space-4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <h2
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Terminal
        </h2>
        <span
          style={{
            fontFamily: "var(--aurora-font-mono)",
            fontSize: "11px",
            color: "var(--aurora-text-muted)",
          }}
        >
          Streaming log · status · cursor
        </span>
      </div>

      <Terminal
        title="axon · in-process"
        status="connected"
        lines={lines}
        onClear={() => setLines([])}
      />
    </div>
  )
}
