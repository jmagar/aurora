"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  ChatSidebar,
  type ChatSidebarThread,
} from "@/registry/aurora/ui/chat-sidebar"

/* Axon brand mark used in the CD dsCard composition. */
const brand = (
  <>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 7v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V7Z"
        stroke="var(--axon-orange-strong)"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="11" r="2" fill="var(--axon-orange-strong)" />
    </svg>
    Axon
  </>
)

const baseThreads: ChatSidebarThread[] = [
  { id: "t1", title: "How does serde derive work?", bucket: "Today" },
  { id: "t2", title: "Crawl docs.rs and summarize", bucket: "Today" },
  { id: "t3", title: "Rust async runtime comparison", bucket: "Today" },
  { id: "t4", title: "Embeddings reranking strategy", bucket: "Yesterday" },
  { id: "t5", title: "Gateway 502 debugging notes", bucket: "Yesterday" },
  { id: "t6", title: "tmux statusline theme port", bucket: "Previous 7 Days" },
  { id: "t7", title: "Zed icon theme tweaks", bucket: "Previous 7 Days" },
]

export default function ChatSidebarDemo() {
  const [threads, setThreads] = React.useState(baseThreads)
  const [selectedId, setSelectedId] = React.useState("t2")
  const [query, setQuery] = React.useState("")
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="Components"
        heading="ChatSidebar"
        description="Chat rail with search, grouped history, and a real new-chat flow."
      />

      <div className="grid gap-3">
        <div
          style={{
            width: 320,
            height: 440,
            boxSizing: "border-box",
            display: "flex",
            overflow: "hidden",
            borderRadius: "var(--aurora-radius-2)",
            border: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-page-bg)",
          }}
        >
          <ChatSidebar
            brand={brand}
            activeId={selectedId}
            onSelectThread={setSelectedId}
            onNewChat={() => {
              const nextId = `draft-${threads.length + 1}`
              setThreads((current) => [
                {
                  id: nextId,
                  title: "New indexing plan",
                  searchText: "New indexing plan",
                  bucket: "Today",
                },
                ...current,
              ])
              setSelectedId(nextId)
              setQuery("")
            }}
            searchValue={query}
            onSearchValueChange={setQuery}
            onOpenAccountMenu={() => setMenuOpen((open) => !open)}
            user={{ name: "Jordan Magar", initials: "JM", plan: "Pro Plan" }}
            threads={threads.map((thread) => ({
              ...thread,
              searchText:
                typeof thread.title === "string" ? thread.title : thread.searchText,
            }))}
          />
        </div>

        <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)", margin: 0 }}>
          {menuOpen
            ? "Account menu opened for the current user."
            : "Search filters the thread rail in place."}
        </p>
      </div>
    </div>
  )
}
