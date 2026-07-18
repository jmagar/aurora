#!/usr/bin/env node
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const chunkDir = join(process.cwd(), ".next/static/chunks")
const files = readdirSync(chunkDir).filter((name) => name.endsWith(".js"))
const sizes = files.map((name) => ({ name, bytes: statSync(join(chunkDir, name)).size }))
const largest = sizes.sort((a, b) => b.bytes - a.bytes)[0]
const total = sizes.reduce((sum, item) => sum + item.bytes, 0)
const maxChunk = 900 * 1024
const maxTotal = 20 * 1024 * 1024

if (!largest || largest.bytes > maxChunk) {
  throw new Error(`Largest client chunk ${largest?.name ?? "missing"} is ${largest?.bytes ?? 0} bytes (budget ${maxChunk})`)
}
if (total > maxTotal) throw new Error(`Client chunks total ${total} bytes (budget ${maxTotal})`)
console.log(`Web performance budget passed: ${files.length} chunks, largest ${largest.bytes} bytes, total ${total} bytes.`)
