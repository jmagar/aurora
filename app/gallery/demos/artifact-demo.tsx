"use client"

import React from "react"
import { Artifact } from "@/registry/aurora/blocks/ai/artifact/artifact"

// Mirrors the Claude Design `Artifact.dsCard` composition 1:1:
//   <Artifact variant="panel" title="deploy.rs" language="rust" code={...} />
//   <Artifact variant="inline" title="restart" language="bash" code="$ labby restart plex --wait" />
const RUST_CODE = `fn main() {
    let gw = Gateway::connect("labby.local:8765")?;
    gw.deploy("plex").await?;
}`

export default function ArtifactDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
        padding: "24px 30px",
        boxSizing: "border-box",
      }}
    >
      <Artifact
        variant="panel"
        title="deploy.rs"
        language="rust"
        code={RUST_CODE}
      />
      <Artifact
        variant="inline"
        title="restart"
        language="bash"
        code="$ labby restart plex --wait"
      />
    </div>
  )
}
