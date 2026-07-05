import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { requiredCapabilityTypes } from "./registry-capability-contract.mjs"

const registry = JSON.parse(readFileSync("registry.json", "utf8"))
const built = JSON.parse(readFileSync("public/r/registry.json", "utf8"))

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

function byName(items) {
  return new Map(items.map((item) => [item.name, item]))
}

const sourceItems = byName(registry.items)
const builtItems = byName(built.items)

for (const [name, type] of Object.entries(requiredCapabilityTypes)) {
  if (sourceItems.get(name)?.type !== type) fail(`${name} missing from registry.json as ${type}`)
  if (builtItems.get(name)?.type !== type) fail(`${name} missing from public/r/registry.json as ${type}`)
  if (!existsSync(join("public", "r", `${name}.json`))) fail(`public/r/${name}.json is missing`)

  const artifact = JSON.parse(readFileSync(join("public", "r", `${name}.json`), "utf8"))
  if (artifact.type !== type) fail(`public/r/${name}.json has type ${artifact.type}, expected ${type}`)
}

for (const item of [...registry.items, ...built.items]) {
  for (const file of item.files ?? []) {
    if ((file.type === "registry:page" || file.type === "registry:file") && !file.target) {
      fail(`${item.name} has ${file.type} without files[].target`)
    }
    if ((file.target ?? "").includes("$HOME") || (file.target ?? "").startsWith("/home/")) {
      fail(`${item.name} target must not point to a real home path: ${file.target}`)
    }
  }
}

if (!process.exitCode) {
  console.log("Aurora registry capability validation passed.")
}
