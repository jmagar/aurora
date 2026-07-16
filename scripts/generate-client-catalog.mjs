#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs"

import { NAV } from "../app/gallery/nav-data.ts"
import { slugToRegistry } from "../lib/slug-map.ts"

const registry = JSON.parse(readFileSync(new URL("../registry.json", import.meta.url), "utf8"))
const byName = new Map(registry.items.map((item) => [item.name, item]))
const groups = NAV.map((group) => group.group)
const items = NAV.flatMap((group) => group.items.map((navItem) => {
  const name = slugToRegistry(navItem.slug)
  const item = name ? byName.get(name) : undefined
  return {
    slug: navItem.slug,
    label: navItem.label,
    group: group.group,
    description: item?.description ?? "",
    registry: item?.name ?? null,
    installUrl: item ? `https://aurora.tootie.tv/r/${item.name}.json` : null,
  }
}))

const output = {
  schemaVersion: 1,
  counts: { registryItems: registry.items.length, catalogItems: items.length, groups: groups.length },
  groups,
  items,
}
writeFileSync(new URL("../lib/client-catalog.json", import.meta.url), `${JSON.stringify(output, null, 2)}\n`)
console.log(`Generated compact client catalog: ${items.length} entries (${Buffer.byteLength(JSON.stringify(output))} bytes).`)
