"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { MultiSelect } from "@/registry/aurora/ui/multi-select"

const options = [
  { value: "labby", label: "labby" },
  { value: "axon", label: "axon" },
  { value: "syslog", label: "syslog" },
  { value: "rustify", label: "rustify" },
  { value: "gotify", label: "gotify" },
]

export default function MultiSelectDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="MultiSelect"
        description="An Aurora extension that collects multiple values as removable chips. The trigger carries the Aurora focus glow; the panel lists each option with a checkbox that fills with the accent tint and a check when selected."
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
        <div style={{ maxWidth: 380 }}>
          <MultiSelect
            defaultOpen
            defaultValue={["labby", "axon"]}
            placeholder="Pick servers…"
            options={options}
          />
        </div>
      </section>
    </div>
  )
}
