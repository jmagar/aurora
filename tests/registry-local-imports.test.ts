import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, posix } from "node:path"
import test from "node:test"

const localImportPattern = /\b(?:import|export)\b(?:[\s\S]*?\bfrom\s*)?["'](\.\/[^"']+)["']/g
const extensions = ["", ".ts", ".tsx", ".js", ".jsx"]

function siblingTargets(target: string, specifier: string): string[] {
  const sibling = posix.normalize(posix.join(dirname(target), specifier))
  return extensions.map((extension) => `${sibling}${extension}`)
}

test("tool-calls registry artifact ships files required by local sibling imports", () => {
  const findings: string[] = []
  const artifact = JSON.parse(readFileSync(new URL("../public/r/aurora-tool-calls.json", import.meta.url), "utf8")) as {
    name?: string
    files?: Array<{ content?: string; target?: string }>
  }
  const shippedTargets = new Set(artifact.files?.map((file) => file.target).filter(Boolean))

  for (const file of artifact.files ?? []) {
    if (!file.content || !file.target) continue

    for (const match of file.content.matchAll(localImportPattern)) {
      const candidates = siblingTargets(file.target, match[1])
      if (!candidates.some((candidate) => shippedTargets.has(candidate))) {
        findings.push(`${artifact.name ?? "aurora-tool-calls"}: ${file.target} imports ${match[1]} but no sibling file is shipped`)
      }
    }
  }

  assert.deepEqual(findings, [])
})
