import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const PURE_MODULES = ["card", "separator", "skeleton", "table", "description-list", "kbd"]

test("verified presentational modules remain Server Component compatible", () => {
  const paths = [...PURE_MODULES.map((name) => `../registry/aurora/ui/${name}.tsx`), "../registry/aurora/blocks/ai/elements/edge.tsx"]
  for (const path of paths) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8")
    assert.doesNotMatch(source, /^['"]use client['"]/)
    assert.doesNotMatch(source, /\b(?:window|document|navigator)\./)
    assert.doesNotMatch(source, /React\.use(?:State|Effect|LayoutEffect|Reducer|Context|Ref|Callback|Memo)\b/)
  }
})
