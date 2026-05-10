"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { CommandPalette, useCommandPalette } from "@/registry/aurora/blocks/command-palette/command-palette"
import type { CommandItem } from "@/registry/aurora/blocks/command-palette/command-palette"

function ClockIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" /><path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
}
function ZapIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 2L3.5 8H7L6 12L10.5 6H7L8 2Z" stroke="currentColor" strokeWidth="1.2" /></svg>
}
function StarIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L8.5 5H12L9 7.5L10 11L7 9L4 11L5 7.5L2 5H5.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2" /></svg>
}
function NavIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 7L7 9L5 12L2 2Z" stroke="currentColor" strokeWidth="1.2" /></svg>
}

const ITEMS: CommandItem[] = [
  { id: "r1", label: "Refactor auth middleware", description: "aurora-gateway - 3m ago", section: "recent", icon: <ClockIcon /> },
  { id: "r2", label: "Connection pool consolidation", description: "aurora-gateway - 28m ago", section: "recent", icon: <ClockIcon /> },
  { id: "r3", label: "Dark mode token audit", description: "design-system - 4h ago", section: "recent", icon: <ClockIcon /> },
  { id: "a1", label: "New conversation", description: "Start a fresh chat session", section: "actions", shortcut: ["⌘", "N"], icon: <ZapIcon /> },
  { id: "a2", label: "Search files", description: "Find files across your workspace", section: "actions", shortcut: ["⌘", "P"], icon: <ZapIcon /> },
  { id: "a3", label: "Clear conversation", description: "Wipe current context", section: "actions", shortcut: ["⌘", "⇧", "K"], icon: <ZapIcon /> },
  { id: "s1", label: "Code review", description: "AI-powered diff analyzer", section: "skills", icon: <StarIcon /> },
  { id: "s2", label: "Security audit", description: "Scan for vulnerabilities", section: "skills", icon: <StarIcon /> },
  { id: "s3", label: "Refactor plan", description: "Step-by-step refactoring plan", section: "skills", icon: <StarIcon /> },
  { id: "n1", label: "Settings", description: "Open preferences panel", section: "navigate", shortcut: ["⌘", ","], icon: <NavIcon /> },
  { id: "n2", label: "Documentation", description: "Browse Aurora component docs", section: "navigate", icon: <NavIcon /> },
]

export default function CommandPaletteDemo() {
  const { open, setOpen, onOpenChange } = useCommandPalette()
  const [lastSelected, setLastSelected] = React.useState<string | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aurora-space-6)", padding: "var(--aurora-space-8) var(--aurora-space-4)" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--aurora-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
        Command Palette
      </h2>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "40px 20px", background: "var(--aurora-panel-medium)", border: "1px solid var(--aurora-border-default)", borderRadius: "var(--aurora-radius-2)", textAlign: "center" }}>
        <Button variant="aurora" size="lg" onClick={() => setOpen(true)}>
          Open Command Palette (⌘K)
        </Button>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", margin: 0 }}>
          Press ⌘K or click the button. Use arrows to navigate, Enter to select, Esc to close.
        </p>
        {lastSelected && (
          <div style={{ padding: "8px 16px", background: "color-mix(in srgb, var(--aurora-success) 10%, var(--aurora-control-surface))", border: "1px solid color-mix(in srgb, var(--aurora-success) 30%, transparent)", borderRadius: "10px", fontSize: "12px", color: "var(--aurora-success)", fontWeight: 500 }}>
            Selected: {lastSelected}
          </div>
        )}
      </div>
      <CommandPalette open={open} onOpenChange={onOpenChange} items={ITEMS} onSelect={(item) => setLastSelected(item.label)} />
    </div>
  )
}
