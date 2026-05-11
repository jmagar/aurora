"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/registry/aurora/ui/menubar"

const panel: React.CSSProperties = {
  display: "grid",
  gap: 16,
  padding: 18,
  borderRadius: 16,
  border: "1px solid var(--aurora-border-default)",
  background: "var(--aurora-panel-medium)",
}

const note: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.55,
  color: "var(--aurora-text-muted)",
}

export default function MenubarDemo() {
  const [lastAction, setLastAction] = React.useState("Opened the deploy workspace")
  const [showActivity, setShowActivity] = React.useState(true)
  const [showLineNumbers, setShowLineNumbers] = React.useState(true)
  const [density, setDensity] = React.useState("comfortable")

  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Navigation"
        heading="Menubar"
        description="A functional desktop-style command surface. Each trigger opens a real menu, updates state, and shows the kind of command grouping the component is meant to handle."
      />

      <div style={panel}>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarLabel>Workspace</MenubarLabel>
              <MenubarItem onSelect={() => setLastAction("Created a new workspace")}>
                New workspace
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => setLastAction("Duplicated the current view")}>
                Duplicate view
                <MenubarShortcut>⇧⌘D</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={() => setLastAction("Exported a registry snapshot")}>
                Export snapshot
              </MenubarItem>
              <MenubarItem danger onSelect={() => setLastAction("Queued the environment for deletion")}>
                Delete environment
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarLabel>Display</MenubarLabel>
              <MenubarCheckboxItem checked={showActivity} onCheckedChange={(checked) => setShowActivity(Boolean(checked))}>
                Activity sidebar
              </MenubarCheckboxItem>
              <MenubarCheckboxItem checked={showLineNumbers} onCheckedChange={(checked) => setShowLineNumbers(Boolean(checked))}>
                Line numbers
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarLabel>Density</MenubarLabel>
              <MenubarRadioGroup value={density} onValueChange={setDensity}>
                <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
                <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
                <MenubarRadioItem value="dense">Dense</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Run</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => setLastAction("Started linting the registry")}>
                Run lint
                <MenubarShortcut>⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => setLastAction("Opened the CI logs")}>
                Open CI logs
              </MenubarItem>
              <MenubarItem onSelect={() => setLastAction("Published a preview deployment")}>
                Publish preview
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => setLastAction("Opened the component guidelines")}>
                Component guidelines
              </MenubarItem>
              <MenubarItem onSelect={() => setLastAction("Opened keyboard shortcuts")}>
                Keyboard shortcuts
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div
          style={{
            display: "grid",
            gap: 10,
            padding: 16,
            borderRadius: 14,
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-default)",
          }}
        >
          <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aurora-text-muted)", fontWeight: 600 }}>
            Current state
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--aurora-text-primary)", fontWeight: 600 }}>{lastAction}</p>
          <p style={note}>
            Activity sidebar: {showActivity ? "On" : "Off"} · Line numbers: {showLineNumbers ? "On" : "Off"} · Density: {density}
          </p>
        </div>
      </div>
    </div>
  )
}
