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

const launcherGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
}

const launcherCard: React.CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 20,
  borderRadius: 16,
  border: "1px solid var(--aurora-border-default)",
  background: "var(--aurora-panel-medium)",
}

function DetailBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <p style={{ margin: 0, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", fontWeight: 600 }}>{label}</p>
      <div style={{ color: "var(--aurora-text-primary)", fontSize: 14 }}>{value}</div>
    </div>
  )
}

export default function SheetDemo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Overlays"
        heading="Sheet"
        description="Sheets work best for secondary detail without taking you out of the current page. These examples lean into inspector and review workflows instead of a blank panel."
      />

      <div style={launcherGrid}>
        <div style={launcherCard}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--aurora-text-primary)" }}>Run inspector</p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--aurora-text-muted)" }}>
            A right-side sheet for metadata, timestamps, and follow-up actions.
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Open inspector</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Registry Build #1842</SheetTitle>
                <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--aurora-text-muted)" }}>
                  Keep the build context, status, and controls visible without replacing the current page.
                </p>
              </SheetHeader>
              <SheetBody style={{ display: "grid", gap: 18 }}>
                <DetailBlock label="Status" value="Succeeded" />
                <DetailBlock label="Started" value="10:42 AM" />
                <DetailBlock label="Duration" value="3m 12s" />
                <DetailBlock label="Artifacts" value="Registry bundle, preview screenshot, release manifest" />
              </SheetBody>
              <SheetFooter style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <Button variant="neutral">View logs</Button>
                <Button>Promote build</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div style={launcherCard}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--aurora-text-primary)" }}>Policy review</p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--aurora-text-muted)" }}>
            A left-side sheet is useful when it complements the main content instead of competing with it.
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="neutral">Open policy sheet</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Gateway policy diff</SheetTitle>
                <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--aurora-text-muted)" }}>
                  Read-only changes before rollout.
                </p>
              </SheetHeader>
              <SheetBody style={{ display: "grid", gap: 14 }}>
                <DetailBlock label="Added" value="Allow marketplace snapshots for read-only sessions" />
                <DetailBlock label="Removed" value="Legacy plugin write scope" />
                <DetailBlock label="Risk" value="Low — no runtime policy expansion" />
              </SheetBody>
              <SheetFooter style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <SheetClose asChild>
                  <Button variant="neutral">Dismiss</Button>
                </SheetClose>
                <Button>Approve rollout</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
