"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/aurora/ui/sheet"

// Stage that pins the open edge drawer the way the Claude Design dsCard does:
// a 560×340 framed surface with the sheet slid in against the right edge.
const stage: React.CSSProperties = {
  position: "relative",
  height: 340,
  overflow: "hidden",
  borderRadius: 16,
  border: "1px solid var(--aurora-border-default)",
  background: "var(--aurora-page-bg)",
}

function DetailBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--aurora-text-muted)",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
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
        description="An edge drawer that slides in for secondary detail without taking you out of the current page. This example mirrors the inspector composition: a right-side panel with a title, a meta line, and live context."
      />

      {/* CD dsCard composition, 1:1 — an open inspector drawer pinned to the right edge. */}
      <div style={stage}>
        <Sheet defaultOpen modal={false}>
          <SheetContent
            side="right"
            hideClose={false}
            onInteractOutside={(event) => event.preventDefault()}
            onEscapeKeyDown={(event) => event.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Gateway Inspector</SheetTitle>
              <SheetDescription
                style={{
                  margin: "8px 0 0",
                  fontSize: 13,
                  lineHeight: 1.55,
                  fontFamily: "var(--aurora-font-sans)",
                  color: "var(--aurora-text-muted)",
                }}
              >
                edge-1 · 7 services
              </SheetDescription>
            </SheetHeader>
            <SheetBody style={{ display: "grid", gap: 18 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--aurora-text-primary)" }}>
                Inbound 1.2k req/min · P99 42ms · 200 OK. Last deploy 14:02 by jmagar.
              </p>
              <DetailBlock label="Status" value="Healthy" />
              <DetailBlock label="Throughput" value="1.2k req/min" />
              <DetailBlock label="Last deploy" value="14:02 · jmagar" />
            </SheetBody>
            <SheetFooter style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <SheetClose asChild>
                <Button variant="neutral">Dismiss</Button>
              </SheetClose>
              <Button>Restart edge-1</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Triggerable example showing the full open/close flow. */}
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Inspector</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Gateway Inspector</SheetTitle>
            <SheetDescription
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                lineHeight: 1.55,
                fontFamily: "var(--aurora-font-sans)",
                color: "var(--aurora-text-muted)",
              }}
            >
              edge-1 · 7 services
            </SheetDescription>
          </SheetHeader>
          <SheetBody style={{ display: "grid", gap: 18 }}>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--aurora-text-primary)" }}>
              Inbound 1.2k req/min · P99 42ms · 200 OK. Last deploy 14:02 by jmagar.
            </p>
            <DetailBlock label="Status" value="Healthy" />
            <DetailBlock label="Throughput" value="1.2k req/min" />
            <DetailBlock label="Last deploy" value="14:02 · jmagar" />
          </SheetBody>
          <SheetFooter style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <SheetClose asChild>
              <Button variant="neutral">Dismiss</Button>
            </SheetClose>
            <Button>Restart edge-1</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
