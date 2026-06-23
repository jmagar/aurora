"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  FilterBar,
  FilterSearch,
  FilterTag,
  FilterTagRose,
} from "@/registry/aurora/ui/filter-bar"

export default function FilterBarDemo() {
  const [q, setQ] = React.useState("serde")

  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components"
        heading="FilterBar"
        description="Search · tags · clear all — a composable filter row with an inline search field, accent and rose tag pills, and a clear-all affordance."
      />

      <section
        style={{
          padding: "40px 30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <FilterBar showClearAll onClearAll={() => setQ("")}>
          <FilterSearch
            placeholder="Filter results…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onClear={() => setQ("")}
          />
          <FilterTag onRemove={() => {}}>status: 200</FilterTag>
          <FilterTagRose onRemove={() => {}}>type: AI</FilterTagRose>
        </FilterBar>
      </section>
    </div>
  )
}
