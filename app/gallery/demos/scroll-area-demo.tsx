"use client"

import * as React from "react"
import type { CSSProperties } from "react"
import {
  Activity,
  CircleCheck,
  CircleX,
  FileCode,
  FileJson,
  FileText,
  Folder,
  Info,
  TriangleAlert,
} from "lucide-react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { ScrollArea } from "@/registry/aurora/ui/scroll-area"

// Section label — the UPPERCASE eyebrow used across the gallery demos.
const lbl: CSSProperties = {
  font: "var(--aurora-type-micro)",
  fontWeight: "var(--aurora-weight-label)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--aurora-letter-label)",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
}

const meta: CSSProperties = {
  font: "var(--aurora-type-caption)",
  color: "var(--aurora-text-muted)",
}

// ── Vertical log stream ──────────────────────────────────────────────
type Level = "ok" | "info" | "warn" | "error"

const levelStyle: Record<Level, { color: string; Icon: typeof Info }> = {
  ok: { color: "var(--aurora-success)", Icon: CircleCheck },
  info: { color: "var(--aurora-info)", Icon: Info },
  warn: { color: "var(--aurora-warn)", Icon: TriangleAlert },
  error: { color: "var(--aurora-error)", Icon: CircleX },
}

const services = ["gateway", "axon", "qdrant", "tei", "cortex", "labby"]
const verbs = [
  "handshake complete",
  "index flushed to disk",
  "embedding batch queued",
  "retry after upstream 502",
  "connection reset by peer",
  "vector upsert acked",
  "cache warmed",
  "token bucket refilled",
]

const logRows = Array.from({ length: 40 }).map((_, i) => {
  const level: Level = i % 11 === 0 ? "error" : i % 7 === 0 ? "warn" : i % 3 === 0 ? "info" : "ok"
  const t = new Date(Date.UTC(2026, 6, 3, 4, 12, i * 7)).toISOString().slice(11, 19)
  return {
    id: i,
    level,
    ts: t,
    service: services[i % services.length],
    msg: verbs[i % verbs.length],
    ms: 8 + ((i * 13) % 240),
  }
})

// ── Horizontal chip row ──────────────────────────────────────────────
const chips = [
  "next@16.0.1",
  "react@19.0.0",
  "tailwindcss@4.0.0",
  "typescript@5.6.3",
  "lucide-react@0.454",
  "radix-ui@1.1.2",
  "shadcn@2.1.0",
  "style-dictionary@4.1",
  "zod@3.23.8",
  "eslint@9.14",
  "vitest@2.1.4",
  "pnpm@10.33.2",
]

// ── Both-axes wide table ─────────────────────────────────────────────
const fileIcon = (name: string) => {
  if (name.endsWith("/")) return Folder
  if (name.endsWith(".json")) return FileJson
  if (name.endsWith(".tsx") || name.endsWith(".ts") || name.endsWith(".mjs")) return FileCode
  return FileText
}

const files = [
  { path: "registry/aurora/ui/scroll-area.tsx", size: "1.4 KB", changed: "2026-07-01 14:22", author: "jmagar", status: "modified" },
  { path: "registry/aurora/styles/aurora.css", size: "38.9 KB", changed: "2026-06-28 09:10", author: "jmagar", status: "modified" },
  { path: "app/gallery/demos/scroll-area-demo.tsx", size: "4.2 KB", changed: "2026-07-03 02:41", author: "claude", status: "added" },
  { path: "public/r/aurora-scroll-area.json", size: "2.1 KB", changed: "2026-07-01 14:23", author: "ci-bot", status: "generated" },
  { path: "lib/themes.ts", size: "12.7 KB", changed: "2026-06-30 18:55", author: "jmagar", status: "unchanged" },
  { path: "components/site/theme-card.tsx", size: "6.0 KB", changed: "2026-06-29 11:02", author: "jmagar", status: "unchanged" },
  { path: "android/build/aurora-tokens.xml", size: "9.8 KB", changed: "2026-06-28 09:11", author: "ci-bot", status: "generated" },
  { path: "scripts/export-aurora-tokens.mjs", size: "3.3 KB", changed: "2026-06-25 16:40", author: "jmagar", status: "unchanged" },
]

const cell: CSSProperties = {
  padding: "8px 14px",
  whiteSpace: "nowrap",
  font: "var(--aurora-type-table)",
  color: "var(--aurora-text-primary)",
  borderBottom: "1px solid var(--aurora-border-default)",
}

