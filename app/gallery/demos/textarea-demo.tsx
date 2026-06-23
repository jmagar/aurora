"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Textarea } from "@/registry/aurora/ui/textarea"

/** Field label — mirrors the CD dsCard `.lbl` chrome (12px / 560 / primary). */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        margin: "0 0 8px",
        fontSize: 12,
        fontWeight: 560,
        color: "var(--aurora-text-primary)",
      }}
    >
      {children}
    </label>
  )
}

/** Reproduces the Claude Design `Textarea.dsCard` composition 1:1. */
function CdCard() {
  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "28px 30px",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: 14,
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
      }}
    >
      <FieldLabel>Task for the agent</FieldLabel>
      <Textarea
        autoGrow
        showCount
        maxLength={280}
        defaultValue="Crawl docs.rs/serde, embed the pages, and summarize how the derive macro expands."
        placeholder="Describe the task…"
      />
    </div>
  )
}

export default function TextareaDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Forms"
        heading="Textarea"
        description="Multi-line input that auto-grows to fit its content, with an optional live character counter pinned to the corner. Focus lifts a cyan glow ring; validation states recolor the border."
      />

      <CdCard />
    </div>
  )
}
