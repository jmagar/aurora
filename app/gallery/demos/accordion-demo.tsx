"use client"

import * as React from "react"
import { Accordion, AccordionItem } from "@/registry/aurora/ui/accordion"

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
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Accordion</h2>
        <p style={copy}>Collapsible sections for compact, disclosure-based content.</p>
      </div>

      <div style={{ maxWidth: 480 }}>
        <Accordion>
          <AccordionItem title="Installation" defaultOpen>
            <code className="aurora-text-code">
              npx shadcn@latest add https://aurora.tootie.tv/r/button.json
            </code>
          </AccordionItem>
          <AccordionItem title="Theming">
            Override the .light scope — same tokens, lighter values.
          </AccordionItem>
          <AccordionItem title="Tokens">
            89 CSS custom properties, exported to Android via Style Dictionary.
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
