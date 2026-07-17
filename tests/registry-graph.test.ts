import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import test from "node:test"

test("complete registry dependency and source-import graph is consistent and acyclic", () => {
  const result = spawnSync("node", ["scripts/validate-registry-graph.mjs"], { encoding: "utf8" })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.match(result.stdout, /Registry graph validated/)
})
