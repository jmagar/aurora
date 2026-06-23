"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Loader } from "@/registry/aurora/blocks/ai/elements/loader"

function Row({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
          width: 64,
        }}
      >
        {name}
      </span>
      {children}
    </div>
  )
}

export default function AiLoaderDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Loader"
        description="Thinking indicator — icon-only by default: spinner / dots / bars / pulse."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Row name="spinner">
          <Loader />
        </Row>
        <Row name="dots">
          <Loader variant="dots" />
        </Row>
        <Row name="bars">
          <Loader variant="bars" tone="accent" />
        </Row>
        <Row name="pulse">
          <Loader variant="pulse" />
        </Row>
        <Row name="labelled">
          <Loader variant="dots" label="Searching 4,198 chunks…" />
        </Row>
      </section>
    </div>
  )
}
