"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Drawer } from "@/registry/aurora/ui/drawer"

export default function DrawerDemo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="Drawer"
        description="An Aurora-extension bottom sheet. Slides up from the bottom edge with a drag-handle grip, a title and a muted sub-line, then a body of quick actions. Swipe down or tap outside to dismiss."
      />

      <Drawer defaultOpen title="Quick actions" description="edge-1 · production">
        Restart · Drain · Roll back · View logs. Swipe down or tap outside to dismiss.
      </Drawer>
    </div>
  )
}
