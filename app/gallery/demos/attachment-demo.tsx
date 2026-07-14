"use client"

import React, { useState, useEffect } from "react"
import {
  AttachmentChip,
  AttachmentDocCard,
  AttachmentAudioChip,
  AttachmentGrid,
  AttachmentDragZone,
  AttachmentUploadProgress,
} from "@/registry/aurora/blocks/files/attachment/attachment"

const INITIAL_CHIPS = [
  { id: "c1", name: "serde.rs.png", size: 184320 },
  { id: "c2", name: "notes.txt", size: 2048 },
]

const GRID_ITEMS = [
  { id: "g1", name: "chrome-dark.png", size: 284320, url: "/themes/previews/chrome-dark.png", mediaType: "image" as const },
  { id: "g2", name: "warp.png", size: 318720, url: "/themes/previews/warp.png", mediaType: "image" as const },
  { id: "g3", name: "zed.png", size: 224880, url: "/themes/previews/zed.png", mediaType: "image" as const },
]

export default function AttachmentDemo() {
  const [chips, setChips] = useState(INITIAL_CHIPS)
  const [showDoc, setShowDoc] = useState(true)
  const [progress, setProgress] = useState(64)

  // Live-animate the upload bar around the CD's 64% target.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 92 ? 40 : p + 2))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "24px clamp(14px, 5vw, 30px)",
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
        boxSizing: "border-box",
      }}
    >
      {/* Chip row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {chips.map((c) => (
          <AttachmentChip
            key={c.id}
            name={c.name}
            size={c.size}
            onDismiss={() => setChips((prev) => prev.filter((x) => x.id !== c.id))}
          />
        ))}
      </div>

      <div style={{ maxWidth: 360 }}>
        <AttachmentGrid items={GRID_ITEMS} columns={3} />
      </div>

      {/* Doc card + audio chips column */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}>
        {showDoc && (
          <AttachmentDocCard
            name="spec.pdf"
            size={1258291}
            pageCount={12}
            onOpen={() => {}}
            onDismiss={() => setShowDoc(false)}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, maxWidth: "100%" }}>
          <AttachmentAudioChip title="standup.m4a" duration="2:41" />
          <AttachmentAudioChip title="note.m4a" duration="0:48" compact />
        </div>
      </div>

      {/* Upload progress */}
      <AttachmentUploadProgress name="dump.tar.gz" progress={progress} onCancel={() => {}} />

      <AttachmentDragZone label="Drop reference files" sublabel="Images, PDFs, audio, or logs" />
    </div>
  )
}
