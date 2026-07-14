"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Button } from "@/registry/aurora/ui/button"
import { Input } from "@/registry/aurora/ui/input"
import { Label } from "@/registry/aurora/ui/label"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/registry/aurora/ui/popover"

export default function PopoverDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components"
        heading="Popover"
        description="A click-triggered floating panel anchored to its trigger, dismissed by clicking outside — used here to edit a setting inline without leaving the page."
      />
      <section
        style={{
          boxSizing: "border-box",
          padding: "30px 30px",
          minHeight: 260,
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          color: "var(--aurora-text-primary)",
        }}
      >
        <Popover defaultOpen>
          <PopoverAnchor>
            <PopoverTrigger asChild>
              <Button variant="neutral">Configure Rate Limit</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, width: 220 }}>
                <Label>Requests / Minute</Label>
                <Input defaultValue="600" />
                <Button variant="aurora" size="sm" style={{ alignSelf: "flex-start" }}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </PopoverAnchor>
        </Popover>
      </section>
    </div>
  )
}
