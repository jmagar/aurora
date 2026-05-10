"use client"

import * as React from "react"
import { Accordion, AccordionItem } from "@/registry/aurora/ui/accordion"
import { Badge } from "@/registry/aurora/ui/badge"

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

export default function AccordionDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: "32px 0" }}>
      <div>
        <h2 style={heading}>Accordion</h2>
        <p style={copy}>Disclosure sections for compact configuration, agent evidence, and command output.</p>
      </div>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Registry install</h3>
        <Accordion>
          <AccordionItem title="Install command" meta="ready" defaultOpen>
            <code className="aurora-text-code">npx shadcn add ... aurora-accordion</code>
          </AccordionItem>
          <AccordionItem title="Registry dependencies" meta="1 dependency">
            <div style={{ display: "flex", gap: 8 }}>
              <Badge>lucide-react</Badge>
            </div>
          </AccordionItem>
          <AccordionItem title="Usage guidance" meta="operator UI">
            <p style={copy}>Use accordions for secondary details. Do not hide the primary action or required status behind disclosure.</p>
          </AccordionItem>
        </Accordion>
      </section>

      <section style={panel}>
        <h3 style={{ ...heading, fontSize: 17 }}>Agent run details</h3>
        <Accordion>
          <AccordionItem title="Plan" meta="3 steps">
            <p style={copy}>Inspect workspace, patch focused files, run verification.</p>
          </AccordionItem>
          <AccordionItem title="Tool output" meta="completed">
            <p style={copy}>All gallery routes opened successfully in agent-browser.</p>
          </AccordionItem>
          <AccordionItem title="Residual risk" meta="low">
            <p style={copy}>Visual polish still benefits from human review after new components are added.</p>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
