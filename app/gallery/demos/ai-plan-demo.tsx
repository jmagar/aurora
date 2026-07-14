"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Plan } from "@/registry/aurora/blocks/ai/elements/plan"

/* Mirrors the Claude Design "Plan" preview 1:1 — titled execution-plan card with
   a rose progress bar and a vertical status rail (done / in-progress / pending),
   rendered with the registry Plan component. */

export default function AiPlanDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Plan"
        description="Execution plan — rail, progress bar, per-step status & detail."
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
          <Plan
            title="Ingest Run"
            steps={[
              { label: "Crawl Docs", status: "done", detail: "412 pages · 1.2s" },
              { label: "Embed Chunks", status: "inprog", detail: "3,180 / 8,004" },
              { label: "Build Index", status: "pending" },
              { label: "Answer Query", status: "pending" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
