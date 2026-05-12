"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { ButtonGroup } from "@/registry/aurora/ui/button-group"
import { GitBranch, History, Play, RotateCcw } from "lucide-react"

const panel: React.CSSProperties = {
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
  padding: 24,
}

const heading: React.CSSProperties = {
  color: "var(--aurora-text-primary)",
  fontFamily: "var(--aurora-font-display)",
  fontSize: 22,
  fontWeight: 760,
  lineHeight: 1.2,
  marginBottom: 6,
}

const copy: React.CSSProperties = {
  color: "var(--aurora-text-muted)",
  fontSize: 13,
  lineHeight: 1.55,
}

export default function ButtonGroupDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Button group</h2>
        <p style={copy}>Grouped command controls for segmented actions, compact run bars, and related toolbar decisions.</p>
      </div>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Run mode</h3>
        <ButtonGroup>
          <Button variant="aurora" size="sm">
            <Play className="size-3.5" aria-hidden />
            Run
          </Button>
          <Button variant="neutral" size="sm">
            Queue
          </Button>
          <Button variant="neutral" size="sm">
            Schedule
          </Button>
        </ButtonGroup>
      </section>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Repository actions</h3>
        <ButtonGroup>
          <Button variant="neutral" size="sm">
            <GitBranch className="size-3.5" aria-hidden />
            Branch
          </Button>
          <Button variant="neutral" size="sm">
            <RotateCcw className="size-3.5" aria-hidden />
            Rebase
          </Button>
          <Button variant="ghost" size="sm">
            <History className="size-3.5" aria-hidden />
            History
          </Button>
        </ButtonGroup>
      </section>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Vertical stack</h3>
        <ButtonGroup orientation="vertical">
          <Button variant="aurora" size="sm">Approve</Button>
          <Button variant="neutral" size="sm">Defer</Button>
          <Button variant="destructive" size="sm">Reject</Button>
        </ButtonGroup>
      </section>
    </div>
  )
}
