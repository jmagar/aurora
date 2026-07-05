import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

type RegistryItem = {
  name: string
  docs?: string
  registryDependencies?: string[]
}

type Registry = {
  items: RegistryItem[]
}

function readRegistry(path: string): Registry {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8")) as Registry
}

for (const [label, path] of [
  ["source registry", "../registry.json"],
  ["built registry", "../public/r/registry.json"],
] as const) {
  test(`${label} docs describe Aurora component style dependencies`, () => {
    const registry = readRegistry(path)
    const findings = registry.items
      .filter((item) => item.registryDependencies?.includes("@aurora/aurora-components"))
      .filter((item) => !item.docs?.includes("aurora-components"))
      .map((item) => item.name)

    assert.deepEqual(findings, [])
  })

  test(`${label} items publish registry docs`, () => {
    const registry = readRegistry(path)
    const findings = registry.items.filter((item) => !item.docs?.trim()).map((item) => item.name)

    assert.deepEqual(findings, [])
  })
}

test("source registry capability items explain install constraints", () => {
  const registry = readRegistry("../registry.json")
  const items = new Map(registry.items.map((item) => [item.name, item]))

  assert.match(items.get("aurora-base")?.docs ?? "", /batteries-included/i)
  assert.match(items.get("aurora-agent-skill")?.docs ?? "", /Claude, Codex, and Gemini/i)
  assert.match(items.get("aurora-plugin-installer")?.docs ?? "", /Run the generated script manually/i)
  assert.match(items.get("aurora-zed-theme")?.docs ?? "", /project-root/i)
})
