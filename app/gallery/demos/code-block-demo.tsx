"use client"

import React from "react"
import { CodeBlock } from "@/registry/aurora/blocks/workspace/code-block/code-block"

// Mirrors the Claude Design CodeBlock dsCard: a single bash command block with
// the language label ("bash") and a copy affordance, rendered on the mono surface.
const INSTALL_CODE = `npx shadcn@latest add \\\\
  https://aurora.tootie.tv/r/button.json`

export default function CodeBlockDemo() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        padding: "var(--aurora-space-8) var(--aurora-space-6)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </div>
    </div>
  )
}
