"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Badge } from "@/registry/aurora/ui/badge"
import { ResizablePanels } from "@/registry/aurora/ui/resizable-panels"

export default function ResizablePanelsDemo() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Layout"
        heading="Resizable Panels"
        description="Two-pane workbench layout for a navigator plus details view. The divider is keyboard-adjustable, so the demo exercises real sizing instead of a static mock."
      />
      <ResizablePanels style={{ minHeight: 320 }}>
        <section style={{ display: "grid", gap: 12, padding: 16 }}>
          <div className="flex items-center justify-between gap-3">
            <span className="aurora-text-section">Deploy Queue</span>
            <Badge tone="info">4 Pending</Badge>
          </div>
          <div className="grid gap-2">
            {[
              ["edge-1", "Healthy"],
              ["edge-2", "Waiting on smoke"],
              ["edge-3", "Blocked by 502"],
              ["edge-4", "Canary active"],
            ].map(([name, state], index) => (
              <div
                key={name}
                className="grid gap-1 rounded-[12px] border px-3 py-2"
                style={{
                  borderColor: index === 2 ? "var(--aurora-error-border)" : "var(--aurora-border-default)",
                  background: index === 2 ? "var(--aurora-error-surface)" : "var(--aurora-control-surface)",
                }}
              >
                <span className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{name}</span>
                <span className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>{state}</span>
              </div>
            ))}
          </div>
        </section>
        <section style={{ display: "grid", gap: 14, padding: 16 }}>
          <div className="flex items-center justify-between gap-3">
            <span className="aurora-text-section">Selected Run</span>
            <Badge tone="warn">Needs Review</Badge>
          </div>
          <div className="grid gap-2 rounded-[16px] border p-4" style={{ borderColor: "var(--aurora-border-default)", background: "var(--aurora-panel-strong)" }}>
            <span className="aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>Rollout</span>
            <span className="aurora-text-body" style={{ color: "var(--aurora-text-primary)" }}>edge-3 canary / eu-west / 17 shards</span>
          </div>
          <div className="grid gap-2 rounded-[16px] border p-4" style={{ borderColor: "var(--aurora-border-default)", background: "var(--aurora-panel-strong)" }}>
            <span className="aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>Latest Event</span>
            <span className="aurora-text-body" style={{ color: "var(--aurora-text-primary)" }}>Gateway returned 502 for the readiness probe after the second drain cycle.</span>
          </div>
        </section>
      </ResizablePanels>
    </div>
  )
}
