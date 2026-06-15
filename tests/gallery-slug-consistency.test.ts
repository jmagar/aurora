import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import test from "node:test"

import { NAV, NAV_SLUG_ALIASES } from "../app/gallery/nav-data.ts"
import { SLUG_TO_REGISTRY, slugToRegistry } from "../lib/slug-map.ts"

// ---------------------------------------------------------------------------
// Consistency gate for the gallery slug universe.
//
// The gallery slug space is spread across several hand-maintained maps that can
// silently drift apart:
//   - lib/slug-map.ts        SLUG_TO_REGISTRY + slugToRegistry (slug → registry name)
//   - app/gallery/nav-data.ts  NAV + NAV_SLUG_ALIASES (sidebar)
//   - app/gallery/[section]/page.tsx  DEMOS (routable demo pages)
//   - registry.json / public/r/<name>.json  the actual registry items
//
// This test wires those maps together and fails if a NAV entry points at a
// non-existent demo, a demo can't be resolved to a registry item, or a resolved
// item has no built public/r artifact.
// ---------------------------------------------------------------------------

// DEMOS keys are bound to next/dynamic() imports, so the page module cannot be
// imported under node:test. Parse its demo keys textually instead — the same
// approach other tests in this suite use for source artifacts.
function loadDemoKeys(): Set<string> {
  const pageSrc = readFileSync(
    new URL("../app/gallery/[section]/page.tsx", import.meta.url),
    "utf8",
  )
  const keys = new Set<string>()
  // Every `<key>: dynamic(` or `"<key>": dynamic(` entry across all demo maps.
  for (const m of pageSrc.matchAll(/(?:"([^"]+)"|([a-zA-Z0-9-]+))\s*:\s*dynamic\(/g)) {
    keys.add(m[1] ?? m[2])
  }
  // AI_DEMOS keys also get a canonical `ai-<key>` route via AI_CANONICAL_DEMOS.
  const aiStart = pageSrc.indexOf("AI_DEMOS: Record")
  const aiEnd = pageSrc.indexOf("AI_CANONICAL_DEMOS")
  assert.ok(aiStart >= 0 && aiEnd > aiStart, "could not locate AI_DEMOS block in page.tsx")
  const aiBlock = pageSrc.slice(aiStart, aiEnd)
  for (const m of aiBlock.matchAll(/(?:"([^"]+)"|([a-zA-Z0-9-]+))\s*:\s*dynamic\(/g)) {
    keys.add(`ai-${m[1] ?? m[2]}`)
  }
  return keys
}

const DEMO_KEYS = loadDemoKeys()

const REGISTRY_NAMES: Set<string> = new Set(
  (JSON.parse(
    readFileSync(new URL("../registry.json", import.meta.url), "utf8"),
  ) as { items: Array<{ name: string }> }).items.map((item) => item.name),
)

function hasBuiltArtifact(name: string): boolean {
  return existsSync(
    fileURLToPath(new URL(`../public/r/${name}.json`, import.meta.url)),
  )
}

// Intentional non-registry demo pages. These are routable gallery pages that
// deliberately have no corresponding registry item (and therefore no install
// strip). Keep this list small — if a real component slug shows up here, that's
// drift to fix at the source, not to hide behind the allowlist.
const NON_REGISTRY_DEMOS = new Set<string>([
  "new-components", // changelog-style overview page, not an installable component
])

test("every NAV slug (after aliasing) resolves to a routable demo", () => {
  const orphans: string[] = []
  for (const group of NAV) {
    for (const item of group.items) {
      const resolved = NAV_SLUG_ALIASES[item.slug] ?? item.slug
      if (!DEMO_KEYS.has(resolved)) {
        orphans.push(`${item.slug}${resolved === item.slug ? "" : ` → ${resolved}`}`)
      }
    }
  }
  assert.deepEqual(
    orphans,
    [],
    `NAV slugs with no matching DEMOS entry: ${orphans.join(", ")}`,
  )
})

test("every routable demo resolves to a real registry item name", () => {
  const unresolved: string[] = []
  for (const key of DEMO_KEYS) {
    if (NON_REGISTRY_DEMOS.has(key)) continue
    const name = slugToRegistry(key)
    if (name === null) {
      unresolved.push(key)
    } else if (!REGISTRY_NAMES.has(name)) {
      unresolved.push(`${key} → ${name} (not in registry.json)`)
    }
  }
  assert.deepEqual(
    unresolved,
    [],
    `DEMOS keys that do not resolve to a registry item: ${unresolved.join(", ")}`,
  )
})

test("every resolved registry name has a built public/r artifact", () => {
  const missing: string[] = []
  // Cover both the demo-resolved names and every SLUG_TO_REGISTRY target.
  const names = new Set<string>(Object.values(SLUG_TO_REGISTRY))
  for (const key of DEMO_KEYS) {
    if (NON_REGISTRY_DEMOS.has(key)) continue
    const name = slugToRegistry(key)
    if (name) names.add(name)
  }
  for (const name of names) {
    if (!hasBuiltArtifact(name)) {
      missing.push(name)
    }
  }
  assert.deepEqual(
    missing,
    [],
    `registry names with no public/r/<name>.json file: ${missing.join(", ")}`,
  )
})
