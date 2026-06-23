"use client"

import { HoverCard } from "@/registry/aurora/ui/hover-card"

export default function HoverCardDemo() {
  return (
    <section
      className="grid gap-4 rounded-[var(--aurora-radius-2)] border p-5"
      style={{
        background: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
      }}
    >
      <div style={{ color: "var(--aurora-text-primary)", font: "13px var(--font-sans)" }}>
        Hover{" "}
        <HoverCard
          trigger={
            <span
              style={{
                color: "var(--aurora-accent-strong)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                cursor: "pointer",
                font: "13px var(--font-sans)",
              }}
            >
              edge-1
            </span>
          }
        >
          <div style={{ fontWeight: 650, fontSize: 13, marginBottom: 4 }}>edge-1</div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--aurora-text-muted)",
            }}
          >
            us-east · 200 OK · P99 42ms
          </div>
          <div style={{ fontSize: 12, color: "var(--aurora-text-muted)", marginTop: 6 }}>
            7 services routed · last deploy 14:32
          </div>
        </HoverCard>{" "}
        to inspect.
      </div>
    </section>
  )
}
