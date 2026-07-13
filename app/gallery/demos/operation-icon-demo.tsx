"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  OperationIcon,
  type OperationName,
} from "@/registry/aurora/ui/operation-icon"

// ─── CD dsCard demo chrome (ported as local components) ────────────────────────

function Row({ label, names }: { label: string; names: OperationName[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {names.map((n) => (
          <div
            key={n}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              width: 62,
              padding: "10px 4px",
              borderRadius: 10,
              border:
                "1px solid color-mix(in srgb, var(--aurora-border-default) 55%, var(--aurora-page-bg))",
              background:
                "color-mix(in srgb, var(--aurora-page-bg) 30%, var(--aurora-control-surface))",
            }}
          >
            <OperationIcon name={n} size={24} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                color: "var(--aurora-text-muted)",
              }}
            >
              {n.charAt(0).toUpperCase() + n.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function IconOnlyRow({ label, names }: { label: string; names: OperationName[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {names.map((n) => (
          <div
            key={n}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              border:
                "1px solid color-mix(in srgb, var(--aurora-border-default) 55%, var(--aurora-page-bg))",
              background:
                "color-mix(in srgb, var(--aurora-page-bg) 30%, var(--aurora-control-surface))",
            }}
            title={n.charAt(0).toUpperCase() + n.slice(1)}
          >
            <OperationIcon name={n} size={16} aria-label={n} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OperationIconDemo() {
  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="Components"
        heading="OperationIcon"
        description="Axon operation glyph family — tone-coded by operation class (fetch/read cyan, AI/reasoning and async jobs orange)."
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 520,
          padding: "24px 26px",
          borderRadius: 16,
          border: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-page-bg)",
          color: "var(--aurora-text-primary)",
        }}
      >
        <Row
          label="Fetch · read (cyan)"
          names={["scrape", "map", "retrieve", "screenshot", "endpoints"]}
        />
        <Row
          label="Async jobs (orange)"
          names={["crawl", "extract", "embed", "ingest"]}
        />
        <Row
          label="AI / reason (orange)"
          names={["ask", "summarize", "research", "suggest"]}
        />
        <IconOnlyRow
          label="Icon only"
          names={["scrape", "map", "retrieve", "screenshot", "endpoints", "crawl", "extract", "embed", "ingest", "ask", "summarize", "research", "suggest"]}
        />
      </div>
    </div>
  )
}
