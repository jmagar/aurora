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

function readText(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8")
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

  test(`${label} docs list the exact registry dependencies`, () => {
    const registry = readRegistry(path)
    for (const item of registry.items) {
      const match = item.docs?.match(/Registry dependencies: ([^\n]+)\.$/)
      assert.ok(match, `${item.name}: missing dependency summary`)

      const documented =
        match[1] === "none"
          ? []
          : match[1].split(", ").map((dependency) => dependency.replaceAll("`", ""))
      const declared = (item.registryDependencies ?? []).map((dependency) =>
        dependency.replace(/^@aurora\//, ""),
      )

      assert.deepEqual(documented, declared, item.name)
    }
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

test("Aurora agent skill docs stay aligned with current tokens and paths", () => {
  const skill = readText("../plugin/skills/aurora/SKILL.md")
  const tokens = readText("../plugin/skills/aurora/references/tokens.md")
  const android = readText("../plugin/skills/aurora/references/android.md")
  const recipes = readText("../plugin/skills/aurora/references/recipes.md")
  const editorCli = readText("../plugin/skills/aurora/references/editor-cli-tokens.md")

  for (const [label, text] of [
    ["skill", skill],
    ["tokens reference", tokens],
    ["recipes reference", recipes],
  ] as const) {
    assert.doesNotMatch(text, /aurora-accent-violet/i, `${label} should not reference removed web violet tokens`)
    assert.doesNotMatch(
      text,
      /violet for AI|violet AI|violet.*AI \/ automation identity|AI \/ automation identity.*violet/i,
      `${label} should not describe violet as AI identity`,
    )
  }

  assert.match(skill, /@layer theme, base, components, aurora-components, utilities;/)
  assert.match(skill, /web and Android use canonical Aurora tokens/i)
  assert.match(skill, /app\/gallery\/demo-map\.tsx/)
  assert.doesNotMatch(skill, /CLI\/editor\/Compose theme/i)
  assert.doesNotMatch(skill, /AxonTheme\.colors/)
  assert.doesNotMatch(skill, /full inventory/i)
  assert.doesNotMatch(skill, /references\/components\.md` — every UI primitive and block/i)
  assert.match(android, /AuroraColors|LocalAuroraColors|MaterialTheme\.colorScheme/)
  assert.doesNotMatch(android, /Axon orange AI\/automation accent/i)
  assert.doesNotMatch(android, /AxonTheme\.colors\.accentPrimary/)
  assert.doesNotMatch(recipes, /ID is mono/i)
  assert.doesNotMatch(editorCli, /`editors\//)
  assert.doesNotMatch(editorCli, /`shell\//)
  assert.match(editorCli, /`themes\/editors\//)
  assert.match(editorCli, /`themes\/shell\//)
})
