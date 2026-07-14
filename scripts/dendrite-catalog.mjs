#!/usr/bin/env node
// Snapshot the dendrite plugin marketplace into lib/dendrite-catalog.json for
// the /plugins viewer. Reads a local checkout of jmagar/dendrite — set
// DENDRITE_DIR to override the default sibling path. Rerun via
// `pnpm dendrite:sync` whenever the marketplace changes, and commit the JSON.

import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const dendriteDir = process.env.DENDRITE_DIR ?? resolve(repoRoot, "..", "..", "dendrite")
// Worktrees live under <repo>/.worktrees/<slug>, so also try two levels up from
// a primary-checkout sibling layout before giving up.
const candidates = [
  dendriteDir,
  resolve(repoRoot, "..", "dendrite"),
  resolve(process.env.HOME ?? "", "workspace", "dendrite"),
]
const root = candidates.find((c) => existsSync(join(c, ".claude-plugin", "marketplace.json")))
if (!root) {
  console.error(`dendrite checkout not found; tried:\n  ${candidates.join("\n  ")}\nSet DENDRITE_DIR.`)
  process.exit(1)
}

const marketplace = JSON.parse(readFileSync(join(root, ".claude-plugin", "marketplace.json"), "utf8"))

function readJsonIf(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"))
  } catch {
    return null
  }
}

function countEntries(dir, ext) {
  if (!existsSync(dir)) return 0
  try {
    return readdirSync(dir).filter((f) => {
      const p = join(dir, f)
      if (ext) return f.endsWith(ext)
      return statSync(p).isDirectory() || f.endsWith(".md")
    }).length
  } catch {
    return 0
  }
}

const plugins = marketplace.plugins.map((entry) => {
  const isLocal = typeof entry.source === "string" && entry.source.startsWith("./")
  const pluginDir = isLocal ? join(root, entry.source) : null
  const manifest = pluginDir ? readJsonIf(join(pluginDir, ".claude-plugin", "plugin.json")) : null
  const gemini = pluginDir ? readJsonIf(join(pluginDir, "gemini-extension.json")) : null

  const components = pluginDir
    ? {
        skills: countEntries(join(pluginDir, "skills")),
        commands: countEntries(join(pluginDir, "commands"), ".md"),
        agents: countEntries(join(pluginDir, "agents"), ".md"),
        hooks: existsSync(join(pluginDir, "hooks")) ? 1 : 0,
        mcp: existsSync(join(pluginDir, ".mcp.json")) || existsSync(join(pluginDir, "mcp.json")),
      }
    : null

  return {
    name: entry.name,
    description: entry.description ?? manifest?.description ?? "",
    source: isLocal ? { kind: "local", path: entry.source } : { kind: "github", repo: entry.source?.repo ?? null },
    // Some plugin manifests carry stale homepage values; for local plugins the
    // dendrite tree path is authoritative unless the manifest already points there.
    homepage: isLocal
      ? manifest?.homepage?.includes("/dendrite")
        ? manifest.homepage
        : `https://github.com/jmagar/dendrite/tree/main/${entry.source.replace(/^\.\//, "")}`
      : entry.source?.repo
        ? `https://github.com/${entry.source.repo}`
        : null,
    license: manifest?.license ?? null,
    keywords: manifest?.keywords ?? [],
    components,
    gemini: gemini
      ? {
          version: gemini.version ?? null,
          settings: Array.isArray(gemini.settings) ? gemini.settings.length : 0,
          mcpServers: gemini.mcpServers ? Object.keys(gemini.mcpServers).length : 0,
        }
      : null,
  }
})

const catalog = {
  marketplace: {
    name: marketplace.name,
    owner: marketplace.owner?.name ?? "jmagar",
    description: marketplace.description ?? "",
    repository: "jmagar/dendrite",
    branches: { claude: "main", codex: "marketplace-no-mcp" },
  },
  counts: {
    plugins: plugins.length,
    geminiExtensions: plugins.filter((p) => p.gemini).length,
    withMcp: plugins.filter((p) => p.components?.mcp).length,
    githubSourced: plugins.filter((p) => p.source.kind === "github").length,
  },
  plugins,
}

const outPath = join(repoRoot, "lib", "dendrite-catalog.json")
writeFileSync(outPath, JSON.stringify(catalog, null, 2) + "\n")
console.log(`wrote ${outPath}: ${catalog.counts.plugins} plugins, ${catalog.counts.geminiExtensions} gemini extensions, ${catalog.counts.withMcp} with MCP`)
