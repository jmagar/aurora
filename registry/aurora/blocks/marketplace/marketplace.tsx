"use client"

import * as React from "react"
import {
  Bot,
  Boxes,
  Code2,
  FileCode2,
  Grid2X2,
  LayoutList,
  Plus,
  RefreshCw,
  Server,
  ShoppingBag,
  Sparkles,
  TerminalSquare,
} from "lucide-react"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"
import { DescriptionItem, DescriptionList } from "@/registry/aurora/ui/description-list"
import { FilterBar, FilterSearch, FilterTagRose } from "@/registry/aurora/ui/filter-bar"
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/registry/aurora/ui/sheet"
import { StatCard, StatGrid } from "@/registry/aurora/ui/stat-card"
import { StatusIndicator } from "@/registry/aurora/ui/status-indicator"

export type MarketplaceKind =
  | "plugin"
  | "skill"
  | "command"
  | "mcp_server"
  | "acp_agent"
  | "app"
  | "hook"
  | "source"

export type MarketplaceLens = "all" | "installed" | "plugins" | "mcp_servers" | "acp_agents" | "sources"
export type MarketplaceViewMode = "cards" | "table"

export interface MarketplaceSource {
  id: string
  name: string
  owner: string
  description: string
  repository?: string
  pluginCount: number
  installedCount: number
  autoUpdate?: boolean
  lastUpdated?: string
}

export interface MarketplaceCatalogItem {
  id: string
  kind: MarketplaceKind
  name: string
  subtitle: string
  description: string
  sourceId?: string
  sourceName?: string
  ecosystem: string
  distribution?: string
  version?: string
  installed?: boolean
  hasUpdate?: boolean
  builtin?: boolean
  tags?: string[]
  updatedAt?: string
}

export interface MarketplaceProps {
  sources?: MarketplaceSource[]
  items?: MarketplaceCatalogItem[]
  readOnlyPreview?: boolean
  onAddSource?: () => void
  onRefresh?: () => void
  onItemAction?: (item: MarketplaceCatalogItem) => void
}

const DEMO_SOURCES: MarketplaceSource[] = [
  {
    id: "labby-marketplace",
    name: "labby-marketplace",
    owner: "jmagar",
    repository: "jmagar/labby-marketplace",
    description: "Operator plugins, Aurora components, and Labby workflow tools.",
    pluginCount: 42,
    installedCount: 18,
    autoUpdate: true,
    lastUpdated: "2h ago",
  },
  {
    id: "mcp-registry",
    name: "MCP Registry",
    owner: "modelcontextprotocol",
    repository: "registry.modelcontextprotocol.io",
    description: "Official MCP server catalog with package and transport metadata.",
    pluginCount: 128,
    installedCount: 9,
    autoUpdate: true,
    lastUpdated: "15m ago",
  },
  {
    id: "acp-registry",
    name: "ACP Registry",
    owner: "agent-client-protocol",
    description: "Installable ACP agent providers for controller and node runtimes.",
    pluginCount: 16,
    installedCount: 4,
    lastUpdated: "1d ago",
  },
]

