"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import {
  Menubar,
  MenubarGroup,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/registry/aurora/ui/menubar"

const brand: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "0 8px 0 4px",
  fontWeight: 800,
  fontFamily: "var(--font-display)",
  fontSize: 13.5,
  letterSpacing: "-0.02em",
  color: "var(--aurora-text-primary)",
}

const brandDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: "var(--aurora-accent-primary)",
  boxShadow: "0 0 6px var(--aurora-accent-primary)",
}

const divider: React.CSSProperties = {
  width: 1,
  height: 18,
  background: "var(--aurora-border-default)",
  margin: "0 2px",
}

export default function MenubarDemo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Navigation"
        heading="Menubar"
        description="App menu bar with a brand mark and dropdown menus."
      />

      <Menubar>
        <span style={brand}>
          <span style={brandDot} />
          Labby
        </span>
        <span style={divider} />

        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                New Session
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Open…
                <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Quit
                <MenubarShortcut>⌘Q</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                Undo
                <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo
                <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                Terminal
                <MenubarShortcut>⌘`</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>Logs</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>Docs</MenubarItem>
              <MenubarItem>
                Keyboard Shortcuts
                <MenubarShortcut>?</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
