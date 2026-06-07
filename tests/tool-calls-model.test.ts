import assert from "node:assert/strict"
import test from "node:test"

import { groupConsecutiveCalls, summarizeToolCallGroup } from "../registry/aurora/blocks/ai/tool-calls/tool-calls-model.ts"

const base = {
  args: {},
} as const

test("groupConsecutiveCalls keeps repeated adjacent tools in one visible group", () => {
  const groups = groupConsecutiveCalls([
    { ...base, id: "1", tool: "ReadFile", status: "completed" },
    { ...base, id: "2", tool: "ReadFile", status: "completed" },
    { ...base, id: "3", tool: "Bash", status: "completed" },
  ])

  assert.equal(groups.length, 2)
  assert.equal(groups[0].tool, "ReadFile")
  assert.equal(groups[0].calls.length, 2)
  assert.equal(summarizeToolCallGroup(groups[0]), "ReadFile")
})

test("summarizeToolCallGroup prioritizes errors over running calls", () => {
  const [group] = groupConsecutiveCalls([
    { ...base, id: "1", tool: "ReadFile", status: "running" },
    { ...base, id: "2", tool: "ReadFile", status: "error" },
  ])

  assert.equal(group.status, "error")
})
