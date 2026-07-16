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
    <Button variant="rose" loading={loading} onClick={run} iconLeft={<Send aria-hidden />}>
      Send Message
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
          <Button variant="aurora">Deploy Now</Button>
          <Button variant="aurora">Add Gateway</Button>
          <Button variant="neutral">Cancel</Button>
          <Button variant="success">Apply</Button>
          <Button variant="warn">Force Redeploy</Button>
          <Button variant="rose">Send Message</Button>
          <Button variant="ghost">View Logs</Button>
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
          <Button variant="aurora" iconLeft={<Plus aria-hidden />}>Add Gateway</Button>
          <AsyncButton />
          <Button variant="success" iconRight={<Download aria-hidden />}>Export</Button>
          <Button variant="neutral" size="icon" aria-label="Settings" iconLeft={<Settings aria-hidden />} />
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Icon only</div>
        <div className="aurora-demo-row">
          <Button variant="aurora" size="icon" aria-label="Add" iconLeft={<Plus aria-hidden />} />
          <Button variant="rose" size="icon" aria-label="Send" iconLeft={<Send aria-hidden />} />
          <Button variant="neutral" size="icon" aria-label="Settings" iconLeft={<Settings aria-hidden />} />
          <Button variant="ghost" size="icon" aria-label="Copy" iconLeft={<Copy aria-hidden />} />
          <Button variant="ghost" size="icon" aria-label="Refresh" iconLeft={<RefreshCw aria-hidden />} />
          <Button variant="ghost" size="icon" aria-label="Download" iconLeft={<Download aria-hidden />} />
          <Button variant="destructive" size="icon" aria-label="Delete" iconLeft={<Trash2 aria-hidden />} />
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">States · block</div>
        <div className="aurora-demo-row" style={{ alignItems: "flex-start" }}>
          <Button variant="aurora" pulse>Pulse</Button>
          <Button variant="aurora" filled>Primary Fill</Button>
          <Button variant="aurora" disabled>Disabled</Button>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Button variant="aurora" block>Block · Full Width</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
