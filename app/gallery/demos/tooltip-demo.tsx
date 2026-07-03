"use client"

import * as React from "react"
import {
  RotateCcw,
  SquareTerminal,
  Settings,
  Trash2,
  Info,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { Kbd } from "@/registry/aurora/ui/kbd"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/registry/aurora/ui/tooltip"
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
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 24,
}

// A tooltip on an Aurora Button (asChild forwards ref + Radix props correctly).
function Tip({
  label,
  name,
  side,
  children,
  color,
}: {
  label: React.ReactNode
  /** Accessible name for the icon button (required when `label` is rich JSX). */
  name?: string
  side?: "top" | "right" | "bottom" | "left"
  children: React.ReactNode
  color?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={name ?? (typeof label === "string" ? label : undefined)} style={color ? { color } : undefined}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  )
}

export default function TooltipDemo() {
  return (
    <TooltipProvider delayDuration={120}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <GalleryPageIntro
          eyebrow="Overlays"
          heading="Tooltip"
          description="Lightweight Radix tooltip on the Aurora panel-strong surface. Opens on hover or keyboard focus; positions on any side; carries rich content and shortcuts."
        />

        <div>
          <div style={lbl}>Toolbar triggers</div>
          <div style={row}>
            <Tip name="Restart gateway" label={<span>Restart gateway <Kbd>⌘R</Kbd></span>}><RotateCcw size={16} aria-hidden /></Tip>
            <Tip label="Open terminal"><SquareTerminal size={16} aria-hidden /></Tip>
            <Tip label="Settings"><Settings size={16} aria-hidden /></Tip>
            <Tip label="Delete · permanent" color="var(--aurora-error)"><Trash2 size={16} aria-hidden /></Tip>
          </div>

          <div style={lbl}>Sides</div>
          <div style={row}>
            <Tip label="Top" side="top"><ArrowUp size={16} aria-hidden /></Tip>
            <Tip label="Right" side="right"><ArrowRight size={16} aria-hidden /></Tip>
            <Tip label="Bottom" side="bottom"><ArrowDown size={16} aria-hidden /></Tip>
            <Tip label="Left" side="left"><ArrowLeft size={16} aria-hidden /></Tip>
          </div>

          <div style={lbl}>Rich content</div>
          <div style={{ ...row, marginBottom: 0 }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="neutral" size="sm"><Info size={14} aria-hidden />Details</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div style={{ display: "grid", gap: 4, maxWidth: 220 }}>
                  <strong style={{ fontSize: 12 }}>Gateway status</strong>
                  <span style={{ color: "var(--aurora-text-muted)", fontSize: 11.5, lineHeight: 1.5 }}>
                    All upstreams healthy. Last sync 2m ago.
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>

            <span style={{ fontSize: 12, color: "var(--aurora-text-muted)" }}>
              Hover or tab to a control to reveal its tooltip.
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
