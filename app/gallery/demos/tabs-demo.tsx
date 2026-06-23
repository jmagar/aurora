"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/registry/aurora/ui/tabs"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

/* Mirrors the Claude Design Tabs preview 1:1 — underline tabs with the
   animated glowing accent indicator, rendered with the registry Radix Tabs. */

export default function TabsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Navigation"
        heading="Tabs & pills"
        description="Underline tabs with an animated accent indicator — the active label lifts to primary while the glowing cyan underline slides beneath it. Built on Radix Tabs."
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="a11y">A11y</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
