import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

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

const required = {
  "aurora-base": "registry:base",
  "aurora-theme-dark": "registry:theme",
  "aurora-theme-light": "registry:theme",
  "aurora-terminal": "registry:page",
  "aurora-gateway": "registry:page",
  "aurora-chat": "registry:page",
  "aurora-login": "registry:page",
  "aurora-marketplace": "registry:page",
  "aurora-log-viewer": "registry:page",
  "aurora-palette": "registry:page",
  "aurora-sidebar": "registry:page",
  "aurora-files": "registry:page",
  "aurora-zed-theme": "registry:file",
  "aurora-warp-theme": "registry:file",
  "aurora-chrome-theme": "registry:file",
  "aurora-shell-theme-pack": "registry:file",
  "aurora-agent-skill": "registry:item",
  "aurora-plugin-installer": "registry:item",
}

for (const [name, type] of Object.entries(required)) {
  if (sourceItems.get(name)?.type !== type) fail(`${name} missing from registry.json as ${type}`)
  if (builtItems.get(name)?.type !== type) fail(`${name} missing from public/r/registry.json as ${type}`)
  if (!existsSync(join("public", "r", `${name}.json`))) fail(`public/r/${name}.json is missing`)
}

for (const item of registry.items) {
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
