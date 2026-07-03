"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  WrapText,
  Clock,
  Radio,
  Eye,
} from "lucide-react"
import { Toggle } from "@/registry/aurora/ui/toggle"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

const lbl: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 12px",
}

const row: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 22,
}

// A little icon-only formatting toolbar — the canonical toggle use. Bold/italic
// hold independent pressed state so it reads as a real control cluster.
function FormattingToolbar() {
  const [on, setOn] = React.useState<Record<string, boolean>>({ bold: true, code: true })
  const set = (k: string) => setOn((p) => ({ ...p, [k]: !p[k] }))
  const items = [
    { k: "bold", label: "Bold", Icon: Bold },
    { k: "italic", label: "Italic", Icon: Italic },
    { k: "underline", label: "Underline", Icon: Underline },
    { k: "strike", label: "Strikethrough", Icon: Strikethrough },
    { k: "code", label: "Code", Icon: Code },
  ]
  return (
    <div style={{ ...row, gap: 6 }}>
      {items.map(({ k, label, Icon }) => (
        <Toggle
          key={k}
          iconOnly
          aria-label={label}
          pressed={!!on[k]}
          onPressedChange={() => set(k)}
        >
          <Icon size={16} aria-hidden />
        </Toggle>
      ))}
    </div>
  )
}

export default function ToggleDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Toggle"
        description="Pressable border-and-glow control that holds an on/off state. Lights up cyan when pressed — for log-view options, formatting toolbars, and stream controls."
      />

      <div>
        <div style={lbl}>Text toggles</div>
        <div style={row}>
          <Toggle defaultPressed>Wrap lines</Toggle>
          <Toggle>Color-code</Toggle>
          <Toggle defaultPressed>Live tail</Toggle>
        </div>

        <div style={lbl}>Icon-only · formatting toolbar</div>
        <FormattingToolbar />

        <div style={lbl}>Icon + label</div>
        <div style={row}>
          <Toggle defaultPressed>
            <WrapText size={15} aria-hidden />
            Wrap
          </Toggle>
          <Toggle>
            <Clock size={15} aria-hidden />
            Timestamps
          </Toggle>
          <Toggle defaultPressed>
            <Radio size={15} aria-hidden />
            Live tail
          </Toggle>
        </div>

        <div style={lbl}>Sizes</div>
        <div style={{ ...row, alignItems: "center" }}>
          <Toggle size="sm" defaultPressed>Small</Toggle>
          <Toggle size="md" defaultPressed>Medium</Toggle>
          <Toggle size="lg" defaultPressed>Large</Toggle>
          <Toggle size="sm" iconOnly aria-label="Preview" defaultPressed>
            <Eye size={14} aria-hidden />
          </Toggle>
          <Toggle size="lg" iconOnly aria-label="Preview" defaultPressed>
            <Eye size={18} aria-hidden />
          </Toggle>
        </div>

        <div style={lbl}>Disabled</div>
        <div style={{ ...row, marginBottom: 0 }}>
          <Toggle disabled defaultPressed>On · locked</Toggle>
          <Toggle disabled>Off · locked</Toggle>
        </div>
      </div>
    </div>
  )
}
