"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Clock3, GitBranch, Plus, Send, Trash2 } from "lucide-react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

export default function ButtonsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Button"
        description="Operator-grade action controls with restrained surfaces, crisp borders, and low-noise focus states."
      />

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Variants</div>
        <div className="aurora-demo-row">
          <Button variant="aurora">Add gateway</Button>
          <Button variant="neutral">Cancel</Button>
          <Button variant="rose">Send message</Button>
          <Button variant="ghost">View logs</Button>
          <Button variant="destructive">Delete environment</Button>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Sizes — aurora variant</div>
        <div className="aurora-demo-row aurora-demo-row--end">
          <Button variant="aurora" size="sm">Deploy agent</Button>
          <Button variant="aurora" size="default">Deploy agent</Button>
          <Button variant="aurora" size="lg">Deploy agent</Button>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Sizes — neutral variant</div>
        <div className="aurora-demo-row aurora-demo-row--end">
          <Button variant="neutral" size="sm">Cancel</Button>
          <Button variant="neutral" size="default">Cancel</Button>
          <Button variant="neutral" size="lg">Cancel</Button>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Common action pairings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div className="aurora-demo-label" style={{ marginBottom: "8px" }}>Gateway provisioning</div>
            <div className="aurora-demo-row">
              <Button variant="aurora">Provision gateway</Button>
              <Button variant="neutral">Configure later</Button>
            </div>
          </div>
          <div className="aurora-demo-divider" />
          <div>
            <div className="aurora-demo-label" style={{ marginBottom: "8px" }}>Environment management</div>
            <div className="aurora-demo-row">
              <Button variant="aurora">Create environment</Button>
              <Button variant="neutral">Import config</Button>
              <Button variant="ghost">View template</Button>
            </div>
          </div>
          <div className="aurora-demo-divider" />
          <div>
            <div className="aurora-demo-label" style={{ marginBottom: "8px" }}>Destructive flows</div>
            <div className="aurora-demo-row">
              <Button variant="destructive">Terminate agent</Button>
              <Button variant="neutral">Keep running</Button>
            </div>
          </div>
          <div className="aurora-demo-divider" />
          <div>
            <div className="aurora-demo-label" style={{ marginBottom: "8px" }}>Agent actions</div>
            <div className="aurora-demo-row">
              <Button variant="rose">Escalate to human</Button>
              <Button variant="ghost">View trace</Button>
              <Button variant="neutral">Pause agent</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">Disabled states</div>
        <div className="aurora-demo-row">
          <Button variant="aurora" disabled>Add gateway</Button>
          <Button variant="neutral" disabled>Cancel</Button>
          <Button variant="rose" disabled>Send message</Button>
          <Button variant="ghost" disabled>View logs</Button>
          <Button variant="destructive" disabled>Delete environment</Button>
        </div>
      </div>

      <div className="aurora-demo-section">
        <div className="aurora-demo-label">With icons</div>
        <div className="aurora-demo-row">
          <Button variant="aurora">
            <Plus className="size-3.5" aria-hidden />
            New agent
          </Button>
          <Button variant="neutral">
            <GitBranch className="size-3.5" aria-hidden />
            Deploy
          </Button>
          <Button variant="ghost">
            <Clock3 className="size-3.5" aria-hidden />
            View history
          </Button>
          <Button variant="rose">
            <Send className="size-3.5" aria-hidden />
            Send update
          </Button>
          <Button variant="destructive">
            <Trash2 className="size-3.5" aria-hidden />
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  )
}
