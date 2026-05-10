"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Clock3, GitBranch, Plus, Send, Trash2 } from "lucide-react"

const section: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "32px",
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
}

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "12px",
}

const label: React.CSSProperties = {
  fontSize: "var(--aurora-type-label)",
  fontFamily: "var(--aurora-font-sans)",
  fontWeight: "var(--aurora-weight-label)",
  color: "var(--aurora-text-muted)",
  letterSpacing: "var(--aurora-letter-label)",
  marginBottom: "8px",
}

const divider: React.CSSProperties = {
  height: "1px",
  background: "var(--aurora-border-default)",
  margin: "4px 0",
}

const heading: React.CSSProperties = {
  fontSize: "18px",
  fontFamily: "var(--aurora-font-display)",
  fontWeight: 600,
  color: "var(--aurora-text-primary)",
  marginBottom: "4px",
}

const subheading: React.CSSProperties = {
  fontSize: "13px",
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--aurora-font-sans)",
  marginBottom: "24px",
}

export default function ButtonsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "32px 0" }}>
      <div>
        <h2 style={heading}>Button</h2>
        <p style={subheading}>
          Operator-grade action controls with restrained surfaces, crisp borders, and low-noise focus states.
        </p>
      </div>

      <div style={section}>
        <div style={label}>Variants</div>
        <div style={row}>
          <Button variant="aurora">Add gateway</Button>
          <Button variant="neutral">Cancel</Button>
          <Button variant="rose">Send message</Button>
          <Button variant="ghost">View logs</Button>
          <Button variant="destructive">Delete environment</Button>
        </div>
      </div>

      <div style={section}>
        <div style={label}>Sizes — aurora variant</div>
        <div style={{ ...row, alignItems: "flex-end" }}>
          <Button variant="aurora" size="sm">Deploy agent</Button>
          <Button variant="aurora" size="default">Deploy agent</Button>
          <Button variant="aurora" size="lg">Deploy agent</Button>
        </div>
      </div>

      <div style={section}>
        <div style={label}>Sizes — neutral variant</div>
        <div style={{ ...row, alignItems: "flex-end" }}>
          <Button variant="neutral" size="sm">Cancel</Button>
          <Button variant="neutral" size="default">Cancel</Button>
          <Button variant="neutral" size="lg">Cancel</Button>
        </div>
      </div>

      <div style={section}>
        <div style={label}>Common action pairings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div style={{ ...label, marginBottom: "8px" }}>Gateway provisioning</div>
            <div style={row}>
              <Button variant="aurora">Provision gateway</Button>
              <Button variant="neutral">Configure later</Button>
            </div>
          </div>
          <div style={divider} />
          <div>
            <div style={{ ...label, marginBottom: "8px" }}>Environment management</div>
            <div style={row}>
              <Button variant="aurora">Create environment</Button>
              <Button variant="neutral">Import config</Button>
              <Button variant="ghost">View template</Button>
            </div>
          </div>
          <div style={divider} />
          <div>
            <div style={{ ...label, marginBottom: "8px" }}>Destructive flows</div>
            <div style={row}>
              <Button variant="destructive">Terminate agent</Button>
              <Button variant="neutral">Keep running</Button>
            </div>
          </div>
          <div style={divider} />
          <div>
            <div style={{ ...label, marginBottom: "8px" }}>Agent actions</div>
            <div style={row}>
              <Button variant="rose">Escalate to human</Button>
              <Button variant="ghost">View trace</Button>
              <Button variant="neutral">Pause agent</Button>
            </div>
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={label}>Disabled states</div>
        <div style={row}>
          <Button variant="aurora" disabled>Add gateway</Button>
          <Button variant="neutral" disabled>Cancel</Button>
          <Button variant="rose" disabled>Send message</Button>
          <Button variant="ghost" disabled>View logs</Button>
          <Button variant="destructive" disabled>Delete environment</Button>
        </div>
      </div>

      <div style={section}>
        <div style={label}>With icons</div>
        <div style={row}>
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
