"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { OpenInChat } from "@/registry/aurora/blocks/ai/elements/open-in-chat"

export default function AiOpenInChatDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / open-in-chat"
        heading="OpenInChat"
        description="Hand-off to chat — rose / outline / ghost, sizes."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "24px 26px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <OpenInChat />
          <OpenInChat variant="outline">Debug in Chat</OpenInChat>
        </div>
        <OpenInChat variant="ghost" size="sm">
          Ask About This
        </OpenInChat>
      </section>
    </div>
  )
}
