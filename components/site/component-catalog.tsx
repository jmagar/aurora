"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, LayoutGrid, Search, X } from "lucide-react"
import { NAV } from "@/app/gallery/nav-data"
import { getRegistryMeta } from "@/lib/registry-meta"
import { tint } from "@/components/site/style-tokens"

/**
 * ComponentCatalog — the searchable component grid from the CD aurora-site home,
 * wired to OUR gallery so it can never drift: every tile is a NAV entry linking
 * to `/gallery/<slug>`, with the description pulled from the registry. Fuzzy
 * search + category (NAV group) chips, ported from the CD `palette.jsx` scorer.
 */

interface CatalogItem {
  slug: string
  label: string
  group: string
  desc: string
}

// Flatten the gallery NAV into a searchable catalog once, at module load.
const ITEMS: CatalogItem[] = NAV.flatMap((g) =>
  g.items.map((it) => ({
    slug: it.slug,
    label: it.label,
    group: g.group,
    desc: getRegistryMeta(it.slug)?.description ?? "",
  })),
)
const GROUPS = NAV.map((g) => g.group)

/** fuzzy subsequence scorer — higher is better, 0 = no match (ported from CD) */
function fuzzy(q: string, text: string): number {
  if (!q) return 1
  q = q.toLowerCase()
  text = text.toLowerCase()
  let ti = 0
  let score = 0
  let streak = 0
  let started = false
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi]
    let found = false
    while (ti < text.length) {
      if (text[ti] === ch) {
        found = true
        streak += 1
        score += streak * 2
        if (ti === 0 || /[\s\-_./]/.test(text[ti - 1])) score += 8
        if (!started && ti < 4) score += 4
        started = true
        ti += 1
        break
      }
      streak = 0
      ti += 1
    }
    if (!found) return 0
  }
  return score - text.length * 0.05
}

export function ComponentCatalog({ heading = "The catalog" }: { heading?: string }) {
  const [q, setQ] = React.useState("")
  const [cat, setCat] = React.useState<string>("all")

  const list = React.useMemo(() => {
    let l = ITEMS
    if (cat !== "all") l = l.filter((i) => i.group === cat)
    if (q) {
      l = l
        .map((i) => ({
          i,
          s: Math.max(fuzzy(q, i.label), fuzzy(q, i.desc) * 0.7, fuzzy(q, i.group) * 0.6),
        }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.i)
    }
    return l
  }, [q, cat])

  return (
    <section style={{ marginTop: "clamp(48px, 7vw, 84px)" }}>
      <div style={{ marginBottom: 16 }}>
        <span className="aurora-text-eyebrow" style={{ color: "var(--aurora-text-muted)" }}>
          {heading}
        </span>
        <h2
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontWeight: 800,
            fontSize: "clamp(24px, 3vw, 30px)",
            letterSpacing: "-0.03em",
            margin: "8px 0 0",
            color: "var(--aurora-text-primary)",
          }}
        >
          {ITEMS.length} components, one palette
        </h2>
      </div>

      {/* search + category chips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 20 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            maxWidth: 460,
            height: 42,
            padding: "0 12px",
            borderRadius: "var(--aurora-radius-1)",
            border: "1px solid var(--aurora-border-strong)",
            background: "var(--aurora-control-surface)",
          }}
        >
          <Search size={16} style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Fuzzy-search components…"
            className="aurora-text-control"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--aurora-text-primary)",
            }}
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

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {["all", ...GROUPS].map((g) => {
            const on = cat === g
            return (
              <button
                key={g}
                type="button"
                onClick={() => setCat(g)}
                className="aurora-text-control"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 11px",
                  borderRadius: 999,
                  cursor: "pointer",
                  border: on
                    ? `1px solid ${tint("--aurora-accent-primary", 45)}`
                    : "1px solid var(--aurora-border-default)",
                  background: on ? tint("--aurora-accent-primary", 12) : "transparent",
                  color: on ? "var(--aurora-accent-strong)" : "var(--aurora-text-muted)",
                }}
              >
                {g === "all" ? <LayoutGrid size={13} /> : null}
                {g === "all" ? "All" : g}
              </button>
            )
          })}
        </div>
      </div>

      {/* grid */}
      {list.length === 0 ? (
        <div style={{ padding: "56px 0", textAlign: "center", color: "var(--aurora-text-muted)" }}>
          <div style={{ fontSize: 14, fontWeight: 650, color: "var(--aurora-text-primary)" }}>
            No components match “{q}”
          </div>
          <div style={{ fontSize: 12.5, marginTop: 6 }}>Try a shorter query or clear the filter.</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))",
            gap: 16,
          }}
        >
          {list.map((c) => (
            <Link
              key={c.slug}
              href={`/gallery/${c.slug}`}
              className="aurora-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 7,
                padding: "16px 16px 15px",
                borderRadius: "var(--aurora-radius-2)",
                border: "1px solid var(--aurora-border-strong)",
                background: "var(--aurora-panel-strong)",
                boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
                transition: "transform 160ms var(--motion-ease-out), border-color 160ms var(--motion-ease-out)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--aurora-font-display)",
                    fontWeight: 800,
                    fontSize: 14.5,
                    letterSpacing: "-0.01em",
                    color: "var(--aurora-text-primary)",
                  }}
                >
                  {c.label}
                </span>
                <ArrowUpRight size={14} style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--aurora-text-muted)",
                  lineHeight: 1.45,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {c.desc}
              </span>
              <span
                style={{
                  marginTop: 2,
                  fontSize: 10.5,
                  fontFamily: "var(--aurora-font-mono)",
                  color: "var(--aurora-text-muted)",
                }}
              >
                {c.group}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default ComponentCatalog
