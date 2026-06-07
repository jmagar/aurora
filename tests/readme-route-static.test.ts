import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("README API route stays on generated static assets instead of dynamic repo reads", () => {
  const route = readFileSync(new URL("../app/api/readme/route.ts", import.meta.url), "utf8")

  assert.doesNotMatch(route, /from ["']fs(?:\/promises)?["']/)
  assert.doesNotMatch(route, /process\.cwd\(\)/)
  assert.match(route, /README_ASSETS/)
})
