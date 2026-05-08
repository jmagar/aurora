"use client"

import React, { useState, useEffect } from "react"
import { AttachmentChip, AttachmentGrid, AttachmentDocCard, AttachmentAudioChip, AttachmentUploadProgress, AttachmentDragZone } from "@/registry/aurora/blocks/attachment/attachment"
import type { AttachmentGridItem } from "@/registry/aurora/blocks/attachment/attachment"

const GRID_ITEMS: AttachmentGridItem[] = [
  { id: "img1", name: "hero-banner.png", size: 248000, url: "https://picsum.photos/seed/a1/300/300", mediaType: "image" },
  { id: "img2", name: "aurora-tokens.png", size: 87400, url: "https://picsum.photos/seed/a2/300/300", mediaType: "image" },
  { id: "img3", name: "dashboard-wireframe.png", size: 194200, url: "https://picsum.photos/seed/a3/300/300", mediaType: "image" },
]

const INITIAL_CHIPS = [
  { id: "c1", name: "gateway.toml", size: 2400 },
  { id: "c2", name: "auth-middleware.ts", size: 6144 },
  { id: "c3", name: "connection-pool.ts", size: 3800 },
]

const INITIAL_UPLOADS = [
  { id: "u1", name: "design-tokens.fig", progress: 100 },
  { id: "u2", name: "aurora-brand-v3.pdf", progress: 72 },
  { id: "u3", name: "component-library.zip", progress: 34 },
]

export default function AttachmentDemo() {
  const [chips, setChips] = useState(INITIAL_CHIPS)
  const [gridItems, setGridItems] = useState(GRID_ITEMS)
  const [uploads, setUploads] = useState(INITIAL_UPLOADS)

  useEffect(() => {
    const interval = setInterval(() => {
      setUploads((prev) => prev.map((u) => u.progress < 100 ? { ...u, progress: Math.min(100, u.progress + 3) } : u))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aurora-space-8)", padding: "var(--aurora-space-8) var(--aurora-space-4)" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--aurora-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Attachment</h2>

      <div>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "10px", fontWeight: 500 }}>AttachmentChip - dismissible file pills</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {chips.map((c) => <AttachmentChip key={c.id} name={c.name} size={c.size} onDismiss={() => setChips((prev) => prev.filter((x) => x.id !== c.id))} />)}
          {chips.length === 0 && <button onClick={() => setChips(INITIAL_CHIPS)} style={{ padding: "4px 10px", background: "var(--aurora-control-surface)", border: "1px solid var(--aurora-border-default)", borderRadius: "8px", color: "var(--aurora-text-muted)", fontSize: "12px", cursor: "pointer" }}>Reset</button>}
        </div>
      </div>

      <div>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "10px", fontWeight: 500 }}>AttachmentGrid - image thumbnails with hover overlay</p>
        {gridItems.length > 0 ? (
          <div style={{ maxWidth: "360px" }}><AttachmentGrid items={gridItems} columns={3} onRemove={(id) => setGridItems((prev) => prev.filter((i) => i.id !== id))} /></div>
        ) : (
          <button onClick={() => setGridItems(GRID_ITEMS)} style={{ padding: "6px 14px", background: "var(--aurora-control-surface)", border: "1px solid var(--aurora-border-default)", borderRadius: "8px", color: "var(--aurora-text-muted)", fontSize: "12px", cursor: "pointer" }}>Reset grid</button>
        )}
      </div>

      <div>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "10px", fontWeight: 500 }}>AttachmentDocCard - PDF and generic document cards</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <AttachmentDocCard name="aurora-spec-v2.pdf" size={2458624} pageCount={48} onOpen={() => window.alert("Opening PDF")} />
          <AttachmentDocCard name="CHANGELOG.md" size={32768} onDismiss={() => {}} onOpen={() => window.alert("Opening markdown")} />
          <AttachmentDocCard name="component-tokens.json" size={87040} onDismiss={() => {}} />
        </div>
      </div>

      <div>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "10px", fontWeight: 500 }}>AttachmentAudioChip - audio player with animated waveform (press play)</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <AttachmentAudioChip title="design-review-notes.m4a" duration="4:32" waveform={[0.6, 0.9, 0.4, 0.8, 0.5]} />
          <AttachmentAudioChip title="standup-recording.mp3" duration="12:07" waveform={[0.7, 0.5, 1.0, 0.6, 0.8]} />
        </div>
      </div>

      <div>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "10px", fontWeight: 500 }}>AttachmentUploadProgress - live progress bars (animated)</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "420px" }}>
          {uploads.map((u) => (
            <AttachmentUploadProgress key={u.id} name={u.name} progress={u.progress} onCancel={u.progress < 100 ? () => setUploads((prev) => prev.filter((x) => x.id !== u.id)) : undefined} />
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "10px", fontWeight: 500 }}>AttachmentDragZone - drag-and-drop upload area</p>
        <AttachmentDragZone label="Drop files to attach" sublabel="Supports images, PDFs, source files" onFiles={(files) => window.alert(files.length + " files dropped")} />
      </div>
    </div>
  )
}
