"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { EmptyState } from "@/registry/aurora/ui/empty-state"
import { Button } from "@/registry/aurora/ui/button"
import { Kbd } from "@/registry/aurora/ui/kbd"

// CD-parity composition for EmptyState: a missing-thing message paired with the
// next action. Folder glyph, title, muted description, and an aurora-accent
// "New session" button carrying its ⌘N shortcut.
function FolderIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6a2 2 0 0 1 2-2h3.4a2 2 0 0 1 1.6.8l.6.8a2 2 0 0 0 1.6.8H18a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    </svg>
  )
}

export default function EmptyStateDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components / empty-state"
        heading="EmptyState"
        description="A missing thing paired with the next action."
      />
      <section
        style={{
          display: "grid",
          placeItems: "center",
          padding: "20px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <EmptyState
          icon={<FolderIcon />}
          title="No sessions yet"
          description="Start one to begin crawling, searching, or asking."
          action={
            <Button variant="aurora">
              New session
              <Kbd style={{ marginLeft: 6 }}>⌘N</Kbd>
            </Button>
          }
        />
      </section>
    </div>
  )
}