const DEMO_ITEMS: MarketplaceCatalogItem[] = [
  {
    id: "aurora-design@labby-marketplace",
    kind: "plugin",
    name: "aurora-design",
    subtitle: "Labby design system plugin",
    description: "Aurora components, skills, and registry helpers for gateway-admin surfaces.",
    sourceId: "labby-marketplace",
    sourceName: "labby-marketplace",
    ecosystem: "Claude",
    distribution: "plugin",
    version: "0.7.7",
    installed: true,
    hasUpdate: true,
    tags: ["ui", "design-system", "shadcn"],
    updatedAt: "2h ago",
  },
  {
    id: "github-mcp@mcp-registry",
    kind: "mcp_server",
    name: "github-mcp",
    subtitle: "io.github.github/github-mcp-server",
    description: "MCP server for repository inspection, issues, pull requests, and workflow state.",
    sourceId: "mcp-registry",
    sourceName: "MCP Registry",
    ecosystem: "MCP",
    distribution: "Docker",
    version: "latest",
    installed: true,
    tags: ["git", "repo", "automation"],
    updatedAt: "15m ago",
  },
  {
    id: "agent-sdk-verifier@acp-registry",
    kind: "acp_agent",
    name: "Agent SDK verifier",
    subtitle: "ACP provider",
    description: "Verification agent for Python and TypeScript Agent SDK behavior.",
    sourceId: "acp-registry",
    sourceName: "ACP Registry",
    ecosystem: "ACP",
    distribution: "npm",
    installed: false,
    tags: ["verification", "sdk"],
    updatedAt: "1d ago",
  },
  {
    id: "rust-bin-tools@labby-marketplace",
    kind: "plugin",
    name: "rust-bin-tools",
    subtitle: "Release and registry operations",
    description: "Project drift checks, MCP registry publish helpers, Aurora checklists, and release workflows.",
    sourceId: "labby-marketplace",
    sourceName: "labby-marketplace",
    ecosystem: "Codex",
    distribution: "plugin",
    version: "1.4.0",
    installed: true,
    tags: ["rust", "release", "registry"],
    updatedAt: "5h ago",
  },
  {
    id: "skill-reviewer@labby-marketplace",
    kind: "skill",
    name: "skill-reviewer",
    subtitle: "Codex skill component",
    description: "Review local skill files for trigger quality, scope, progressive disclosure, and install readiness.",
    sourceId: "labby-marketplace",
    sourceName: "labby-marketplace",
    ecosystem: "Codex",
    distribution: "skill",
    installed: false,
    tags: ["quality", "skills"],
    updatedAt: "3d ago",
  },
  {
    id: "plugin-sync@labby-marketplace",
    kind: "command",
    name: "plugin-sync",
    subtitle: "Marketplace command",
    description: "Synchronize installed plugin artifacts into a Lab-managed stash workspace.",
    sourceId: "labby-marketplace",
    sourceName: "labby-marketplace",
    ecosystem: "Claude",
    distribution: "command",
    installed: false,
    builtin: true,
    tags: ["workspace", "deploy"],
    updatedAt: "6d ago",
  },
]

const KIND_META: Record<MarketplaceKind, { label: string; icon: React.ReactNode }> = {
  plugin: { label: "Plugin", icon: <Boxes className="size-4" aria-hidden /> },
  skill: { label: "Skill", icon: <Sparkles className="size-4" aria-hidden /> },
  command: { label: "Command", icon: <TerminalSquare className="size-4" aria-hidden /> },
  mcp_server: { label: "MCP server", icon: <Server className="size-4" aria-hidden /> },
  acp_agent: { label: "ACP agent", icon: <Bot className="size-4" aria-hidden /> },
  app: { label: "App", icon: <Code2 className="size-4" aria-hidden /> },
  hook: { label: "Hook", icon: <FileCode2 className="size-4" aria-hidden /> },
  source: { label: "Source", icon: <ShoppingBag className="size-4" aria-hidden /> },
}

function itemActionLabel(item: MarketplaceCatalogItem, readOnlyPreview: boolean) {
  if (item.kind === "source") return "Filter source"
  if (readOnlyPreview) return item.installed ? "Preview removal" : "Preview install"
  if (item.installed) return item.hasUpdate ? "Update" : "Remove"
  if (item.kind === "acp_agent") return "Wire agent"
  if (item.kind === "mcp_server") return "Install"
  if (item.kind !== "plugin") return "Install component"
  return "Install"
}

function itemMatchesLens(item: MarketplaceCatalogItem, lens: MarketplaceLens) {
  if (lens === "all") return true
  if (lens === "installed") return Boolean(item.installed)
  if (lens === "plugins") return item.kind === "plugin" || item.kind === "skill" || item.kind === "command"
  if (lens === "mcp_servers") return item.kind === "mcp_server"
  if (lens === "acp_agents") return item.kind === "acp_agent"
  if (lens === "sources") return item.kind === "source"
  return true
}

