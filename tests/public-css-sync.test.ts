import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("legacy served Aurora CSS is a mechanical copy of the canonical tokens", () => {
  const canonical = readFileSync(new URL("../registry/aurora/styles/aurora.css", import.meta.url), "utf8")
  const served = readFileSync(new URL("../public/aurora.css", import.meta.url), "utf8")
  assert.equal(served, canonical)
})
