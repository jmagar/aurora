"use client"

import * as React from "react"
import { Clock3, Navigation, Star, Zap } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { CommandPalette, useCommandPalette } from "@/registry/aurora/blocks/workspace/command-palette/command-palette"
import type { CommandItem } from "@/registry/aurora/blocks/workspace/command-palette/command-palette"

const ICON_STROKE = 1.65

const ITEMS: CommandItem[] = [
  { id: "r1", label: "Refactor auth middleware", description: "aurora-gateway - 3m ago", section: "recent", icon: <Clock3 size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "r2", label: "Connection pool consolidation", description: "aurora-gateway - 28m ago", section: "recent", icon: <Clock3 size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "r3", label: "Dark mode token audit", description: "design-system - 4h ago", section: "recent", icon: <Clock3 size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "a1", label: "New conversation", description: "Start a fresh chat session", section: "actions", shortcut: ["⌘", "N"], icon: <Zap size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "a2", label: "Search files", description: "Find files across your workspace", section: "actions", shortcut: ["⌘", "P"], icon: <Zap size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "a3", label: "Clear conversation", description: "Wipe current context", section: "actions", shortcut: ["⌘", "⇧", "K"], icon: <Zap size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "s1", label: "Code review", description: "AI-powered diff analyzer", section: "skills", icon: <Star size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "s2", label: "Security audit", description: "Scan for vulnerabilities", section: "skills", icon: <Star size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "s3", label: "Refactor plan", description: "Step-by-step refactoring plan", section: "skills", icon: <Star size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "n1", label: "Settings", description: "Open preferences panel", section: "navigate", shortcut: ["⌘", ","], icon: <Navigation size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
  { id: "n2", label: "Documentation", description: "Browse Aurora component docs", section: "navigate", icon: <Navigation size={14} strokeWidth={ICON_STROKE} aria-hidden="true" /> },
]

export default function CommandPaletteDemo() {
  const { open, setOpen, onOpenChange } = useCommandPalette()
  const [lastSelected, setLastSelected] = React.useState<string | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aurora-space-6)", padding: "var(--aurora-space-8) var(--aurora-space-4)" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--aurora-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
        Command palette
      </h2>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "40px 20px", background: "var(--aurora-panel-medium)", border: "1px solid var(--aurora-border-default)", borderRadius: "var(--aurora-radius-2)", textAlign: "center" }}>
        <Button variant="aurora" size="lg" onClick={() => setOpen(true)}>
          Open command palette
        </Button>
        <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", margin: 0 }}>
          Search commands, recent work, and navigation in one place.
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
