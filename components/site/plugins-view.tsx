"use client"

import * as React from "react"

import {
  Marketplace,
  type MarketplaceCatalogItem,
  type MarketplaceSource,
} from "@/registry/aurora/blocks/workspace/marketplace/marketplace"
import { CodeBlock } from "@/registry/aurora/blocks/workspace/code-block/code-block"
import { StatCard, StatGrid } from "@/registry/aurora/ui/stat-card"

import catalog from "@/lib/dendrite-catalog.json"

// The /plugins viewer renders a read-only snapshot of the dendrite plugin
// marketplace (jmagar/dendrite). Refresh the snapshot with `pnpm dendrite:sync`.

type CatalogPlugin = (typeof catalog.plugins)[number]

const INSTALL_CODE = `# Claude Code
/plugin marketplace add jmagar/dendrite
/plugin install <name>@dendrite

# Codex — no-MCP variant (MCP servers flow through the Labby gateway)
/plugin marketplace add jmagar/dendrite@marketplace-no-mcp

# Gemini CLI — ${catalog.counts.geminiExtensions} plugins bundle a gemini-extension.json manifest`

const SOURCES: MarketplaceSource[] = [
  {
    id: "dendrite",
    name: "dendrite",
    owner: catalog.marketplace.owner,
    repository: catalog.marketplace.repository,
    description: catalog.marketplace.description,
    pluginCount: catalog.counts.plugins,
    installedCount: 0,
    autoUpdate: true,
    lastUpdated: "main",
  },
  {
    id: "dendrite-no-mcp",
    name: "dendrite (No-MCP)",
    owner: catalog.marketplace.owner,
    repository: `${catalog.marketplace.repository}@${catalog.marketplace.branches.codex}`,
    description:
      "Codex marketplace variant without bundled MCP server registrations — for setups where MCP already flows through the Labby gateway.",
    pluginCount: catalog.counts.plugins,
    installedCount: 0,
    lastUpdated: catalog.marketplace.branches.codex,
  },
]

function subtitleFor(plugin: CatalogPlugin) {
  const parts: string[] = []
  const c = plugin.components
  if (c) {
    if (c.skills > 0) parts.push(`${c.skills} ${c.skills === 1 ? "Skill" : "Skills"}`)
    if (c.commands > 0) parts.push(`${c.commands} ${c.commands === 1 ? "Command" : "Commands"}`)
    if (c.agents > 0) parts.push(`${c.agents} ${c.agents === 1 ? "Agent" : "Agents"}`)
    if (c.hooks > 0) parts.push("Hooks")
    if (c.mcp) parts.push("MCP")
  }
  if (plugin.gemini) parts.push("Gemini")
  if (parts.length === 0) parts.push(plugin.source.kind === "github" ? "External Repo" : "Plugin")
  return parts.join(" · ")
}

const HOMEPAGES: Record<string, string | null> = Object.fromEntries(
  catalog.plugins.map((plugin) => [plugin.name, plugin.homepage]),
)

const ITEMS: MarketplaceCatalogItem[] = catalog.plugins.map((plugin) => ({
  id: plugin.name,
  kind: "plugin",
  name: plugin.name,
  subtitle: subtitleFor(plugin),
  description: plugin.description,
  sourceId: "dendrite",
  sourceName: "dendrite",
  ecosystem: plugin.gemini ? "Claude · Codex · Gemini" : "Claude · Codex",
  distribution: plugin.source.kind === "github" ? plugin.source.repo ?? "GitHub" : "dendrite",
  version: plugin.gemini?.version ?? undefined,
  tags: plugin.keywords.slice(0, 4),
}))

export function PluginsView() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20">
      <section className="flex flex-col gap-3 pt-14 pb-8">
        <p className="aurora-text-eyebrow" style={{ color: "var(--aurora-accent-strong)" }}>
          Plugins
        </p>
        <h1 className="aurora-text-display-2">One Marketplace, Three Agents</h1>
        <p className="aurora-text-body max-w-2xl" style={{ color: "var(--aurora-text-muted)" }}>
          The dendrite marketplace packages agent skills, MCP integrations, hooks, commands, and
          companion agents for Claude Code and Codex, with Gemini CLI extension manifests bundled
          per plugin. This catalog is a read-only snapshot of{" "}
          <a
            href="https://github.com/jmagar/dendrite"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--aurora-accent-strong)" }}
          >
            jmagar/dendrite
          </a>
          .
        </p>
        <StatGrid className="pt-4" aria-label="Marketplace stats">
          <StatCard compact label="Plugins" value={catalog.counts.plugins} />
          <StatCard compact label="Gemini Extensions" value={catalog.counts.geminiExtensions} />
          <StatCard compact label="MCP Plugins" value={catalog.counts.withMcp} />
          <StatCard compact label="External Repos" value={catalog.counts.githubSourced} />
        </StatGrid>
      </section>

      <section className="pb-10" aria-label="Install">
        <CodeBlock code={INSTALL_CODE} language="bash" filename="install.sh" />
      </section>

      <section aria-label="Plugin catalog">
        <Marketplace
          sources={SOURCES}
          items={ITEMS}
          readOnlyPreview
          eyebrow="dendrite"
          heading="Plugin Catalog"
          intro="Every plugin in the dendrite marketplace — skills, commands, agents, hooks, MCP servers, and Gemini extension manifests."
          previewNote="Read-only catalog snapshot. Install from your agent CLI with the commands above."
          onItemAction={(item) => {
            const homepage = HOMEPAGES[item.name]
            if (homepage) window.open(homepage, "_blank", "noopener,noreferrer")
          }}
        />
      </section>
    </main>
  )
}
