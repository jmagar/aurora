"use client";

import * as React from "react";
import { GalleryPageIntro } from "@/components/gallery-page-intro";
import {
  FilterBar,
  FilterSearch,
  FilterTag,
  FilterTagRose,
} from "@/registry/aurora/ui/filter-bar";

export default function FiltersDemo() {
  const [query, setQuery] = React.useState("prod");
  const [showScope, setShowScope] = React.useState(true);
  const [showStatus, setShowStatus] = React.useState(true);
  const [showRegion, setShowRegion] = React.useState(true);
  const [showSource, setShowSource] = React.useState(true);

  const activeCount = [showScope, showStatus, showRegion, showSource].filter(Boolean)
    .length;

  function clearAll() {
    setQuery("");
    setShowScope(false);
    setShowStatus(false);
    setShowRegion(false);
    setShowSource(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="Filters"
        description="A denser filter composition for workflow screens, with removable chips, live counts, and an empty state after clear-all."
      />

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "28px 24px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
        }}
      >
        <FilterBar
          onClearAll={clearAll}
          showClearAll={activeCount > 0 || query.length > 0}
        >
          <FilterSearch
            placeholder="Search gateways…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
          />

          {showScope && (
            <FilterTag onRemove={() => setShowScope(false)}>
              Scope: Production
            </FilterTag>
          )}

          {showStatus && (
            <FilterTagRose onRemove={() => setShowStatus(false)}>
              Status: Live
            </FilterTagRose>
          )}

          {showRegion && (
            <FilterTagRose onRemove={() => setShowRegion(false)}>
              Region: EU
            </FilterTagRose>
          )}

          {showSource && (
            <FilterTagRose onRemove={() => setShowSource(false)}>
              Source: Edge Mesh
            </FilterTagRose>
          )}
        </FilterBar>

        <p
          className="aurora-text-body-sm"
          style={{
            color: "var(--aurora-text-muted)",
            margin: 0,
          }}
        >
          {activeCount > 0 || query
            ? `${activeCount} filters active across ${query ? "the current search." : "the gateway set."}`
            : "All filters cleared. The list is back to its default state."}
        </p>
      </section>
    </div>
  );
}
