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
  const [query, setQuery] = React.useState("serde")
  const [showScope, setShowScope] = React.useState(true)
  const [showStatus, setShowStatus] = React.useState(true)
  const [showSource, setShowSource] = React.useState(true)

  const selectedCount = [showScope, showStatus, showSource].filter(Boolean).length

  function clearAll() {
    setQuery("")
    setShowScope(false)
    setShowStatus(false)
    setShowSource(false)
  }

  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components"
        heading="FilterBar"
        description="Search · tags · clear all — a composable filter row with an inline search field, accent and rose tag pills, and a clear-all affordance."
      />

      <section
        className="grid gap-4"
        style={{
          padding: "40px 30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <FilterBar
          showClearAll={Boolean(query || selectedCount)}
          onClearAll={clearAll}
        >
          <FilterSearch
            placeholder="Filter results…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
          />
          {showScope ? (
            <FilterTag onRemove={() => setShowScope(false)}>
              Scope: Registry
            </FilterTag>
          ) : null}
          {showStatus ? (
            <FilterTagRose onRemove={() => setShowStatus(false)}>
              Status: Indexed
            </FilterTagRose>
          ) : null}
          {showSource ? (
            <FilterTagRose onRemove={() => setShowSource(false)}>
              Source: Docs.rs
            </FilterTagRose>
          ) : null}
        </FilterBar>

        <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)", margin: 0 }}>
          {selectedCount > 0
            ? `${selectedCount} filters active${query ? " with a query applied." : "."}`
            : "No filters selected."}
        </p>
      </section>
    </div>
  )
}
