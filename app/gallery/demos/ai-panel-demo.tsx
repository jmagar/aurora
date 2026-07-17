"use client"

import * as React from "react"
import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Panel } from "@/registry/aurora/blocks/ai/elements/panel"

// CD-parity composition for the Panel AI element: a generic card with a
// tone-tinted icon tile, an uppercase eyebrow above the title, a trailing
// actions slot, body content and a footer rule.
export default function AiPanelDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / panel"
        heading="Panel"
        description="Generic AI-element card — icon/eyebrow/title header, actions slot and footer."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "11px",
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Panel
          eyebrow="Inspector"
          title="Request"
          tone="cyan"
          icon={Plus}
          actions={
            <Button variant="plain" size="unstyled" className="aurora-ael__btn icon sm" type="button" aria-label="Refresh" title="Refresh">
              <RefreshCw size={13} strokeWidth={1.6} aria-hidden />
            </Button>
          }
          footer="Last updated 12s ago"
        >
          Drop any content into the Panel body — it inherits the AI-element surface, recessed border
          and inset top highlight.
        </Panel>
      </section>
    </div>
  )
}
