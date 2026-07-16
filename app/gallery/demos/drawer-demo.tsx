"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import { Drawer } from "@/registry/aurora/ui/drawer"

export default function DrawerDemo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="Drawer"
        description="An Aurora-extension bottom sheet. Slides up from the bottom edge with a drag-handle grip, a title and a muted sub-line, then a body of quick actions. Swipe down or tap outside to dismiss."
      />

      <Drawer defaultOpen title="Quick Actions" description="edge-1 · production">
        Restart. Drain. Roll Back. View Logs. Swipe down or tap outside to dismiss.
      </Drawer>

      <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
        <div className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>
          Triggerable drawer
        </div>
        <Drawer
          title="Gateway Actions"
          description="edge-2 · staging"
          trigger={<Button variant="neutral">Open Drawer</Button>}
        >
          Restart. Drain. Roll Back. View Logs. Tap outside to dismiss.
        </Drawer>
      </div>
    </div>
  )
}
