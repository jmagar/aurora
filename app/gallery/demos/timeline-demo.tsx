"use client"

import { Timeline, TimelineItem } from "@/registry/aurora/ui/timeline"

// Standalone gallery demo reproducing the Claude Design Timeline dsCard 1:1.
// done  -> "online"  (success / teal, filled)
// active -> "syncing" (filled) with the dot pinned to the bright accent cyan,
//           matching CD's brighter in-progress node
// queued -> "queued"  (hollow ring, "not yet reached")
const activeDotStyle = {
  background: "var(--aurora-accent-primary)",
  boxShadow: "0 0 10px var(--aurora-accent-primary)",
}

export default function TimelineDemo() {
  return (
    <section
      className="rounded-[var(--aurora-radius-2)] border p-7"
      style={{
        background: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
      }}
    >
      <div className="max-w-[440px]">
        <Timeline>
          <TimelineItem tone="online" title="Crawl started" meta="14:02">
            docs.rs · depth 4
          </TimelineItem>
          <TimelineItem tone="online" title="Embedded 4,198 chunks" meta="14:06" />
          <TimelineItem tone="syncing" title="Indexing" meta="now" dotStyle={activeDotStyle}>
            Writing vectors to Qdrant…
          </TimelineItem>
          <TimelineItem tone="queued" title="Ask" meta="queued">
            Awaiting index completion.
          </TimelineItem>
        </Timeline>
      </div>
    </section>
  )
}
