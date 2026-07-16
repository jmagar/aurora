#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

if (!existsSync(".next")) throw new Error(".next is missing; run a production build before web budget checks")
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}
const files = walk(".next")
const chunks = files.filter((file) => file.includes("/static/chunks/") && file.endsWith(".js"))
const largestChunk = Math.max(0, ...chunks.map((file) => statSync(file).size))
// Standalone output mirrors server manifests; count the canonical server copy once.
const manifestBytes = files.filter((file) => file.endsWith("_client-reference-manifest.js") && !file.includes("/standalone/")).reduce((sum, file) => sum + statSync(file).size, 0)
const pluginHtml = files.find((file) => /(?:^|\/)plugins\.html$/.test(file))
const htmlBytes = pluginHtml ? statSync(pluginHtml).size : 0
const budgets = { largestChunk: [largestChunk, 850 * 1024], clientReferenceManifests: [manifestBytes, 700 * 1024], pluginsHtml: [htmlBytes, 180 * 1024] }
const failures = Object.entries(budgets).filter(([, [actual, limit]]) => actual > limit)
if (failures.length) throw new Error(failures.map(([name, [actual, limit]]) => `${name}: ${actual} > ${limit}`).join("\n"))
console.log(JSON.stringify(Object.fromEntries(Object.entries(budgets).map(([name, [actual, limit]]) => [name, { actual, limit }])), null, 2))
