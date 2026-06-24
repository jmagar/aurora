"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { ChatSidebar } from "@/registry/aurora/ui/chat-sidebar"

/* Axon brand mark used in the CD dsCard composition. */
const brand = (
  <>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 7v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V7Z"
        stroke="var(--aurora-accent-strong)"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="11" r="2" fill="var(--aurora-accent-strong)" />
    </svg>
    Axon
  </>
)

const threads = [
  { id: "t1", title: "How does serde derive work?", bucket: "Today" },
  { id: "t2", title: "Crawl docs.rs and summarize", bucket: "Today" },
  { id: "t3", title: "Rust async runtime comparison", bucket: "Today" },
  { id: "t4", title: "Embeddings reranking strategy", bucket: "Yesterday" },
  { id: "t5", title: "Gateway 502 debugging notes", bucket: "Yesterday" },
  { id: "t6", title: "tmux statusline theme port", bucket: "Previous 7 days" },
  { id: "t7", title: "Zed icon theme tweaks", bucket: "Previous 7 days" },
]

export default function ChatSidebarDemo() {
  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="Components"
        heading="ChatSidebar"
        description="Chat rail · new chat · history"
      />

      <div
        style={{
          width: 300,
          height: 480,
          boxSizing: "border-box",
          display: "flex",
          overflow: "hidden",
          borderRadius: "var(--aurora-radius-2, 10px)",
          border: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-page-bg)",
        }}
      >
        <ChatSidebar
          brand={brand}
          defaultActiveId="t2"
          onNewChat={() => {}}
          user={{ name: "Jordan Magar", initials: "JM", plan: "Pro plan" }}
          threads={threads}
        />
      </div>
    </div>
  )
}
