"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Actions, Action } from "@/registry/aurora/blocks/ai/elements/actions"

function Svg({ d }: { d: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: d }}
    />
  )
}

const copy =
  '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'
const refresh = '<path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.7 3L3 8"/><path d="M3 3v5h5"/>'
const share =
  '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/>'
const edit =
  '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'
const more =
  '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'
const trash =
  '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'
const flag =
  '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>'

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
    { d: trash, label: "Delete" },
    { d: flag, label: "Report" },
  ]
  return (
    <div style={{ position: "relative" }}>
      <Actions>
        <Action aria-label="Copy">
          <Svg d={copy} />
        </Action>
        <Action aria-label="Retry">
          <Svg d={refresh} />
        </Action>
        <Action aria-label="Share">
          <Svg d={share} />
        </Action>
        <Action aria-label="Edit">
          <Svg d={edit} />
        </Action>
        <Action aria-label="More" pressed={open} onClick={() => setOpen((o) => !o)}>
          <Svg d={more} />
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
              <Svg d={it.d} />
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
              <Svg d={copy} />
            </Action>
            <Action aria-label="Retry">
              <Svg d={refresh} />
            </Action>
            <Action aria-label="Share">
              <Svg d={share} />
            </Action>
          </Actions>
        </div>

        <div>
          <Cap>Icon + text</Cap>
          <Actions>
            <Action label="Copy">
              <Svg d={copy} />
            </Action>
            <Action label="Retry">
              <Svg d={refresh} />
            </Action>
            <Action label="Share">
              <Svg d={share} />
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
                <Svg d={copy} />
              </Action>
              <Action aria-label="Edit">
                <Svg d={edit} />
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
