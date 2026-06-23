"use client"

import React, { useState, useEffect } from "react"
import {
  AttachmentChip,
  AttachmentDocCard,
  AttachmentAudioChip,
  AttachmentUploadProgress,
} from "@/registry/aurora/blocks/files/attachment/attachment"

const INITIAL_CHIPS = [
  { id: "c1", name: "serde.rs.png", size: 184320 },
  { id: "c2", name: "notes.txt", size: 2048 },
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
        padding: "24px 30px",
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

      {/* Doc card + audio chips column */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {showDoc && (
          <AttachmentDocCard
            name="spec.pdf"
            size={1258291}
            pageCount={12}
            onOpen={() => {}}
            onDismiss={() => setShowDoc(false)}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <AttachmentAudioChip title="standup.m4a" duration="2:41" />
          <AttachmentAudioChip title="note.m4a" duration="0:48" compact />
        </div>
      </div>

      {/* Upload progress */}
      <AttachmentUploadProgress name="dump.tar.gz" progress={progress} onCancel={() => {}} />
    </div>
  )
}