function identityInitials(name: string) {
  return name
    .replace(/[-_/]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function IdentityMark({ item }: { item: MarketplaceCatalogItem }) {
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border"
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "var(--aurora-border-default)",
        color: item.kind === "plugin" ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-display)",
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "-0.02em",
      }}
    >
      {item.kind === "plugin" ? identityInitials(item.name) : KIND_META[item.kind].icon}
    </div>
  )
}

function CatalogCard({
  item,
  readOnlyPreview,
  onAction,
}: {
  item: MarketplaceCatalogItem
  readOnlyPreview: boolean
  onAction?: (item: MarketplaceCatalogItem) => void
}) {
  const installed = Boolean(item.installed)
  const stateLabel = item.hasUpdate ? "Update" : installed ? "Installed" : item.builtin ? "Built-in" : KIND_META[item.kind].label

  return (
    <article
      className="grid min-h-[220px] w-full min-w-0 grid-rows-[auto_1fr_auto] gap-3 rounded-[8px] border p-4 text-left transition-all hover:-translate-y-px focus-visible:outline-none"
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-medium), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-3">
        <IdentityMark item={item} />
        <div className="min-w-0">
          <h3 className="truncate aurora-text-section" style={{ fontSize: 15 }}>
            {item.name}
          </h3>
          <p className="truncate aurora-text-meta" style={{ marginTop: 3 }}>
            {item.subtitle}
          </p>
        </div>
        <Badge variant={item.hasUpdate ? "warn" : installed ? "success" : "default"} dot>
          {stateLabel}
        </Badge>
      </div>

      <div className="min-w-0">
        <p className="line-clamp-3 aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
          {item.description || "No description provided."}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[item.ecosystem, item.distribution, item.sourceName, ...(item.tags ?? [])]
            .filter(Boolean)
            .slice(0, 5)
            .map((tag) => (
              <Badge key={tag} variant={tag === item.sourceName ? "rose" : "default"}>
                {tag}
              </Badge>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-3" style={{ borderColor: "var(--aurora-border-default)" }}>
        <span className="aurora-text-meta">{item.version ? `v${item.version}` : item.updatedAt ?? "latest"}</span>
        <Button variant={item.kind === "acp_agent" ? "rose" : "aurora"} size="sm" type="button" onClick={() => onAction?.(item)}>
          {itemActionLabel(item, readOnlyPreview)}
        </Button>
      </div>
    </article>
  )
}

function SourceCard({ source, onClick }: { source: MarketplaceSource; onClick: () => void }) {
  return (
    <Button variant="plain" size="unstyled"
      type="button"
      onClick={onClick}
      className="grid gap-3 rounded-[8px] border p-4 text-left transition-all hover:-translate-y-px focus-visible:outline-none"
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-default)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.035)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border"
          style={{
            background: "var(--aurora-control-surface)",
            borderColor: "var(--aurora-border-strong)",
            color: "var(--aurora-accent-primary)",
            fontFamily: "var(--aurora-font-display)",
            fontWeight: 800,
          }}
        >
          {identityInitials(source.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>
            {source.name}
          </p>
          <p className="truncate aurora-text-meta">by {source.owner}</p>
        </div>
        {source.autoUpdate && <StatusIndicator tone="syncing" label="Auto" style={{ marginLeft: "auto", fontSize: 11 }} />}
      </div>
      <p className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
        {source.description}
      </p>
      <div className="flex flex-wrap items-center gap-2 border-t pt-3" style={{ borderColor: "var(--aurora-border-default)" }}>
        <span className="aurora-text-meta">{source.installedCount} installed</span>
        <span className="aurora-text-meta">{source.pluginCount} available</span>
        <span className="ml-auto truncate aurora-text-code" style={{ color: "var(--aurora-text-muted)", fontSize: 11 }}>
          {source.repository ?? source.id}
        </span>
      </div>
    </Button>
  )
}

export function Marketplace({
  sources = DEMO_SOURCES,
  items = DEMO_ITEMS,
  readOnlyPreview = false,
  onAddSource,
  onRefresh,
  onItemAction,
}: MarketplaceProps) {
  const [lens, setLens] = React.useState<MarketplaceLens>("all")
  const [query, setQuery] = React.useState("")
  const [type, setType] = React.useState<MarketplaceKind | "all">("all")
  const [sourceId, setSourceId] = React.useState<string | "all">("all")
  const [view, setView] = React.useState<MarketplaceViewMode>("cards")
  const [selected, setSelected] = React.useState<MarketplaceCatalogItem | null>(null)

  const sourceItems = React.useMemo<MarketplaceCatalogItem[]>(
    () =>
      sources.map((source) => ({
        id: source.id,
        kind: "source" as const,
        name: source.name,
        subtitle: source.repository ?? source.owner,
        description: source.description,
        sourceId: source.id,
        sourceName: source.name,
        ecosystem: "Source",
        distribution: source.autoUpdate ? "auto-update" : "manual",
        installed: source.installedCount > 0,
        tags: [source.owner],
        updatedAt: source.lastUpdated,
      })),
    [sources]
  )

  const allItems = React.useMemo(() => [...sourceItems, ...items], [items, sourceItems])
  const filteredItems = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    return allItems.filter((item) => {
      const matchesLens = itemMatchesLens(item, lens)
      const matchesType = type === "all" || item.kind === type
      const matchesSource = sourceId === "all" || item.sourceId === sourceId
      const text = [item.name, item.subtitle, item.description, item.sourceName, item.ecosystem, item.distribution, ...(item.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return matchesLens && matchesType && matchesSource && (!needle || text.includes(needle))
    })
  }, [allItems, lens, query, sourceId, type])

  const summary = React.useMemo(() => {
    const catalog = allItems.filter((item) => item.kind !== "source")
    return {
      all: allItems.length,
      installed: catalog.filter((item) => item.installed).length,
      plugins: catalog.filter((item) => item.kind === "plugin" || item.kind === "skill" || item.kind === "command").length,
      mcpServers: catalog.filter((item) => item.kind === "mcp_server").length,
      acpAgents: catalog.filter((item) => item.kind === "acp_agent").length,
      sources: sources.length,
      updates: catalog.filter((item) => item.hasUpdate).length,
    }
  }, [allItems, sources.length])

  const typeOptions = React.useMemo(() => {
    const set = new Set(allItems.map((item) => item.kind))
    return [...set].filter((value) => value !== "source")
  }, [allItems])

  function handleAction(item: MarketplaceCatalogItem) {
    setSelected(item)
    onItemAction?.(item)
  }

  function clearFilters() {
    setQuery("")
    setType("all")
    setSourceId("all")
  }

  return (
    <section className="grid gap-5">
      <div className="rounded-[var(--aurora-radius-2)] border p-5" style={{ background: "var(--aurora-panel-medium)", borderColor: "var(--aurora-border-default)" }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="aurora-text-eyebrow" style={{ color: "var(--aurora-text-muted)" }}>Operator catalog</p>
            <h2 className="aurora-text-section" style={{ fontSize: 28, marginTop: 8 }}>Marketplace</h2>
            <p className="mt-2 max-w-3xl aurora-text-body" style={{ color: "var(--aurora-text-muted)" }}>
              Browse Claude and Codex plugins, MCP Registry servers, ACP agents, and installable components through one Labby catalog.
            </p>
            {readOnlyPreview && (
              <p className="mt-3 aurora-text-control" style={{ color: "var(--aurora-accent-strong)" }}>
                Dev preview: reads are live; install, remove, source, and wiring mutations are blocked.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="neutral" size="sm" onClick={() => setView(view === "cards" ? "table" : "cards")}>
              {view === "cards" ? <LayoutList className="size-3.5" aria-hidden /> : <Grid2X2 className="size-3.5" aria-hidden />}
              {view === "cards" ? "Table view" : "Card view"}
            </Button>
            <Button variant="neutral" size="sm" onClick={onAddSource}>
              <Plus className="size-3.5" aria-hidden />
              Add source
            </Button>
            <Button variant="aurora" size="sm" onClick={onRefresh}>
              <RefreshCw className="size-3.5" aria-hidden />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <StatGrid>
        <Button variant="plain" size="unstyled" type="button" onClick={() => setLens("all")} className="text-left"><StatCard label="All items" value={summary.all} description="Sources and catalog entries" tone={lens === "all" ? "info" : "neutral"} /></Button>
        <Button variant="plain" size="unstyled" type="button" onClick={() => setLens("installed")} className="text-left"><StatCard label="Installed" value={summary.installed} description="Ready on this controller" tone={lens === "installed" ? "success" : "neutral"} /></Button>
        <Button variant="plain" size="unstyled" type="button" onClick={() => setLens("plugins")} className="text-left"><StatCard label="Plugins" value={summary.plugins} description="Plugins, skills, commands" tone={lens === "plugins" ? "info" : "neutral"} /></Button>
        <Button variant="plain" size="unstyled" type="button" onClick={() => setLens("mcp_servers")} className="text-left"><StatCard label="MCP servers" value={summary.mcpServers} description="Registry server entries" tone={lens === "mcp_servers" ? "info" : "neutral"} /></Button>
        <Button variant="plain" size="unstyled" type="button" onClick={() => setLens("acp_agents")} className="text-left"><StatCard label="ACP agents" value={summary.acpAgents} description="Provider wiring targets" tone={lens === "acp_agents" ? "warn" : "neutral"} /></Button>
        <Button variant="plain" size="unstyled" type="button" onClick={() => setLens("sources")} className="text-left"><StatCard label="Sources" value={summary.sources} description={`${summary.updates} updates available`} tone={lens === "sources" ? "info" : "neutral"} /></Button>
      </StatGrid>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="grid gap-4 self-start rounded-[var(--aurora-radius-2)] border p-4" style={{ background: "var(--aurora-panel-medium)", borderColor: "var(--aurora-border-default)" }}>
          <FilterBar showClearAll={Boolean(query || type !== "all" || sourceId !== "all")} onClearAll={clearFilters}>
            <FilterSearch value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} placeholder="Search marketplace" />
          </FilterBar>

          <div className="grid gap-3">
            <p className="aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>Type</p>
            <div className="flex flex-wrap gap-2">
              <Button variant={type === "all" ? "aurora" : "neutral"} size="sm" onClick={() => setType("all")}>All</Button>
              {typeOptions.map((option) => (
                <Button key={option} variant={type === option ? "aurora" : "neutral"} size="sm" onClick={() => setType(option)}>
                  {KIND_META[option].label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <p className="aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>Source</p>
            <div className="grid gap-2">
              <Button variant={sourceId === "all" ? "aurora" : "neutral"} size="sm" onClick={() => setSourceId("all")}>All sources</Button>
              {sources.map((source) => (
                <Button key={source.id} variant={sourceId === source.id ? "rose" : "neutral"} size="sm" onClick={() => setSourceId(source.id)}>
                  {source.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 border-t pt-4" style={{ borderColor: "var(--aurora-border-default)" }}>
            <p className="aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>Sources</p>
            {sources.map((source) => (
              <SourceCard key={source.id} source={source} onClick={() => { setLens("all"); setSourceId(source.id) }} />
            ))}
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="aurora-text-meta">{filteredItems.length} results</p>
            <div className="flex flex-wrap gap-2">
              {query && <FilterTagRose onRemove={() => setQuery("")}>Search: {query}</FilterTagRose>}
              {type !== "all" && <FilterTagRose onRemove={() => setType("all")}>{KIND_META[type].label}</FilterTagRose>}
              {sourceId !== "all" && <FilterTagRose onRemove={() => setSourceId("all")}>{sources.find((source) => source.id === sourceId)?.name ?? sourceId}</FilterTagRose>}
            </div>
          </div>

          {view === "cards" ? (
            <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
              {filteredItems.map((item) => <CatalogCard key={item.id} item={item} readOnlyPreview={readOnlyPreview} onAction={handleAction} />)}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[8px] border" style={{ background: "var(--aurora-panel-medium)", borderColor: "var(--aurora-border-strong)" }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr>
                      {["Item", "Type", "Source", "Version", "State", "Action"].map((heading) => (
                        <th key={heading} className="px-4 py-2.5 text-left aurora-text-label" style={{ color: "var(--aurora-text-muted)", borderBottom: "1px solid var(--aurora-border-default)" }}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="cursor-pointer" onClick={() => handleAction(item)}>
                        <td className="px-4 py-3" style={{ borderBottom: "1px solid var(--aurora-border-default)" }}>
                          <div className="flex items-center gap-3">
                            <IdentityMark item={item} />
                            <div className="min-w-0">
                              <p className="truncate aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{item.name}</p>
                              <p className="truncate aurora-text-meta">{item.description || item.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 aurora-text-table" style={{ borderBottom: "1px solid var(--aurora-border-default)" }}>{KIND_META[item.kind].label}</td>
                        <td className="px-4 py-3 aurora-text-table" style={{ borderBottom: "1px solid var(--aurora-border-default)" }}>{item.sourceName ?? item.subtitle}</td>
                        <td className="px-4 py-3 aurora-text-table" style={{ borderBottom: "1px solid var(--aurora-border-default)" }}>{item.version ?? "latest"}</td>
                        <td className="px-4 py-3" style={{ borderBottom: "1px solid var(--aurora-border-default)" }}>
                          <StatusIndicator tone={item.hasUpdate ? "degraded" : item.installed ? "online" : item.builtin ? "queued" : "offline"} label={item.hasUpdate ? "Update" : item.installed ? "Installed" : item.builtin ? "Built-in" : "Available"} />
                        </td>
                        <td className="px-4 py-3 text-right" style={{ borderBottom: "1px solid var(--aurora-border-default)" }}>
                          <Button variant={item.kind === "acp_agent" ? "rose" : "aurora"} size="sm" type="button">{itemActionLabel(item, readOnlyPreview)}</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle style={{ fontFamily: "var(--aurora-font-display)", fontSize: 18, fontWeight: 760 }}>
              {selected?.name ?? "Marketplace item"}
            </SheetTitle>
            <SheetDescription className="aurora-text-body-sm">
              {selected?.description}
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            {selected && (
              <div className="grid gap-4">
                <DescriptionList>
                  <DescriptionItem label="Kind" value={KIND_META[selected.kind].label} />
                  <DescriptionItem label="Source" value={selected.sourceName ?? selected.sourceId ?? "None"} />
                  <DescriptionItem label="Ecosystem" value={selected.ecosystem} />
                  <DescriptionItem label="Distribution" value={selected.distribution ?? "Latest"} />
                  <DescriptionItem label="Version" value={selected.version ?? "Latest"} />
                  <DescriptionItem label="State" value={selected.hasUpdate ? "Update available" : selected.installed ? "Installed" : selected.builtin ? "Built-in" : "Available"} />
                </DescriptionList>
                <div className="flex flex-wrap gap-2">
                  {(selected.tags ?? []).map((tag) => <Badge key={tag}>{tag}</Badge>)}
                </div>
                <Button variant={selected.kind === "acp_agent" ? "rose" : "aurora"}>
                  {itemActionLabel(selected, readOnlyPreview)}
                </Button>
              </div>
            )}
          </SheetBody>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default Marketplace
