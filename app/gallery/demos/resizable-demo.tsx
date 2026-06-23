"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Resizable, ResizablePane } from "@/registry/aurora/ui/resizable"

export default function ResizableDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="Resizable"
        description="An Aurora extension with draggable split panels — drag the divider, or focus it and use the arrow keys, to redistribute space between the two panes."
      />
      <div style={{ height: 200 }}>
        <Resizable defaultSize={42}>
          <ResizablePane>sidebar</ResizablePane>
          <ResizablePane>editor — drag the divider →</ResizablePane>
        </Resizable>
      </div>
    </div>
  )
}
