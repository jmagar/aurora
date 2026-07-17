import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import test from "node:test"

test("published registry components use the React 19 direct-ref contract", () => {
  assert.doesNotThrow(() => execFileSync("node", ["scripts/migrate-react19-refs.mjs", "--check"], { stdio: "pipe" }))
})

test("representative public component types preserve optional DOM refs", () => {
  for (const path of [
    "registry/aurora/ui/multi-select.tsx",
    "registry/aurora/blocks/ai/elements/core.tsx",
    "registry/aurora/blocks/feedback/error-page/error-page.tsx",
  ]) {
    const source = readFileSync(path, "utf8")
    assert.match(source, /ref\?: React\.Ref</)
    assert.doesNotMatch(source, /React\.forwardRef/)
  }
})
