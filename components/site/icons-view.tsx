"use client"

import * as React from "react"
import {
  Bell,
  BookOpen,
  Bot,
  Box,
  Check,
  Clock,
  Command,
  Compass,
  Copy,
  Droplet,
  Feather,
  Filter,
  Folder,
  Globe,
  Hash,
  Layers,
  LayoutGrid,
  MessageSquare,
  Monitor,
  Moon,
  MousePointer,
  PanelsTopLeft,
  Plug,
  Rocket,
  Rows3,
  Ruler,
  Search,
  Send,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Store,
  Sun,
  Table,
  Terminal,
  ToggleLeft,
  Type,
  User,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react"
import {
  OperationIcon,
  type OperationName,
} from "@/registry/aurora/ui/operation-icon"
import { fuzzy } from "@/lib/fuzzy"
import { useClipboard } from "@/lib/use-clipboard"

/**
 * IconsView — ported from the CD `aurora-site` icons page. Lucide is canonical
 * (line-only, currentColor); the Axon operation set rides the same 24px grid
 * via the registry `OperationIcon`, so the page can never drift from the
 * component. Click any cell to copy its usage.
 */

const LUCIDE_SET: [string, LucideIcon][] = [
  ["Search", Search],
  ["Command", Command],
  ["Sun", Sun],
  ["Moon", Moon],
  ["Copy", Copy],
  ["Check", Check],
  ["X", X],
  ["Zap", Zap],
  ["MousePointer", MousePointer],
  ["Type", Type],
  ["Table", Table],
  ["Bell", Bell],
  ["PanelsTopLeft", PanelsTopLeft],
  ["Layers", Layers],
  ["Sparkles", Sparkles],
  ["Compass", Compass],
  ["Box", Box],
  ["Terminal", Terminal],
  ["MessageSquare", MessageSquare],
  ["Send", Send],
  ["ToggleLeft", ToggleLeft],
  ["User", User],
  ["Server", Server],
  ["Plug", Plug],
  ["Bot", Bot],
  ["Store", Store],
  ["Shield", Shield],
  ["Folder", Folder],
  ["LayoutGrid", LayoutGrid],
  ["Rows3", Rows3],
  ["Hash", Hash],
  ["Droplet", Droplet],
  ["Ruler", Ruler],
  ["Clock", Clock],
  ["BookOpen", BookOpen],
  ["Rocket", Rocket],
  ["Feather", Feather],
  ["Wrench", Wrench],
  ["Monitor", Monitor],
  ["Smartphone", Smartphone],
  ["Globe", Globe],
  ["Filter", Filter],
]

const OP_SET: OperationName[] = [
  "scrape",
  "map",
  "retrieve",
  "screenshot",
  "endpoints",
  "crawl",
  "extract",
  "embed",
  "ingest",
  "ask",
  "summarize",
  "research",
  "suggest",
]

function useCopy(): [string | null, (text: string, key: string) => void] {
  const [copied, setCopied] = React.useState<string | null>(null)
  const clipboard = useClipboard(1100)
  const copy = (text: string, key: string) => {
    void clipboard.copy(text).then((didCopy) => {
      if (didCopy) setCopied(key)
    })
  }
  return [clipboard.copied ? copied : null, copy]
}

function Cell({
  label,
  copied,
  onClick,
  children,
}: {
  label: string
  copied: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="aurora-card flex flex-col items-center gap-2 rounded-[var(--aurora-radius-2)] px-2 pb-2.5 pt-4"
      style={{
        cursor: "pointer",
        background: "var(--aurora-panel-medium)",
        border: "1px solid var(--aurora-border-default)",
        boxShadow: "var(--aurora-shadow-subtle), var(--aurora-highlight-medium)",
        transition: "transform 160ms var(--motion-ease-out), border-color 160ms var(--motion-ease-out)",
      }}
    >
      <div
        className="grid h-[26px] place-items-center"
        style={{ color: copied ? "var(--aurora-success)" : "var(--aurora-text-primary)" }}
      >
        {children}
      </div>
      <span
        className="aurora-text-code max-w-full truncate"
        style={{ fontSize: 10, color: copied ? "var(--aurora-success)" : "var(--aurora-text-muted)" }}
      >
        {copied ? "copied" : label}
      </span>
    </button>
  )
}

export function IconsView() {
  const [q, setQ] = React.useState("")
  const [copied, copy] = useCopy()

  const lucide = LUCIDE_SET.filter(([n]) => fuzzy(q, n) > 0).sort(
    (a, b) => fuzzy(q, b[0]) - fuzzy(q, a[0]),
  )
  const ops = OP_SET.filter((n) => fuzzy(q, n) > 0).sort((a, b) => fuzzy(q, b) - fuzzy(q, a))

  return (
    <div style={{ paddingTop: 40 }}>
      <span className="aurora-text-eyebrow">Icons</span>
      <h1 className="aurora-text-display-1" style={{ margin: "12px 0 0" }}>
        Lucide, Line-Only
      </h1>
      <p
        className="aurora-text-lead mt-4 max-w-[620px]"
        style={{ color: "var(--aurora-text-muted)" }}
      >
        Lucide is canonical — 1.5–1.75px stroke,{" "}
        <span className="aurora-text-code" style={{ fontSize: 13 }}>currentColor</span>, never
        filled. Axon adds a tone-coded operation set on the same grid. Click any cell to copy its
        usage.
      </p>

      <label
        className="my-6 flex h-[42px] max-w-[420px] items-center gap-2.5 rounded-[var(--aurora-radius-1)] px-3"
        style={{
          background: "var(--aurora-control-surface)",
          border: "1px solid var(--aurora-border-strong)",
        }}
      >
        <Search size={16} style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search icons…"
          className="aurora-text-control min-w-0 flex-1 border-none bg-transparent outline-none"
          style={{ color: "var(--aurora-text-primary)" }}
        />
        {q ? (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Clear search"
            style={{ display: "flex", color: "var(--aurora-text-muted)" }}
          >
            <X size={14} />
          </button>
        ) : null}
      </label>

      <div className="aurora-text-eyebrow mb-3.5" style={{ fontSize: 10.5 }}>
        Lucide · Canonical
      </div>
      {lucide.length === 0 ? (
        <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
          No Lucide icons match “{q}”.
        </p>
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 12 }}
        >
          {lucide.map(([name, Ic]) => (
            <Cell
              key={name}
              label={name}
              copied={copied === name}
              onClick={() => copy(`<${name} size={16} strokeWidth={1.6} />`, name)}
            >
              <Ic size={22} strokeWidth={1.6} />
            </Cell>
          ))}
        </div>
      )}

      <div className="aurora-text-eyebrow mb-3.5 mt-[34px]" style={{ fontSize: 10.5 }}>
        Axon Operations · 24px Grid
      </div>
      {ops.length === 0 ? (
        <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
          No operation icons match “{q}”.
        </p>
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 12 }}
        >
          {ops.map((name) => (
            <Cell
              key={name}
              label={name}
              copied={copied === `op-${name}`}
              onClick={() => copy(`<OperationIcon name="${name}" />`, `op-${name}`)}
            >
              <OperationIcon name={name} size={24} />
            </Cell>
          ))}
        </div>
      )}
    </div>
  )
}
