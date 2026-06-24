"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Plus, Send, Settings, Trash2, RefreshCw, Copy, Download } from "lucide-react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

/* Mirrors the Claude Design Button preview 1:1 — 8 intents · 4 sizes ·
   icons / loading / icon-only · states / block — rendered with the registry Button. */

function AsyncButton() {
  const [loading, setLoading] = React.useState(false)
  const run = () => {
    if (loading) return
    setLoading(true)
    setTimeout(() => setLoading(false), 1400)
  }
  return (
    <Button variant="rose" loading={loading} onClick={run} iconLeft={<Send className="size-3.5" aria-hidden />}>
      Send message
    </Button>
  )
}

export default function ButtonsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Button"
        description="Operator-grade action controls — lit-outline border + glow, never a flooded fill. Eight intents, four sizes, icons, loading, pulse, and block."
      />

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Intents</div>
        <div className="aurora-demo-row">
          <Button variant="aurora">Deploy now</Button>
          <Button variant="aurora">Add gateway</Button>
          <Button variant="neutral">Cancel</Button>
          <Button variant="success">Apply</Button>
          <Button variant="warn">Force redeploy</Button>
          <Button variant="rose">Send message</Button>
          <Button variant="ghost">View logs</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Sizes</div>
        <div className="aurora-demo-row aurora-demo-row--end">
          <Button variant="aurora" size="sm">Deploy</Button>
          <Button variant="aurora">Deploy</Button>
          <Button variant="aurora" size="lg">Deploy</Button>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Icons · loading · icon-only</div>
        <div className="aurora-demo-row">
          <Button variant="aurora" iconLeft={<Plus className="size-3.5" aria-hidden />}>Add gateway</Button>
          <AsyncButton />
          <Button variant="success">Apply</Button>
          <Button variant="neutral" size="icon" aria-label="Settings"><Settings className="size-4" aria-hidden /></Button>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Icon only</div>
        <div className="aurora-demo-row">
          <Button variant="aurora" size="icon" aria-label="Add"><Plus className="size-4" aria-hidden /></Button>
          <Button variant="rose" size="icon" aria-label="Send"><Send className="size-4" aria-hidden /></Button>
          <Button variant="neutral" size="icon" aria-label="Settings"><Settings className="size-4" aria-hidden /></Button>
          <Button variant="ghost" size="icon" aria-label="Copy"><Copy className="size-4" aria-hidden /></Button>
          <Button variant="ghost" size="icon" aria-label="Refresh"><RefreshCw className="size-4" aria-hidden /></Button>
          <Button variant="ghost" size="icon" aria-label="Download"><Download className="size-4" aria-hidden /></Button>
          <Button variant="destructive" size="icon" aria-label="Delete"><Trash2 className="size-4" aria-hidden /></Button>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">States · block</div>
        <div className="aurora-demo-row" style={{ alignItems: "flex-start" }}>
          <Button variant="aurora" pulse>Pulse</Button>
          <Button variant="aurora" disabled>Disabled</Button>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Button variant="aurora" block>Block · full width</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
