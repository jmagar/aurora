"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight, LayoutGrid, Search, X } from "lucide-react"
import { NAV } from "@/app/gallery/nav-data"
import { DEMOS } from "@/app/gallery/demo-map"
import { getRegistryMeta } from "@/lib/registry-meta"
import { fuzzy } from "@/lib/fuzzy"
import { CopyLine } from "@/components/site/site-ui"
import { tint } from "@/components/site/style-tokens"

/**
 * ComponentCatalog — the CD `aurora-site` LiveCatalog, wired to OUR gallery so
 * it can never drift: every tile is a gallery NAV entry rendering its real
 * gallery demo as a scaled live preview (lazy-mounted on scroll), and opening
 * a tile shows the interactive demo in a drawer with its install line.
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

/* ── Lazy live preview — CD LazyFrame, sans iframe ─────────────────────────
 * The demo renders at full width inside a scaled, non-interactive wrapper.
 * The scale transform also acts as a containing block, so demos that use
 * position:fixed (dialogs, drawers, palettes) stay inside their tile. */
const PREVIEW_W = 760
const PREVIEW_SCALE = 0.31
const PREVIEW_H = 470

function LazyPreview({ slug }: { slug: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)
  const Demo = DEMOS[slug]

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible(true)
      },
      { rootMargin: "300px" },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        width: PREVIEW_W * PREVIEW_SCALE,
        height: PREVIEW_H * PREVIEW_SCALE,
        overflow: "hidden",
        pointerEvents: "none",
        flexShrink: 0,
      }}
    >
      {visible && Demo ? (
        <div
          style={{
            width: PREVIEW_W,
            height: PREVIEW_H,
            overflow: "hidden",
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: "top left",
            padding: 16,
          }}
        >
          <Demo />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--aurora-accent-primary) 5%, transparent), transparent 60%)",
          }}
        />
      )}
    </div>
  )
}

function DrawerArrow({
  dir,
  target,
  onPick,
}: {
  dir: "left" | "right"
  target: CatalogItem | null
  onPick: (item: CatalogItem) => void
}) {
  return (
    <button
      type="button"
      disabled={!target}
      onClick={(e) => {
        e.stopPropagation()
        if (target) onPick(target)
      }}
      aria-label={target ? `${dir === "left" ? "Previous" : "Next"}: ${target.label}` : undefined}
      title={target ? `${dir === "left" ? "Previous" : "Next"}: ${target.label}` : undefined}
      className="grid size-[46px] flex-none place-items-center self-center rounded-[12px]"
      style={{
        background: "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-strong)",
        color: "var(--aurora-text-primary)",
        boxShadow: "var(--aurora-highlight-medium)",
        opacity: target ? 1 : 0.4,
        cursor: target ? "pointer" : "default",
      }}
    >
      {dir === "left" ? <ArrowLeft size={18} strokeWidth={1.75} /> : <ArrowRight size={18} strokeWidth={1.75} />}
    </button>
  )
}

/* ── Detail drawer — CD LiveDrawer, with prev/next arrows (CD
 * HeroComponentView parity): ←/→ keys and flanking arrow buttons cycle
 * through the currently filtered list. ─────────────────────────────────── */
