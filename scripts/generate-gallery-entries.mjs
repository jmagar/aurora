#!/usr/bin/env node
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const source = readFileSync(resolve(root, "app/gallery/demo-map.tsx"), "utf8")
const entryPattern = /(?:"([^"]+)"|([a-zA-Z0-9-]+))\s*:\s*dynamic\(\(\)\s*=>\s*import\("\.\/demos\/([^"]+)"\)\)/g
const entries = new Map()
for (const match of source.matchAll(entryPattern)) entries.set(match[1] ?? match[2], match[3])

const aiStart = source.indexOf("AI_DEMOS: Record")
const aiEnd = source.indexOf("AI_CANONICAL_DEMOS")
if (aiStart < 0 || aiEnd <= aiStart) throw new Error("Unable to locate AI_DEMOS in demo-map.tsx")
for (const match of source.slice(aiStart, aiEnd).matchAll(entryPattern)) entries.set(`ai-${match[1] ?? match[2]}`, match[3])

const outputDir = resolve(root, "app/gallery/entries")
rmSync(outputDir, { recursive: true, force: true })
mkdirSync(outputDir, { recursive: true })
for (const [slug, moduleName] of [...entries].sort(([a], [b]) => a.localeCompare(b))) {
  writeFileSync(resolve(outputDir, `${slug}.tsx`), `export { default } from "../demos/${moduleName}"\n`)
}
const manifest = Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(resolve(root, "lib/gallery-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Generated ${entries.size} route-specific gallery entries.`)
