"use client"

import * as React from "react"
import { Copy, Ellipsis, Flag, Pencil, RefreshCw, Share2, Trash2 } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Actions, Action } from "@/registry/aurora/blocks/ai/elements/actions"

const iconProps = { size: 14, strokeWidth: 1.6, "aria-hidden": true } as const

const capStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono, monospace)",
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  marginBottom: 11,
}

function Cap({ children }: { children: React.ReactNode }) {
  return <div style={capStyle}>{children}</div>
}

function OverflowRow() {
  const [open, setOpen] = React.useState(false)
  const items = [
    { icon: Trash2, label: "Delete" },
    { icon: Flag, label: "Report" },
  ]
  return (
    <div style={{ position: "relative" }}>
      <Actions>
        <Action aria-label="Copy">
          <Copy {...iconProps} />
        </Action>
        <Action aria-label="Retry">
          <RefreshCw {...iconProps} />
        </Action>
        <Action aria-label="Share">
          <Share2 {...iconProps} />
        </Action>
        <Action aria-label="Edit">
          <Pencil {...iconProps} />
        </Action>
        <Action aria-label="More" pressed={open} onClick={() => setOpen((o) => !o)}>
          <Ellipsis {...iconProps} />
        </Action>
      </Actions>
      {open ? (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: 38,
            left: 172,
            minWidth: 150,
            padding: 5,
            borderRadius: 12,
            background:
              "linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong))",
            border: "1px solid var(--aurora-border-strong)",
            boxShadow:
              "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,.05)",
            zIndex: 5,
          }}
        >
          {items.map((it, i) => (
            <Button variant="plain" size="unstyled"
              key={i}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--aurora-text-primary)",
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: 13,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--aurora-hover-bg)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none"
              }}
            >
              <it.icon {...iconProps} />
              {it.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function AiActionsDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Actions"
        description="A horizontal row of message/turn action buttons — icon-only or icon + text, with a pressed state for toggles and an overflow menu for capped rows."
      />
      <section
        style={{
          boxSizing: "border-box",
          padding: "30px 30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-page-bg)",
          color: "var(--aurora-text-primary)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div>
          <Cap>Icon only · default</Cap>
          <Actions>
            <Action aria-label="Copy">
              <Copy {...iconProps} />
            </Action>
            <Action aria-label="Retry">
              <RefreshCw {...iconProps} />
            </Action>
            <Action aria-label="Share">
              <Share2 {...iconProps} />
            </Action>
          </Actions>
        </div>

        <div>
          <Cap>Icon + text</Cap>
          <Actions>
            <Action label="Copy">
              <Copy {...iconProps} />
            </Action>
            <Action label="Retry">
              <RefreshCw {...iconProps} />
            </Action>
            <Action label="Share">
              <Share2 {...iconProps} />
            </Action>
          </Actions>
        </div>

        <div>
          <Cap>Right-aligned · under a user turn</Cap>
          <div
            style={{
              borderTop: "1px solid var(--aurora-border-default)",
              paddingTop: 12,
              display: "flex",
            }}
          >
            <Actions style={{ marginLeft: "auto" }}>
              <Action aria-label="Copy">
                <Copy {...iconProps} />
              </Action>
              <Action aria-label="Edit">
                <Pencil {...iconProps} />
              </Action>
            </Actions>
          </div>
        </div>

        <div>
          <Cap>Overflow · cap at ~5, rest in a ⋯ menu</Cap>
          <OverflowRow />
        </div>
      </section>
    </div>
  )
}
