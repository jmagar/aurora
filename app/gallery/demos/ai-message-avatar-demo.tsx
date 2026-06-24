"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { MessageAvatar } from "@/registry/aurora/blocks/ai/elements/message-avatar"

export default function AiMessageAvatarDemo() {
  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="MessageAvatar"
        description="Initials / photo avatar — tone-tinted ring plus an optional glowing presence dot."
      />

      <div className="max-w-[540px]">
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <MessageAvatar label="AX" status="online" />
          <MessageAvatar label="JM" tone="cyan" status="busy" />
          <MessageAvatar label="LB" tone="success" status="away" />
          <MessageAvatar label="OP" tone="muted" status="offline" />
          <MessageAvatar label="BIG" size={44} status="online" />
        </div>
      </div>
    </div>
  )
}
