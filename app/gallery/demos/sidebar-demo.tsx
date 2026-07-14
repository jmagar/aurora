"use client"

import * as React from "react"
import { BookOpen, Box, Clock3, MessageSquare, Play, Settings } from "lucide-react"
import { Sidebar, type SidebarItem } from "@/registry/aurora/blocks/workspace/sidebar/sidebar"

const ICON_STROKE = 1.6

const ITEMS: SidebarItem[] = [
  {
    id: "run",
    label: "Run",
    section: "Workspace",
    icon: <Play size={17} strokeWidth={ICON_STROKE} aria-hidden="true" />,
  },
  {
    id: "ask",
    label: "Ask",
    icon: <MessageSquare size={17} strokeWidth={ICON_STROKE} aria-hidden="true" />,
  },
  {
    id: "library",
    label: "Library",
    badge: "128",
    icon: <BookOpen size={17} strokeWidth={ICON_STROKE} aria-hidden="true" />,
  },
  {
    id: "history",
    label: "History",
    section: "Account",
    icon: <Clock3 size={17} strokeWidth={ICON_STROKE} aria-hidden="true" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={17} strokeWidth={ICON_STROKE} aria-hidden="true" />,
  },
]

export default function SidebarDemo() {
  const [activeId, setActiveId] = React.useState("ask")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-6)",
        padding: "var(--aurora-space-8) var(--aurora-space-4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Sidebar
        </h2>
        <span
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
          }}
        >
          Active:{" "}
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              color: "var(--aurora-accent-primary)",
              fontSize: "11px",
              fontWeight: 650,
            }}
          >
            {activeId}
          </span>
        </span>
      </div>

      {/* CD dsCard composition: operator nav rail, 300x380 panel */}
      <div
        style={{
          width: "300px",
          height: "380px",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "var(--aurora-radius-2)",
          overflow: "hidden",
          display: "flex",
          background: "var(--aurora-page-bg)",
          boxShadow: "var(--aurora-shadow-medium)",
        }}
      >
        <Sidebar
          defaultActiveId="ask"
          activeId={activeId}
          onSelect={setActiveId}
          brand={
            <span
              style={{
                fontFamily: "var(--aurora-font-display)",
                fontWeight: 800,
                fontSize: "15px",
                letterSpacing: 0,
              }}
            >
              Axon
            </span>
          }
          items={ITEMS}
        />

        {/* Mock main area */}
        <div
          style={{
            flex: 1,
            background: "var(--aurora-page-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background:
                "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--aurora-accent-primary) 24%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box size={20} strokeWidth={1.5} color="var(--aurora-accent-primary)" aria-hidden="true" />
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--aurora-text-muted)",
              margin: 0,
              textAlign: "center",
            }}
          >
            {ITEMS.find((i) => i.id === activeId)?.label ?? "Select an item"}
          </p>
        </div>
      </div>
    </div>
  )
}
