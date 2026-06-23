"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Sandbox } from "@/registry/aurora/blocks/ai/elements/sandbox"

/* Mirrors the Claude Design "Sandbox" preview 1:1 — dev sandbox card with a
   cyan terminal header + RUNNING status, a preview URL bar, runtime chips
   (command / runtime / env / uptime), mounted paths, and log/shell actions,
   rendered with the registry Sandbox component. */

export default function AiSandboxDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Sandbox"
        description="Dev sandbox — status, preview URL, runtime chips, mounted paths."
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-3)",
          border: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-page-bg)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "428px" }}>
          <Sandbox
            title="preview-sandbox"
            status="running"
            command="pnpm dev"
            runtime="Node 20"
            url="https://3000-sandbox-7f1a.labby.dev"
            uptime="4m 12s"
            envCount={8}
            paths={["/workdir/app", "/workdir/.next"]}
          />
        </div>
      </div>
    </div>
  )
}
