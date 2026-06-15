import test from "node:test"
import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const rDir = join(dirname(fileURLToPath(import.meta.url)), "../public/r")
const ALLOWED = new Set(["cn"])

test("registry artifacts import only cn from @/lib/utils", () => {
  const findings: string[] = []
  for (const f of readdirSync(rDir).filter((n) => n.endsWith(".json") && n !== "registry.json")) {
    const art = JSON.parse(readFileSync(join(rDir, f), "utf8")) as {
      files?: Array<{ content?: string; target?: string }>
    }
    for (const file of art.files ?? []) {
      const content = file.content ?? ""
      for (const m of content.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']@\/lib\/utils["']/g)) {
        const syms = m[1]
          .split(",")
          .map((s) => s.trim().split(/\s+as\s+/)[0].trim())
          .filter(Boolean)
        const bad = syms.filter((s) => !ALLOWED.has(s))
        if (bad.length) findings.push(`${f} :: ${file.target}: ${bad.join(", ")}`)
      }
    }
  }
  assert.deepEqual(findings, [], `Non-cn @/lib/utils imports ship broken:\n${findings.join("\n")}`)
})
