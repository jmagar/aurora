"use client"

import * as React from "react"
import { Sidebar, type SidebarItem } from "@/registry/aurora/blocks/workspace/sidebar/sidebar"

// CD icon helper: 17px, stroke 1.6, round caps/joins, currentColor.
function ic(path: React.ReactNode) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}

const ITEMS: SidebarItem[] = [
  {
    id: "run",
    label: "Run",
    section: "Workspace",
    icon: ic(<path d="m6 3 14 9-14 9V3z" />),
  },
  {
    id: "ask",
    label: "Ask",
    icon: ic(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />),
  },
  {
    id: "library",
    label: "Library",
    badge: "128",
    icon: ic(
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      </>,
    ),
  },
  {
    id: "history",
    label: "History",
    section: "Account",
    icon: ic(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>,
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: ic(
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 2h-5l-.3 2.6a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L3 11a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 2.5h5l.3-2.6a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.4a7 7 0 0 0 .2-1z" />
      </>,
    ),
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
          <code
            style={{
              fontFamily: "var(--aurora-font-mono)",
              color: "var(--aurora-accent-primary)",
              fontSize: "11px",
            }}
          >
            {activeId}
          </code>
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
                letterSpacing: "-0.01em",
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z"
                stroke="var(--aurora-accent-primary)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
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
