"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Spinner } from "@/registry/aurora/ui/spinner"

// CD dsCard chrome: a horizontal row of stacked cells.
const stage: React.CSSProperties = {
  background: "var(--aurora-page-bg)",
  color: "var(--aurora-text-primary)",
  boxSizing: "border-box",
  padding: 30,
  display: "flex",
  alignItems: "center",
  gap: 26,
  borderRadius: "var(--aurora-radius-2)",
  border: "1px solid var(--aurora-border-default)",
}

const cell: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
}

const caption: React.CSSProperties = {
  fontFamily: "var(--aurora-font-sans)",
  fontSize: 10.5,
  fontWeight: 560,
  color: "var(--aurora-text-muted)",
}

export default function SpinnerDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Spinner"
        description="Compact loading indicators for registry refreshes, agent runs, and background verification."
      />

      <section style={stage}>
        <div style={cell}>
          <Spinner size={16} tone="cyan" />
          <span style={caption}>16</span>
        </div>
        <div style={cell}>
          <Spinner size={24} tone="cyan" />
          <span style={caption}>24</span>
        </div>
        <div style={cell}>
          <Spinner size={34} thickness={3} tone="muted" />
          <span style={caption}>34</span>
        </div>
        <div style={cell}>
          <Spinner size={24} tone="rose" />
          <span style={caption}>rose</span>
        </div>
      </section>
    </div>
  )
}
