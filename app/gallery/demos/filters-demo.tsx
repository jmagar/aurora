"use client";

import * as React from "react";
import {
  FilterBar,
  FilterSearch,
  FilterTag,
  FilterTagRose,
} from "@/registry/aurora/ui/filter-bar";

export default function FiltersDemo() {
  const [query, setQuery] = React.useState("prod");
  const [showStatus, setShowStatus] = React.useState(true);
  const [showRegion, setShowRegion] = React.useState(true);
  const [showVersion, setShowVersion] = React.useState(true);

  const hasFilters = showStatus || showRegion || showVersion;

  function clearAll() {
    setQuery("");
    setShowStatus(false);
    setShowRegion(false);
    setShowVersion(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
        }}
      >
        Gateway Filter Bar
      </p>

      <FilterBar
        onClearAll={clearAll}
        showClearAll={hasFilters || query.length > 0}
      >
        <FilterSearch
          placeholder="Search gateways…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
        />

        {showStatus && (
          <FilterTag onRemove={() => setShowStatus(false)}>
            Status: Live
          </FilterTag>
        )}

        {showRegion && (
          <FilterTagRose onRemove={() => setShowRegion(false)}>
            Region: EU
          </FilterTagRose>
        )}

        {showVersion && (
          <FilterTag onRemove={() => setShowVersion(false)}>
            Version: v2.4
          </FilterTag>
        )}
      </FilterBar>

      {!hasFilters && !query && (
        <p
          style={{
            fontSize: 13,
            color: "var(--aurora-text-muted)",
            fontStyle: "italic",
          }}
        >
          All filters cleared — use the controls above to restore them.
        </p>
      )}
    </div>
  );
}
