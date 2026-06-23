"use client"

import type { CSSProperties } from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { ScrollArea } from "@/registry/aurora/ui/scroll-area"

// CD-parity composition for the ScrollArea primitive: a bordered viewport capped
// at 200px with a thin scrollbar, scrolling 24 mono "edge" log rows. Each row uses
// the dsCard `.r` chrome (9px/12px padding, bottom rule, 12px mono, muted text).
const rowStyle: CSSProperties = {
  padding: "9px 12px",
  borderBottom: "1px solid var(--aurora-border-default)",
  font: "12px var(--aurora-font-mono)",
  color: "var(--aurora-text-muted)",
}

export default function ScrollAreaDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components / scroll-area"
        heading="ScrollArea"
        description="Bordered viewport · thin scrollbar"
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "24px 30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <ScrollArea maxHeight={200}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} style={rowStyle}>
              edge-{String(i + 1).padStart(2, "0")} · 200 OK · {30 + i}ms
            </div>
          ))}
        </ScrollArea>
      </section>
    </div>
  )
}
