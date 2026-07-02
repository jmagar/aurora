"use client"

import * as React from "react"
import { Sparkles, Tag } from "lucide-react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Badge } from "@/registry/aurora/ui/badge"

// CD dsCard demo chrome ported as inline styles.
const lbl: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  margin: "0 0 12px",
}

const row: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "18px",
}

// CD re-tints `warn` to its orange tertiary accent within the demo surface,
// scoped here exactly as the dsCard does (`:root{--aurora-warn:#d97757}`).
const demoSurface: React.CSSProperties = {
  ["--aurora-warn" as string]: "#d97757",
  background: "var(--aurora-page-bg)",
  color: "var(--aurora-text-primary)",
  padding: "26px 30px",
  borderRadius: "var(--aurora-radius-2, 12px)",
  border: "1px solid var(--aurora-border-default)",
}

// Interactive filter-chip row — a toggleable, keyboard-activatable selection.
// `selected` drives aria-pressed on the component; the fill swap is just visual.
const FILTERS = ["Errors", "Warnings", "Info", "AI"] as const

function FilterChips() {
  const [active, setActive] = React.useState<Set<string>>(new Set(["Errors"]))

  const toggle = (name: string) =>
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  return (
    <div style={row}>
      {FILTERS.map((name) => {
        const on = active.has(name)
        return (
          <Badge
            key={name}
            tone="cyan"
            shape="pill"
            fill={on ? "solid" : "outline"}
            interactive
            selected={on}
            onClick={() => toggle(name)}
          >
            {name}
          </Badge>
        )
      })}
    </div>
  )
}

// Dismissible chips — each removes itself via the `onRemove` "×" affordance.
function RemovableTags() {
  const [tags, setTags] = React.useState(["design", "frontend", "aurora", "wip"])
  const remove = (t: string) => setTags((prev) => prev.filter((x) => x !== t))

  if (tags.length === 0) {
    return (
      <Badge tone="neutral" shape="tag" fill="outline">
        All cleared
      </Badge>
    )
  }

  return (
    <div style={row}>
      {tags.map((t) => (
        <Badge
          key={t}
          tone="cyan"
          shape="tag"
          icon={<Tag size={12} aria-hidden />}
          onRemove={() => remove(t)}
          removeLabel={`Remove ${t}`}
        >
          {t}
        </Badge>
      ))}
    </div>
  )
}

export default function BadgesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="Badge"
        description="Semantic badges communicate system meaning. Seven tones, three fills, three shapes, a live pulse dot, inline icons, dismissible chips, and numeric counts."
      />

      <div style={demoSurface}>
        <div style={lbl}>Tones</div>
        <div style={row}>
          <Badge tone="success" dot>Healthy</Badge>
          <Badge tone="warn" dot>Degraded</Badge>
          <Badge tone="error" dot>Down</Badge>
          <Badge tone="info" dot>Info</Badge>
          <Badge tone="cyan" dot>Syncing</Badge>
          <Badge tone="neutral" dot>Idle</Badge>
          <Badge tone="rose" icon={<Sparkles size={12} aria-hidden />}>AI</Badge>
        </div>

        <div style={lbl}>Fills</div>
        <div style={row}>
          <Badge tone="cyan" fill="soft">Soft</Badge>
          <Badge tone="cyan" fill="solid">Solid</Badge>
          <Badge tone="cyan" fill="outline">Outline</Badge>
        </div>

        <div style={lbl}>Live · pulse</div>
        <div style={row}>
          <Badge tone="error" dot pulse fill="solid">Recording</Badge>
          <Badge tone="success" dot pulse>Connected</Badge>
          <Badge tone="cyan" dot pulse>Syncing</Badge>
        </div>

        <div style={lbl}>Shapes</div>
        <div style={row}>
          <Badge tone="cyan" shape="label">Label</Badge>
          <Badge tone="cyan" shape="tag">Tag</Badge>
          <Badge tone="cyan" shape="pill">Pill</Badge>
        </div>

        <div style={lbl}>Interactive · filter chips</div>
        <FilterChips />

        <div style={lbl}>Dismissible</div>
        <RemovableTags />

        <div style={lbl}>Count · notification</div>
        <div style={row}>
          <Badge tone="cyan" count={3} />
          <Badge tone="error" fill="solid" count={12} />
          <Badge tone="neutral" fill="outline" count={128} max={99} />
          <Badge tone="rose" shape="tag" icon={<Sparkles size={12} aria-hidden />}>
            Inbox
          </Badge>
        </div>

        <div style={lbl}>Sizes</div>
        <div style={{ ...row, marginBottom: 0 }}>
          <Badge tone="neutral" size="sm" fill="outline">Small</Badge>
          <Badge tone="neutral" size="md" fill="outline">Medium</Badge>
          <Badge tone="cyan" size="sm">Beta</Badge>
          <Badge tone="rose" size="md" shape="tag">v0.9.4</Badge>
        </div>
      </div>
    </div>
  )
}
