"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/aurora/ui/sheet"

const launcher: React.CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 20,
  borderRadius: 16,
  border: "1px solid var(--aurora-border-default)",
  background: "var(--aurora-panel-medium)",
}

const actionCard: React.CSSProperties = {
  display: "grid",
  gap: 4,
  padding: 14,
  borderRadius: 12,
  border: "1px solid var(--aurora-border-default)",
  background: "var(--aurora-control-surface)",
}

export default function DrawerDemo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Overlays"
        heading="Drawer"
        description="Drawers are better for mobile-first action groups and short task flows. This one opens from the bottom, keeps the grip bar, and drops the extra chrome."
      />

      <div style={launcher}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--aurora-text-primary)" }}>Quick deployment actions</p>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--aurora-text-muted)" }}>
          Use a drawer when the content is temporary and touch-friendly, not when you need a dense desktop inspector.
        </p>

        <Sheet>
          <SheetTrigger asChild>
            <Button>Open action drawer</Button>
          </SheetTrigger>
          <SheetContent side="bottom" hideClose>
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 12 }}>
              <div
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 4,
                  borderRadius: 999,
                  background: "color-mix(in srgb, var(--aurora-text-muted) 42%, transparent)",
                }}
              />
            </div>
            <SheetHeader style={{ borderBottom: 0, paddingTop: 12 }}>
              <SheetTitle>Deployment actions</SheetTitle>
              <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--aurora-text-muted)" }}>
                A bottom drawer should feel fast and direct. Keep the grip, keep the actions, skip the extra decoration.
              </p>
            </SheetHeader>
            <SheetBody style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <div style={actionCard}>
                  <strong style={{ fontSize: 14, color: "var(--aurora-text-primary)" }}>Run lint</strong>
                  <span style={{ fontSize: 12, color: "var(--aurora-text-muted)" }}>Validate registry changes before shipping.</span>
                </div>
                <div style={actionCard}>
                  <strong style={{ fontSize: 14, color: "var(--aurora-text-primary)" }}>Publish preview</strong>
                  <span style={{ fontSize: 12, color: "var(--aurora-text-muted)" }}>Share a staging build with the team.</span>
                </div>
                <div style={actionCard}>
                  <strong style={{ fontSize: 14, color: "var(--aurora-text-primary)" }}>Rollback</strong>
                  <span style={{ fontSize: 12, color: "var(--aurora-text-muted)" }}>Restore the last stable release.</span>
                </div>
              </div>
            </SheetBody>
            <SheetFooter style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <SheetClose asChild>
                <Button variant="neutral">Close</Button>
              </SheetClose>
              <Button>Open deployment</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
