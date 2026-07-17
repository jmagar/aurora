"use client"

import * as React from "react"
import {
  Play,
  GitBranch,
  Undo2,
  Redo2,
  Search,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Save,
  Settings,
  Trash2,
  Plus,
} from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { Badge } from "@/registry/aurora/ui/badge"
import { Kbd } from "@/registry/aurora/ui/kbd"
import { Toggle } from "@/registry/aurora/ui/toggle"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
} from "@/registry/aurora/ui/toolbar"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

const lbl: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 12px",
}

const stack: React.CSSProperties = { marginBottom: 22 }

export default function ToolbarDemo() {
  const [marks, setMarks] = React.useState<Record<string, boolean>>({ bold: true })
  const [align, setAlign] = React.useState("left")
  const mark = (k: string) => setMarks((m) => ({ ...m, [k]: !m[k] }))
  const ALIGN = [
    { k: "left", Icon: AlignLeft },
    { k: "center", Icon: AlignCenter },
    { k: "right", Icon: AlignRight },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Workspace"
        heading="Toolbar"
        description="Dense workbench toolbar with grouped controls, separators, and a flexible spacer — for editors, previews, and inspectors. Horizontal or vertical."
      />

      <div>
        <div style={lbl}>Editor toolbar · spacer</div>
        <div style={stack}>
          <Toolbar aria-label="Editor actions">
            <ToolbarGroup>
              <Button variant="neutral" size="sm" iconLeft={<Play size={14} aria-hidden />}>Run</Button>
              <Button variant="neutral" size="sm" iconLeft={<GitBranch size={14} aria-hidden />}>Branch</Button>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
              <Button variant="ghost" size="icon" aria-label="Undo"><Undo2 size={15} aria-hidden /></Button>
              <Button variant="ghost" size="icon" aria-label="Redo"><Redo2 size={15} aria-hidden /></Button>
            </ToolbarGroup>
            <ToolbarSpacer />
            <ToolbarGroup>
              <Button variant="ghost" size="sm" iconLeft={<Search size={14} aria-hidden />}>Search <Kbd>⌘K</Kbd></Button>
            </ToolbarGroup>
          </Toolbar>
        </div>

        <div style={lbl}>Formatting</div>
        <div style={stack}>
          <Toolbar aria-label="Formatting controls">
            <ToolbarGroup>
              <Toggle iconOnly aria-label="Bold" pressed={!!marks.bold} onPressedChange={() => mark("bold")}><Bold size={15} aria-hidden /></Toggle>
              <Toggle iconOnly aria-label="Italic" pressed={!!marks.italic} onPressedChange={() => mark("italic")}><Italic size={15} aria-hidden /></Toggle>
              <Toggle iconOnly aria-label="Underline" pressed={!!marks.underline} onPressedChange={() => mark("underline")}><Underline size={15} aria-hidden /></Toggle>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
              {ALIGN.map(({ k, Icon }) => (
                <Toggle key={k} iconOnly aria-label={`Align ${k}`} pressed={align === k} onPressedChange={() => setAlign(k)}>
                  <Icon size={15} aria-hidden />
                </Toggle>
              ))}
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
              <Button variant="ghost" size="sm" iconLeft={<Eye size={14} aria-hidden />}>Preview</Button>
            </ToolbarGroup>
          </Toolbar>
        </div>

        <div style={lbl}>Left / right split</div>
        <div style={stack}>
          <Toolbar aria-label="Document actions">
            <ToolbarGroup>
              <Button variant="neutral" size="sm" iconLeft={<Plus size={14} aria-hidden />}>New</Button>
              <Button variant="neutral" size="sm" iconLeft={<Save size={14} aria-hidden />}>Save</Button>
            </ToolbarGroup>
            <ToolbarSpacer />
            <ToolbarGroup>
              <Badge tone="success" dot>Synced</Badge>
              <Button variant="ghost" size="icon" aria-label="Settings"><Settings size={15} aria-hidden /></Button>
            </ToolbarGroup>
          </Toolbar>
        </div>

        <div style={{ ...lbl, marginTop: 4 }}>Vertical rail</div>
        <div style={{ ...stack, marginBottom: 0 }}>
          <Toolbar orientation="vertical" aria-label="Vertical tool rail">
            <ToolbarGroup>
              <Button variant="ghost" size="icon" aria-label="Run"><Play size={15} aria-hidden /></Button>
              <Button variant="ghost" size="icon" aria-label="Branch"><GitBranch size={15} aria-hidden /></Button>
              <Button variant="ghost" size="icon" aria-label="Preview"><Eye size={15} aria-hidden /></Button>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
              <Button variant="ghost" size="icon" aria-label="Settings"><Settings size={15} aria-hidden /></Button>
              <Button variant="ghost" size="icon" aria-label="Delete"><Trash2 size={15} aria-hidden /></Button>
            </ToolbarGroup>
          </Toolbar>
        </div>
      </div>
    </div>
  )
}