function LiveDrawer({
  item,
  list,
  onPick,
  onClose,
}: {
  item: CatalogItem
  list: CatalogItem[]
  onPick: (item: CatalogItem) => void
  onClose: () => void
}) {
  const Demo = DEMOS[item.slug]
  const meta = getRegistryMeta(item.slug)

  const idx = list.findIndex((c) => c.slug === item.slug)
  const has = idx >= 0 && list.length > 1
  const prev = has ? list[(idx - 1 + list.length) % list.length] : null
  const next = has ? list[(idx + 1) % list.length] : null

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag && /INPUT|TEXTAREA|SELECT/.test(tag)) return
      if (e.key === "ArrowLeft" && prev) onPick(prev)
      else if (e.key === "ArrowRight" && next) onPick(next)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onPick, prev, next])

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "color-mix(in srgb, var(--aurora-page-bg) 62%, transparent)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        gap: 12,
        padding: "5vh 20px",
      }}
    >
      <DrawerArrow dir="left" target={prev} onPick={onPick} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={item.label}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(760px, 92vw)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "var(--aurora-radius-3)",
          background: "var(--aurora-panel-strong)",
          border: "1px solid var(--aurora-border-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid var(--aurora-border-default)" }}
        >
          <div className="min-w-0 flex-1">
            <div
              style={{
                fontFamily: "var(--aurora-font-display)",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "-0.02em",
                color: "var(--aurora-text-primary)",
              }}
            >
              {item.label}
            </div>
            <div className="aurora-text-code" style={{ fontSize: 11.5, color: "var(--aurora-text-muted)" }}>
              aurora · {item.group.toLowerCase()}
              {has ? ` · ${idx + 1} / ${list.length}` : null}
            </div>
          </div>
          <Link
            href={`/gallery/${item.slug}`}
            className="aurora-text-control flex items-center gap-1.5 rounded-[9px] border px-3 py-[7px]"
            style={{
              color: "var(--aurora-accent-strong)",
              borderColor: tint("--aurora-accent-primary", 34),
              background: tint("--aurora-accent-primary", 10),
            }}
          >
            Open in gallery <ArrowUpRight size={13} strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[32px] place-items-center rounded-[9px]"
            style={{ color: "var(--aurora-text-muted)" }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="aurora-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
          <div className="aurora-text-eyebrow mb-2.5" style={{ fontSize: 10 }}>
            Live preview · interactive
          </div>
          <div
            className="mb-5 overflow-hidden rounded-[var(--aurora-radius-2)] p-4"
            style={{
              background:
                "radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--aurora-accent-primary) 6%, transparent), transparent 60%), var(--aurora-control-surface)",
              border: "1px solid var(--aurora-border-default)",
            }}
          >
            {Demo ? <Demo /> : null}
          </div>

          {meta ? (
            <>
              <div className="aurora-text-eyebrow mb-2.5" style={{ fontSize: 10 }}>
                Install
              </div>
              <CopyLine cmd={`npx shadcn@latest add ${meta.installUrl}`} />
            </>
          ) : null}
        </div>
      </aside>
      <DrawerArrow dir="right" target={next} onPick={onPick} />
    </div>
  )
}

export function ComponentCatalog({ heading = "The catalog" }: { heading?: string }) {
  const [q, setQ] = React.useState("")
  const [cat, setCat] = React.useState<string>("all")
  const [open, setOpen] = React.useState<CatalogItem | null>(null)

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
          Components{" "}
          <span
            className="aurora-text-code"
            style={{ fontWeight: 500, fontSize: "0.6em", color: "var(--aurora-text-muted)" }}
          >
            {ITEMS.length} live
          </span>
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
            gridTemplateColumns: "repeat(auto-fill, minmax(236px, 1fr))",
            gap: 16,
          }}
        >
          {list.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setOpen(c)}
              className="aurora-card"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                borderRadius: "var(--aurora-radius-2)",
                border: "1px solid var(--aurora-border-default)",
                background: "var(--aurora-panel-medium)",
                boxShadow: "var(--aurora-shadow-subtle), var(--aurora-highlight-medium)",
                transition:
                  "transform 160ms var(--motion-ease-out), border-color 160ms var(--motion-ease-out)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  justifyItems: "center",
                  overflow: "hidden",
                  background:
                    "radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--aurora-accent-primary) 6%, transparent), transparent 60%), var(--aurora-control-surface)",
                  borderBottom: "1px solid var(--aurora-border-default)",
                }}
              >
                <LazyPreview slug={c.slug} />
              </div>
              <div style={{ padding: "11px 13px 13px", display: "flex", flexDirection: "column", gap: 6 }}>
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
                    marginTop: 2,
                    fontSize: 10.5,
                    fontFamily: "var(--aurora-font-mono)",
                    color: "var(--aurora-text-muted)",
                  }}
                >
                  {c.group}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {open ? (
        <LiveDrawer
          item={open}
          list={list.length > 0 ? list : ITEMS}
          onPick={setOpen}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  )
}

export default ComponentCatalog
