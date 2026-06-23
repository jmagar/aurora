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
          <Switch defaultChecked />
          <Label>Color-code by operation</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Checkbox />
          <Label>Stream tokens</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Label required>API token</Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Checkbox disabled />
          <Label disabled>Read-only setting</Label>
        </div>
      </section>
    </div>
  )
}
