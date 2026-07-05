import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { requestedPageNames, requiredCapabilityTypes } from "../scripts/registry-capability-contract.mjs"

type RegistryFile = {
  path: string
  type: string
  target?: string
}

type RegistryItem = {
  name: string
  type: string
  title?: string
  docs?: string
  registryDependencies?: string[]
  files?: RegistryFile[]
  envVars?: Record<string, string>
}

type Registry = {
  items: RegistryItem[]
}

function readRegistry(path: string): Registry {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8")) as Registry
}

function itemMap(registry: Registry): Map<string, RegistryItem> {
  return new Map(registry.items.map((item) => [item.name, item]))
}

const requiredPageDependencies: Record<string, string[]> = {
  "aurora-terminal": ["@aurora/aurora-base", "@aurora/aurora-terminal-block"],
  "aurora-gateway": ["@aurora/aurora-base", "@aurora/aurora-card", "@aurora/aurora-timeline", "@aurora/aurora-badge", "@aurora/aurora-button"],
  "aurora-chat": ["@aurora/aurora-base", "@aurora/aurora-ai-message", "@aurora/aurora-prompt-input"],
  "aurora-login": ["@aurora/aurora-base", "@aurora/aurora-login-block"],
  "aurora-marketplace": ["@aurora/aurora-base", "@aurora/aurora-marketplace-block"],
  "aurora-log-viewer": ["@aurora/aurora-base", "@aurora/aurora-code-block", "@aurora/aurora-badge"],
  "aurora-palette": ["@aurora/aurora-base", "@aurora/aurora-badge"],
  "aurora-sidebar": ["@aurora/aurora-base", "@aurora/aurora-sidebar-block"],
  "aurora-files": ["@aurora/aurora-base", "@aurora/aurora-file-tree"],
}

test("registry includes modern Aurora capability items", () => {
  const registry = readRegistry("../registry.json")
  const items = itemMap(registry)

  for (const [name, type] of Object.entries(requiredCapabilityTypes)) {
    assert.equal(items.get(name)?.type, type)
  }
})

test("requested page starter names are registry:page items", () => {
  const registry = readRegistry("../registry.json")
  const items = itemMap(registry)

  for (const name of requestedPageNames) {
    assert.equal(items.get(name)?.type, "registry:page", `${name} should be a starter page`)
    assert.equal(items.get(name)?.files?.[0]?.type, "registry:file", `${name} should ship an installable page file`)
    assert.match(items.get(name)?.files?.[0]?.target ?? "", /^app\/aurora\/.+\/page\.tsx$/)
  }
})

test("starter pages declare their standalone registry dependencies", () => {
  const registry = readRegistry("../registry.json")
  const items = itemMap(registry)

  for (const [name, dependencies] of Object.entries(requiredPageDependencies)) {
    const item = items.get(name)
    assert.ok(item, `${name} should exist`)
    assert.deepEqual(item.registryDependencies, dependencies, `${name} should install without relying on another smoke profile`)
  }
})

test("renamed component entries preserve colliding legacy installs", () => {
  const registry = readRegistry("../registry.json")
  const items = itemMap(registry)

  assert.equal(items.get("aurora-terminal-block")?.type, "registry:block")
  assert.equal(items.get("aurora-login-block")?.type, "registry:block")
  assert.equal(items.get("aurora-marketplace-block")?.type, "registry:block")
  assert.equal(items.get("aurora-sidebar-block")?.type, "registry:block")
})

test("registry file targets stay project-root scoped", () => {
  const registry = readRegistry("../registry.json")
  const fileItems = registry.items.filter((item) => item.type === "registry:file" || item.type === "registry:item")
  const targets = fileItems.flatMap((item) => item.files?.map((file) => `${item.name}:${file.target ?? ""}`) ?? [])

  assert.ok(targets.some((target) => target.includes("~/.config/aurora/themes/zed/aurora.json")))
  assert.ok(targets.some((target) => target.includes("~/.config/aurora/themes/warp/aurora.yaml")))
  assert.ok(targets.some((target) => target.includes("~/.config/aurora/themes/chrome/README.md")))
  assert.ok(targets.some((target) => target.includes("~/.config/aurora/themes/shell/README.md")))
  assert.ok(targets.some((target) => target.includes("~/.config/aurora/agent/aurora-design-system/references/tokens.md")))
  assert.equal(targets.some((target) => target.includes("$HOME")), false)
  assert.equal(targets.some((target) => target.includes("/home/")), false)
})

test("registry docs do not claim shadcn can execute shell commands", () => {
  const registry = readRegistry("../registry.json")
  const forbidden = registry.items
    .filter((item) => /auto[- ]?runs?|post[- ]?install|executes? shell|runs claude plugin install/i.test(item.docs ?? ""))
    .map((item) => item.name)

  assert.deepEqual(forbidden, [])
})

test("built registry preserves the new capability item types", () => {
  const registry = readRegistry("../public/r/registry.json")
  const items = itemMap(registry)

  assert.equal(items.get("aurora-base")?.type, "registry:base")
  assert.equal(items.get("aurora-theme-dark")?.type, "registry:theme")
  assert.equal(items.get("aurora-terminal")?.type, "registry:page")
  assert.equal(items.get("aurora-zed-theme")?.type, "registry:file")
  assert.equal(items.get("aurora-chrome-theme")?.type, "registry:file")
  assert.equal(items.get("aurora-shell-theme-pack")?.type, "registry:file")
  assert.equal(items.get("aurora-agent-skill")?.type, "registry:item")
})
