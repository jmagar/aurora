"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { ButtonGroup } from "@/registry/aurora/ui/button-group"

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

// CD .gi segment styling (ButtonGroup.dsCard.html) ported as a local component.
const segment: React.CSSProperties = {
  height: 28,
  padding: "0 14px",
  border: "none",
  background: "none",
  color: "var(--aurora-text-muted)",
  font: "560 13px var(--font-sans)",
  borderRadius: 7,
  cursor: "pointer",
}

const segmentActive: React.CSSProperties = {
  color: "var(--aurora-accent-strong)",
  background:
    "color-mix(in srgb, var(--aurora-accent-primary) 14%, var(--aurora-control-surface))",
  boxShadow:
    "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent)",
}

const views = ["list", "board", "graph"] as const

export default function ButtonGroupDemo() {
  const [view, setView] = React.useState<(typeof views)[number]>("list")

  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Button group</h2>
        <p style={copy}>Segmented container with a shared outline for related, mutually exclusive choices.</p>
      </div>

      <ButtonGroup>
        {views.map((k) => {
          const pressed = view === k
          return (
            <Button variant="plain" size="unstyled"
              key={k}
              type="button"
              aria-pressed={pressed}
              onClick={() => setView(k)}
              style={pressed ? { ...segment, ...segmentActive } : segment}
            >
              {k}
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
  )
}
