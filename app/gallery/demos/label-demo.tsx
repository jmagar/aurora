"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Checkbox } from "@/registry/aurora/ui/checkbox"
import { Label } from "@/registry/aurora/ui/label"
import { Switch } from "@/registry/aurora/ui/switch"

// CD-parity composition for the Label primitive: four rows pairing the label
// with the control it names — a switch, a checkbox, a standalone required
// label, and a disabled checkbox + disabled label.
export default function LabelDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components / label"
        heading="Label"
        description="Names a control · required · disabled."
      />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Switch id="label-demo-color-code" defaultChecked />
          <Label htmlFor="label-demo-color-code">Color-Code by Operation</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Checkbox id="label-demo-stream" />
          <Label htmlFor="label-demo-stream">Stream Tokens</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Label required>API Token</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Checkbox id="label-demo-read-only" disabled />
          <Label htmlFor="label-demo-read-only" disabled>
            Read-Only Setting
          </Label>
        </div>
      </section>
    </div>
  )
}
