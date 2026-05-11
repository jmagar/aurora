"use client"

import { Button } from "@/registry/aurora/ui/button";
import React, { useState } from "react"
import { Sidebar, Project } from "@/registry/aurora/blocks/workspace/sidebar/sidebar"

const PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Aurora Gateway",
    sessions: [
      {
        id: "sess-1",
        title: "Refactor auth middleware",
        updatedAt: new Date(Date.now() - 3 * 60 * 1000),
        isLive: true,
      },
      {
        id: "sess-2",
        title: "Connection pool consolidation",
        updatedAt: new Date(Date.now() - 28 * 60 * 1000),
      },
      {
        id: "sess-3",
        title: "Rate limiter implementation",
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "proj-2",
    name: "Design System",
    sessions: [
      {
        id: "sess-4",
        title: "Token audit & cleanup",
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: "sess-5",
        title: "Dark mode refinements",
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "proj-3",
    name: "Infra / DevOps",
    sessions: [
      {
        id: "sess-6",
        title: "Production deploy runbook",
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "sess-7",
        title: "Kubernetes HPA tuning",
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
  },
]

export default function SidebarDemo() {
  const [activeSessionId, setActiveSessionId] = useState("sess-1")
  const [variant, setVariant] = useState<"expanded" | "icon-only">("expanded")

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
        <div style={{ display: "flex", gap: "6px" }}>
          {(["expanded", "icon-only"] as const).map((v) => (
            <Button variant="plain" size="unstyled"
              key={v}
              onClick={() => setVariant(v)}
              style={{
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid var(--aurora-border-default)",
                background:
                  variant === v
                    ? "color-mix(in srgb, var(--aurora-accent-primary) 14%, var(--aurora-control-surface))"
                    : "var(--aurora-control-surface)",
                color:
                  variant === v
                    ? "var(--aurora-accent-primary)"
                    : "var(--aurora-text-muted)",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {/* Active session indicator */}
      <p
        style={{
          fontSize: "12px",
          color: "var(--aurora-text-muted)",
          margin: 0,
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
          {activeSessionId}
        </code>
        {" — "}
        {PROJECTS.flatMap((p) => p.sessions).find((s) => s.id === activeSessionId)?.title}
      </p>

      {/* Sidebar in a constrained container */}
      <div
        style={{
          height: "500px",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "var(--aurora-radius-2)",
          overflow: "hidden",
          display: "flex",
          boxShadow: "var(--aurora-shadow-medium)",
        }}
      >
        <Sidebar
          projects={PROJECTS}
          activeSessionId={activeSessionId}
          onSessionSelect={setActiveSessionId}
          onNewSession={() => alert("New session!")}
          onSettings={() => alert("Settings!")}
          variant={variant}
          userName="J. Magar"
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
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background:
                "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 24%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M9 3L16 6.5V11.5L9 15L2 11.5V6.5L9 3Z"
                stroke="var(--aurora-accent-primary)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--aurora-text-muted)",
              margin: 0,
            }}
          >
            Select a session from the sidebar
          </p>
        </div>
      </div>
    </div>
  )
}
