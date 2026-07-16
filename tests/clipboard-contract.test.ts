import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("clipboard consumers use the central verified state primitive", () => {
  for (const path of ["../components/component-install.tsx", "../components/site/site-ui.tsx", "../registry/aurora/ui/copy-button.tsx"]) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8")
    assert.match(source, /useClipboard/)
    assert.doesNotMatch(source, /navigator\.clipboard/)
  }
})

test("clipboard hook exposes error state and clears its timer during cleanup", () => {
  const source = readFileSync(new URL("../registry/aurora/lib/use-clipboard.ts", import.meta.url), "utf8")
  assert.match(source, /"idle" \| "copied" \| "error"/)
  assert.match(source, /if \(timer\.current\) clearTimeout\(timer\.current\)/)
  assert.match(source, /setState\("error"\)/)
})
