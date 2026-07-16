#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs"
import { dirname, extname, normalize, resolve, sep } from "node:path"

const registry = JSON.parse(readFileSync("registry.json", "utf8"))
const items = new Map(registry.items.map((item) => [item.name, item]))
const errors = []
const graph = new Map()
const fileOwners = new Map()

for (const item of registry.items) {
  for (const file of item.files ?? []) {
    const path = normalize(file.path)
    const owners = fileOwners.get(path) ?? new Set()
    owners.add(item.name)
    fileOwners.set(path, owners)
  }
}

function dependencyName(value) {
  const match = value.match(/(?:^|\/)aurora-[a-z0-9-]+$/)
  return match?.[0].split("/").at(-1) ?? null
}

for (const item of registry.items) {
  const dependencies = new Set()
  for (const value of item.registryDependencies ?? []) {
    const name = dependencyName(value)
    if (!name || !items.has(name)) errors.push(`${item.name} declares unknown registry dependency ${value}`)
    else if (name !== item.name) dependencies.add(name)
  }
  graph.set(item.name, dependencies)
}

function reachesAny(start, targets, seen = new Set()) {
  if (targets.has(start)) return true
  if (seen.has(start)) return false
  seen.add(start)
  return [...(graph.get(start) ?? [])].some((dependency) => reachesAny(dependency, targets, seen))
}

for (const item of registry.items) {
  for (const file of item.files ?? []) {
    const sourcePath = resolve(file.path)
    if (!existsSync(sourcePath) || ![".ts", ".tsx"].includes(extname(sourcePath))) continue
    const source = readFileSync(sourcePath, "utf8")
    for (const match of source.matchAll(/(?:import|export)[\s\S]*?from\s*["'](@\/registry\/aurora\/[^"']+|\.\.?\/[^"']+)["']/g)) {
      const specifier = match[1]
      const candidate = specifier.startsWith("@/") ? resolve(specifier.slice(2)) : resolve(dirname(sourcePath), specifier)
      const targets = extname(candidate) ? [candidate] : [`${candidate}.ts`, `${candidate}.tsx`, resolve(candidate, "index.ts"), resolve(candidate, "index.tsx")]
      const target = targets.find(existsSync)
      if (!target) { errors.push(`${item.name}:${file.path} imports missing ${specifier}`); continue }
      const relative = normalize(target.slice(process.cwd().length + 1).split(sep).join("/"))
      const owners = fileOwners.get(relative)
      if (owners && !reachesAny(item.name, owners)) {
        errors.push(`${item.name}:${file.path} imports ${relative} from ${[...owners].join("/")} outside its dependency closure`)
      }
      if (!owners) errors.push(`${item.name}:${file.path} imports ${relative}, but the file is not shipped by any registry item`)
    }
  }
}

const visiting = new Set()
const visited = new Set()
function visit(name, path = []) {
  if (visiting.has(name)) { errors.push(`registry dependency cycle: ${[...path, name].join(" -> ")}`); return }
  if (visited.has(name)) return
  visiting.add(name)
  for (const dependency of graph.get(name) ?? []) visit(dependency, [...path, name])
  visiting.delete(name)
  visited.add(name)
}
for (const name of items.keys()) visit(name)

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log(`Registry graph validated: ${items.size} items and ${fileOwners.size} shipped source files.`)
