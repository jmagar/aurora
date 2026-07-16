import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import test from "node:test"

test("root Aurora skill is generated from the canonical packaged skill", () => {
  const result = spawnSync("node", ["scripts/sync-agent-skill.mjs", "--check"], { encoding: "utf8" })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.match(result.stdout, /synchronized/)
})
