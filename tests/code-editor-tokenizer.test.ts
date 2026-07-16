import assert from "node:assert/strict"
import test from "node:test"

import { tokenizeCode } from "../registry/aurora/blocks/files/code-editor/tokenizer.ts"

const types = (source: string, language: string) => tokenizeCode(source, language).map((line) => line.map((token) => token.type))

test("preserves JavaScript block-comment state across lines", () => {
  const result = types("const ready = true /* open\nstill comment */ return ready", "typescript")
  assert.deepEqual(result[0].slice(-1), ["comment"])
  assert.equal(result[1][0], "comment")
  assert.ok(result[1].includes("keyword"))
})

test("preserves template and Python triple-string state across lines", () => {
  assert.equal(types("const value = `first\nsecond`", "tsx")[1][0], "string")
  const python = types('message = \"\"\"first\nsecond\nthird\"\"\"\nreturn message', "python")
  assert.equal(python[1][0], "string")
  assert.equal(python[2][0], "string")
  assert.ok(python[3].includes("keyword"))
})

test("token text losslessly reconstructs every input line", () => {
  const source = "/* a */ const answer = call(42)\n# not a JS comment"
  const tokens = tokenizeCode(source, "javascript")
  assert.deepEqual(tokens.map((line) => line.map((token) => token.text).join("")), source.split("\n"))
})
