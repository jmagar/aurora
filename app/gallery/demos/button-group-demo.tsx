"use client"

import * as React from "react"
import {
  List,
  LayoutGrid,
  Network,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { ButtonGroup, ButtonGroupItem } from "@/registry/aurora/ui/button-group"
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
  gap: 14,
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 22,
}

const VIEWS = [
  { k: "list", label: "List", Icon: List },
  { k: "board", label: "Board", Icon: LayoutGrid },
  { k: "graph", label: "Graph", Icon: Network },
] as const

const ALIGN = [
  { k: "left", Icon: AlignLeft },
  { k: "center", Icon: AlignCenter },
  { k: "right", Icon: AlignRight },
] as const

export default function ButtonGroupDemo() {
  const [view, setView] = React.useState<string>("board")
  const [align, setAlign] = React.useState<string>("left")
  const [marks, setMarks] = React.useState<Record<string, boolean>>({ bold: true })
  const toggleMark = (k: string) => setMarks((m) => ({ ...m, [k]: !m[k] }))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Button Group"
        description="Segmented container for related, mutually-exclusive choices. Pair with ButtonGroupItem for the ready-made segment styling — idle, hover, selected, focus, and disabled states, no hand-rolled CSS."
      />

      <div>
        <div style={lbl}>Segmented control · text</div>
        <div style={row}>
          <ButtonGroup aria-label="View mode">
            {VIEWS.map(({ k, label }) => (
              <ButtonGroupItem key={k} selected={view === k} onClick={() => setView(k)}>
                {label}
              </ButtonGroupItem>
            ))}
          </ButtonGroup>
        </div>

        <div style={lbl}>Icon + label</div>
        <div style={row}>
          <ButtonGroup aria-label="View mode with icons">
            {VIEWS.map(({ k, label, Icon }) => (
              <ButtonGroupItem key={k} selected={view === k} onClick={() => setView(k)}>
                <Icon size={15} aria-hidden />
                {label}
              </ButtonGroupItem>
            ))}
          </ButtonGroup>
        </div>

        <div style={lbl}>Icon-only · alignment</div>
        <div style={row}>
          <ButtonGroup aria-label="Text alignment">
            {ALIGN.map(({ k, Icon }) => (
              <ButtonGroupItem
                key={k}
                selected={align === k}
                onClick={() => setAlign(k)}
                aria-label={`Align ${k}`}
                style={{ padding: "0 10px" }}
              >
                <Icon size={15} aria-hidden />
              </ButtonGroupItem>
            ))}
          </ButtonGroup>

          {/* Multi-select formatting cluster (not mutually exclusive). */}
          <ButtonGroup aria-label="Text formatting">
            <ButtonGroupItem selected={marks.bold} onClick={() => toggleMark("bold")} aria-label="Bold" style={{ padding: "0 10px" }}>
              <Bold size={15} aria-hidden />
            </ButtonGroupItem>
            <ButtonGroupItem selected={marks.italic} onClick={() => toggleMark("italic")} aria-label="Italic" style={{ padding: "0 10px" }}>
              <Italic size={15} aria-hidden />
            </ButtonGroupItem>
            <ButtonGroupItem selected={marks.underline} onClick={() => toggleMark("underline")} aria-label="Underline" style={{ padding: "0 10px" }}>
              <Underline size={15} aria-hidden />
            </ButtonGroupItem>
          </ButtonGroup>
        </div>

        <div style={lbl}>Joined toolbar · real buttons</div>
        <div style={row}>
          <ButtonGroup aria-label="Clipboard actions">
            <Button variant="neutral" size="sm">Cut</Button>
            <Button variant="neutral" size="sm">Copy</Button>
            <Button variant="neutral" size="sm">Paste</Button>
          </ButtonGroup>
        </div>

        <div style={lbl}>Vertical · disabled state</div>
        <div style={{ ...row, alignItems: "flex-start", marginBottom: 0 }}>
          <ButtonGroup orientation="vertical" aria-label="Vertical views">
            {VIEWS.map(({ k, label, Icon }) => (
              <ButtonGroupItem key={k} selected={view === k} onClick={() => setView(k)}>
                <Icon size={15} aria-hidden />
                {label}
              </ButtonGroupItem>
            ))}
          </ButtonGroup>

          <ButtonGroup aria-label="Enabled and disabled states">
            <ButtonGroupItem selected>Enabled</ButtonGroupItem>
            <ButtonGroupItem disabled>Disabled</ButtonGroupItem>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )
}
