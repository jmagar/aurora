#!/usr/bin/env node
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const standalone = join(root, ".next", "standalone")

if (!existsSync(standalone)) {
  console.error("Standalone audit failed: .next/standalone is missing. Run pnpm build first.")
  process.exit(1)
}

const forbidden = [
  ".env",
  ".worktrees",
  "android",
  "docs",
  "registry",
  "scripts",
  "themes",
]

const entries = new Set(readdirSync(standalone))
const findings = forbidden.filter((entry) => entries.has(entry))

if (findings.length > 0) {
  console.error("Standalone audit failed: broad traced files/directories found in .next/standalone:")
  for (const finding of findings) console.error(`- ${finding}`)
  process.exit(1)
}

console.log("Standalone audit passed.")