const headCell: CSSProperties = {
  ...cell,
  position: "sticky",
  top: 0,
  zIndex: 1,
  background: "var(--aurora-panel-strong)",
  color: "var(--aurora-text-muted)",
  font: "var(--aurora-type-micro)",
  fontWeight: "var(--aurora-weight-label)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--aurora-letter-label)",
  textTransform: "uppercase",
}

const statusTone: Record<string, string> = {
  added: "var(--aurora-success)",
  modified: "var(--aurora-info)",
  generated: "var(--aurora-warn)",
  unchanged: "var(--aurora-text-muted)",
}

export default function ScrollAreaDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <GalleryPageIntro
        eyebrow="Components / scroll-area"
        heading="ScrollArea"
        description="A bordered viewport with a thin Aurora scrollbar. Cap the height with maxHeight to make vertical scrolling meaningful; overflow-auto handles horizontal and both-axes content in the same primitive."
      />

      {/* ── VERTICAL: log stream ─────────────────────────────────── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={lbl}>Vertical · live log stream</span>
          <span style={{ ...meta, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Activity size={13} aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />
            {logRows.length} lines · maxHeight 260
          </span>
        </div>
        <ScrollArea maxHeight={260}>
          {logRows.map((row) => {
            const { color, Icon } = levelStyle[row.level]
            return (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px 68px 72px 1fr auto",
                  gap: 10,
                  alignItems: "center",
                  padding: "7px 12px",
                  borderBottom: "1px solid var(--aurora-border-default)",
                  font: "var(--aurora-type-table)",
                  fontFamily: "var(--aurora-font-mono)",
                }}
              >
                <Icon size={14} aria-hidden style={{ color }} />
                <span style={{ color: "var(--aurora-text-muted)" }}>{row.ts}</span>
                <span style={{ color: "var(--aurora-accent-pink)" }}>{row.service}</span>
                <span style={{ color: "var(--aurora-text-primary)" }}>{row.msg}</span>
                <span style={{ color: "var(--aurora-text-muted)" }}>{row.ms}ms</span>
              </div>
            )
          })}
        </ScrollArea>
      </section>

      {/* ── HORIZONTAL: dependency chip row ──────────────────────── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={lbl}>Horizontal · dependency chips</span>
          <span style={meta}>scroll sideways · no height cap</span>
        </div>
        <ScrollArea viewportClassName="overflow-y-hidden">
          <div style={{ display: "flex", gap: 8, padding: "12px 14px", width: "max-content" }}>
            {chips.map((chip) => (
              <span
                key={chip}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  padding: "6px 12px",
                  borderRadius: "var(--aurora-radius-3)",
                  border: "1px solid var(--aurora-border-default)",
                  background: "var(--aurora-control-surface)",
                  font: "var(--aurora-type-table)",
                  fontFamily: "var(--aurora-font-mono)",
                  color: "var(--aurora-text-primary)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </ScrollArea>
      </section>

      {/* ── BOTH AXES: wide file table ───────────────────────────── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={lbl}>Both axes · wide changeset table</span>
          <span style={meta}>sticky header · maxHeight 220</span>
        </div>
        <ScrollArea maxHeight={220}>
          <table style={{ borderCollapse: "collapse", width: "max-content", minWidth: "100%" }}>
            <thead>
              <tr>
                <th style={{ ...headCell, textAlign: "left" }}>Path</th>
                <th style={{ ...headCell, textAlign: "right" }}>Size</th>
                <th style={{ ...headCell, textAlign: "left" }}>Changed</th>
                <th style={{ ...headCell, textAlign: "left" }}>Author</th>
                <th style={{ ...headCell, textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => {
                const Icon = fileIcon(f.path)
                return (
                  <tr key={f.path}>
                    <td style={cell}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--aurora-font-mono)" }}>
                        <Icon size={14} aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />
                        {f.path}
                      </span>
                    </td>
                    <td style={{ ...cell, textAlign: "right", color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)" }}>
                      {f.size}
                    </td>
                    <td style={{ ...cell, color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)" }}>{f.changed}</td>
                    <td style={{ ...cell, color: "var(--aurora-accent-pink)" }}>{f.author}</td>
                    <td style={{ ...cell }}>
                      <span style={{ color: statusTone[f.status], fontWeight: "var(--aurora-weight-label)" as CSSProperties["fontWeight"] }}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </ScrollArea>
      </section>
    </div>
  )
}
