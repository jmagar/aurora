"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { usePreviewPoster } from "@/lib/preview-poster"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/aurora/ui/select"

const models = [
  { value: "sonnet", label: "Claude Sonnet" },
  { value: "opus", label: "Claude Opus" },
  { value: "gpt4o", label: "GPT-4o" },
  { value: "local", label: "Local · Qwen3" },
]

export default function SelectDemo() {
  // Radix Select has no `modal` prop, so an open Select always locks document
  // scroll. Harmless on this page and in the drawer; fatal in a catalog tile,
  // where scrolling one into view would freeze the whole catalog.
  const poster = usePreviewPoster()
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components"
        heading="Select"
        description="A listbox trigger that opens an overlay of options. The active row carries the Aurora selected glow — an accent tint, border, and soft outer halo — alongside a trailing check."
      />
      <section
        style={{
          boxSizing: "border-box",
          padding: "30px 30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          color: "var(--aurora-text-primary)",
        }}
      >
        <Select defaultOpen={!poster} defaultValue="sonnet">
          <SelectTrigger style={{ maxWidth: 280 }}>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
    </div>
  )
}
